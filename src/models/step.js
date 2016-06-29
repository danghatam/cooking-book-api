import mongoose from 'mongoose';

const stepSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		validate: [(value) => { value.length <= 50 }, 'Recipe name is too long (50 max)']
	},
	details: {
		type: String,
		required: true
	}
});

export default mongoose.model('Step', stepSchema);