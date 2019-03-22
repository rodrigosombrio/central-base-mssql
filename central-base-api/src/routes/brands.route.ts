import { Request, Response, Router } from 'express';
import { Brands } from '../models/Brands';
import { Database } from '../services/database';

const router: Router = Router();
const db: Database = new Database();

router.get('/', async (req: Request, res: Response) => {
	const list: Brands[] = await db.manager.find(Brands);
	const json = {
		brands: list,
		count: list.length,
		next_page: null,
		prev_page: null,
	};
	res.json(json);
});

router.get('/:id', async (req: Request, res: Response) => {
	const list: Brands[] = await db.manager.find(Brands, { id: req.params.id });
	let json: {
		count?: number;
		error?: string;
		next_page?: string | null;
		prev_page?: string | null;
		brands?: Brands[];
	};
	if (list.length > 0) {
		json = {
			brands: list,
			count: list.length,
			next_page: null,
			prev_page: null,
		};
	} else {
		json = {
			error: `Brands not found ${req.params.id} `,
		};
	}
	res.json(json);
});

export const BrandsController: Router = router;
