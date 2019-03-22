import { Cache } from '../../cache';
import { IZendeskImport } from '../../interface/IZendeskImport';
import { Configuration } from '../../models/Configuration';
import { Database } from '../database';
import DynamicModel from '../DynamicModel';
import { log } from '../factory/logs';
import { Zendesk } from '../zendesk';

const db: Database = new Database();

export class Support implements IZendeskImport {
	private _config: Configuration;
	private _url: string;
	private _content: any;
	constructor (config: Configuration) {
		this._config = config;
		this._url = '';
		this._content = [];
	}
	public async import () {
		const config = {inExecution: true};
		await db.manager.update(Configuration, {id: this._config.id}, config);
		const baseUri = Cache.get('baseUriZendesk');
		this._url = baseUri + this._config.url;
		const result = await this.run();
		return result;
	}
	public async run () {
		let next: boolean = true;
		let url: string = this._url;
		while (next) {
			try {
				const result: any = await Zendesk.json(url);
				const items = result[this._config.tableToParse.toLowerCase()];
				this._content = this._content.concat(items);
				if (result.next_page) {
					url = result.next_page;
				} else {
					next = false;
				}
			} catch (err) {
				await db.manager.update(
					Configuration,
					{id: this._config.id},
					{inExecution: false, lastExecuteAt: new Date()},
				);
				await log('ERROR', this._config, JSON.stringify(err), this._config.id.toString());
				next = false;
			}
		}
		const f = await this.saveDb();
		return f;
	}
	public async saveDb () {
		await log('START', this._config, '', this._config.id.toString());
		for (const content of this._content) {
			try {
				const dynamic = new DynamicModel(this._config.tableToParse);
				const schema: any = dynamic.schema;
				if (schema) {
					if (this._config.beforeClean) {
						await db.manager.remove(schema);
					}

					const entity: any = db.manager.create(schema, content);
					const key = entity.url ? entity.url : entity.id;
					const entitydb = await db.manager.find(schema, {
						url: entity.url,
					});
					if (entitydb.length > 0) {
						await log('UPDATE', this._config, JSON.stringify(content), key);
						await db.manager.update(schema, {url: key}, content);
					} else {
						await log('INSERT', this._config, JSON.stringify(entity), key);
						await db.manager.save(schema, entity);
					}
				}
			} catch (err) {
				await log('ERROR', this._config, JSON.stringify(err), this._config.id.toString());
			}
		}
		await db.manager.update(Configuration, {id: this._config.id}, {inExecution: false, lastExecuteAt: new Date()});
		await log('FINISH', this._config, '', this._config.id.toString());

		return true;
	}
}
