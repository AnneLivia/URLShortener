import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const authMiddleware = (req, res, next) => {
    
    // se login ou cadastro, pass
    if (req.url === '/api/login' || (req.url === '/api/users' && req.method == 'POST'))
        return next();

    const {authorization} = req.headers;

    if (!authorization)
        return res.status(401).json({message: "Authorization not found!"}) // 401 - Unauthorized

    const [, token] = authorization.split(' ');

    try {

        const payload = jwt.verify(token, JWT_SECRET);

        req.loggedUser = payload;

    } catch (err) {
        
        console.error(err);

        return res.status(401).json({message: "Invalid token!"});
    }

    next();
}

