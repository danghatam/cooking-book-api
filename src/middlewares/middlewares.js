import jwt from 'jsonwebtoken';
import config from '../../config';
import RecipeService from '../services/recipes';

// check if a request is from an logged user
export function isAuthenticated(req, res, next) {
	 // check header for access token
	const token = req.headers['access-token'];
	// decode token
	if (token) {
		// verifies secret and checks exp
		jwt.verify(token, config.secret, (err, decoded) => {
			if (err) return res.json({
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
    		error: 'Authentication failed. No token provided.'
    	});
	}
}

// check if logged user has privileges to access user controllers
export function canAccessUser(req, res, next) {
	if (req.decoded._doc.admin || req.decoded._doc._id == req.params.id) 
		next();
	else {
		res.json({
			error: 'Authorization failed. You do not have privilege.'
		});	
	}
}

// TODO: check if logged user has privileges to access recipe controllers
export function canAccessRecipe(req, res, next) {
	if (req.decoded._doc.admin)
		next();
	else {
		RecipeService.get(req.params.id).then(recipe => {
			if (req.decoded._doc._id == recipe._creator)
				next();
			else {
				res.json({
					error: 'Authorization failed. You do not have privilege.'
				});			
			}    	
  		}).catch(err => {
			res.json({
				error: err.message
			});
		});
	}	
}

// check if logged user has admin privileges 
export function isAdmin(req, res, next) {
	if (req.decoded._doc.admin) next();
	else return res.json({
		error: 'Authorization failed. Admin privileges are required.'
	});
}
