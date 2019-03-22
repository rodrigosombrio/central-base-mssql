import { Request, Response, Router } from 'express';
import { UserFields } from '../models/UserFields';
import { Database } from '../services/database';

const router: Router = Router();
const db: Database = new Database();

router.get('/', async (req: Request, res: Response) => {
	const list: UserFields[] = await db.manager.find(UserFields);
	const json = {
		count: list.length,
		next_page: null,
		prev_page: null,
		user_fields: list,
	};
	res.json(json);
});

router.get('/:id', async (req: Request, res: Response) => {
	const list: UserFields[] = await db.manager.find(UserFields, { id: req.params.id });
	let json: {
		count?: number;
		error?: string;
		next_page?: string | null;
		prev_page?: string | null;
		user_fields?: UserFields[];
	};
	if (list.length > 0) {
		json = {
			count: list.length,
			next_page: null,
			prev_page: null,
			user_fields: list,
		};
	} else {
		json = {
			error: `User_fields not found ${req.params.id} `,
		};
	}
	res.json(json);
});

export const UserFieldsController: Router = router;
