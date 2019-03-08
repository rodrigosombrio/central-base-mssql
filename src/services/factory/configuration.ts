import { Request } from 'mssql';
import { Cache } from '../../cache';
import { Brands } from '../../models/Brands';
import { Configuration } from '../../models/Configuration';
import { Logo } from '../../models/Logo';
import { Database } from '../database';
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
			this.content = this.content.concat(
				result[this.current.tableToParse.toLowerCase()],
			);
			if (result.next_page) {
				this.run(result.next_page);
			} else {
				this.finish(0);
			}
		});
	}
	private static finish (index: number) {
		console.log(index, this.content[index].logo);
		const self = this;

		async function save () {
			if (self.content[index].logo) {
				const logo = await db.manager.create(
					Logo,
					self.content[index].logo,
				);
				console.log('logo', logo);
				if (await db.manager.hasId(logo)) {
					await db.manager.update(
						Logo,
						{ id: logo.id },
						self.content[index].logo,
					);
				} else {
					await db.manager.save(logo);
				}
			}
			const brands = await db.manager.create(Brands, self.content[index]);
			if (await db.manager.hasId(brands)) {
				await db.manager.update(
					Brands,
					{ id: brands.id },
					self.content[index],
				);
			} else {
				await db.manager.save(brands);
			}
		}

		save().then(() => {
			index++;
			if (self.content.length > index) {
				self.finish(index);
			} else {
				self.content = [];
			}
		});
	}
	constructor () {
		logger.info('db %s', 'zendesk');
	}
}
