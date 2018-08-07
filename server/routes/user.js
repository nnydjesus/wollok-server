import User from '../controllers/user';

module.exports = api => {
	api.route('/users').get(User.list);
	api.route('/users/:userId').get(User.get);
	api.route('/users/:userId').put(User.put);
	api.route('/auth/signup').post(User.post);
	api.route('/auth/signin').post(User.signin);
	api.route('/users/:userId').delete(User.delete);
};
