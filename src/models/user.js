import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12;

const userSchema = new mongoose.Schema({
  	email: {
    	type: String,
    	required: true,
    	unique: true
  	},
  	password: {
  		type: String,
  		required: true
  	},
  	admin: {
    	type: Boolean,
    	default: false
  	}	
});

userSchema.pre('save', function(next) {
	const user = this;
	if (user.email.match(/[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i) == null)
		return next(new Error('Registration failed. Invalid email.'));
	mongoose.models['User'].findOne({email: user.email}).exec((err, res) => {
		if (err) return next(err);
		if (res) {
			user.invalidate('email', 'Email must be unique.');
			return next(new Error('Registration failed. This email address has already been registered.'));
		}
		else {
			bcrypt.genSalt(SALT_ROUNDS, (err, salt) => {
				if (err) return next(err);
				bcrypt.hash(user.password, salt, (err, hash) => {
					if (err) return next(err);
					user.password = hash;
					next();
				});
			});
		}
	});
});

userSchema.pre('update', function(next) {
	console.log('pre-update user');
	next();
});

userSchema.methods.validPassword = function(pwd) {
	return new Promise((resolve, reject) => {
		bcrypt.compare(pwd, this.password, (err, res) => {
			if (err) reject(err);
			resolve(res);
		});
	});
};

export default mongoose.model('User', userSchema);