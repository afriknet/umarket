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



export = function (ctx: ctx.AppContext) {

    ctx.register_api({
        serviceName: 'user',
        getInstance: (ctx) => {
            return new userSrv(ctx);
        }
    });
}


class userSrv extends api.ServiceApi {

    get_modelName() {
        return 'user';
    }



    signup(url_params: any): Q.Promise<any> {

        var d = Q.defer<any>();

        var usr_ent = url_params.params;

        var qry = breeze.EntityQuery.from('user')
            .where('email', '==', usr_ent['email']);

        this.fetch(qry).then(list => {

            if (this.entityManager.getEntities('user').length > 0) {
                d.resolve({
                    success: false,
                    error:'Cet email existe deja'
                });
            }

            this.entityManager.createEntity('user', usr_ent);

            this.savechanges(this.entityManager.exportEntities()).then(() => {

                d.resolve({
                    success: true
                });

            }).fail(err => {

                d.resolve({
                    success: false,
                    error: err
                });

            });

        });

        return d.promise;
    }



    login(url_params: any): Q.Promise<any> {

        var d = Q.defer<any>();

        var params = url_params.params;

        var p1 = breeze.Predicate.create('email', '==', params.email);
        var p2 = breeze.Predicate.create('password', '==', params.password);
        var p3 = breeze.Predicate.and(p1, p2);
        
        var qry = breeze.EntityQuery.from('user').where(p3)

        this.fetch(qry).then(list => {

            if (list.length === 0) {

                d.resolve({
                    success: false,
                    error: 'Email/ mot de passe incorrect'
                });

            } else {

                d.resolve({
                    success: true,                    
                    payload: 'Identification effectuee'
                });
            }

        });

        return d.promise;
    }

}