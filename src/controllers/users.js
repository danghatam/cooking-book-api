'use strict';

import express from 'express';
import jwt from 'jsonwebtoken';
import config from '../../config';
import * as middlewares from '../middlewares/middlewares';
import UserService from '../services/users';

const router = express.Router();
const isAuthenticated = middlewares.isAuthenticated;
const isAdmin = middlewares.isAdmin;

// list users
router.get('/', isAuthenticated, isAdmin, (req, res, next) => {
  	UserService.list().then(users => {
    	res.json({
      		success: true,
      		users: users
    	});
  	}).catch(err => {
		res.json({
			error: err.message
		});
	});
});

// get an user
router.get('/:id', isAuthenticated, (req, res, next) => {
  	UserService.get(req.params.id).then(user => {
    	res.json({
      		success: true,
      		user: user
    	});
  	}).catch(err => {
		res.json({
			error: err.message
		});
	});
});

// add new user
router.post('/', (req, res, next) => {
	UserService.add(req.body).then(user => {
		res.json({
			success: true,
			user: user
		});
	}).catch(err => {
		res.json({
			error: err.message
		});
	});
});

// update user
router.put('/:id', isAuthenticated, (req, res, next) => {
	// if (req.decoded._id != req.params.id) 
  	UserService.edit(req.params.id, req.body).then(user => {
  		res.json({
    		success: true,
    		user: user
  		});
  	}).catch(err => {
		res.json({
			error: err.message
		});
	});
});

// delete user
router.delete('/:id', isAuthenticated, isAdmin, (req, res, next) => {
	UserService.remove(req.params.id).then(() => {
		res.json({
    		success: true
  		});	
	}).catch(err => {
		res.json({
			error: err.message
		});
	});
});

// TODO login user: move to somewhere else
router.post('/login', (req, res, next) => {
	UserService.login(req.body).then(loginRes => {
		console.log(loginRes);
		const token = jwt.sign(loginRes, config.secret, {
			expiresIn : 60*60*24
		});
  		res.json({
  			success: true,
  			token: token
  		});
	}).catch(err => {
		res.json({
			error: err.message
		});
	});
});

// get user's history
router.get('/:id/history', (req, res, next) => {
	UserService.getHistory(req.params.id).then(historyList => {
		res.json({
			success: true,
			historyList: historyList
		});
	}).catch(err => {
		res.json({
			error: err.message
		});
	});
});

// add an entry to user's history
router.post('/:userId/history/', (req, res, next) => {
	UserService.addHistory(req.params.userId, req.body).then(history => {
		res.json({
			success: true,
			history: history
		});
	}).catch(err => {
		res.json({
			error: err.message
		});
	});
});

// delete an entry from user's history
router.delete('/:userId/history/:entryId', (req, res, next) => {
	UserService.removeHistory(req.params.entryId).then(() => {
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