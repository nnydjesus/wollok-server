import fs from 'fs';
import fse from 'fs-extra';
import repo from '../utils/repo'
import logger from '../utils/logger';


exports.post = (req, res) => {
    var folder = req.body;
    repo.createFolder(folder, req.user).then(result =>res.sendStatus(201))
    .catch(err => {
        logger.error(err);
        res.status(500).send(err);
    });

};

exports.delete = (req, res) => {
    var path = req.body.path;
    var folderName = req.params.folderName;
    repo.deleteFolder({name:folderName, path, children:[]}, req.user).then(result =>res.sendStatus(204))
    .catch(err => {
        logger.error(err);
        res.status(500).send(err);
    });
};
