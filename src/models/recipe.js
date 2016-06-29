import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		validate: [(value) => { value.length <= 50 }, 'Recipe name is too long (50 max)']
	},
	image: {
		type: String,
		required: true
	},
	ingredients: [{
		type: String,
		required: true,
		notEmpty: true
	}],
	notes: {
		type: String
	},
	steps: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Step'
	}],
	views: {
		type: Number,
		default: 0
	},
	_user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}
});

export default mongoose.model('Recipe', recipeSchema);	