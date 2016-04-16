/// <reference path="../../server/appcontext.ts" />
/// <reference path="../../server/lib/serviceapi.ts" />
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/breeze/breeze.d.ts" />
/// <reference path="../../server/lib/utils.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var api = require('../../server/lib/serviceapi');
var breeze = require('breeze-client');
var utils = require('../../server/lib/utils');
var ItemSrv = (function (_super) {
    __extends(ItemSrv, _super);
    function ItemSrv() {
        _super.apply(this, arguments);
    }
    ItemSrv.prototype.get_ServiceName = function () {
        return 'item';
    };
    ItemSrv.prototype.get_modelName = function () {
        return 'item';
    };
    ItemSrv.prototype.request_products = function (url_params) {
        var _this = this;
        var params = url_params.params;
        var sql = "select distinct itm.id from item itm \n                     left join item_detail det on itm.id = det.itemID   \n                     left join item_cat cat on itm.id = cat.itemid\n                    ";
        var where = null;
        // build where
        if (params.cats) {
            where = utils.sql_where_in(params.cats, 'cat.item_cat_name');
        }
        if (params.specs) {
            var tmp = utils.sql_where_in(params.specs, 'det.item_detail_value');
            if (!tmp) {
                if (!where) {
                    where = where + " and ";
                }
                where = where + tmp;
            }
        }
        if (!utils.is_null_or_empty(where)) {
            sql += ' where ' + where;
        }
        var sql_count = ' select count(*) total from ( ' + sql + ') as tbl_count';
        return this.internal_exec_sql(sql_count).then(function (list1) {
            var _total = list1[0].total;
            if (params.limit) {
                sql += ' LIMIT ' + params.limit;
            }
            if (params.offset) {
                sql += ' OFFSET ' + params.offset;
            }
            return _this.internal_exec_sql(sql).then(function (list) {
                var qry = breeze.EntityQuery.from('item').where(utils.where_in('id', _.map(list, function (m) { return m.id; })))
                    .expand(['item_imgs', 'item_details', 'item_partners']);
                return _this.fetch(qry).then(function (rst) {
                    var _data = _this.entityManager.exportEntities();
                    var result = {
                        data: _data,
                        total: _total
                    };
                    return result;
                });
            });
        });
    };
    return ItemSrv;
})(api.ServiceApi);
module.exports = function (ctx) {
    ctx.register_api({
        serviceName: 'item',
        getInstance: function (ctx) {
            return new ItemSrv(ctx);
        }
    });
};
//# sourceMappingURL=item_srv.js.map