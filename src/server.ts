import config from 'config';
import { Server } from './app';
import { logger } from './services';

// create http server
export const app = Server.bootstrap().app;
export const server = app.listen(config.get('port'));

server.on('listening', onListening);

function onListening () {
	const addr = server.address();
	const bind =
		typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr.port;
	logger.info('Listening on ' + bind);
}
