import knex from 'knex';
import config from '../knexfile';
import dotenv from 'dotenv';

dotenv.config();

const environment = process.env.NODE_ENV || 'development';
const connection = knex(config[environment]);

export default connection;




