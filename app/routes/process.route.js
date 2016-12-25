'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/user.controller');
	var process = require('../../app/controllers/process.controller');
   	//var router = express.Router();
   console.log("route init");
	// Products Routes
	app.get('/', function (req, res) {
  		res.send('hello world')
	});
	app.route('/process')
	.get(users.requiresLogin,process.list)
	.post(process.create);
        
	//.post(users.requiresLogin, process.create);

	// router.get('/process/:processId')
	// 	.get(process.read)
	// 	.put(users.requiresLogin, process.hasAuthorization, process.update)
	// 	.delete(users.requiresLogin, process.hasAuthorization, process.delete);

	// // Finish by binding the Product middleware
	// router.param('processId', process.processIdByID);
};
