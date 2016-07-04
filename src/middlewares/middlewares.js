import jwt from 'jsonwebtoken';
import config from '../../config';
import UserService from '../services/users';

export function isAuthenticated(req, res, next) {
	 // check header for access token
	const token = req.headers['access-token'];
	// decode token
	if (token) {
		// verifies secret and checks exp
		jwt.verify(token, config.secret, (err, decoded) => {
			if (err) return res.json({
					success: false,
					error: 'Authentication failed. Failed to authenticate token.'
				});
			else {
				// if everything is good, save to request for use in other routes
				req.decoded = decoded;
				next();
			}
		});
	}
	else {
		// if there is no token
    	// return an error
    	return res.status(403).send({
    		success: false,
    		error: 'Authentication failed. No token provided.'
    	});
	}
}

export function isAdmin(req, res, next) {
	if (req.decoded.admin) next();
	else return res.json({
		success: false,
		error: 'Authorization failed. Admin privileges are required.'
	});
}
