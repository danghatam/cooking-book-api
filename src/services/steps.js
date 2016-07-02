import Step from '../models/step';

class StepService {

	// list steps
	list() {
		return new Promise((resolve, reject) => {
			Step.find({}).exec((err, res) => {
				if (err) reject(err);
				resolve(res);
			});
		});
	}

	// get a step
	get(id) {
		return new Promise((resolve, reject) => {
			Step.findById(id).exec((err, res) => {
				if (err) reject(err);
				if (!res) reject(new Error('Step not found.'));
				resolve(res);
			});
		});
	}

}

export default new StepService();