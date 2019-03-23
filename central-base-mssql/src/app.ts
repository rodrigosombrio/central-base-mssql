import * as bodyParser from 'body-parser';
import * as path from 'path';

import compression from 'compression';
import cors from 'cors';
import errorHandler from 'errorhandler';
import express from 'express';
import helmet from 'helmet';
import methodOverride from 'method-override';
import morgan from 'morgan';
import schedule = require('node-schedule');

import { logger } from './services';

import { Cache } from './cache';
import { Configuration } from './models/Configuration';
import { Params } from './models/Params';
import { Database } from './services/database';
import { ConfigurationFactory } from './services/factory/configuration';

const db: Database = new Database();
export class Server {
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
		this.app = express();
	}

	public async start () {
		const self = this;

		db.connect((err) => {
			if (err) {
				logger.error('Erro ao conectar o banco!');
				console.log(err);
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
					self.schedule();
					self.config();
				});
		});
		return this.app;
	}

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
				.then(async (configuration) => {
					let record: {};
					for (record of configuration) {
						ConfigurationFactory.addRow(record as Configuration);
					}
					ConfigurationFactory.start();
				});
		};
		schedule.scheduleJob('*/2 * * * *', execute);
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
