import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  	email: {
    	type: String,
    	required: true,
    	set: (value) => { value.trim().toLowerCase() },
    	validate: [(email) => { email.match(/[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/i) != null }, 'Invalid email']
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

export default mongoose.model('User', userSchema);