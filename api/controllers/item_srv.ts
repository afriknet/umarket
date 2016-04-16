/// <reference path="../../server/appcontext.ts" />
/// <reference path="../../server/lib/serviceapi.ts" />
/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/breeze/breeze.d.ts" />
/// <reference path="../../server/lib/utils.ts" />


import api = require('../../server/lib/serviceapi');
import ctx = require('../../server/appcontext');
import breeze = require('breeze-client');
import utils = require('../../server/lib/utils');


export = function (ctx: ctx.AppContext) {

    ctx.register_api({
        serviceName: 'item',
        getInstance: (ctx) => {
            return new ItemSrv(ctx);
        }
    });
}


interface request_productInfo {
    price_from?: number,
    price_to?: number,
    cats?: string[],
    specs?: string[],
    parts?: string[],
    orderby_name?: boolean,
    orderby_price?: boolean,
    offset?: number,
    limit?: number,
    data: string,
    total: number
}

interface browser_data_response {
    data: any[],
    total: number,
}


class ItemSrv extends api.ServiceApi {

    get_ServiceName() {
        return 'item';
    }


    get_modelName() {
        return 'item';
    }


    request_products(url_params:any): Q.Promise<request_productInfo> {


        var params: request_productInfo = url_params.params;
        

        var sql =   `select distinct itm.id from item itm 
                     left join item_detail det on itm.id = det.itemID   
                     left join item_cat cat on itm.id = cat.itemid
                    `; 


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
        

        return this.internal_exec_sql(sql_count).then(list1 => {
            
            var _total = list1[0].total;
            

            if (params.limit) {
                sql += ' LIMIT ' + params.limit;
            }


            if (params.offset) {
                sql += ' OFFSET ' + params.offset;
            }
            
            return this.internal_exec_sql(sql).then((list: { id: string }[]) => {
                
                var qry = breeze.EntityQuery.from('item').where(utils.where_in('id', _.map(list, m => m.id)))
                    .expand(['item_imgs', 'item_details','item_partners']);

                return this.fetch(qry).then(rst => {
                    
                    var _data: string = this.entityManager.exportEntities();

                    var result: request_productInfo = {
                        data: _data,
                        total: _total
                    }

                    return result;
                    
                });

            });

        });
        
    }
}






