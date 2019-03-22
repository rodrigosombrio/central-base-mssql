import { Request, Response, Router } from 'express';
import { OrganizationFields } from '../models/OrganizationFields';
import { Database } from '../services/database';

const router: Router = Router();
const db: Database = new Database();

router.get('/', async (req: Request, res: Response) => {
	const list: OrganizationFields[] = await db.manager.find(OrganizationFields);
	const json = {
		count: list.length,
		next_page: null,
		organization_fields: list,
		prev_page: null,
	};
	res.json(json);
});

router.get('/:id', async (req: Request, res: Response) => {
	const list: OrganizationFields[] = await db.manager.find(OrganizationFields, { id: req.params.id });
	let json: {
		count?: number;
		error?: string;
		next_page?: string | null;
		organization_fields?: OrganizationFields[];
		prev_page?: string | null;
	};
	if (list.length > 0) {
		json = {
			count: list.length,
			next_page: null,
			organization_fields: list,
			prev_page: null,
		};
	} else {
		json = {
			error: `Organization_fields not found ${req.params.id} `,
		};
	}
	res.json(json);
});

export const OrganizationFieldsController: Router = router;
