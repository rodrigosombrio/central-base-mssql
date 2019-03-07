import { NextFunction, Request, Response, Router } from 'express';
import { logger } from '../services';
import { BaseRoute } from './route';

/**
 * / route
 *
 * @class User
 */
export class ApiRoutes extends BaseRoute {

	public static create (router: Router) {
    router.get('/', (req: Request, res: Response, next: NextFunction) => {
		new ApiRoutes().get(req, res, next);
	  });
  }

  /**
   * @class ApiRoutes
   * @constructor
   */
  constructor () {
    super();
  }

  public get (req: Request, res: Response, next: NextFunction) {
    logger.info('get: {}', req);
    res.status(200).json({ online: true });
  }

}
