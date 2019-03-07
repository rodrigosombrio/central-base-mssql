import config from 'config';
import { ConnectionPool, Request } from 'mssql';
import { logger } from './index';

const db: any = config.get('db');
const params = {
	database: db.database,
	password: db.password,
	pool: {
		idleTimeoutMillis: db.pool.idleTimeoutMillis,
		max: db.pool.max,
		min: db.pool.min,
	},
	server: db.host,
	user: db.user,
};

const state = {
	db: new ConnectionPool(params),
};

export class Database {
	constructor () {
		logger.info('db %s', state.db);
	}
	public connect (done: (result: any) => void) {
		const pool = new ConnectionPool(params);
		pool.connect((err) => {
			if (err) {
				return done(err);
			}
			state.db = pool;
			return done(undefined);
		});
	}
	public get db () {
		return state.db;
	}

	public get request (): Request {
		return state.db.request();
	}
}
