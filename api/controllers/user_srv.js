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
var userSrv = (function (_super) {
    __extends(userSrv, _super);
    function userSrv() {
        _super.apply(this, arguments);
    }
    userSrv.prototype.get_modelName = function () {
        return 'user';
    };
    userSrv.prototype.signup = function (url_params) {
        var _this = this;
        var d = Q.defer();
        var usr_ent = url_params.params;
        var qry = breeze.EntityQuery.from('user')
            .where('email', '==', usr_ent['email']);
        this.fetch(qry).then(function (list) {
            if (_this.entityManager.getEntities('user').length > 0) {
                d.resolve({
                    success: false,
                    error: 'Cet email existe deja'
                });
            }
            _this.entityManager.createEntity('user', usr_ent);
            _this.savechanges(_this.entityManager.exportEntities()).then(function () {
                d.resolve({
                    success: true
                });
            }).fail(function (err) {
                d.resolve({
                    success: false,
                    error: err
                });
            });
        });
        return d.promise;
    };
    userSrv.prototype.login = function (url_params) {
        var d = Q.defer();
        var params = url_params.params;
        var p1 = breeze.Predicate.create('email', '==', params.email);
        var p2 = breeze.Predicate.create('password', '==', params.password);
        var p3 = breeze.Predicate.and(p1, p2);
        var qry = breeze.EntityQuery.from('user').where(p3);
        this.fetch(qry).then(function (list) {
            if (list.length === 0) {
                d.resolve({
                    success: false,
                    error: 'Email/ mot de passe incorrect'
                });
            }
            else {
                d.resolve({
                    success: true,
                    payload: 'Identification effectuee'
                });
            }
        });
        return d.promise;
    };
    return userSrv;
})(api.ServiceApi);
module.exports = function (ctx) {
    ctx.register_api({
        serviceName: 'user',
        getInstance: function (ctx) {
            return new userSrv(ctx);
        }
    });
};
//# sourceMappingURL=user_srv.js.map