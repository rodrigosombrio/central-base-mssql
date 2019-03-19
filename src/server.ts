import config from 'config';
import { Application } from 'express';
import { Server } from './app';
import { logger } from './services';

// create http server
export const bootstrap = Server.bootstrap();
export let server: any = {};
bootstrap.start().then((app: any) => {
	console.log('start', app);
	server = app.listen(config.get('port'));
	server.on('listening', onListening);
});
function onListening () {
	const addr = server.address();
	const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
	logger.info('Listening on ' + bind);
}
