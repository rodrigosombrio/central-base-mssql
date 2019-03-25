import { Request, Response, Router } from 'express';
import { Tickets } from '../models/Tickets';
import { TicketsComments } from '../models/TicketsComments';
import { Database } from '../services/database';
import { Pagination } from '../services/pagination';
import { BaseRouter } from './routers';

const db: Database = new Database();

class TicketsRouter extends BaseRouter {
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
			res.json(await super.json(Tickets, 'tickets', Pagination.parse(req)));
		});

		this._router.get('/:id', async (req: Request, res: Response) => {
			const list: Tickets[] = await db.manager.find(Tickets, { id: req.params.id });
			let json: {
				count?: number;
				error?: string;
				next_page?: string | null;
				prev_page?: string | null;
				tickets?: Tickets[];
			};
			if (list.length > 0) {
				json = {
					count: list.length,
					next_page: null,
					prev_page: null,
					tickets: list,
				};
			} else {
				json = {
					error: `Tickets not found ${req.params.id} `,
				};
			}
			res.json(json);
		});
		this._router.get('/:id/comments', async (req: Request, res: Response) => {
			console.log('comments', req.params.id)
			const list: TicketsComments[] = await db.manager.find(TicketsComments, { ticket_id: req.params.id });
			console.log('list', list)
			let json: {
				count?: number;
				error?: string;
				next_page?: string | null;
				prev_page?: string | null;
				tickets_comments?: TicketsComments[];
			};
			if (list.length > 0) {
				json = {
					count: list.length,
					next_page: null,
					prev_page: null,
					tickets_comments: list,
				};
			} else {
				json = {
					error: `Tickets_comments	 not found ${req.params.id} `,
				};
			}
			console.log('json', json)
			res.json(json);
		});
	}
}

export const TicketsController: Router = new TicketsRouter().router;
