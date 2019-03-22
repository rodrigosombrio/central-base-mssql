import { Request, Response, Router } from 'express';
import { Like } from 'typeorm';
import { Users } from '../models/Users';
import { Database } from '../services/database';
import { Pagination } from '../services/pagination';
import { BaseRouter } from './routers';

const db: Database = new Database();

class UsersRouter extends BaseRouter {
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
			res.json(await super.json(Users, 'users', Pagination.parse(req)));
		});

		this._router.get('/:id', async (req: Request, res: Response) => {
			const list: Users[] = await db.manager.find(Users, { id: req.params.id });
			let json: {
				count?: number;
				error?: string;
				next_page?: string | null;
				prev_page?: string | null;
				users?: Users[];
			};
			if (list.length > 0) {
				json = {
					count: list.length,
					next_page: null,
					prev_page: null,
					users: list,
				};
			} else {
				json = {
					error: `Users not found ${req.params.id} `,
				};
			}
			res.json(json);
		});
		this._router.get('/search/:nome', async (req: Request, res: Response) => {
			const list: Users[] = await db.manager.find(Users, { name: Like(`%${req.params.nome}%`) });
			let json: {
				count?: number;
				error?: string;
				next_page?: string | null;
				prev_page?: string | null;
				users?: Users[];
			};
			if (list.length > 0) {
				json = {
					count: list.length,
					next_page: null,
					prev_page: null,
					users: list,
				};
			} else {
				json = {
					error: `Users not found ${req.params.nome} `,
				};
			}
			res.json(json);
		});
	}
}

export const UsersController: Router = new UsersRouter().router;
