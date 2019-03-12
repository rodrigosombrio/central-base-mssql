import { Configuration } from '../../models/Configuration';
import { Logs } from '../../models/Logs';
import { Database } from '../database';

const db: Database = new Database();

export async function log (event: string, config: Configuration, details: string, key: string) {
	const log: Logs = new Logs();
	log.startAt = new Date();
	log.event = event;
	log.config = config;
	log.details = details;
	log.key = key;
	await db.manager.save(Logs, log);
}
