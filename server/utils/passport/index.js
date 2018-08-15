import passport  from 'passport';
import FacebookTokenStrategy from 'passport-facebook-token';
import {Strategy as GoogleTokenStrategy} from 'passport-google-token';
import GitHubStrategy from 'passport-github';
import config from '../../config';
import logger from '../logger';
import User from '../../models/user';



passport.use(new FacebookTokenStrategy({
        clientID: config.facebook.appId,
        clientSecret: config.facebook.secret
    },
    function (accessToken, refreshToken, profile, done) {
        User.upsertSocialUser('facebookProvider', accessToken, refreshToken, profile, (err, user) => done(err, user) )
    })
);

passport.use(new GoogleTokenStrategy({
        clientID: config.google.clientId,
        clientSecret: config.google.secret
    },
    function (accessToken, refreshToken, profile, done) {
        User.upsertSocialUser('googleProvider', accessToken, refreshToken, profile, (err, user) => done(err, user) )
    })
);

passport.use(new GitHubStrategy({
        clientID: config.github.clientId,
        clientSecret: config.github.secret,
        callbackURL: config.github.callback,
    },
    function (accessToken, refreshToken, profile, done) {
        User.upsertSocialUser('githubProvider', accessToken, refreshToken, profile, (err, user) => done(err, user) )
    })
);
