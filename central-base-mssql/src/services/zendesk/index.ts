import * as request from 'request-promise';
import { Cache } from '../../cache';
import { logger } from '../index';

export class Zendesk {
	public static json (url: string) {
		return new Promise((resolve, reject) => {
			const token = Cache.get('tokenZendesk');
			const user = Cache.get('userZendesk');

			const options = {
				headers: {
					Accept: 'application/json',
					Authorization:
						'Basic ' +
						new Buffer(`${user}/token:${token}`).toString('base64'),
				},
				json: true,
				method: 'GET',
				timeout: 180000,
				uri: url,
			};
			request
				.get(options)
				.then((result) => {
					resolve(result);
				})
				.catch((err) => {
					reject(err);
				});
		});
	}
	constructor () {
		logger.info('db %s', 'zendesk');
	}
}
