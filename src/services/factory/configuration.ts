import { Configuration } from '../../models/Configuration';
import { Database } from '../database';
import DynamicModel from '../DynamicModel';
import { log } from '../factory/logs';
import { logger } from '../index';
import { Zendesk } from '../zendesk';
import { HelpCenter } from './helpcenter';
import { Incremental } from './incremental';
import { Page } from './page';
import { Support } from './support';

const db: Database = new Database();

export class ConfigurationFactory {
	public static list: Configuration[] = [];
	public static content: any[] = [];
	public static current: Configuration;
	public static index: number = 0;
	public static addRow (config: Configuration) {
		this.list.push(config);
	}
	public static getInstance (config: Configuration): any {
		if (config.is_helpcenter) { return new HelpCenter(config); }
		else if (config.incremental !== '') { return new Incremental(config); }
		else if (config.lastPage > 0) { return new Page(config); }
		return new Support(config);
	}
	public static start () {
		const self = this;
		if (this.list.length > 0) {
			this.current = this.list[this.index];
			const instance = ConfigurationFactory.getInstance(this.current);
			console.log('instance', instance)
			instance.import().then(() => {
				self.index++;
				if (self.list.length > self.index) {
					this.start();
				}
			})
		}
	}
	private static run (url: string) {
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
		console.log('run', url);
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
		console.log('finish', controller, clean);
		const self = this;
		async function save () {
			// 	try {
			if (controller === 0) {
				await log('START', self.current, '', '');
				const config = { inExecution: true };
				if (endTime && endTime !== '') {
					config.incremental = endTime;
				}
				await db.manager.update(Configuration, { id: self.current.id }, config);
				// await db.manager.save(Logs, { id: self.current.id }, config);
			}
			const dynamic = new DynamicModel(self.current.tableToParse);
			const schema = dynamic.schema;
			if (schema) {
				if (clean) {
					console.log('remove');
					await db.manager.remove(schema);
					console.log('remove ok');
				}

				const entity: any = db.manager.create(schema, self.content[controller]);
				const key = entity.url ? entity.url : entity.id;
				const entitydb = await db.manager.find(schema, {
					url: entity.url,
				});
				if (entitydb.length > 0) {
					console.log('update', entity);
					await log('UPDATE', self.current, JSON.stringify(self.content[controller]), key);
					await db.manager.update(schema, { url: key }, self.content[controller]);
				} else {
					console.log('save', entity);
					await log('INSERT', self.current, entity, key);
					await db.manager.save(schema, entity);
				}
			}
			if (self.content.length <= controller + 1) {
				await db.manager.update(
					Configuration,
					{ id: self.current.id },
					{ inExecution: false, lastExecuteAt: new Date() },
				);
				await log('FINISH', self.current, '', '');
			}
			/*		} catch (err) {
				await log('ERROR', self.current, JSON.stringify(err), JSON.stringify(self.content[controller]));
			}*/
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
