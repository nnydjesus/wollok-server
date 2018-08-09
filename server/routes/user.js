import User from '../controllers/user';
import  '../utils/passport';
import passport  from 'passport';

// ConfigPassport()

module.exports = api => {
	api.route('/users').get(User.list);
	api.route('/users/:userId').get(User.get);
	api.route('/users/:userId').put(User.put);
	api.route('/users/:userId').delete(User.delete);
	
	api.route('/auth/signup').post(User.post);
	api.route('/auth/signin').post(User.signin);
	api.route('/auth/facebook').post(passport.authenticate('facebook-token', {session: false}), User.social);
	api.route('/auth/google').post(passport.authenticate('google-token', {session: false}), User.social);
	api.route('/auth/github').post(passport.authenticate('github-token', {session: false}), User.social);
};
