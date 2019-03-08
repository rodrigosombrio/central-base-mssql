import config from 'config';
import 'reflect-metadata';
import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import { Brands } from '../models/Brands';
import { Configuration } from '../models/Configuration';
import { Logo } from '../models/Logo';
import { Params } from '../models/Params';
import { TicketFields } from '../models/TicketFields';
import { TicketForms } from '../models/TicketForms';
import { TicketFormsOptions } from '../models/TicketFormsOptions';
import { logger } from './index';

const definitions: any = config.get('db');
const params: ConnectionOptions = {
	database: definitions.database,
	entities: [
		Params,
		Configuration,
		Brands,
		Logo,
		TicketFields,
		TicketForms,
		TicketFormsOptions,
	],
	host: definitions.host,
	logging: false,
	password: definitions.password,
	port: definitions.port,
	synchronize: true,
	type: 'mssql',
	username: definitions.user,
};

const state = {
	db: new Connection(params),
};

export class Database {
	public get db () {
		return state.db;
	}

	public get manager () {
		return state.db.manager;
	}
	constructor () {
		logger.info('db %s', state.db);
	}

	public repository (entity: any) {
		return state.db.getRepository(entity);
	}
	public connect (done: (result: any) => void) {
		createConnection(params)
			.then(async (connection) => {
				state.db = connection;
				return done(undefined);
			})
			.catch((error: any) => {
				return done(error);
			});
	}
}
