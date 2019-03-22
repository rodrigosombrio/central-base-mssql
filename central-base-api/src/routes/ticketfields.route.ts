import { Request, Response, Router } from 'express';
import { TicketFields } from '../models/TicketFields';
import { Database } from '../services/database';

const router: Router = Router();
const db: Database = new Database();

router.get('/', async (req: Request, res: Response) => {
	const list: TicketFields[] = await db.manager.find(TicketFields);
	const json = {
		count: list.length,
		next_page: null,
		prev_page: null,
		ticket_fields: list,
	};
	res.json(json);
});

router.get('/:id', async (req: Request, res: Response) => {
	const list: TicketFields[] = await db.manager.find(TicketFields, { id: req.params.id });
	let json: {
		count?: number;
		error?: string;
		next_page?: string | null;
		prev_page?: string | null;
		ticket_fields?: TicketFields[];
	};
	if (list.length > 0) {
		json = {
			count: list.length,
			next_page: null,
			prev_page: null,
			ticket_fields: list,
		};
	} else {
		json = {
			error: `Ticket_fields not found ${req.params.id} `,
		};
	}
	res.json(json);
});

export const TicketFieldsController: Router = router;
