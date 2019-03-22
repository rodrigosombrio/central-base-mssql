import config from 'config';
import 'reflect-metadata';
import { Connection, createConnection } from 'typeorm';
import { SqlServerConnectionOptions } from 'typeorm/driver/sqlserver/SqlServerConnectionOptions';
import { Articles } from '../models/Articles';
import { Brands } from '../models/Brands';
import { Categories } from '../models/Categories';
import { Configuration } from '../models/Configuration';
import { Groups } from '../models/Groups';
import { GroupsMemberships } from '../models/GroupsMemberships';
import { Locales } from '../models/Locales';
import { Logs } from '../models/Logs';
import { OrganizationFields } from '../models/OrganizationFields';
import { OrganizationMemberships } from '../models/OrganizationMemberships';
import { Organizations } from '../models/Organizations';
import { Params } from '../models/Params';
import { Sections } from '../models/Sections';
import { TicketEvents } from '../models/TicketEvents';
import { TicketFields } from '../models/TicketFields';
import { Tickets } from '../models/Tickets';
import { UserFields } from '../models/UserFields';
import { Users } from '../models/Users';

const definitions: any = config.get('db');
const params: SqlServerConnectionOptions = {
	database: definitions.database,
	entities: [
		Params,
		Users,
		Logs,
		Configuration,
		Brands,
		Groups,
		GroupsMemberships,
		UserFields,
		Organizations,
		OrganizationFields,
		OrganizationMemberships,
		Tickets,
		TicketEvents,
		TicketFields,
		Locales,
		Categories,
		Sections,
		Articles,
	],
	host: definitions.host,
	logging: false,
	password: definitions.password,
	pool: {
		idleTimeoutMillis: definitions.pool.idleTimeoutMillis,
		max: definitions.pool.max,
		min: definitions.pool.min,
	},
	port: definitions.port,
	synchronize: definitions.synchronize,
	type: 'mssql',
	username: definitions.user,
};

const state = {
	db: new Connection(params),
};

export class Database {
	public get manager () {
		return state.db.manager;
	}

	public repository (entity: any) {
		return state.db.getRepository(entity);
	}
	public connect (done: (result: any) => void) {
		createConnection(params)
			.then(async (connection: Connection) => {
				state.db = connection;
				return done(undefined);
			})
			.catch((error: any) => {
				return done(error);
			});
	}
}