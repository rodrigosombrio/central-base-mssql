import { logger } from '../logger';

export class CustomizationTickets {
	constructor () {
		logger.info('in customization tickets');
	}

	public run (event: string) {
		return event;
	}
}
