import jwt from 'jsonwebtoken';
import config from '../../config'


const generateToken = (user) =>{
    return jwt.sign({ email: user.email, id: user._id, name:user.name }, config.jwt.secret, {
        expiresIn: 86400
    });
}

export default generateToken