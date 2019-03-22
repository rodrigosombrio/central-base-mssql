import { URLSearchParams } from 'url';
import { IZendeskImport } from '../../interface/IZendeskImport';
import { Brands } from '../../models/Brands';
import { Configuration } from '../../models/Configuration';
import { Locales } from '../../models/Locales';
import { Database } from '../database';
import DynamicModel from '../DynamicModel';
import IClasses from '../DynamicModel';
import { logger } from '../index';
import { Zendesk } from '../zendesk';
import { log } from './logs';

const db: Database = new Database();

export class HelpCenter implements IZendeskImport {
	private _config: Configuration;
	private _url: string;
	private _content: any;
	private _page: number;
	private _incremental: string;

	constructor (config: Configuration) {
		this._config = config;
		this._url = '';
		this._content = [];
		this._page = 0;
		this._incremental = '';
	}
	public async import () {
		await log('START', this._config, '', '');
		const brands = await db.manager.find(Brands, {has_help_center: true});

		if (this.hasIncremental()) {
			for (const brand of brands) {
				this._url = brand.brand_url + this._config.url + '?start_time=' + this._config.incremental;
				await this.run();
			}
		} else {
			const locales = await db.manager.find(Locales, {});
			for (const brand of brands) {
				for (const locale of locales) {
					this._url =
						brand.brand_url +
						this._config.url.replace('{locale}', locale.locale.toLowerCase()) +
						'?per_page=1000&page=1';
					await this.run();
				}
			}
		}

		const f = await this.saveDb();
		return f;
	}
	public async run () {
		let next: boolean = true;
		let url: string = this._url;
		while (next) {
			logger.info('url helpcenter', url);
			const result: any = await Zendesk.json(url);
			const items = result[this._config.tableToParse.toLowerCase()];
			this._content = this._content.concat(items);
			if (result.next_page) {
				if (this.hasIncremental()) {
					url = result.next_page;
				} else {
					if (result.next_page.indexOf('per_page') !== -1) {
						url = result.next_page.replace('per_page=30', 'per_page=1000');
					} else {
						url = result.next_page + '&per_page=1000';
					}
				}
			} else {
				if (this.hasIncremental()) {
					this._page = 0;
					if (result.count > 0) {
						this._incremental = result.end_time;
					}
				} else {
					const u = new URLSearchParams(url.substring(url.lastIndexOf('?')));
					this._page = +u.get('page')!;
					this._incremental = '';
				}
				next = false;
			}
		}
	}
	public async saveDb () {
		const config = {inExecution: true};
		await db.manager.update(Configuration, {id: this._config.id}, config);
		logger.info('content', this._content.length, this._config.id, this._incremental, this._page);
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
						await log('INSERT', this._config, entity, key);
						await db.manager.save(schema, entity);
					}
				}
			} catch (err) {
				await log('ERROR', this._config, JSON.stringify(err), this._config.id.toString());
			}
		}
		await db.manager.update(
			Configuration,
			{id: this._config.id},
			{inExecution: false, lastExecuteAt: new Date(), lastPage: this._page, incremental: this._incremental},
		);
		await log('FINISH', this._config, '', '');

		return true;
	}

	public hasIncremental (): boolean {
		if (this._config.incremental !== '') {
			return true;
		}
		return false;
	}
}
