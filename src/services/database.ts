import config from 'config';
import 'reflect-metadata';
import { Connection, ConnectionOptions, createConnection } from 'typeorm';
import { Brands } from '../models/Brands';
import { Configuration } from '../models/Configuration';
import { Groups } from '../models/Groups';
import { GroupsMemberships } from '../models/GroupsMemberships';
import { Organizations } from '../models/Organizations';
import { Params } from '../models/Params';
import { UserFields } from '../models/UserFields';
import { Users } from '../models/Users';
import { logger } from './index';

const definitions: any = config.get('db');
const params: ConnectionOptions = {
	database: definitions.database,
	entities: [Params, Users, Configuration, Brands, Groups, GroupsMemberships, UserFields, Organizations],
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
			.then(async (connection: Connection) => {
				state.db = connection;
				return done(undefined);
			})
			.catch((error: any) => {
				return done(error);
			});
	}
}
