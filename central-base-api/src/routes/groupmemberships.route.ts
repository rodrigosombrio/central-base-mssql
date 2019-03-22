import { Request, Response, Router } from 'express';
import { GroupsMemberships } from '../models/GroupsMemberships';
import { Database } from '../services/database';
import { Pagination } from '../services/pagination';
import { BaseRouter } from './routers';

const db: Database = new Database();

class GroupsMembershipsRouter extends BaseRouter {
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
			res.json(await super.json(GroupsMemberships, 'group_memberships', Pagination.parse(req)));
		});

		this._router.get('/:id', async (req: Request, res: Response) => {
			const list: GroupsMemberships[] = await db.manager.find(GroupsMemberships, {
				id: req.params.id,
			});
			let json: {
				count?: number;
				error?: string;
				next_page?: string | null;
				prev_page?: string | null;
				group_memberships?: GroupsMemberships[];
			};
			if (list.length > 0) {
				json = {
					count: list.length,
					group_memberships: list,
					next_page: null,
					prev_page: null,
				};
			} else {
				json = {
					error: `Group_memberships not found ${req.params.id} `,
				};
			}
			res.json(json);
		});
		this._router.get('/user/:id', async (req: Request, res: Response) => {
			const list: GroupsMemberships[] = await db.manager.find(GroupsMemberships, { user_id: req.params.id });
			let json: {
				count?: number;
				error?: string;
				next_page?: string | null;
				prev_page?: string | null;
				group_memberships?: GroupsMemberships[];
			};
			if (list.length > 0) {
				json = {
					count: list.length,
					group_memberships: list,
					next_page: null,
					prev_page: null,
				};
			} else {
				json = {
					error: `Group_memberships not found ${req.params.id} `,
				};
			}
			res.json(json);
		});
		this._router.get('/group/:id', async (req: Request, res: Response) => {
			const list: GroupsMemberships[] = await db.manager.find(GroupsMemberships, { group_id: req.params.id });
			let json: {
				count?: number;
				error?: string;
				next_page?: string | null;
				prev_page?: string | null;
				group_memberships?: GroupsMemberships[];
			};
			if (list.length > 0) {
				json = {
					count: list.length,
					group_memberships: list,
					next_page: null,
					prev_page: null,
				};
			} else {
				json = {
					error: `Group_memberships not found ${req.params.id} `,
				};
			}
			res.json(json);
		});
	}
}

export const GroupsMembershipsController: Router = new GroupsMembershipsRouter().router;
