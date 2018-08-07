import fs from 'fs';
import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import winston from 'winston';
import compression from 'compression';
import expressWinston from 'express-winston';
import jwt from 'express-jwt';

import config from './server/config';
import logger from './server/utils/logger';

const api = express();

api.use(cors());
api.use(compression());
api.use(bodyParser.urlencoded({ extended: true }));
api.use(bodyParser.json());

api.use(
	jwt({ secret: config.jwt.secret }).unless({
		path: [
			'/auth/signup',
			'/auth/signin'
		]
	})
);

api.use((err, req, res, next) => {
	if (err.name === 'UnauthorizedError') {
		res.status(401).send('Missing authentication credentials.');
	}
});

api.use(
	expressWinston.logger({
		transports: [
			new winston.transports.Papertrail({
				host: config.logger.host,
				port: config.logger.port,
				level: 'info'
			})
		],
		meta: true
	})
);

api.listen(config.server.port, err => {
	if (err) {
		logger.error(err);
		process.exit(1);
	}

	require('./server/utils/db');

	fs.readdirSync(path.join(__dirname, './server/routes')).map(file => {
		require('./server/routes/' + file)(api);
	});

	logger.info(
		`API is now running on port ${config.server.port} in ${config.env} mode`
	);
});

module.exports = api;
