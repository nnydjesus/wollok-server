import validator from 'validator';
import config from '../config'
import User from '../models/user';
import repo from '../utils/repo'
import logger from '../utils/logger';
import generateToken from '../utils/token';
import fs from 'fs';

exports.list = (req, res) => {
	const params = req.params || {};
	const query = req.query || {};

	const page = parseInt(query.page, 10) || 0;
	const perPage = parseInt(query.per_page, 10) || 10;

	User.apiQuery(req.query)
		.select('name email username bio url twitter background')
		.then(users => {
			res.json(users);
		})
		.catch(err => {
			logger.error(err);
			res.status(422).send(err.errors);
		});
};

exports.get = (req, res) => {
	User.findById(req.params.userId)
		.then(user => {
			user.password = undefined;
			user.recoveryCode = undefined;

			res.json(user);
		})
		.catch(err => {
			logger.error(err);
			res.status(422).send(err.errors);
		});
};

exports.put = (req, res) => {
	const data = req.body || {};

	if (data.email && !validator.isEmail(data.email)) {
		return res.status(422).send('Invalid email address.');
	}

	if (data.username && !validator.isAlphanumeric(data.username)) {
		return res.status(422).send('Usernames must be alphanumeric.');
	}

	User.findByIdAndUpdate({ _id: req.params.userId }, data, { new: true })
		.then(user => {
			if (!user) {
				return res.sendStatus(404);
			}

			user.password = undefined;
			user.recoveryCode = undefined;

			res.json(user);
		})
		.catch(err => {
			logger.error(err);
			res.status(422).send(err.errors);
		});
};

exports.post = (req, res) => {
	const data = req.body;
	
	User.create(data)
		.then(user => {
			const token = generateToken(user);
			
			res.json({
				email: user.email,
				name: user.name,
				id: user._id,
				token: token
			});
		})
		.catch(err => {
			logger.error(err);
			res.status(500).send(err);
		});
};

exports.signin = (req, res) => {
	const email = req.body.email;
	const password = req.body.password;
	
	User.findOne({ email: email })
	.then(user => {
		if(user == undefined){
			res.status(401).json({id:"invalidCredentials"});
		}
		user.verifyPassword(password).then(function(valid) {
			if (valid) {
				const token = token(user);
				res.json({
					name: user.name,
					id: user._id,
					token: token
				});
			} else {
				res.status(401).json({id:"invalidCredentials"});
			}
		}).catch(function(err) {
			logger.error(err);
			res.status(401).json({id:"invalidCredentials"});
		});
	})
	.catch(err => {
		logger.error(err);
		res.status(401).json({id:"invalidCredentials"});
	});
};

exports.delete = (req, res) => {
	User.findByIdAndUpdate(
		{ _id: req.params.user },
		{ active: false },
		{
			new: true
		}
	).then(user => {
		if (!user) {
			return res.sendStatus(404);
		}

		res.sendStatus(204);
	}).catch(err => {
		logger.error(err);
		res.status(422).send(err.errors);
	});
};


exports.social = (req, res) => {
	var user = req.user
	if(user == undefined){
		res.status(401).json({id:"invalidCredentials"});
	}
	const token = generateToken(user);
	res.json({
		name: user.name,
		id: user._id,
		token: token
	});
};