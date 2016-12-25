'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./error.controller'),
	Process = mongoose.model('Process'),
	_ = require('lodash');

/**
 * Create a Product
 */
exports.create = function(req, res) {
    console.log("create req reached"+req);
	var process = new Process(req.body);
	//product.user = req.user;

	process.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(process);
		}
	});
};

/**
 * Show the current Product
 */
exports.read = function(req, res) {
	res.jsonp(req.process);
};

/**
 * Update a Product
 */
exports.update = function(req, res) {
	var process = req.process ;

	process = _.extend(process , req.body);

	process.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(process);
		}
	});
};

/**
 * Delete an Product
 */
exports.delete = function(req, res) {
	var process = req.process ;

	process.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(process);
		}
	});
};

/**
 * List of Products
 */
exports.list = function(req, res) { 
	console.log('process list');
	Process.find().sort('-created').exec(function(err, processes) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(processes);
		}
	});
};

/**
 * Product middleware
 */
exports.processByID = function(req, res, next, id) { 
	Process.findById(id).exec(function(err, process) {
		if (err) return next(err);
		if (! process) return next(new Error('Failed to load Product ' + id));
		req.process = process ;
		next();
	});
};

/**
 * Product authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.product.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
