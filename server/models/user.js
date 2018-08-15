import mongoose, { Schema } from 'mongoose';
import bcrypt from 'mongoose-bcrypt';
import timestamps from 'mongoose-timestamp';
import mongooseStringQuery from 'mongoose-string-query';
import repo from '../utils/repo';

import logger from '../utils/logger';
import email from '../utils/email';

export const UserSchema = new Schema(
	{
		email: {
			type: String,
			lowercase: true,
			trim: true,
			index: true,
			unique: true,
			required: true
		},
		password: {
			type: String,
			required: true,
			bcrypt: true
		},
		facebookProvider: {
            type: {
                id: String,
                token: String
            },
            select: false
		},
		googleProvider: {
            type: {
                id: String,
                token: String
            },
            select: false
		},
		githubProvider: {
            type: {
                id: String,
                token: String
            },
            select: false
		},
		name: {
			type: String,
			trim: true,
			required: true
		},
		recoveryCode: {
			type: String,
			trim: true,
			default: ''
		},
		active: {
			type: Boolean,
			default: true
		},
		admin: {
			type: Boolean,
			default: false
		}
	},
	{ collection: 'users' }
);

UserSchema.pre('save', function(next) {
	if (!this.isNew) {
		next();
	}

	repo.createUserFolder(this).then(()=> {} )

	email({
		type: 'welcome',
		email: this.email
	})
		.then(() => {
			next();
		})
		.catch(err => {
			logger.error(err);
			next();
		});
});

UserSchema.pre('findOneAndUpdate', function(next) {
	if (!this._update.recoveryCode) {
		return next();
	}

	email({
		type: 'password',
		email: this._conditions.email,
		passcode: this._update.recoveryCode
	})
		.then(() => {
			next();
		})
		.catch(err => {
			logger.error(err);
			next();
		});
});

UserSchema.statics.upsertSocialUser = function(provider, accessToken, refreshToken, profile, cb) {
	console.log(profile)
	var that = this;  
	var providerId= provider+'.id'
	return this.findOne({
		[providerId]: profile.id
	}).then(user => {
		// no user was found, lets create a new one
		if (!user) {
			var newUser = new that({
				name: profile.displayName||profile.username,
				email: profile.emails?profile.emails[0].value : profile.username,
				password: accessToken,
				[provider]: {
					id: profile.id,
					token: accessToken
				}
			});

			return newUser.save()
				.then(userSaved => cb(undefined, userSaved))
				.catch(err => {
					logger.error(err);
					cb(err, newUser)
				});
		}
		return cb(undefined, user);
	}).catch(err => {
		logger.error(err);
		cb(err, undefined)
	});
};

UserSchema.plugin(bcrypt);
UserSchema.plugin(timestamps);
UserSchema.plugin(mongooseStringQuery);

UserSchema.index({ email: 1});

module.exports = exports = mongoose.model('User', UserSchema);
