import * as config from 'config';

import { Router } from 'express';
import { logger } from '../services';

export abstract class BaseRoute {
	/**
	 * Constructor
	 *
	 * @class BaseRoute
	 * @constructor
	 */

	protected router = Router();
	protected connection: any = {};

	public async connect (name: string): Promise<any> {
		console.log('create');
		return {};
	}

	public async disconnect (name: string): Promise<boolean> {
		console.log('disconnect');
		try {
			return true;
		} catch (err) {
			logger.error('Error while disconnecting from database:', err);
			return false;
		}
	}
}
