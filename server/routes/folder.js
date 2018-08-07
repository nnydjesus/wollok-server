import Folder from '../controllers/folder';

module.exports = api => {
    api.route('/folders').post(Folder.post);
    api.route('/folders/:folderName').delete(Folder.delete);
};
