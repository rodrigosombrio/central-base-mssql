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

			this.run(baseUri + this.current.url);
		}
	}
	private static run (url: string) {
		Zendesk.json(url).then((result: any) => {
			this.content = this.content.concat(result[this.current.tableToParse.toLowerCase()]);
			if (result.next_page) {
				this.run(result.next_page);
			} else {
				this.finish(0);
			}
		});
	}
	private static finish (controller: number) {
		const self = this;
		async function save () {
			const conf = new Configuration();
			conf.inExecution = true;
			// 			await db.manager.update(Configuration, { id: self.current.id }, conf);
			const schema = new DynamicModel(self.current.tableToParse) as Function;
			const entity: any = db.manager.create(schema, self.content[controller]);

			const entitydb: any = await db.manager
				.createQueryBuilder(schema, 'schema')
				.where('schema.id = :id', { id: entity.id })
				.getOne();

			// 			const entitydb: any[] = await db.manager.find(schema, { id: entity.id });
			if (entitydb) {
				await db.manager.update(schema, { id: entity.id }, self.content[controller]);
			} else {
				await db.manager.save(entity);
			}
		}

		save().then(() => {
			controller++;
			if (self.content.length > controller) {
				self.finish(controller);
			} else {
				self.current.inExecution = false;
				self.current.lastExecuteAt = new Date();
				self.content = [];
				self.index++;
				if (self.list.length > self.index) {
					self.import();
				}
			}
		});
	}
	constructor () {
		logger.info('db %s', 'zendesk');
	}
}
