'use strict';

var	path = require('path'),
	http = require('http'),
	https = require('https'),
	express = require('express'),
	morgan = require('morgan'),
	bodyParser = require('body-parser'),
	session = require('express-session'),
    compress = require('compression'),
    methodOverride = require('method-override'),
	cookieParser = require('cookie-parser'),
	helmet = require('helmet'),
	passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy,
	mongoose = require('mongoose'),
	mongoStore = require('connect-mongo')(session),
    config = require('./config');

module.exports = function(db) {
	// Initialize express app
	var app = express();

	// Globbing model files
	
	config.getGlobbedFiles('./app/models/**/*.js').forEach(function(modelPath) {
		require(path.resolve(modelPath));
	});
	var User = mongoose.model('User');

	// Setting application local variables
	app.locals.title = config.app.title;
	app.locals.description = config.app.description;
	app.locals.keywords = config.app.keywords;

	// Passing the request url to environment locals
	app.use(function(req, res, next) {
		res.locals.url = req.protocol + '://' + req.headers.host + req.url;
		next();
	});

	// Should be placed before express.static
	app.use(compress({
		filter: function(req, res) {
			return (/json|text|javascript|css/).test(res.getHeader('Content-Type'));
		},
		level: 9
	}));

	// Showing stack errors
	app.set('showStackError', true);

	// Environment dependent middleware
	if (process.env.NODE_ENV === 'development') {
		// Enable logger (morgan)
		app.use(morgan('dev'));

		// Disable views cache
		app.set('view cache', false);
	} else if (process.env.NODE_ENV === 'production') {
		app.locals.cache = 'memory';
	}

	// Request body parsing middleware should be above methodOverride
	app.use(bodyParser.urlencoded({
		extended: true
	}));
	app.use(bodyParser.json());
	app.use(methodOverride());

	// CookieParser should be above session
	app.use(cookieParser());

	//Express MongoDB session storage
	app.use(session({
		saveUninitialized: true,
		resave: true,
		secret: config.sessionSecret,
		store: new mongoStore({
			mongooseConnection: db.connection,
			collection: config.sessionCollection
		})
	}));
	// use passport session
	app.use(passport.initialize());
	app.use(passport.session());

	passport.use(new LocalStrategy(
	function(username, password, done) {
		User.findOne({ username: username }, function (err, user) {
		console.log('User:'+user);
		console.log('Error:'+err);
		if (err) { return done(err); }
		if (!user) { return done(null, false); }
		if (!user.authenticate(password)) { return done(null, false); }
		return done(null, user);
		});
	}
	));
	// // connect flash for flash messages
	// app.use(flash());

	// Use helmet to secure Express headers
	app.use(helmet.frameguard());
	app.use(helmet.xssFilter());
	app.use(helmet.noSniff());
	app.use(helmet.ieNoOpen());
	app.disable('x-powered-by');

	// Globbing routing files
	config.getGlobbedFiles('./app/routes/**/*.js').forEach(function(routePath) {
		var route = require(path.resolve(routePath));
		route(app);
	});


	// Assume 'not found' in the error msgs is a 404. this is somewhat silly, but valid, you can do whatever you like, set properties, use instanceof etc.
	app.use(function(err, req, res, next) {
		// If the error object doesn't exists
		console.log("handling errors, res");

		if (!err) return next();

		// Log it
		console.error(err.stack);

		// Error page
		res.status(500).status('500', {
			error: err.stack
		});
	});

	// Assume 404 since no middleware responded
	app.use(function(req, res) {
		res.status(404).status('404', {
			url: req.originalUrl,
			error: 'Not Found'
		});
	});

	if (process.env.NODE_ENV === 'secure') {
		// Log SSL usage
		console.log('Securely using https protocol');

		// Load SSL key and certificate
		var privateKey = fs.readFileSync('./config/sslcerts/key.pem', 'utf8');
		var certificate = fs.readFileSync('./config/sslcerts/cert.pem', 'utf8');

		// Create HTTPS Server
		var httpsServer = https.createServer({
			key: privateKey,
			cert: certificate
		}, app);

		// Return HTTPS server instance
		return httpsServer;
	}

	// Return Express server instance	
	return app;
};



