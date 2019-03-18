import * as bodyParser from 'body-parser';
import * as compression from 'compression';
import * as path from 'path';

import cors from 'cors';
import errorHandler from 'errorhandler';
import express from 'express';
import helmet from 'helmet';
import methodOverride from 'method-override';
import morgan from 'morgan';
import schedule = require('node-schedule');

import { ApiRoutes } from './routes';
import { logger } from './services';

import { Cache } from './cache';
import { Configuration } from './models/Configuration';
import { Params } from './models/Params';
import { Database } from './services/database';
import { ConfigurationFactory } from './services/factory/configuration';

const db: Database = new Database();
/**
 * The server.
 *
 * @class Server
 */
export class Server {
	/**
	 * Bootstrap the application.
	 *
	 * @class Server
	 * @method bootstrap
	 * @static
	 */
	public static bootstrap (): Server {
		return new Server();
	}

	public app: express.Application;

	/**
	 * Constructor.
	 *
	 * @class Server
	 * @constructor
	 */
	constructor () {
		const self = this;
		// create expressjs application
		this.app = express();

		db.connect((err) => {
			if (err) {
				logger.info('Erro ao conectar o banco!');
				console.log(err);
			}

			db.repository(Params)
				.find()
				.then(async (result) => {
					for (const record of result) {
						console.log(record);
						Cache.set(record.key, record.value);
					}

					self.schedule();

					// configure application
					self.config();

					// add routes
					self.routes();
				});
		});
	}

	/**
	 * Start schedule from import Zendesk JSON
	 *
	 * @class Server
	 * @method config
	 */
	public schedule () {
		const execute: schedule.JobCallback = () => {
			logger.info('execute job: %s', new Date());

			db.repository(Configuration)
				.find({
					order: {
						priority: 'ASC',
					},
					where: { active: true, inExecution: false },
				})
				.then(async (configutarion) => {
					for (const record of configutarion) {
						ConfigurationFactory.addRow(record);
					}
					ConfigurationFactory.start();
				});

			/*			const request: Request = db.request;
			request
				.query('select * from Configuration order by priority')
				.then((configutarion: any) => {
					const result: any[] = configutarion.recordset;
					for (const record of result) {
						ConfigurationFactory.addRow(record);
					}
					ConfigurationFactory.import();
				});*/
		};
		schedule.scheduleJob('*/3 * * * *', execute);
	}

	/**
	 * Configure application
	 *
	 * @class Server
	 * @method config
	 */

	public config () {
		// add static paths
		this.app.use(express.static(path.join(__dirname, 'public')));

		// mount logger
		this.app.use(
			morgan('tiny', {
				stream: {
					write: (message: string) => logger.info(message.trim()),
				},
			} as morgan.Options),
		);

		// mount json form parser
		this.app.use(bodyParser.json({ limit: '50mb' }));

		// mount query string parser
		this.app.use(
			bodyParser.urlencoded({
				extended: true,
			}),
		);

		// mount override?
		this.app.use(helmet());
		this.app.use(cors());
		this.app.use(compression.default);
		this.app.use(methodOverride());

		// catch 404 and forward to error handler
		this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
			err.status = 404;
			next(err);
		});

		// error handling
		this.app.use(errorHandler());
	}

	/**
	 * Create and return Router.
	 *
	 * @class Server
	 * @method routes
	 * @return void
	 */
	private routes () {
		let router: express.Router;
		router = express.Router();

		ApiRoutes.create(router);

		// use router middleware
		this.app.use(router);
	}
}
