
/// <reference path="../typings/tsd.d.ts" />
/// <reference path="lib/serviceapi.ts" />
/// <reference path="appcontext.ts" />
/// <reference path="lib/store.ts" />

var root = require('root-path');
import path = require('path')
var fs = require('fs');
import _ = require('lodash');
import api = require('./lib/serviceapi');
import ctx = require('./appcontext');
import store = require('./lib/store');


var skip_files: string[] = ["DispatchController.js"];


function load_models(context: ctx.AppContext) {

    var files: string[] = fs.readdirSync(root('/api/models'));

    _.each(files.sort(), fn => {

        var ext = path.extname(fn);

        if (ext === '.js') {

            var model = require(root('/api/models/' + fn));

            model();
        }
    });
    
}



function load_apis(context: ctx.AppContext) {

    var files: string[] = fs.readdirSync(root('/api/controllers'));

    _.each(files, fn => {
        
        var ext = path.extname(fn);

        if (ext === '.js') {

            var _skip_file = _.find(skip_files, f => {
                return f === fn;
            }) != undefined;


            if (!_skip_file) {

                var _api = require(root('/api/controllers/' + fn));

                _api(context);

            }            
        }
    });
}



function init_datastore(ctx: ctx.AppContext) {

    ctx.conn.importMetadata(store.ModelStore.exportMetadata());

}


export function initialize_application() {

    var context = new ctx.AppContext();

    load_models(context);

    load_apis(context);

    init_datastore(context);   
}