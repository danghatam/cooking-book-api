import mongoose from 'mongoose';

const recipeSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true
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
	_steps: [{
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Step'
	}],
	views: {
		type: Number,
		default: 0
	},
	_creator: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User',
		required: true
	}
});

recipeSchema.pre('remove', function(next) {
	const recipe = this;
	recipe._steps.forEach(step => {
		mongoose.models['Step'].remove({_id: step}, (err, res) => {
			if (err) return next(err);
			if (res) return next();
		});
	});
	next();
});

export default mongoose.model('Recipe', recipeSchema);	