import User from '../models/user';
import History from '../models/history';

class UserService {

	// list users
	list() {
		return new Promise((resolve, reject) => {
			User.find({}).exec((err, res) => {
				if (err) reject(err);
				resolve(res);
 			});
		});
	}

	// get an user
	get(id) {
		return new Promise((resolve, reject) => {
			User.findById(id).exec((err, res) => {
				if (err) reject(err);
				if (!res) reject(new Error('User not found.'));
				resolve(res);
			});
		});
	}

	// add new user
	add(params) {
		return new Promise((resolve, reject) => {
			const newUser = {
				email: params.email,
				password: params.password,
			};
			new User(newUser).save({new: true, safe: true}, (err, res) => {
				if (err) reject(err);
				resolve(res);
			});
		});
	}

	// update user
	edit(id, params) {
		return new Promise((resolve, reject) => {
			User.findByIdAndUpdate(id, {$set: params}, {new: true}, (err, res) => {
				if (err) reject(err);
				if (!res) reject(new Error('Update failed. User not found.'));
				resolve(res);
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
					if (res) resolve(res);
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

	// add a recipe to user's history
	addHistory(userId, recipeId) {
		return new Promise((resolve, reject) => {
			const newHistory = {
				_user: userId,
				_recipe: recipeId
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