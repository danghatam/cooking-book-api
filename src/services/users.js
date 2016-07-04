import joi from 'joi';
import User from '../models/user';
import History from '../models/history';

const joiAddUserSchema = joi.object().keys({
	email: joi.string().regex(/[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i).required(),
	password: joi.string().min(5).max(20).required()
});
const joiEditUserSchema = joi.object().keys({
	email: joi.string().regex(/[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i),
	password: joi.string().min(5).max(20),
	admin: joi.boolean()
});

class UserService {

	// list users
	list() {
		return new Promise((resolve, reject) => {
			User.find({}).select('email').exec((err, res) => {
				if (err) reject(err);
				resolve(res);
 			});
		});
	}

	// get an user
	get(id) {
		return new Promise((resolve, reject) => {
			User.findById(id).select('email').exec((err, res) => {
				if (err) reject(err);
				if (!res) reject(new Error('User not found.'));
				resolve(res);
			});
		});
	}

	// add new user
	add(params) {
		return new Promise((resolve, reject) => {
			joi.validate(params, joiAddUserSchema, (validateErr, validateRes) => {
				if (validateErr) reject(validateErr);
				else {
					const newUser = {
						email: params.email,
						password: params.password
					};
					new User(newUser).save({new: true, safe: true}, (err, res) => {
						if (err) reject(err);
						resolve(res);
					});					
				}
			});
		});
	}

	// update user
	edit(id, params) {
		return new Promise((resolve, reject) => {
			joi.validate(params, joiEditUserSchema, (validateErr, validateRes) => {
				if (validateErr) reject(validateErr);
				else {
					User.findByIdAndUpdate(id, {$set: params}, {new: true}, (err, res) => {
						if (err) reject(err);
						if (!res) reject(new Error('Update failed. User not found.'));
						resolve(res);
					});
				}
			});
		});
	}

	// delete user
	remove(id) {
		return new Promise((resolve, reject) => {
			User.findByIdAndRemove(id, (err, res) => {
				if (err) reject(err);
				if (!res) reject(new Error('Deletion failed. User not found.'));
				resolve(res);
			});
		});
	}

	// user login
	login(params) {
		return new Promise((resolve, reject) => {
			User.findOne({email: params.email}).exec((err, user) => {
				if (err) return reject(err);
				if (!user) return reject(new Error('Authentication failed. User not found.'));
				user.validPassword(params.password).then(res => {
					if (res) resolve(user);
					else reject(new Error('Authentication failed. Wrong password.'));
				}).catch(err => {
					reject(err);
				});
			});
		});
	}

	// get user's history
	getHistory(id) {
		return new Promise((resolve, reject) => {
			History.find({_user: id}).sort({timestamp: -1}).exec((err, history) => {
				if (err) return reject(err);
				resolve(history);
			});
		});
	}

	// add an entry to user's history
	addHistory(userId, params) {
		return new Promise((resolve, reject) => {
			const newHistory = {
				_user: userId,
				_recipe: params.recipeId
			};
			History.findOne(newHistory, (findErr, findRes) => {
				if (findErr) reject(err);
				if (!findRes) {
					new History(newHistory).save({new: true, safe: true}, (saveErr, saveRes) => {
						if (saveErr) reject(saveErr);
						resolve(saveRes);
					});
				}
				else {
					const updatedTime = new Date().toISOString();
					History.findByIdAndUpdate(findRes._id, {$set: {timestamp: updatedTime}}, {new: true}, (err, res) => {
						if (err) reject(err);
						if (res) resolve(res);
					});
				}
			});	
		});
	}

	// delete an entry from user's history
	removeHistory(entryId) {
		return new Promise((resolve, reject) => {
			History.findByIdAndRemove(entryId, {}, (err, res) => {
				if (err) reject(err);
				if (!res) reject(new Error('Deletion failed. Entry not found.'));
				resolve(res);
			});
		});
	}

}

export default new UserService();