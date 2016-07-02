import Recipe from '../models/recipe';
import Step from '../models/step';

class RecipeService {

	// list recipes
	list() {
		return new Promise((resolve, reject) => {
			Recipe.find({}).exec((err, res) => {
				if (err) reject(err);
				resolve(res);
			});
		});
	}

	// get a recipe
	get(id) {
		return new Promise((resolve, reject) => {
			Recipe.findById(id).populate('_steps').exec((err, res) => {
				if (err) reject(err);
				if (!res) reject(new Error('Recipe not found.'));
				resolve(res);
			});
		});
	}

	// add new recipe
	add(params) {
		return new Promise((resolve, reject) => {
			const newRecipe = {
				name: params.name,
				image: params.image,
				ingredients: params.ingredients,
				notes: params.notes,
				_steps: [],
				_creator: params.creator
			}
			new Recipe(newRecipe).save({new: true, safe: true}, (recipeErr, recipeRes) => {
				if (recipeErr) reject(recipeErr);
				if (recipeRes) {
					RecipeService.addSteps(recipeRes._id, params.steps).then((addStepsRes) => {
						resolve(addStepsRes);
					}).catch((addStepsErr) => {
						reject(addStepsErr);
					});
					// newSteps.forEach((step, index) => {
					// 	const newStep = {
					// 		name: step.name,
					// 		details: step.details
					// 	};
					// 	new Step(newStep).save({new: true, safe: true}, (stepErr, stepRes) => {
					// 		if (stepErr) reject(stepErr);
					// 		Recipe.findByIdAndUpdate(recipeRes._id, {$push: {'_steps': stepRes._id}}, {new: true, safe: true, upsert: true}, (updateErr, updateRes) => {
					// 			if (updateErr) reject(updateErr);
					// 			if (index == newSteps.length - 1) resolve(updateRes);
					// 		});
					// 	});
					// });
				}
			})
		});
	}

	// add new steps
	static addSteps(recipeId, steps) {
		return new Promise((resolve, reject) => {
			const newSteps = steps;
			newSteps.forEach((step, index) => {
				const newStep = {
					name: step.name,
					details: step.details
				};
				new Step(newStep).save({new: true, safe: true}, (stepErr, stepRes) => {
					if (stepErr) reject(stepErr);
					Recipe.findByIdAndUpdate(recipeId, {$push: {'_steps': stepRes._id}}, {new: true, safe: true, upsert: true}, (updateErr, updateRes) => {
						if (updateErr) reject(updateErr);
						if (index == newSteps.length - 1) resolve(updateRes);
					});
				});
			});
		});
	}

	// update recipe, steps are excluded and will be update seperately
	edit(id, params) {
		return new Promise((resolve, reject) => {
			Recipe.findByIdAndUpdate(id, {$set: params/*{'name': params.name, 'image': params.image, 'ingredients': params.ingredients, 'notes': params.notes, 'views': params.views}*/}, {new: true}, (err, res) => {
				if (err) reject(err);
				if (!res) reject(new Error('Update failed. Recipe not found.'));
				else {
					if (params.steps) {
						RecipeService.editSteps(res, params.steps).then((editStepsRes) => {
							resolve(editStepsRes);
						}).catch((editStepsErr) => {
							reject(editStepsErr);
						});
					}
				}
			});
		});
	}

	// delete steps
	static editSteps(recipe, newSteps) {
		return new Promise((resolve, reject) => {
			const steps = recipe._steps;
			steps.forEach((step, index) => {
				Step.findByIdAndRemove(step, (removeErr, removeRes) => {
					if (removeErr) reject(removeErr);
					if (!removeRes) reject(new Error('Deletion failed. Step not found.'));
					if (index == steps.length - 1) {
						Recipe.findByIdAndUpdate(recipe._id, {$set: {'_steps': []}}, (err, res) => {
							if (err) reject(err);
							if (res) {
								RecipeService.addSteps(res._id, newSteps).then((addStepsRes) => {
									resolve(addStepsRes);
								}).catch((addStepsErr) => {
									reject(addStepsErr);
								});
							}
						});
					}
				});
			});
		});
	}

	// delete recipe
	remove(id) {
		return new Promise((resolve, reject) => {
			Recipe.findById(id).exec((findErr, findRes) => {
				if (findErr) reject(findErr);
				if (!findRes) reject(new Error('Deletion failed. Recipe not found.'));
				else {
					findRes.remove((removeErr, removeRes) => {
						if (removeErr) reject(removeErr);
						resolve(removeRes);
					});
				}
			});
		});		
	}

}

export default new RecipeService();