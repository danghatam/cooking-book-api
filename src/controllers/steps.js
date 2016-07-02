'use strict';

import express from 'express';
import StepService from '../services/steps';

const router = express.Router();

// list steps
router.get('/', (req, res, next) => {
  	StepService.list().then(steps => {
    	res.json({
      		success: true,
      		steps: steps
    	});
  	}).catch(err => {
		res.json({
			error: err.message
		});
	});
});

// get a step
router.get('/:id', (req, res, next) => {
  	StepService.get(req.params.id).then(step => {
    	res.json({
      		success: true,
      		step: step
    	});
  	}).catch(err => {
		res.json({
			error: err.message
		});
	});
});

export default router;