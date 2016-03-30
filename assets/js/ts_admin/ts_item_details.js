/// <reference path="../ts_library/ts_types.ts" />
/// <reference path="../ts_library/ts_lib.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../ts_library/ts_lib'], function (require, exports, lib) {
    var ItemDetailsExplorer = (function (_super) {
        __extends(ItemDetailsExplorer, _super);
        function ItemDetailsExplorer(options) {
            _super.call(this, options);
        }
        Object.defineProperty(ItemDetailsExplorer.prototype, "master", {
            get: function () {
                return this.datasource.dataManager.getEntities(this.getResourceName())[0];
            },
            enumerable: true,
            configurable: true
        });
        ItemDetailsExplorer.prototype.get_datasource = function () {
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
        ItemDetailsExplorer.prototype.getServiceName = function () {
            return 'item-srv';
        };
        ItemDetailsExplorer.prototype.getResourceName = function () {
            return 'item';
        };
        ItemDetailsExplorer.prototype.get_query = function () {
            var qry = new breeze.EntityQuery(this.getResourceName()).where('id', '==', this.master['id']());
            return qry.expand(['item_details']);
        };
        ItemDetailsExplorer.prototype.retrieve_data = function () {
            var data = this.datasource.dataManager.getEntities('item_detail');
            return data;
        };
        ItemDetailsExplorer.prototype.get_tableProps = function () {
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
                            title: 'titre', data: 'item_detail_title'
                        },
                        {
                            title: 'valeur', data: 'item_detail_value'
                        }
                    ],
                    data: []
                }
            });
            options.tblSettings["bAutoWidth"] = false;
            return options;
        };
        ItemDetailsExplorer.prototype.add_record = function () {
            this.rowAdding = true;
            this.rowEditing = true;
            this.adding = true;
            this.open_record(this.master['id']());
        };
        ItemDetailsExplorer.prototype.get_entry = function (options) {
            var detail = _.find(this.datasource.dataManager.getEntities('item_detail'), function (e) {
                return e['id']() === options.autoLoadID;
            });
            if (detail != undefined) {
                options.detail_id = options.autoLoadID;
                options.autoLoadID = detail['itemID']();
            }
            return new ItemDetailEntry(options);
        };
        ItemDetailsExplorer.prototype.notify = function (cmd) {
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
        return ItemDetailsExplorer;
    })(lib.Views.Explorer);
    exports.ItemDetailsExplorer = ItemDetailsExplorer;
    var ItemDetailEntry = (function (_super) {
        __extends(ItemDetailEntry, _super);
        function ItemDetailEntry(options) {
            _super.call(this, options);
        }
        Object.defineProperty(ItemDetailEntry.prototype, "currentItem", {
            get: function () {
                return this.datasource.dataManager.getEntities('item')[0];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ItemDetailEntry.prototype, "currentDetail", {
            get: function () {
                var _this = this;
                return _.find(this.datasource.dataManager.getEntities('item_detail'), function (d) {
                    return d['id']() === _this.options.detail_id;
                });
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ItemDetailEntry.prototype, "specs_names", {
            get: function () {
                return this.$el.find('.specs-names');
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ItemDetailEntry.prototype, "specs_values", {
            get: function () {
                return this.$el.find('.specs-values');
            },
            enumerable: true,
            configurable: true
        });
        ItemDetailEntry.prototype.get_query = function () {
            var qry = _super.prototype.get_query.call(this);
            return qry.expand(['item_details']);
        };
        ItemDetailEntry.prototype.fetch_data = function () {
            var _this = this;
            var that = this;
            return _super.prototype.fetch_data.call(this).then(function () {
                if (that.options.detail_id == undefined) {
                    _this.insertNew();
                }
                return true;
            });
        };
        ItemDetailEntry.prototype.init_form = function () {
            var _this = this;
            _super.prototype.init_form.call(this);
            var html = _.template($("#ts-item-detail-entry").html())();
            var root = this.$el.find('.content-entry');
            root.html(html);
            this.datasource.fetch_localDB().then(function (db) {
                _this.init_specs_ui(db);
            });
            $('.wizard > .content > .body ul > li').css('display', 'inherit');
            this.$el.find('.bootstrap-select.specs-values').css('width', '100%');
        };
        ItemDetailEntry.prototype.insertNew = function () {
            var id = this.currentItem['id']();
            var e = this.datasource.insert('item_detail', {
                itemID: id
            });
            this.options.detail_id = e['id']();
            return e;
        };
        ItemDetailEntry.prototype.init_specs_ui = function (db) {
            var _this = this;
            this.lookup_names = lib.Controls.Lookup.render({
                el: this.$el.find('.lookup-1'),
                displaymember: 'name',
                valuemember: 'name',
                data: db.specs_toArray(),
                onchange: function (el, val) {
                    _this.currentDetail['item_detail_title'](val);
                    _this.currentDetail['item_detail_value'](null);
                    if (!utils.is_null_or_empty(val)) {
                        var items = db.specs_values_toArray(val);
                        _this.lookup_values.reset_values(items);
                        _this.lookup_values.update(null);
                    }
                },
                onInit: function (self) {
                    var val = _this.currentDetail['item_detail_title']();
                    self.update(val);
                }
            });
            this.lookup_values = lib.Controls.Lookup.render({
                el: this.$el.find('.lookup-2'),
                displaymember: 'name',
                valuemember: 'name',
                submember: 'subvalues',
                onchange: function (el, val) {
                    _this.currentDetail['item_detail_value'](val);
                },
                onInit: function (self) {
                    var master_val = _this.lookup_names.value;
                    if (!utils.is_null_or_empty(master_val)) {
                        var values = db.specs_values_toArray(master_val);
                        self.reset_values(values);
                        var val = _this.currentDetail['item_detail_value']();
                        if (!utils.is_null_or_empty(val)) {
                            self.update(val);
                        }
                    }
                },
                data: []
            });
        };
        return ItemDetailEntry;
    })(lib.Views.Entry);
    exports.ItemDetailEntry = ItemDetailEntry;
});
//# sourceMappingURL=C:/umarket/umarket.web.ui/js/ts_admin/ts_item_details.js.map