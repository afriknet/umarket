/// <reference path="../typings/tsd.d.ts" />
/// <reference path="lib/serviceapi.ts" />
/// <reference path="appcontext.ts" />
/// <reference path="lib/store.ts" />
var root = require('root-path');
var path = require('path');
var fs = require('fs');
var _ = require('lodash');
var ctx = require('./appcontext');
var store = require('./lib/store');
var skip_files = ["DispatchController.js"];
function load_models(context) {
    var files = fs.readdirSync(root('/api/models'));
    _.each(files.sort(), function (fn) {
        var ext = path.extname(fn);
        if (ext === '.js') {
            var model = require(root('/api/models/' + fn));
            model();
        }
    });
}
function load_apis(context) {
    var files = fs.readdirSync(root('/api/controllers'));
    _.each(files, function (fn) {
        var ext = path.extname(fn);
        if (ext === '.js') {
            var _skip_file = _.find(skip_files, function (f) {
                return f === fn;
            }) != undefined;
            if (!_skip_file) {
                var _api = require(root('/api/controllers/' + fn));
                _api(context);
            }
        }
    });
}
function init_datastore(ctx) {
    ctx.conn.importMetadata(store.ModelStore.exportMetadata());
}
function initialize_application() {
    var context = new ctx.AppContext();
    load_models(context);
    load_apis(context);
    init_datastore(context);
}
exports.initialize_application = initialize_application;
//# sourceMappingURL=init.js.map