/// <reference path="../ts_library/ts_types.ts" />
/// <reference path="../ts_library/ts_lib.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../ts_library/ts_lib'], function (require, exports, lib) {
    var ItemCatsExplorer = (function (_super) {
        __extends(ItemCatsExplorer, _super);
        function ItemCatsExplorer(options) {
            _super.call(this, options);
        }
        Object.defineProperty(ItemCatsExplorer.prototype, "master", {
            get: function () {
                return this.datasource.dataManager.getEntities(this.getResourceName())[0];
            },
            enumerable: true,
            configurable: true
        });
        ItemCatsExplorer.prototype.get_datasource = function () {
            var _this = this;
            var __ds = this.options.datasource.clone();
            __ds.dataManager.entityChanged.subscribe(function (args) {
                var is_modified = (args.entityAction == breeze.EntityAction.EntityStateChange)
                    || (args.entityAction == breeze.EntityAction.PropertyChange);
                if (is_modified) {
                    _this.actions.btnCancel.removeClass('hidden');
                    _this.actions.btnSave.removeClass('hidden');
                }
                else {
                    _this.actions.btnCancel.addClass('hidden');
                    _this.actions.btnSave.addClass('hidden');
                }
            });
            return __ds;
        };
        ItemCatsExplorer.prototype.getServiceName = function () {
            return 'item-srv';
        };
        ItemCatsExplorer.prototype.getResourceName = function () {
            return 'item';
        };
        ItemCatsExplorer.prototype.get_query = function () {
            var qry = new breeze.EntityQuery(this.getResourceName()).where('id', '==', this.master['id']());
            return qry.expand(['item_cats']);
        };
        ItemCatsExplorer.prototype.retrieve_data = function () {
            var data = this.datasource.dataManager.getEntities('item_cat');
            return data;
        };
        ItemCatsExplorer.prototype.get_tableProps = function () {
            var options = _super.prototype.get_tableProps.call(this);
            _.extend(options, {
                allow_delete: true,
                allow_edit: true,
                counting: true,
                toggle_action: false,
                spinner: this.spinner,
                tblSettings: {
                    columns: [
                        {
                            title: 'categorie', data: 'item_cat_name'
                        }
                    ],
                    data: []
                }
            });
            options.tblSettings["bAutoWidth"] = false;
            return options;
        };
        ItemCatsExplorer.prototype.add_record = function () {
            this.rowAdding = true;
            this.rowEditing = true;
            this.adding = true;
            this.open_record(this.master['id']());
        };
        ItemCatsExplorer.prototype.notify = function (cmd) {
            var _this = this;
            var that = this;
            switch (cmd.command) {
                case lib.Constants.Commands.AddRow: {
                    return _super.prototype.notify.call(this, cmd).then(function () {
                        _this.actions.btnCancel.removeClass('hidden');
                        _this.actions.btnSave.removeClass('hidden');
                        return true;
                    });
                }
                case lib.Constants.Commands.openRecord: {
                    return _super.prototype.notify.call(this, cmd).then(function () {
                        _this.actions.btnCancel.removeClass('hidden');
                        _this.actions.btnSave.removeClass('hidden');
                        return true;
                    });
                }
                case lib.Constants.Commands.ReturnEdit:
                case lib.Constants.Commands.CancelEdit: {
                    return _super.prototype.notify.call(this, cmd).then(function () {
                        return that.fetch_data();
                    });
                }
                default:
                    return _super.prototype.notify.call(this, cmd);
            }
            return Q.resolve(true);
        };
        ItemCatsExplorer.prototype.get_entry = function (options) {
            var detail = _.find(this.datasource.dataManager.getEntities('item_cat'), function (e) {
                return e['id']() === options.autoLoadID;
            });
            if (detail != undefined) {
                options.detail_id = options.autoLoadID;
                options.autoLoadID = detail['itemid']();
            }
            return new ItemCategory(options);
        };
        return ItemCatsExplorer;
    })(lib.Views.Explorer);
    exports.ItemCatsExplorer = ItemCatsExplorer;
    var ItemCategory = (function (_super) {
        __extends(ItemCategory, _super);
        function ItemCategory(options) {
            _super.call(this, options);
        }
        Object.defineProperty(ItemCategory.prototype, "currentItem", {
            get: function () {
                return this.datasource.dataManager.getEntities('item')[0];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ItemCategory.prototype, "currentDetail", {
            get: function () {
                var _this = this;
                return _.find(this.datasource.dataManager.getEntities('item_cat'), function (d) {
                    return d['id']() === _this.options.detail_id;
                });
            },
            enumerable: true,
            configurable: true
        });
        ItemCategory.prototype.get_query = function () {
            var qry = _super.prototype.get_query.call(this);
            return qry.expand(['item_cats']);
        };
        ItemCategory.prototype.fetch_data = function () {
            var _this = this;
            var that = this;
            return _super.prototype.fetch_data.call(this).then(function () {
                if (that.options.detail_id == undefined) {
                    _this.insertNew();
                }
                return true;
            });
        };
        ItemCategory.prototype.insertNew = function () {
            var id = this.currentItem['id']();
            var e = this.datasource.insert('item_cat', {
                itemid: id
            });
            this.options.detail_id = e['id']();
            return e;
        };
        ItemCategory.prototype.init_form = function () {
            var _this = this;
            _super.prototype.init_form.call(this);
            var html = _.template($("#ts-item-cats-entry").html())();
            var root = this.$el.find('.content-entry');
            root.html(html);
            this.datasource.fetch_localDB().then(function (db) {
                _this.init_cats_ui(db);
            });
        };
        ItemCategory.prototype.init_cats_ui = function (db) {
            var _this = this;
            this.lookup_cats = lib.Controls.Lookup.render({
                el: this.$el.find('.lookup-1'),
                displaymember: 'name',
                valuemember: 'name',
                data: db.cats_toArray(),
                onchange: function (el, val) {
                    _this.currentDetail['item_cat_name'](val);
                },
                onInit: function (self) {
                    var val = _this.currentDetail['item_cat_name']();
                    self.update(val);
                }
            });
        };
        return ItemCategory;
    })(lib.Views.Entry);
    exports.ItemCategory = ItemCategory;
});
//# sourceMappingURL=C:/umarket/umarket.web.ui/js/ts_admin/ts_item_cats.js.map