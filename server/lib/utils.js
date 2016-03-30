var breeze = require('breeze-client');
var $ = require('stringformat');
exports.format = require('string-format');
//export function format(str: string, ...params: string[]): string {
//    return f(arguments);
//}
function quote(s) {
    return "'" + s + "'";
}
exports.quote = quote;
function sql_where_in(values, property) {
    var where = null;
    _.each(values, function (val) {
        where = !where ? quote(val) : where + "," + quote(val);
    });
    if (where) {
        where = exports.format(' {0} in ( {1} ) ', property, where);
    }
    return where;
}
exports.sql_where_in = sql_where_in;
function where_in(field, values) {
    var pred_list = [];
    _.each(values, function (val) {
        var pred = new breeze.Predicate(field, '==', quote(val));
        pred_list.push(pred);
    });
    if (pred_list.length === 0) {
        pred_list.push(new breeze.Predicate(field, '==', '-1'));
    }
    return breeze.Predicate.or(pred_list);
}
exports.where_in = where_in;
function is_null_or_empty(val) {
    return val === null || val === undefined
        || !val || (0 === val.length);
}
exports.is_null_or_empty = is_null_or_empty;
//# sourceMappingURL=utils.js.map