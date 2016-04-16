/// <reference path="../../server/lib/store.ts" />
var Store = require('../../server/lib/store');
var breeze = require('breeze-client');
module.exports = function () {
    Store.add_to_Store({
        defaultResourceName: 'user',
        dataProperties: {
            'id': { dataType: breeze.DataType.String, isPartOfKey: true },
            'firstname': { dataType: breeze.DataType.String },
            'lastname': { dataType: breeze.DataType.String },
            'email': { dataType: breeze.DataType.String },
            'password': { dataType: breeze.DataType.String },
            'datecreated': { dataType: breeze.DataType.DateTime }
        }
    });
};
//# sourceMappingURL=user_model.js.map