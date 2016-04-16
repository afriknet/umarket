
import Store = require('../../server/lib/store');
import breeze = require('breeze-client');


module.exports = function () {

    Store.add_to_Store({
        defaultResourceName: 'itemcats',
        dataProperties: {
            id: { dataType: breeze.DataType.String, isPartOfKey: true },
            catname: { dataType: breeze.DataType.String },            
            parentid: { dataType: breeze.DataType.String },            
            img_path: { dataType: breeze.DataType.String },
            isdemo: { dataType: breeze.DataType.Int16 },
            order: { dataType: breeze.DataType.Int16 }
        },
        navigationProperties: {
            itemcats_specsdims: {
                entityTypeName: "itemcats_specsdims",
                associationName: "assoc_itemcats_specsdims",
                isScalar: false
            }
        }
    });


    Store.add_to_Store({
        defaultResourceName: 'itemcats_specsdims',
        dataProperties: {
            id: { dataType: breeze.DataType.String, isPartOfKey: true },
            itemcatid: { dataType: breeze.DataType.String },
            specsdimid: { dataType: breeze.DataType.String }            
        },
        navigationProperties: {
            itemcats: {
                type: "itemcats",
                assoc: "assoc_itemcats_specsdims",
                foreignKeyNames: ["itemcatid"]
            }
        }
    });
}

