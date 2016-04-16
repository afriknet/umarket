
/// <reference path="../appcontext.ts" />
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="utils.ts" />
/// <reference path="adapter.ts" />
/// <reference path="store.ts" />

var root = require('root-path');
import ctx = require('../appcontext');
import Q = require('q');
var br_sequel = require( root('/server/breeze_sequel/main'));
var sequel_manager = br_sequel.SequelizeManager;
var sequel_query = br_sequel.SequelizeQuery;
var sequel_save = br_sequel.SequelizeSaveHandler;
var __sequel = require('sequelize');
import utils = require('./utils');
import _ = require('lodash');
import Store = require('./store');
import breeze = require('breeze-client');
require('./adapter');


br_sequel.breeze.config.initializeAdapterInstance('dataService', 'adapter_webApi', true);


export interface ApiInfo {
    serviceName: string,
    getInstance: (ctx: ctx.AppContext) => ServiceApi
}


interface sql_incr_input {
    sql: string,
    draw: number,
    order_by_offset?: string,
    total_count_sql?: number,
}


export class ServiceApi {

    private __entityName: string;
    context: ctx.AppContext;

    constructor(context: ctx.AppContext) {
        this.context = context;
    }
    

    get_ServiceName(): string {
        return this.get_modelName();
    }


    get_modelName(): string {
        return null;
    }
    

    private __dm: breeze.EntityManager;
    get entityManager(): breeze.EntityManager {

        if (!this.__dm) {
            this.__dm = new breeze.EntityManager({
                dataService: new breeze.DataService({
                    serviceName: this.get_ServiceName(),
                    hasServerMetadata: false
                })
            });
            this.__dm.metadataStore.importMetadata(Store.ModelStore.exportMetadata());
        }
        return this.__dm;
    }


    private __fill_entityManager(data: any[]) {
        
        var that = this;

        data.forEach(e => {

            this.entityManager.createEntity(this.get_modelName(), e, breeze.EntityState.Unchanged, breeze.MergeStrategy.OverwriteChanges);
        });
    }


    private __execQuery(query: breeze.EntityQuery): Q.Promise<any> {

        var d = Q.defer<any>();

        
        var qry = new sequel_query(this.context.conn, query);


        qry.execute().then(rst => {
            d.resolve(rst);
        }); 


        return d.promise;
    }
    

    
    fetch(query: breeze.EntityQuery): Q.Promise<any[]> {

        var d = Q.defer<any[]>();

        this.__execQuery(query).then(result => {

            if (result) {
                this.__fill_entityManager(result);
            } 

            d.resolve(result);

        });
        
        return d.promise;

    }



    internal_exec_sql(sql: string): Q.Promise<any[]> {

        var d = Q.defer<any[]>();

        this.context.conn.sequelize.query(sql, { type: __sequel.QueryTypes.SELECT }).then((list: any[]) => {
            d.resolve(list);
        });

        return d.promise;
    }



    exec_sql(input: any): Q.Promise<any[]> {

        return this.internal_exec_sql(input.sql);

    }

    


    exec_sql_incr(input: sql_incr_input): Q.Promise<any> {


        var d = Q.defer<any>();


        var sql_count = utils.format("SELECT COUNT(*) RECORDCOUNT FROM ({0}) B", input.sql);


        this.internal_exec_sql(sql_count).then((list: any[]) => {

            var __total: number = list[0]['RECORDCOUNT'];


            var _sql = input.sql + " " + input.order_by_offset;


            this.internal_exec_sql(_sql).then((list2: any[]) => {

                list2.forEach(row => {

                    row = _.extend(row, { DT_RowId: _.result(row, 'ID') });

                });


                var result = {
                    data: list2,
                    draw: input.draw,
                    recordsTotal: list2.length,
                    recordsFiltered: __total
                }


                d.resolve(result);

            });


        });
        

        return d.promise;

    }



    private __saveChanges(saveBundle:any): Q.Promise<any> {

        var d = Q.defer<any>();

        sequel_save.save(this.context.conn, {
            body: {
                entities: JSON.parse(saveBundle).entities
            }
        }).then(() => {

            d.resolve(true);

        }).catch((err) => {

            d.reject(err.message)
        });

        return d.promise;

    }
    

    
    savechanges(data: string): Q.Promise<any> {
        
        this.entityManager.importEntities(data, { mergeStrategy: breeze.MergeStrategy.OverwriteChanges });

        return this.do_savechanges();
    }
    


    do_savechanges(): Q.Promise<any> {

        var dataservice: any = br_sequel.breeze.config.getAdapterInstance('dataService');

        var savecontext = {
            entityManager: this.entityManager,
            dataService: dataservice,
            resourceName: this.get_modelName()
        }


        var bundle = { entities: this.entityManager.getEntities(), saveOptions: {} };


        var saveBundle = dataservice.saveChanges(savecontext, bundle);


        return this.__saveChanges(saveBundle);

    }
}