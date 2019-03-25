import { Request, Response, Router } from 'express';
import { TicketsAudits } from '../models/TicketsAudits';
import { Database } from '../services/database';
import { Pagination } from '../services/pagination';
import { BaseRouter } from './routers';

const db: Database = new Database();

class AuditsRouter extends BaseRouter {
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
			res.json(await super.json(TicketsAudits, 'audits', Pagination.parse(req)));
		});

		this._router.get('/:id', async (req: Request, res: Response) => {
			const list: TicketsAudits[] = await db.manager.find(TicketsAudits, { ticket_id: req.params.id });
			let json: {
				count?: number;
				error?: string;
				next_page?: string | null;
				prev_page?: string | null;
				audits?: TicketsAudits[];
			};
			if (list.length > 0) {
				json = {
					audits: list,
					count: list.length,
					next_page: null,
					prev_page: null,
				};
			} else {
				json = {
					error: `Tickets_audits not found ${req.params.id} `,
				};
			}
			res.json(json);
		});
	}
}

export const AuditsController: Router = new AuditsRouter().router;
