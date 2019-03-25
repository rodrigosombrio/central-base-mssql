import * as bodyParser from 'body-parser';
import * as path from 'path';

import compression from 'compression';
import cors from 'cors';
import errorHandler from 'errorhandler';
import express from 'express';
import helmet from 'helmet';
import methodOverride from 'method-override';
import morgan from 'morgan';

import { logger } from './services';

import { Cache } from './cache';
import { Params } from './models/Params';
import {
	BrandsController,
	GroupsController,
	GroupsMembershipsController,
	OrganizationFieldsController,
	OrganizationMembershipsController,
	OrganizationsController,
	TicketFieldsController,
	UserFieldsController,
	AuditsController,
	SlaController,
	TicketsController,
} from './routes';
import { UsersController } from './routes/users.route';
import { Database } from './services/database';

const db: Database = new Database();
export class Server {
	public static bootstrap (): Server {
		return new Server();
	}
	public app: any;

	/**
	 * Constructor.
	 *
	 * @class Server
	 * @constructor
	 */
	constructor () {
		this.app = express();
	}

	public async start () {
		const self = this;

		db.connect((err) => {
			if (err) {
				logger.error('Erro ao conectar o banco!');
			}

			db.repository(Params)
				.find()
				.then((result) => {
					let record: {
						key?: any;
						value?: any;
					};
					for (record of result) {
						Cache.set(record.key, record.value);
					}
					self.config();
					self.routes();
				});
		});
		return this.app;
	}

	public routes () {
		this.app.use('/brands', BrandsController);
		this.app.use('/ticket_fields', TicketFieldsController);
		this.app.use('/organizations', OrganizationsController);
		this.app.use('/groups', GroupsController);
		this.app.use('/users', UsersController);
		this.app.use('/organization_fields', OrganizationFieldsController);
		this.app.use('/organization_memberships', OrganizationMembershipsController);
		this.app.use('/group_memberships', GroupsMembershipsController);
		this.app.use('/user_fields', UserFieldsController);
		this.app.use('/audits', AuditsController);
		this.app.use('/sla', SlaController);
		this.app.use('/tickets', TicketsController);
	}

	public config () {
		this.app.use(express.static(path.join(__dirname, 'public')));

		this.app.use(
			morgan('tiny', {
				stream: {
					write: (message: string) => logger.info(message.trim()),
				},
			} as morgan.Options),
		);

		this.app.use(bodyParser.json({ limit: '50mb' }));
		this.app.use(
			bodyParser.urlencoded({
				extended: true,
			}),
		);
		this.app.use(helmet());
		this.app.use(cors());
		this.app.use(compression());
		this.app.use(methodOverride());

		this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
			err.status = 404;
			next(err);
		});

		this.app.use(errorHandler());
	}
}
