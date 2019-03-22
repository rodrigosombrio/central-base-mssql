import { Request, Response, Router } from 'express';
import { Groups } from '../models/Groups';
import { Database } from '../services/database';
import { Pagination } from '../services/pagination';
import { BaseRouter } from './routers';

const db: Database = new Database();

class GroupsRouter extends BaseRouter {
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
			res.json(await super.json(Groups, 'groups', Pagination.parse(req)));
		});

		this._router.get('/:id', async (req: Request, res: Response) => {
			const list: Groups[] = await db.manager.find(Groups, { id: req.params.id });
			let json: {
				count?: number;
				error?: string;
				next_page?: string | null;
				prev_page?: string | null;
				groups?: Groups[];
			};
			if (list.length > 0) {
				json = {
					count: list.length,
					groups: list,
					next_page: null,
					prev_page: null,
				};
			} else {
				json = {
					error: `Groups not found ${req.params.id} `,
				};
			}
			res.json(json);
		});
	}
}

export const GroupsController: Router = new GroupsRouter().router;
