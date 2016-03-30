/**
 * DispatchController
 *
 * @description :: Server-side logic for managing dispatches
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var root = require('root-path');
var dispatcher = require(root('/server/dispatcher'));

module.exports = {
	
    dispatch: function (req, res){
        dispatcher.process(req, res);
    }

};

