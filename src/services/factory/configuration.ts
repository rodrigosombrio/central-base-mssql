import { Request } from 'mssql';
import { Cache } from '../../cache';
import { Brands } from '../../models/Brands';
import { Configuration } from '../../models/Configuration';
import { Database } from '../database';
import { logger } from '../index';
import { Zendesk } from '../zendesk';

const db: Database = new Database();

export class ConfigurationFactory {
	public static list: Configuration[] = [];
	public static content: any[] = [];
	public static current: Configuration;
	public static index: number = 0;
	public static addRow (json: any) {
		const config = new Configuration();
		config.set(json);
		this.list.push(config);
	}
	public static import () {
		this.current = this.list[this.index];
		const baseUri = Cache.get('baseUriZendesk');

		this.run(baseUri + this.current.url);
	}
	private static run (url: string) {
		Zendesk.json(url).then((result: any) => {
			this.content = this.content.concat(result[this.current.table.toLowerCase()]);
			if (result.next_page) {
				this.run(result.next_page);
			} else {
				this.finish(0);
			}
		});
	}
	private static finish (index: number) {
		Brands.addRow(this.content[index]).then((result: any) => {
			const request: Request = db.request;
			console.log(result.sql());
			request.query(result.sql()).then((row) => {
				index++;
				if (this.content.length > index) {
					this.finish(index);
				} else {
					this.content = [];
				}
			});
		});
	}
	constructor () {
		logger.info('db %s', 'zendesk');
	}
}
