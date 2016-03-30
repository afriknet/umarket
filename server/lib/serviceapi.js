/// <reference path="../appcontext.ts" />
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="utils.ts" />
/// <reference path="adapter.ts" />
/// <reference path="store.ts" />
var root = require('root-path');
var Q = require('q');
var br_sequel = require(root('/server/breeze_sequel/main'));
var sequel_manager = br_sequel.SequelizeManager;
var sequel_query = br_sequel.SequelizeQuery;
var sequel_save = br_sequel.SequelizeSaveHandler;
var __sequel = require('sequelize');
var utils = require('./utils');
var _ = require('lodash');
var Store = require('./store');
var breeze = require('breeze-client');
require('./adapter');
br_sequel.breeze.config.initializeAdapterInstance('dataService', 'adapter_webApi', true);
var ServiceApi = (function () {
    function ServiceApi(context) {
        this.context = context;
    }
    ServiceApi.prototype.get_ServiceName = function () {
        return null;
    };
    ServiceApi.prototype.get_masterEntityName = function () {
        return null;
    };
    Object.defineProperty(ServiceApi.prototype, "entityManager", {
        get: function () {
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
        },
        enumerable: true,
        configurable: true
    });
    ServiceApi.prototype.__fill_entityManager = function (data) {
        var _this = this;
        var that = this;
        data.forEach(function (e) {
            _this.entityManager.createEntity(_this.get_masterEntityName(), e, breeze.EntityState.Unchanged, breeze.MergeStrategy.OverwriteChanges);
        });
    };
    ServiceApi.prototype.__execQuery = function (query) {
        var d = Q.defer();
        var qry = new sequel_query(this.context.conn, query);
        qry.execute().then(function (rst) {
            d.resolve(rst);
        });
        return d.promise;
    };
    ServiceApi.prototype.fetch = function (query) {
        var _this = this;
        var d = Q.defer();
        this.__execQuery(query).then(function (result) {
            if (result) {
                _this.__fill_entityManager(result);
            }
            d.resolve(result);
        });
        return d.promise;
    };
    ServiceApi.prototype.exec_sql = function (sql) {
        var d = Q.defer();
        this.context.conn.sequelize.query(sql, { type: __sequel.QueryTypes.SELECT }).then(function (list) {
            d.resolve(list);
        });
        return d.promise;
    };
    ServiceApi.prototype.exec_sql_incr = function (input) {
        var _this = this;
        var d = Q.defer();
        var sql_count = utils.format("SELECT COUNT(*) RECORDCOUNT FROM ({0}) B", input.sql);
        this.exec_sql(sql_count).then(function (list) {
            var __total = list[0]['RECORDCOUNT'];
            var _sql = input.sql + " " + input.order_by_offset;
            _this.exec_sql(_sql).then(function (list2) {
                list2.forEach(function (row) {
                    row = _.extend(row, { DT_RowId: _.result(row, 'ID') });
                });
                var result = {
                    data: list2,
                    draw: input.draw,
                    recordsTotal: list2.length,
                    recordsFiltered: __total
                };
                d.resolve(result);
            });
        });
        return d.promise;
    };
    ServiceApi.prototype.__saveChanges = function (saveBundle) {
        var d = Q.defer();
        sequel_save.save(this.context.conn, {
            body: {
                entities: JSON.parse(saveBundle).entities
            }
        }).then(function () {
            d.resolve(true);
        }).catch(function (err) {
            d.reject(err.message);
        });
        return d.promise;
    };
    ServiceApi.prototype.savechanges = function (data) {
        this.entityManager.importEntities(data, { mergeStrategy: breeze.MergeStrategy.OverwriteChanges });
        var dataservice = br_sequel.breeze.config.getAdapterInstance('dataService');
        var savecontext = {
            entityManager: this.entityManager,
            dataService: dataservice,
            resourceName: this.get_masterEntityName()
        };
        var bundle = { entities: this.entityManager.getEntities(), saveOptions: {} };
        var saveBundle = dataservice.saveChanges(savecontext, bundle);
        return this.__saveChanges(saveBundle);
    };
    return ServiceApi;
})();
exports.ServiceApi = ServiceApi;
//# sourceMappingURL=serviceapi.js.map