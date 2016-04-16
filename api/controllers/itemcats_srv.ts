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
        serviceName: 'itemcats',
        getInstance: (ctx) => {
            return new itemcatsSrv(ctx);
        }
    });
}




class itemcatsSrv extends api.ServiceApi {

    get_modelName() {
        return 'itemcats';
    }


    init_demo_data() {

        var qry = breeze.EntityQuery.from('itemcats');

        return this.fetch(qry).then(list => {
            



            if (list.length === 0) {

                this.insert_demo_data();

                return this.do_savechanges();    

            } else {

                return Q.resolve([]);

            }
        });
    }


    insert_demo_data() {        

        _.each(Object.keys(demo_data), k => {

            var cat = demo_data[k];
            var subs = cat['subs'];

            this.insert_cat(k, undefined, subs);

        });

    }    


    insert_cat(name: string, parentid?: string, subs?: string[]) {

        var e = this.entityManager.createEntity('itemcats', {
            id: guid.raw(),
            catname: name,
            parentid: parentid,
            isdemo: 1
        });

        if (subs) {

            _.each(Object.keys(subs), s => {
                this.insert_cat(s, _.result(e, 'id') as any);
            });            
        }        
    }
}


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

}