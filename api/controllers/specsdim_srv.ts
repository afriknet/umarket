
/// <reference path="../../server/appcontext.ts" />
/// <reference path="../../server/lib/serviceapi.ts" />
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/breeze/breeze.d.ts" />
/// <reference path="../../server/lib/utils.ts" />

import api = require('../../server/lib/serviceapi');
import ctx = require('../../server/appcontext');
import breeze = require('breeze-client');
import utils = require('../../server/lib/utils');
import Q = require('q');
import _ = require('lodash');
var guid = require('guid');



export = function (ctx: ctx.AppContext) {

    ctx.register_api({
        serviceName: 'specsdim',
        getInstance: (ctx) => {
            return new specsdimSrv(ctx);
        }
    });
}



interface SpecsDimInfo {
    master: string,
    dim?: string,
    display?: string
}

class specsdimSrv extends api.ServiceApi {


    get_modelName() {
        return 'specsdim';
    }


    init_demo_data() {

        var qry = breeze.EntityQuery.from('specsdim');

        this.fetch(qry).then(list => {

            this.update_data(list);

        });        
    }


    update_data(list: breeze.Entity[]) {

        var data: SpecsDimInfo[] = [];

        var specs_keys = Object.keys(demo_data);

        _.each(specs_keys, key => {

            var master_obj = demo_data[key];
            
            data.push({
                master: key,
                display: master_obj['display']                
            });
            

            var values = master_obj['values'];
            
            _.each(Object.keys(values), val => {

                var val_obj = values[val];

                data.push({
                    master: key,
                    dim: val,
                    display: val_obj['display']
                });

            });            
        });
        

        _.each(data, d => {


            var master_obj = _.find(this.entityManager.getEntities('specsdim'), dim => {
                return _.result(dim, 'specsdim_title') === d.master
            });


            if (master_obj === undefined) {

                master_obj = this.entityManager.createEntity('specsdim', {
                    id: guid.raw(),
                    specsdim_title: d.master,
                    specsdim_display: d.display
                });
            }


            if (d.dim != null && d.dim != undefined) {

                var dim_obj = _.find(this.entityManager.getEntities('specsdim'), dim => {
                    return (_.result(dim, 'specsdim_title') === d.dim)
                        && (_.result(master_obj, 'specsdim_title') === d.master);
                });

                if (dim_obj === undefined) {

                    dim_obj = this.entityManager.createEntity('specsdim', {
                        id: guid.raw(),
                        specsdim_title: d.dim,
                        specsdim_display: d.display,
                        specsdim_parentid: _.result(master_obj, 'id')
                    });
                }
            }            
        });


        return this.do_savechanges();

    }
}


var demo_data = {

    "Couleurs": {
        display: 'Couleur',
        gender:'both',
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
    
}