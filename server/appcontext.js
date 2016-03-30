/// <reference path="lib/serviceapi.ts" />
/// <reference path="../typings/lodash/lodash.d.ts" />
/// <reference path="db/boot.ts" />
var _ = require('lodash');
var boot = require('./db/boot');
var conn = boot.start_db(null);
var apis_list = [];
var AppContext = (function () {
    function AppContext() {
    }
    Object.defineProperty(AppContext.prototype, "conn", {
        get: function () {
            return conn;
        },
        enumerable: true,
        configurable: true
    });
    AppContext.prototype.register_api = function (info) {
        var exists = _.find(apis_list, function (a) {
            return a.serviceName.toUpperCase() === info.serviceName.toUpperCase();
        }) != undefined;
        if (exists) {
            throw "api server '" + info.serviceName + "' exists already";
        }
        apis_list.push(info);
    };
    AppContext.prototype.get_ServiceApi = function (serviceName) {
        var info = _.find(apis_list, function (a) {
            return a.serviceName === serviceName;
        });
        if (info) {
            return info.getInstance(this);
        }
        return null;
    };
    return AppContext;
})();
exports.AppContext = AppContext;
//# sourceMappingURL=appcontext.js.map