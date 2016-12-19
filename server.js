'use strict';
/**
 * Module dependencies.
 */
var init = require('./config/init')(),
    config = require('./config/config'),
	  mongoose = require('mongoose'),
   	chalk = require('chalk');

// Bootstrap db connection
var db = mongoose.connect(config.db, function(err) {
	if (err) {
		console.error(chalk.red('Could not connect to MongoDB!'));
		console.log(chalk.red(err));
	}
});

 var app = require('./config/express')(db);

 app.listen(config.port);

 exports = module.exports = app;

console.log('BpmApi application started on port ' + config.port);

