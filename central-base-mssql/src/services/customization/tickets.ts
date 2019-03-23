import { Cache } from '../../cache';
import { Tickets } from '../../models/Tickets';
import { TicketsComments } from '../../models/TicketsComments';
import { Database } from '../database';
import { logger } from '../logger';
import { Zendesk } from '../zendesk';

const db: Database = new Database();

export class CustomizationTickets {
	public static async run (event: string, data: Tickets) {
		console.log('event', event, data);
		const baseUri = Cache.get('baseUriZendesk');
		let url = baseUri + '/api/v2/tickets/' + data.id + '/comments.json';
		let next: boolean = true;
		let comments: any = [];
		while (next) {
			console.log('url incremental', url);
			const result: any = await Zendesk.json(url);
			const items = result.comments;
			comments = comments.concat(items);
			if (result.next_page && url.indexOf(result.end_time) === -1) {
				url = result.next_page;
			} else {
				next = false;
			}
		}
		console.log('comments', comments);
		for (const content of comments) {
			try {
				const entity: any = db.manager.create(TicketsComments, content);
				const entitydb = await db.manager.find(TicketsComments, {
					id: '' + entity.id,
				});
				if (entitydb.length > 0) {
					await db.manager.update(TicketsComments, { id: '' + entity.id }, content);
				} else {
					await db.manager.save(TicketsComments, entity);
				}
			} catch (err) {
				console.log(err);
			}
		}

		return event;
	}
	private static _content: any;
	constructor () {
		logger.info('in customization tickets');
	}
}
