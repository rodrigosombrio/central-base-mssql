import { Request, Response, Router } from 'express';
import { TicketsAudits } from '../models/TicketsAudits';
import { Database } from '../services/database';
import { Pagination } from '../services/pagination';
import { BaseRouter } from './routers';
import { SlaPolicies } from '../models/SlaPolicies';

const db: Database = new Database();

class SlaRouter extends BaseRouter {
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
			res.json(await super.json(SlaPolicies, 'sla_policies', Pagination.parse(req)));
		});

		this._router.get('/:id', async (req: Request, res: Response) => {
			const list: SlaPolicies[] = await db.manager.find(SlaPolicies, { id: req.params.id });
			let json: {
				count?: number;
				error?: string;
				next_page?: string | null;
				prev_page?: string | null;
				sla_policies?: SlaPolicies[];
			};
			if (list.length > 0) {
				json = {
					count: list.length,
					next_page: null,
					prev_page: null,
					sla_policies: list,
				};
			} else {
				json = {
					error: `Sla_policies not found ${req.params.id} `,
				};
			}
			res.json(json);
		});
	}
}

export const SlaController: Router = new SlaRouter().router;
