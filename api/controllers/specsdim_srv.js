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
var _ = require('lodash');
var guid = require('guid');
var specsdimSrv = (function (_super) {
    __extends(specsdimSrv, _super);
    function specsdimSrv() {
        _super.apply(this, arguments);
    }
    specsdimSrv.prototype.get_modelName = function () {
        return 'specsdim';
    };
    specsdimSrv.prototype.init_demo_data = function () {
        var _this = this;
        var qry = breeze.EntityQuery.from('specsdim');
        this.fetch(qry).then(function (list) {
            _this.update_data(list);
        });
    };
    specsdimSrv.prototype.update_data = function (list) {
        var _this = this;
        var data = [];
        var specs_keys = Object.keys(demo_data);
        _.each(specs_keys, function (key) {
            var master_obj = demo_data[key];
            data.push({
                master: key,
                display: master_obj['display']
            });
            var values = master_obj['values'];
            _.each(Object.keys(values), function (val) {
                var val_obj = values[val];
                data.push({
                    master: key,
                    dim: val,
                    display: val_obj['display']
                });
            });
        });
        _.each(data, function (d) {
            var master_obj = _.find(_this.entityManager.getEntities('specsdim'), function (dim) {
                return _.result(dim, 'specsdim_title') === d.master;
            });
            if (master_obj === undefined) {
                master_obj = _this.entityManager.createEntity('specsdim', {
                    id: guid.raw(),
                    specsdim_title: d.master,
                    specsdim_display: d.display
                });
            }
            if (d.dim != null && d.dim != undefined) {
                var dim_obj = _.find(_this.entityManager.getEntities('specsdim'), function (dim) {
                    return (_.result(dim, 'specsdim_title') === d.dim)
                        && (_.result(master_obj, 'specsdim_title') === d.master);
                });
                if (dim_obj === undefined) {
                    dim_obj = _this.entityManager.createEntity('specsdim', {
                        id: guid.raw(),
                        specsdim_title: d.dim,
                        specsdim_display: d.display,
                        specsdim_parentid: _.result(master_obj, 'id')
                    });
                }
            }
        });
        return this.do_savechanges();
    };
    return specsdimSrv;
})(api.ServiceApi);
var demo_data = {
    "Couleurs": {
        display: 'Couleur',
        gender: 'both',
        values: {
            'noir': {},
            'blanc': {},
            'rouge': {},
            'vert': {}
        }
    },
    "Marques vestes hommes": {
        display: "Marque",
        values: {
            "Hilfiger Denim": {},
            "Levi's": {},
            "Jack & Jones": {},
            "Esprit": {},
            "G-Star": {},
            "Redskins": {},
            "Boss Orange": {},
            "Teddy Smith": {},
            "Lyle & Scott": {},
            "Pepe Jeans": {},
            "Calvin Klein Jeans": {}
        }
    },
    "Taille vetements homme": {
        display: "Taille",
        values: {
            XS: {},
            S: {},
            M: {},
            L: {},
            XL: {},
            XXL: {}
        }
    },
    "Type de coupe chemises homme": {
        display: 'Type de coupe',
        values: {
            'Taille ajustee': {},
            'Taille loose': {},
            'Taille normale': {}
        }
    },
    'Longueur de manches chemises hommes': {
        display: 'Longueur de manches',
        values: {
            'Manches courtes': {},
            'Manches 3/4': {},
            'Manches longues': {},
            'Sans manche': {}
        }
    },
    'Vendeur': {
        display: 'Vendeur',
        values: {
            'Amazon.fr': {},
            'Kamiceria': {},
            'WiBA-Fashion': {},
            'CHEMISE WEB': {},
            'sourcingmap': {},
            'Herrenausstatter Muga': {},
            'Basics-You are the Man': {},
            'Melvinsi Fashion': {},
            'diplomat15': {},
            'Rue des Hommes': {}
        }
    }
};
module.exports = function (ctx) {
    ctx.register_api({
        serviceName: 'specsdim',
        getInstance: function (ctx) {
            return new specsdimSrv(ctx);
        }
    });
};
//# sourceMappingURL=specsdim_srv.js.map