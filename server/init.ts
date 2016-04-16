
/// <reference path="../typings/tsd.d.ts" />
/// <reference path="lib/serviceapi.ts" />
/// <reference path="appcontext.ts" />
/// <reference path="lib/store.ts" />

var root = require('root-path');
import store = require('./lib/store');
import path = require('path')
var fs = require('fs');
import _ = require('lodash');
import api = require('./lib/serviceapi');
import ctx = require('./appcontext');
import Q = require('q');


var skip_files: string[] = ["DispatchController.js"];


function load_models(context: ctx.AppContext) {
    
    var files: string[] = fs.readdirSync(root('/api/models'));

    _.each(files.sort(), fn => {

        var ext = path.extname(fn);

        if (ext === '.js') {

            var model = require(root('/api/models/' + fn));

            if (_.isFunction(model)) {
                model();
            }
            
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



function init_demo_categories(ctx: ctx.AppContext) {

    var srv = ctx.get_ServiceApi('itemcats');

    return srv['init_demo_data']();
}




function init_demo_specs(ctx: ctx.AppContext) {

    var srv = ctx.get_ServiceApi('specsdim');

    return srv['init_demo_data']();

}



function init_demo_data(ctx: ctx.AppContext) {

    Q.all([
        init_demo_categories(ctx),
        init_demo_specs(ctx)
    ]).then(values => {

    });

}



export function initialize_application() {

    var context = new ctx.AppContext();

    load_models(context);

    load_apis(context);

    init_datastore(context);   
    
    init_demo_data(context);
}