/// <reference path="../../server/lib/store.ts" />
var Store = require('../../server/lib/store');
var breeze = require('breeze-client');
module.exports = function () {
    Store.add_to_Store({
        defaultResourceName: 'item',
        dataProperties: {
            id: { dataType: breeze.DataType.String, isPartOfKey: true },
            itemname: { dataType: breeze.DataType.String },
            itemdescr: { dataType: breeze.DataType.String },
            itemcreated: { dataType: breeze.DataType.DateTime },
            catid: { dataType: breeze.DataType.String },
            partnerid: { dataType: breeze.DataType.String },
            itemprice: { dataType: breeze.DataType.Decimal },
            amazon: { dataType: breeze.DataType.Int16 },
        },
        navigationProperties: {
            item_imgs: {
                entityTypeName: "item_img",
                associationName: "assoc_item_imgs",
                isScalar: false
            },
            item_details: {
                entityTypeName: "item_detail",
                associationName: "assoc_item_detail",
                isScalar: false
            },
            item_cats: {
                entityTypeName: "item_cat",
                associationName: "assoc_item_cat_name",
                isScalar: false
            },
            item_partners: {
                entityTypeName: "item_partner",
                associationName: "assoc_item_partner",
                isScalar: false
            }
        },
        custom: {}
    });
    Store.add_to_Store({
        defaultResourceName: 'item_img',
        dataProperties: {
            id: { dataType: breeze.DataType.String, isPartOfKey: true },
            itemID: { dataType: breeze.DataType.String, },
            filename: { dataType: breeze.DataType.String },
            filepath: { dataType: breeze.DataType.String },
            filesize: { dataType: breeze.DataType.Decimal },
            filetype: { dataType: breeze.DataType.String },
            filecreated: { dataType: breeze.DataType.DateTime },
            ismain: { dataType: breeze.DataType.Int16 }
        },
        navigationProperties: {
            item: {
                type: "item",
                assoc: "assoc_item_imgs",
                foreignKeyNames: ["itemID"]
            }
        }
    });
    // item detail
    Store.add_to_Store({
        defaultResourceName: 'item_detail',
        dataProperties: {
            id: { dataType: breeze.DataType.String, isPartOfKey: true },
            itemID: { dataType: breeze.DataType.String, },
            item_detail_title: { dataType: breeze.DataType.String },
            item_detail_value: { dataType: breeze.DataType.String },
            detail_icon: { dataType: breeze.DataType.String }
        },
        navigationProperties: {
            item: {
                type: "item",
                assoc: "assoc_item_detail",
                foreignKeyNames: ["itemID"]
            }
        }
    });
    // item_cat
    Store.add_to_Store({
        defaultResourceName: 'item_cat',
        dataProperties: {
            id: { dataType: breeze.DataType.String, isPartOfKey: true },
            itemid: { dataType: breeze.DataType.String, },
            item_cat_name: { dataType: breeze.DataType.String },
        },
        navigationProperties: {
            item: {
                type: "item",
                assoc: "assoc_item_cat_name",
                foreignKeyNames: ["itemid"]
            }
        }
    });
    // item_partner
    Store.add_to_Store({
        defaultResourceName: 'item_partner',
        dataProperties: {
            id: { dataType: breeze.DataType.String, isPartOfKey: true },
            itemid: { dataType: breeze.DataType.String, },
            partner_name: { dataType: breeze.DataType.String },
        },
        navigationProperties: {
            item: {
                type: "item",
                assoc: "assoc_item_partner",
                foreignKeyNames: ["itemid"]
            }
        }
    });
    /*
    // item_partner
        this.add_dataStore({
            namespace: dataNameSpace,
            shortName: 'item_partner',
            defaultResourceName: 'item_partner',
            autoGeneratedKeyType: breeze.AutoGeneratedKeyType.None,
            dataProperties: {
                id: { dataType: breeze.DataType.String, isPartOfKey: true },
                itemID: { dataType: breeze.DataType.String, },
                partnerid: { dataType: breeze.DataType.String },
            },
            navigationProperties: {
                item: {
                    type: "item",
                    assoc: "assoc_item_partner",
                    foreignKeyNames: ["itemID"]
                }
            }
        });

    */
};
//# sourceMappingURL=item_model.js.map