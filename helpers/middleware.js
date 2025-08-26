import User from '../models/User.js';
import { verifyToken } from './token.js';


export const AuthMiddleware = async (req, res, next) => {
	try {
		const { headers, baseUrl } = req;
		if (!headers.authorization)
			return res.send({ done: false, statusCode: 401, message: "Unauthorized request!" });

		const token = await verifyToken(headers.authorization);
		if (!token) {
			return res.send({ done: false, statusCode: 401, message: "Unauthorized request!" });
		}


		console.log(`Token verified for user: ${token.id} on route: ${baseUrl}`);
		
    const user = await User.findById(token.id);
    req.user = user;
		
		next();
	} catch (error) {
		return next({ statusCode: 401, message: "Unauthorized request!" });
	}
};
