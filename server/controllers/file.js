import fs from 'fs';
import repo from '../utils/repo'
import logger from '../utils/logger';

exports.post = (req, res) => {
    var file = req.body;
    repo.createFile(file, req.user).then(result =>res.json(result))
    .catch(err => {
        logger.error(err);
        res.status(500).send(err);
    });
    
};

exports.put = (req, res) => {
    var file = req.body;
    repo.updateFile(file, req.user).then(result =>res.json(result))
    .catch(err => {
        logger.error(err);
        res.status(500).send(err);
    });
};


exports.delete = (req, res) => {
    repo.deleteFile(req.body, req.user).then( result=>res.json(result))
    .catch(err => {
        logger.error(err);
        res.status(500).send(err);
    });
};


exports.rename = (req, res) => {
    var filepath = req.body.path;
    var fileName = req.body.name;
    var newName = req.body.newName;
    res.sendStatus(200);
};
