'use strict';

import express from 'express';
import { isAuthenticated, canAccessRecipe, isAdmin } from '../middlewares/middlewares';
import RecipeService from '../services/recipes';

const router = express.Router();

// list recipes
router.get('/', (req, res, next) => {
  	RecipeService.list().then(recipes => {
    	res.json({
      		success: true,
      		recipes: recipes
    	});
  	}).catch(err => {
		res.json({
			error: err.message
		});
	});
});

// get a recipe
router.get('/:id', (req, res, next) => {
  	RecipeService.get(req.params.id).then(recipe => {
    	res.json({
      		success: true,
      		recipe: recipe
    	});
  	}).catch(err => {
		res.json({
			error: err.message
		});
	});
});

// add new recipe
router.post('/', isAuthenticated, (req, res, next) => {
	RecipeService.add(req.body).then(recipe => {
		res.json({
			success: true,
			recipe: recipe
		});
	}).catch(err => {
		res.json({
			error: err.message
		});
	});
});

// update recipe
router.put('/:id', isAuthenticated, canAccessRecipe, (req, res, next) => {
  	RecipeService.edit(req.params.id, req.body).then(recipe => {
  		res.json({
    		success: true,
    		recipe: recipe
  		});
  	}).catch(err => {
		res.json({
			error: err.message
		});
	});
});

// delete recipe
router.delete('/:id', isAuthenticated, canAccessRecipe, (req, res, next) => {
	RecipeService.remove(req.params.id).then(() => {
		res.json({
    		success: true
  		});	
	}).catch(err => {
		res.json({
			error: err.message
		});
	});
});

export default router;
