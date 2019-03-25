import { Cache } from '../../cache';
import { Configuration } from '../../models/Configuration';
import { Tickets } from '../../models/Tickets';
import { TicketsAudits } from '../../models/TicketsAudits';
import { TicketsComments } from '../../models/TicketsComments';
import { Database } from '../database';
import { log } from '../factory/logs';
import { logger } from '../logger';
import { Zendesk } from '../zendesk';

const db: Database = new Database();

export class CustomizationTickets {
	public static async run (event: string, data: Tickets) {
		await this.comments(event, data);
		await this.audits(event, data);
		return event;
	}

	public static async comments (event: string, data: Tickets) {
		console.log('comments')
		const baseUri = Cache.get('baseUriZendesk');
		let url = baseUri + '/api/v2/tickets/' + data.id + '/comments.json';
		let next: boolean = true;
		let comments: any = [];
		while (next) {
			const result: any = await Zendesk.json(url);
			const items = result.comments;
			comments = comments.concat(items);
			if (result.next_page && url.indexOf(result.end_time) === -1) {
				url = result.next_page;
			} else {
				next = false;
			}
		}
		for (const content of comments) {
			try {
				const entity: TicketsComments = db.manager.create(TicketsComments, content);
				entity.ticket_id = data.id;
				const entitydb = await db.manager.find(TicketsComments, { id: '' + content.id });
				if (entitydb.length > 0) {
					await db.manager.update(TicketsComments, { id: '' + content.id }, entity);
				} else {
					await db.manager.save(TicketsComments, entity);
				}
			} catch (err) {
				await log('ERROR', new Configuration(), JSON.stringify(err), content.id.toString());
			}
		}
		return true;
	}
	public static async audits (event: string, data: Tickets) {
		console.log('audits')
		const baseUri = Cache.get('baseUriZendesk');
		let url = baseUri + '/api/v2/tickets/' + data.id + '/audits.json';
		let next: boolean = true;
		let audits: any = [];
		while (next) {
			const result: any = await Zendesk.json(url);
			const items = result.audits;
			audits = audits.concat(items);
			if (result.next_page && url.indexOf(result.end_time) === -1) {
				url = result.next_page;
			} else {
				next = false;
			}
		}
		for (const content of audits) {
			try {
				const entity: TicketsAudits = db.manager.create(TicketsAudits, content);
				entity.ticket_id = data.id;
				entity.events = [];
				for (const evt of content.events) {
					entity.events.push(JSON.stringify(evt));
				}
				console.log('entity.events', entity.events)
				const entitydb = await db.manager.find(TicketsAudits, { id: '' + content.id });
				if (entitydb.length > 0) {
					await db.manager.update(TicketsAudits, { id: '' + content.id }, entity);
				} else {
					await db.manager.save(TicketsAudits, entity);
				}
			} catch (err) {
				console.log('err', err);
				await log('ERROR', new Configuration(), JSON.stringify(err), content.id.toString());
			}
		}
		return true;
	}

	constructor () {
		logger.info('in customization tickets');
	}

}
