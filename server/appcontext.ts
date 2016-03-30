/// <reference path="lib/serviceapi.ts" />
/// <reference path="../typings/lodash/lodash.d.ts" />
/// <reference path="db/boot.ts" />

import api = require('./lib/serviceapi');
import _ = require('lodash');
import boot = require('./db/boot');
import express = require('express');


var conn = boot.start_db(null);


var apis_list: api.ApiInfo[] = [];



export class AppContext {

    get conn(): any {
        return conn;
    }


    register_api(info: api.ApiInfo) {

        var exists = _.find(apis_list, a => {
            return a.serviceName.toUpperCase() === info.serviceName.toUpperCase()
        }) != undefined;

        if (exists) {
            throw "api server '" + info.serviceName +"' exists already";
        }

        apis_list.push(info);
    }


    get_ServiceApi(serviceName: string): api.ServiceApi {

        var info = _.find(apis_list, a => {
            return a.serviceName === serviceName;
        });

        if (info) {

            return info.getInstance(this);
        }

        return null;
    }
}