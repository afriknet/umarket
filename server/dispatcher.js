/// <reference path="local/localdb.ts" />
/// <reference path="../typings/tsd.d.ts" />
/// <reference path="appcontext.ts" />
/// <reference path="lib/store.ts" />
/// <reference path="lib/store.ts" />
/// <reference path="lib/fileupload.ts" />
var ctx = require('./appcontext');
var breeze = require('breeze-client');
var Store = require('./lib/store');
var FileUploader = require('./lib/fileupload');
var localDB = require('./local/localdb');
function sendResponse(data, res) {
    res.send(data);
}
function process(req, res, next) {
    var apiname = req.params.resource;
    var method = req.params.operation;
    var _ctx = new ctx.AppContext();
    var srv = _ctx.get_ServiceApi(apiname);
    switch (method) {
        case "data":
            {
                var localdb = {
                    specs: localDB.SpecsAttribs,
                    cats: localDB.Categories,
                    parts: localDB.Partners
                };
                sendResponse({
                    payload: localdb,
                    success: true
                }, res);
            }
            break;
        case "upload":
            {
                FileUploader.upload_file(req, res, next);
            }
            break;
        case "Metadata":
            {
                res.send(Store.ModelStore.exportMetadata());
            }
            break;
        case 'fetch':
            {
                var qry = new breeze.EntityQuery(req.body.params);
                srv.fetch(qry).then(function (rst) {
                    var data = srv.entityManager.exportEntities();
                    sendResponse({
                        success: true,
                        payload: data
                    }, res);
                }).catch(function (err) {
                    sendResponse({
                        success: false,
                        error: err
                    }, res);
                });
            }
            break;
        case 'savechanges':
            {
                var data = req.body.params;
                srv.savechanges(data).then(function (rsp) {
                    sendResponse({
                        success: true,
                    }, res);
                }).catch(function (err) {
                    sendResponse({
                        success: false,
                        error: err
                    }, res);
                });
            }
            break;
        default:
            {
                var p = srv[method](req.body);
                p.then(function (rst) {
                    console.log(rst);
                    res.send({
                        succes: true,
                        payload: rst
                    });
                }).fail(function (err) {
                    res.send({
                        succes: false,
                        error: err
                    });
                });
            }
            break;
    }
}
exports.process = process;
//# sourceMappingURL=dispatcher.js.map