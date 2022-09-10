import 'dotenv/config';
import { ExtendedClient } from './Classes/ExtendedClient';
import { clientConfig } from './Config/clientConfig';

new ExtendedClient(clientConfig);