import Project from '../controllers/project';

module.exports = api => {
    api.route('/projects').post(Project.post);
    api.route('/projects/complete').post(Project.complete);
    api.route('/projects').get(Project.list);
    api.route('/projects/:name').get(Project.get);
};
