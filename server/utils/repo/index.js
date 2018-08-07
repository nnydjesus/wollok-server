import Octokit from '@octokit/rest';
import config from '../../config'
import logger from '../logger';
import 'babel-polyfill';

const octokit = new Octokit()
octokit.authenticate({
    type: 'token',
    token: config.github.token

    // type: 'oauth',
    // key: config.github.clientId,
    // secret: config.github.secret
})

const owner = "nnydjesus"
const repo = "wollok-workspace"
const branch = "master"
const message = "update"

const toBase64 = (text) => {
    return Buffer.from(text).toString('base64')
}

const fromBase64 = (text) => {
    return Buffer.from(text, 'base64').toString('ascii')
}

const filePath = (file, user) => {
    return user.email+file.path+"/"+file.name
}

const flatten = list => list.reduce(
    (a, b) => a.concat(Array.isArray(b) ? flatten(b) : b), []
);

const author = (user) =>{
    return {name:user.name, email:user.email}
}



class Repo{

    createFile(file, user){
        return octokit.repos.createFile({owner, repo, path:filePath(file, user), message, content:toBase64(file.text), branch, committer: author(user), author: author(user)}).then(result => {
            return {sha: result.data.content.sha}
        })
    }

    createFolder(folder, user){
        return octokit.repos.createFile({owner, repo, path:filePath(folder, user)+"/init", message, content:"", branch, committer: author(user), author: author(user)})
    }

    createUserFolder(user){
        return octokit.repos.createFile({owner, repo, path:user.email+"/init", message, content:"", branch, committer: author(user), author: author(user)})
    }

    updateFile(file, user){
        return octokit.repos.createFile({owner, repo, path: filePath(file, user), message, content:toBase64(file.text), sha:file.sha, branch, committer: author(user), author: author(user)}).then(result => {
            return {sha: result.data.content.sha}
        })
    }

    deleteFile(file, user){
        return octokit.repos.deleteFile({owner, repo, path:filePath(file, user), message, sha:file.sha, branch, committer: author(user), author: author(user)})
    }

    deleteGithubFile(file, user){
        logger.info({type:"deleteFile", name:file.path, sha:file.sha});
        return  octokit.repos.deleteFile({owner, repo, path:file.path, message, sha:file.sha, branch, committer: author(user), author: author(user)}).then(result =>{
            logger.info({type:"deleteFileSuccessful", name:file.path, sha:file.sha});
            return result
        })
    }

    deleteFolder(folder, user){
        return this.deleteGithubFolder({path:user.email+folder.path+folder.name}, user)
    }

    deleteGithubFolder(folder, user){
        return octokit.repos.getContent({owner, repo, path:folder.path}).then(async result =>{
            var files = result.data.filter(data => data.type == "file")
            if(files.length > 0){
                await this.deleteGithubFile(files[0], user)
                if(result.data.length > 1){
                    await this.deleteGithubFolder(folder, user)
                }
            }else{
                var folders = result.data.filter(data => data.type == "dir")
                if(folders.length > 0){
                    await this.deleteGithubFolder(folders[0], user)
                }
            }
            // return result.data.map(async data =>{
            //     if(data.type == "file"){
            //         return await this.deleteGithubFile(data, user)
            //     }else{
            //         // return this.deleteGithubFolder(data, user)
            //     }
            // })
        })
    }

    createProject(project, user){
        return Promise.all(project.children.map( child =>{
            if(child.type == "file"){
                return this.createFile(child, user).then(result => child.sha = result.sha)
            }else{
                return this.createProject(child, user)
            }
        })).then( result => project)
    }
    
    getProject(name, user){
        var project = {name:name, path:"/", children:[], extension:"directory"}
        return this.getDirContent(user.email+"/"+name, user, project).then( () => project )
    }

    getProjects(user){
        return octokit.repos.getContent({owner, repo, path:user.email}).then(result =>result.data.filter(data=>data.type == "dir").map(dir => dir.name))
    }

    getDirContent(path, user, folder) {
        return octokit.repos.getContent({owner, repo, path}).then(result =>{
             return Promise.all(result.data.map(data =>{
                if(data.type == "file" && data.name != "init"){
                    return octokit.repos.getContent({owner, repo, path:data.path}).then(fileData =>{
                        var file = fileData.data
                        var fileServer = { name:file.name, path:file.path.replace(user.email, "").replace("/"+file.name, ""), sha:file.sha, text: fromBase64(file.content), type:file.type, extension: file.path.split(".").pop()}
                        folder.children.push(fileServer)
                        return fileServer 
                    })
                }else if (data.type == "dir"){
                    var subFolder = {name:data.name, path:data.path.replace(user.email, "").replace(new RegExp(data.name+'$'), ''), type:data.type, extension:"directory", children:[]}
                    folder.children.push(subFolder)
                    return this.getDirContent(data.path, user, subFolder)
                }
            }))
        })
    }

    _deleteChild(child, user){
        if(child.type == "file"){
            return this.deleteFile(child, user)
        }else{
            return Promise.all(child.children.map(subChild =>{
                this._deleteChild(subChild, user)
            }))
        }
        
    }

}

export default new Repo()