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
var Q = require('q');
var _ = require('lodash');
var guid = require('guid');
var itemcatsSrv = (function (_super) {
    __extends(itemcatsSrv, _super);
    function itemcatsSrv() {
        _super.apply(this, arguments);
    }
    itemcatsSrv.prototype.get_modelName = function () {
        return 'itemcats';
    };
    itemcatsSrv.prototype.init_demo_data = function () {
        var _this = this;
        var qry = breeze.EntityQuery.from('itemcats');
        return this.fetch(qry).then(function (list) {
            if (list.length === 0) {
                _this.insert_demo_data();
                return _this.do_savechanges();
            }
            else {
                return Q.resolve([]);
            }
        });
    };
    itemcatsSrv.prototype.insert_demo_data = function () {
        var _this = this;
        _.each(Object.keys(demo_data), function (k) {
            var cat = demo_data[k];
            var subs = cat['subs'];
            _this.insert_cat(k, undefined, subs);
        });
    };
    itemcatsSrv.prototype.insert_cat = function (name, parentid, subs) {
        var _this = this;
        var e = this.entityManager.createEntity('itemcats', {
            id: guid.raw(),
            catname: name,
            parentid: parentid,
            isdemo: 1
        });
        if (subs) {
            _.each(Object.keys(subs), function (s) {
                _this.insert_cat(s, _.result(e, 'id'));
            });
        }
    };
    return itemcatsSrv;
})(api.ServiceApi);
var demo_data = {
    "Men": {
        subs: {
            "Tshirts & Jackets": { display: 'accessoires' },
            "Caps and Hats": {},
            "Ties": {},
            "Scarves": {},
            "Shirts": {},
            "Jeans": {},
        }
    },
    "Women": {
        subs: {
            "Jackets & Coats": {},
            "Jumpers & cardigans": {},
            "Jeans": {},
            "Trousers": {},
            "Dresses": {},
            "Skirts": {},
            "Long Sleeve Tops": {},
        }
    },
    Accessoires: {
        subs: {
            "Sunglasses": {},
            "Watches": {},
            "Umbrellas": {},
            "Bags & Wallets": { display: 'Bags & Wallets' },
            "Fashion Jewellery": {},
            "Belts": {}
        }
    }
};
module.exports = function (ctx) {
    ctx.register_api({
        serviceName: 'itemcats',
        getInstance: function (ctx) {
            return new itemcatsSrv(ctx);
        }
    });
};
//# sourceMappingURL=itemcats_srv.js.map