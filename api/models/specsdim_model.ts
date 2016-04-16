

import Store = require('../../server/lib/store');
import breeze = require('breeze-client');


module.exports = function () {

    Store.add_to_Store({
        defaultResourceName: 'specsdim',
        dataProperties: {
            id: { dataType: breeze.DataType.String, isPartOfKey: true },
            specsdim_title: { dataType: breeze.DataType.String },
            specsdim_display: { dataType: breeze.DataType.String },
            specsdim_type: { dataType: breeze.DataType.String },
            specsdim_code: { dataType: breeze.DataType.String },
            specsdim_parentid: { dataType: breeze.DataType.String },
            specsdim_value: { dataType: breeze.DataType.String },
        }
    });
}