import File from '../controllers/file';

module.exports = api => {
    api.route('/files').post(File.post);
    api.route('/files').put(File.put);
	api.route('/files/rename').get(File.rename);
	api.route('/files/:fileName').delete(File.delete);
};
