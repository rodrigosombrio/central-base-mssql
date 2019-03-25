import { BaseEntity } from 'typeorm';
import { Cache } from '../../cache';
import { IZendeskImport } from '../../interface/IZendeskImport';
import { Configuration } from '../../models/Configuration';
import { Database } from '../database';
import DynamicModel from '../DynamicModel';
import { Zendesk } from '../zendesk';
import { log } from './logs';

const db: Database = new Database();

export class Incremental implements IZendeskImport {
	private _config: Configuration;
	private _url: string;
	private _content: any;
	private _endTime: string;

	constructor (config: Configuration) {
		this._config = config;
		this._url = '';
		this._content = [];
		this._endTime = '';
	}
	public async import () {
		const baseUri = Cache.get('baseUriZendesk');
		this._url = baseUri + this._config.url + '?start_time=' + this._config.incremental;
		const result = await this.run();
		return result;
	}
	public async run () {
		const config = { inExecution: true };
		await db.manager.update(Configuration, { id: this._config.id }, config);
		let next: boolean = true;
		let url: string = this._url;
		while (next) {
			console.log('incremental', next, url);
			try {
				console.log('incremental call result');
				const result: any = await Zendesk.json(url);
				console.log('incremental result');
				const items = result[this._config.tableToParse.toLowerCase()];
				console.log('items');
				this._content = this._content.concat(items);
				console.log('content');
				if (result.next_page && url.indexOf(result.end_time) === -1) {
					console.log('result.next_page', result.next_page, result.end_time);
					url = result.next_page;
				} else {
					console.log('end result.next_page', result.next_page, result.end_time);
					this._endTime = result.end_time;
					next = false;
				}
			} catch (err) {
				console.log('incremental err');
				// 	await log('ERROR', this._config, err, this._config.id.toString());
				next = false;
			}
		}
		console.log('savedb');
		const f = await this.saveDb();
		return f;
	}
	public async saveDb () {
		await log('START', this._config, '', '');
		for (const content of this._content) {
			try {
				const dynamic = new DynamicModel(this._config.tableToParse);
				const schema: any = dynamic.schema;
				if (schema) {
					if (this._config.beforeClean) {
						await db.manager.remove(schema);
					}
					console.log('dosave tickets', content.url);
					const entity = await db.saveDb(schema, content, { url: content.url });
					console.log('saved tickets', entity);
					if (entity instanceof BaseEntity) {
						if (dynamic.customization) {
							console.log('run custom', entity);
							await dynamic.customization.run('save', entity);
						}
					} else {
						await log('ERROR', this._config, JSON.stringify(entity), this._config.id.toString());
					}
				}
			} catch (err) {
				await log('ERROR', this._config, err, this._config.id.toString());
			}
		}
		await db.manager.update(
			Configuration,
			{ id: this._config.id },
			{ inExecution: false, lastExecuteAt: new Date(), incremental: this._endTime },
		);
		await log('FINISH', this._config, '', '');

		return true;
	}
}
