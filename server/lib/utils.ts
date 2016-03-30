
import breeze = require('breeze-client');

var $ = require('stringformat');

export var format = require('string-format')


//export function format(str: string, ...params: string[]): string {
//    return f(arguments);
//}


export function quote(s: string): string {
    return "'" + s + "'";
}



export function sql_where_in(values: string[], property: string) {

    var where = null;

    _.each(values, val => {

        where = !where ? quote(val) : where + "," + quote(val);

    });

    if (where) {

        where = format(' {0} in ( {1} ) ', property, where);
    }

    return where;

}



export function where_in(field: string, values: string[]): breeze.Predicate {

    var pred_list: breeze.Predicate[] = [];

    _.each(values, val => {

        var pred = new breeze.Predicate(field, '==', quote(val))

        pred_list.push(pred);

    });

    if (pred_list.length === 0) {
        pred_list.push(new breeze.Predicate(field, '==', '-1'));
    }

    return breeze.Predicate.or(pred_list);
}



export function is_null_or_empty(val: any): boolean {
    return val === null || val === undefined
        || !val || (0 === val.length);
}