import { Request, Response, Router } from 'express';
import { OrganizationMemberships } from '../models/OrganizationMemberships';
import { Database } from '../services/database';
import { Pagination } from '../services/pagination';
import { BaseRouter } from './routers';

const db: Database = new Database();

class OrganizationMembershipsRouter extends BaseRouter {
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
			res.json(await super.json(OrganizationMemberships, 'organization_memberships', Pagination.parse(req)));
		});

		this._router.get('/:id', async (req: Request, res: Response) => {
			const list: OrganizationMemberships[] = await db.manager.find(OrganizationMemberships, {
				id: req.params.id,
			});
			let json: {
				count?: number;
				error?: string;
				next_page?: string | null;
				prev_page?: string | null;
				organization_memberships?: OrganizationMemberships[];
			};
			if (list.length > 0) {
				json = {
					count: list.length,
					next_page: null,
					organization_memberships: list,
					prev_page: null,
				};
			} else {
				json = {
					error: `Organization_memberships not found ${req.params.id} `,
				};
			}
			res.json(json);
		});
		this._router.get('/user/:id', async (req: Request, res: Response) => {
			const list: OrganizationMemberships[] = await db.manager.find(OrganizationMemberships, {
				user_id: req.params.id,
			});
			let json: {
				count?: number;
				error?: string;
				next_page?: string | null;
				prev_page?: string | null;
				organization_memberships?: OrganizationMemberships[];
			};
			if (list.length > 0) {
				json = {
					count: list.length,
					next_page: null,
					organization_memberships: list,
					prev_page: null,
				};
			} else {
				json = {
					error: `Organization_memberships not found ${req.params.id} `,
				};
			}
			res.json(json);
		});
		this._router.get('/organization/:id', async (req: Request, res: Response) => {
			const list: OrganizationMemberships[] = await db.manager.find(OrganizationMemberships, {
				organization_id: req.params.id,
			});
			let json: {
				count?: number;
				error?: string;
				next_page?: string | null;
				prev_page?: string | null;
				organization_memberships?: OrganizationMemberships[];
			};
			if (list.length > 0) {
				json = {
					count: list.length,
					next_page: null,
					organization_memberships: list,
					prev_page: null,
				};
			} else {
				json = {
					error: `Organization_memberships not found ${req.params.id} `,
				};
			}
			res.json(json);
		});
	}
}

export const OrganizationMembershipsController: Router = new OrganizationMembershipsRouter().router;
