'use strict';

module.exports = {
	app: {
		title: 'BPM API Services',
		description: 'Provides authentication and bpm core modules apis',
		keywords: 'MongoDB, Express, Node.js'
	},
	port: process.env.PORT || 8080,
	sessionSecret: 'expreesbpm',
	sessionCollection: 'sessions',
	
};