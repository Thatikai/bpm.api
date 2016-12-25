'use strict'

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

var ProcessSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Product name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
    version:{
        type: Number,
        default:1
    },
    status:{
        type:String,
        default:'working'
    }
	// owner: {
	// 	type: Schema.ObjectId,
	// 	ref: 'User'
	// }
});

mongoose.model('Process', ProcessSchema);