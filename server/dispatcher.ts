/// <reference path="local/localdb.ts" />
/// <reference path="../typings/tsd.d.ts" />
/// <reference path="appcontext.ts" />
/// <reference path="lib/store.ts" />
/// <reference path="lib/store.ts" />
/// <reference path="lib/fileupload.ts" />



import express = require('express');
import ctx = require('./appcontext');
import Q = require('q');
import store = require('./lib/store');
import breeze = require('breeze-client');
import _ = require('lodash');
import Store = require('./lib/store');
import FileUploader = require('./lib/fileupload');
import localDB = require('./local/localdb');


export interface srvCallResult {
    success: boolean,
    payload?: any,
    error?: any
}


function sendResponse(data: srvCallResult, res: express.Response) {

    res.send(data);
}


export function process(req: express.Request, res: express.Response, next: any) {

    var apiname = req.params.resource;
    var method = req.params.operation;
    
    var _ctx = new ctx.AppContext();
    var srv = _ctx.get_ServiceApi(apiname);


    switch (method) {


        case "data": {

            var localdb = {
                specs: localDB.SpecsAttribs,
                cats: localDB.Categories,
                parts: localDB.Partners
            }

            sendResponse({
                payload: localdb,
                success: true
            }, res);

        } break;


        case "upload": {

            FileUploader.upload_file(req, res, next);

        } break;
            

        case "Metadata": {
            res.send(Store.ModelStore.exportMetadata());
        } break;


        case 'fetch': {

            var qry = new breeze.EntityQuery(req.body.params);

            srv.fetch(qry).then(rst => {

                var data: string = srv.entityManager.exportEntities();

                sendResponse({
                    success: true,
                    payload: data
                }, res);

            }).catch(err => {

                sendResponse({
                    success: false,
                    error: err
                }, res);

            });
            

        } break;


        
        case 'savechanges': {

            var data = req.body.params;

            srv.savechanges(data).then((rsp) => {

                sendResponse({
                    success: true,                    
                }, res);
                

            }).catch(err => {

                sendResponse({
                    success: false,
                    error: err
                }, res);

            });

        }
        break;


        default: {

            var p: Q.Promise<any> = srv[method](req.body);
            

            p.then(rst => {

                console.log(rst);

                res.send({
                    succes: true,
                    payload:rst
                });

            }).fail(err => {

                res.send({
                    succes: false,
                    error: err
                });
                
            });


        } break;

    }
    

    

    

}