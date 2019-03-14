import { Configuration } from '../../models/Configuration';
import { Logs } from '../../models/Logs';
import { Database } from '../database';

const db: Database = new Database();

export async function log (event: string, config: Configuration, details: string, key: string) {
	const logged: Logs = new Logs();
	logged.startAt = new Date();
	logged.event = event;
	logged.configId = config.id;
	logged.details = details;
	logged.key = key;
	await db.manager.save(Logs, logged);
}
