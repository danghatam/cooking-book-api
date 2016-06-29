import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
	_user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	_recipe: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Recipe'
	},
	timestamp: {
		type: Date,
		default: Date.now
	}
});

export default mongoose.model('History', historySchema);