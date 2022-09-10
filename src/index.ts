import 'dotenv/config';
import { ExtendedClient } from './Classes/ExtendedClient';
import { clientConfig } from './Config/clientConfig';

new ExtendedClient(clientConfig);

['warning', 'uncaughtException', 'error', 'unhandledRejection'].forEach((event) => {
	process.on(event, () => {
		console.log('Error: ' + event);
	});
});