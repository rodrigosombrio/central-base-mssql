import { Cache } from '../../cache';
import { Configuration } from '../../models/Configuration';
import { Database } from '../database';
import DynamicModel from '../DynamicModel';
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
		console.log('zendesk get', url);
		Zendesk.json(url)
			.then((result: any) => {
				this.content = this.content.concat(result[this.current.tableToParse.toLowerCase()]);
				if (result.next_page) {
					this.run(result.next_page);
				} else {
					if (this.current.beforeClean) {
						const dynamic = new DynamicModel(this.current.tableToParse);
						const schema = dynamic.schema;
						db.manager.remove(schema).then(() => {
							this.finish(0, result.end_time);
						});
					} else {
						this.finish(0, result.end_time);
					}
				}
			})
			.catch((err) => {
				console.log('zendesk err', err);
			});
	}

	private static incremental (url: string) {
		console.log('zendesk incremental', url);
		Zendesk.json(url).then((result: any) => {
			this.content = this.content.concat(result[this.current.tableToParse.toLowerCase()]);
			console.log('url', url.indexOf(result.end_time));
			if (result.next_page && url.indexOf(result.end_time) === -1) {
				this.incremental(result.next_page);
			} else {
				if (this.current.beforeClean) {
					const dynamic = new DynamicModel(this.current.tableToParse);
					const schema = dynamic.schema;
					db.manager.remove(schema).then(() => {
						this.finish(0, result.end_time);
					});
				} else {
					this.finish(0, result.end_time);
				}
			}
		});
	}

	private static finish (controller: number, endTime: string) {
		const self = this;
		async function save () {
			if (controller === 0) {
				console.log('in execution', endTime);
				const config = { inExecution: true };
				if (endTime && endTime !== '') {
					config.incremental = endTime;
				}
				console.log('config', config);
				await db.manager.update(Configuration, { id: self.current.id }, config);
			}
			const dynamic = new DynamicModel(self.current.tableToParse);
			const schema = dynamic.schema;
			if (schema) {
				const entity: any = db.manager.create(schema, self.content[controller]);

				console.log('find');
				const entitydb = await db.manager.find(schema, {
					url: entity.url,
				});
				console.log('find ok ', entitydb);
				if (entitydb.length > 0) {
					console.log('update');
					await db.manager.update(schema, { url: entity.url }, self.content[controller]);
					console.log('update ok');
				} else {
					console.log('save');
					await db.manager.save(schema, entity);
					console.log('save ok');
				}
			}
			if (self.content.length <= controller + 1) {
				console.log('update finish');
				await db.manager.update(
					Configuration,
					{ id: self.current.id },
					{ inExecution: false, lastExecuteAt: new Date() },
				);
			}
		}

		save().then(() => {
			controller++;
			if (self.content.length > controller) {
				self.finish(controller, '');
			} else {
				self.content = [];
				self.index++;
				console.log(self.index, self.list.length);
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
