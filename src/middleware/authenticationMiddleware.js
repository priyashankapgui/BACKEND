import jwt from 'jsonwebtoken';


import { ACCESS } from '../../config/config.js';
const { ACCESS_TOKEN } = ACCESS;

//import { handleLogin } from '../modules/employee/service.js';


export const authenticateToken = (req, res, next) => {

    const authHeader = req.headers['authorization'];
    const token = authHeader.split(' ')[1];

    console.log(token);

    // if (token == null) return res.sendStatus(401);
    
    jwt.verify(token, ACCESS_TOKEN, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });

    


};


