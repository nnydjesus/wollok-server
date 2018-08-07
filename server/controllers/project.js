import fs from 'fs';
import fse from 'fs-extra';
import repo from '../utils/repo'
import logger from '../utils/logger';

exports.post = (req, res) => {
    var projectName = req.body.name;
    var project = {name:projectName, extension:"directory", children:[], path:"/"}
    repo.createFolder(project, req.user).then(result =>res.json(project))
    .catch(err => {
        logger.error(err);
        res.status(500).send(err);
    });
};

exports.complete = (req, res) => {
    var project = req.body;
    repo.createProject(project, req.user).then(result =>res.json(project))
};

exports.list = (req, res) => {
    repo.getProjects(req.user).then(result =>res.json(result))
    .catch(err => {
        logger.error(err);
        res.status(500).send(err);
    });
};

exports.get = (req, res) => {
    var name = req.params.name;
    repo.getProject(name, req.user)
    .then(result =>res.json(result) )
    .catch(err => {
        logger.error(err);
        res.status(500).send(err);
    });
};
