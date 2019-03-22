import { Request, Response, Router } from 'express';
import { Organizations } from '../models/Organizations';
import { Database } from '../services/database';
import { Pagination } from '../services/pagination';
import { BaseRouter } from './routers';

const db: Database = new Database();

class OrganizationsRouter extends BaseRouter {
	public get router () {
		return this._router;
	}
	private _router: Router;

	constructor () {
		super();
		this._router = Router();
		this.create();
	}

	private create () {
		this._router.get('/', async (req: Request, res: Response) => {
			res.json(await super.json(Organizations, 'organizations', Pagination.parse(req)));
		});

		this._router.get('/:id', async (req: Request, res: Response) => {
			const list: Organizations[] = await db.manager.find(Organizations, { id: req.params.id });
			let json: {
				count?: number;
				error?: string;
				next_page?: string | null;
				prev_page?: string | null;
				organizations?: Organizations[];
			};
			if (list.length > 0) {
				json = {
					count: list.length,
					next_page: null,
					organizations: list,
					prev_page: null,
				};
			} else {
				json = {
					error: `Organization not found ${req.params.id} `,
				};
			}
			res.json(json);
		});
	}
}

export const OrganizationsController: Router = new OrganizationsRouter().router;
