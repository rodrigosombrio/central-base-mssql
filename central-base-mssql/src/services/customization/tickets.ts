import { Tickets } from '../../models/Tickets';
import { logger } from '../logger';

export class CustomizationTickets {
	constructor () {
		logger.info('in customization tickets');
	}

	public run (event: string, data: Tickets) {
		return event;
	}
}
