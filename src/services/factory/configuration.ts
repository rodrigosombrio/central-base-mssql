import { Cache } from '../../cache';
import { Configuration } from '../../models/Configuration';
import { Database } from '../database';
import DynamicModel from '../DynamicModel';
import { log } from '../factory/logs';
import { logger } from '../index';
import { Zendesk } from '../zendesk';

const db: Database = new Database();

export class ConfigurationFactory {
	public static list: Configuration[] = [];
	public static content: any[] = [];
	public static current: Configuration;
	public static index: number = 0;
	public static addRow (config: Configuration) {
		this.list.push(config);
	}
	public static import () {
		if (this.list.length > 0) {
			this.current = this.list[this.index];
			const baseUri = Cache.get('baseUriZendesk');
			let url = baseUri + this.current.url;
			if (this.current.incremental !== '') {
				url += '?start_time=' + this.current.incremental;
				this.incremental(url);
			} else {
				this.run(url);
			}
		}
	}
	private static run (url: string) {
		console.log('run', url);
		Zendesk.json(url)
			.then((result: any) => {
				this.content = this.content.concat(result[this.current.tableToParse.toLowerCase()]);
				if (result.next_page) {
					this.run(result.next_page);
				} else {
					this.finish(0, result.end_time, this.current.beforeClean);
				}
			})
			.catch((err) => {
				console.log('zendesk err', err);
			});
	}

	private static incremental (url: string) {
		Zendesk.json(url)
			.then((result: any) => {
				this.content = this.content.concat(result[this.current.tableToParse.toLowerCase()]);
				if (result.next_page && url.indexOf(result.end_time) === -1) {
					this.incremental(result.next_page);
				} else {
					this.finish(0, result.end_time, this.current.beforeClean);
				}
			})
			.catch((err) => {
				console.log('zendesk err', err);
			});
	}

	private static finish (controller: number, endTime: string, clean: boolean) {
		const self = this;
		async function save () {
			if (controller === 0) {
				await log('START', self.current, '', '');
				const config = {inExecution: true};
				if (endTime && endTime !== '') {
					config.incremental = endTime;
				}
				await db.manager.update(Configuration, {id: self.current.id}, config);
				// await db.manager.save(Logs, { id: self.current.id }, config);
			}
			const dynamic = new DynamicModel(self.current.tableToParse);
			const schema = dynamic.schema;
			if (schema) {
				if (clean) {
					await db.manager.remove(schema);
				}

				const entity: any = db.manager.create(schema, self.content[controller]);

				const entitydb = await db.manager.find(schema, {
					url: entity.url,
				});
				if (entitydb.length > 0) {
					await log('UPDATE', self.current, JSON.stringify(self.content[controller]), entity.url);
					await db.manager.update(schema, {url: entity.url}, self.content[controller]);
				} else {
					await log('INSERT', self.current, self.content[controller], entity.url);
					await db.manager.save(schema, entity);
				}
			}
			if (self.content.length <= controller + 1) {
				await db.manager.update(
					Configuration,
					{id: self.current.id},
					{inExecution: false, lastExecuteAt: new Date()},
				);
				await log('FINISH', self.current, '', '');
			}
		}

		save().then(() => {
			controller++;
			if (self.content.length > controller) {
				self.finish(controller, '', false);
			} else {
				self.content = [];
				self.index++;
				if (self.list.length > self.index) {
					self.import();
				} else {
					self.list = [];
					self.index = 0;
				}
			}
		});
	}
	constructor () {
		logger.info('db %s', 'zendesk');
	}
}
