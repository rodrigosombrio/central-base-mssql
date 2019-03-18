import { Configuration } from '../../models/Configuration';
import { logger } from '../index';
import { HelpCenter } from './helpcenter';
import { Incremental } from './incremental';
import { Page } from './page';
import { Support } from './support';

export class ConfigurationFactory {
	public static list: Configuration[] = [];
	public static content: any[] = [];
	public static current: Configuration;
	public static index: number = 0;
	public static addRow (config: Configuration) {
		this.list.push(config);
	}
	public static getInstance (config: Configuration): any {
		if (config.is_helpcenter) {
			return new HelpCenter(config);
		} else if (config.incremental !== '') {
			return new Incremental(config);
		} else if (config.lastPage > 0) {
			return new Page(config);
		}
		return new Support(config);
	}
	public static start () {
		const self = this;
		if (this.list.length > 0) {
			this.current = this.list[this.index];
			const instance = ConfigurationFactory.getInstance(this.current);
			console.log('instance', instance);
			instance.import().then(() => {
				self.index++;
				if (self.list.length > self.index) {
					this.start();
				}
			});
		}
	}
	constructor () {
		logger.info('db %s', 'zendesk');
	}
}
