import { Application, Request, Response } from 'express';

export class Routes {
	public routes (app: Application): void {
		console.log('app routes');
		app.use('/cst').get((req: Request, res: Response) => {
			console.log('app routes get');
			res.status(200).send({
				message: 'GET request successfulll!!!!',
			});
		});
	}
}
