/// <reference path="../ts_library/ts_types.ts" />
/// <reference path="../ts_library/ts_lib.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../ts_library/ts_lib'], function (require, exports, lib) {
    var ItemPartnerExplorer = (function (_super) {
        __extends(ItemPartnerExplorer, _super);
        function ItemPartnerExplorer(options) {
            _super.call(this, options);
        }
        Object.defineProperty(ItemPartnerExplorer.prototype, "master", {
            get: function () {
                return this.datasource.dataManager.getEntities(this.getResourceName())[0];
            },
            enumerable: true,
            configurable: true
        });
        ItemPartnerExplorer.prototype.get_datasource = function () {
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
        ItemPartnerExplorer.prototype.getServiceName = function () {
            return 'item-srv';
        };
        ItemPartnerExplorer.prototype.getResourceName = function () {
            return 'item';
        };
        ItemPartnerExplorer.prototype.get_query = function () {
            var qry = new breeze.EntityQuery(this.getResourceName()).where('id', '==', this.master['id']());
            return qry.expand(['item_partners']);
        };
        ItemPartnerExplorer.prototype.retrieve_data = function () {
            var data = this.datasource.dataManager.getEntities('item_partner');
            return data;
        };
        ItemPartnerExplorer.prototype.get_tableProps = function () {
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
                            title: 'partenaire', data: 'partner_name'
                        }
                    ],
                    data: []
                }
            });
            options.tblSettings["bAutoWidth"] = false;
            return options;
        };
        ItemPartnerExplorer.prototype.add_record = function () {
            this.rowAdding = true;
            this.rowEditing = true;
            this.adding = true;
            this.open_record(this.master['id']());
        };
        ItemPartnerExplorer.prototype.notify = function (cmd) {
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
        ItemPartnerExplorer.prototype.get_entry = function (options) {
            var detail = _.find(this.datasource.dataManager.getEntities('item_partner'), function (e) {
                return e['id']() === options.autoLoadID;
            });
            if (detail != undefined) {
                options.detail_id = options.autoLoadID;
                options.autoLoadID = detail['itemid']();
            }
            return new ItemPartner(options);
        };
        return ItemPartnerExplorer;
    })(lib.Views.Explorer);
    exports.ItemPartnerExplorer = ItemPartnerExplorer;
    var ItemPartner = (function (_super) {
        __extends(ItemPartner, _super);
        function ItemPartner(options) {
            _super.call(this, options);
        }
        Object.defineProperty(ItemPartner.prototype, "currentItem", {
            get: function () {
                return this.datasource.dataManager.getEntities('item')[0];
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ItemPartner.prototype, "currentDetail", {
            get: function () {
                var _this = this;
                return _.find(this.datasource.dataManager.getEntities('item_partner'), function (d) {
                    return d['id']() === _this.options.detail_id;
                });
            },
            enumerable: true,
            configurable: true
        });
        ItemPartner.prototype.get_query = function () {
            var qry = _super.prototype.get_query.call(this);
            return qry.expand(['item_partners']);
        };
        ItemPartner.prototype.fetch_data = function () {
            var _this = this;
            var that = this;
            return _super.prototype.fetch_data.call(this).then(function () {
                if (that.options.detail_id == undefined) {
                    _this.insertNew();
                }
                return true;
            });
        };
        ItemPartner.prototype.insertNew = function () {
            var id = this.currentItem['id']();
            var e = this.datasource.insert('item_partner', {
                itemid: id
            });
            this.options.detail_id = e['id']();
            return e;
        };
        ItemPartner.prototype.init_form = function () {
            var _this = this;
            _super.prototype.init_form.call(this);
            var html = _.template($("#ts-item-partner-entry").html())();
            var root = this.$el.find('.content-entry');
            root.html(html);
            this.datasource.fetch_localDB().then(function (db) {
                _this.init_cats_ui(db);
            });
        };
        ItemPartner.prototype.init_cats_ui = function (db) {
            var _this = this;
            var data = _.map(Object.keys(db.parts), function (p) {
                return { name: p };
            });
            this.lookup_cats = lib.Controls.Lookup.render({
                el: this.$el.find('.lookup-1'),
                displaymember: 'name',
                valuemember: 'name',
                data: data,
                onchange: function (el, val) {
                    _this.currentDetail['partner_name'](val);
                },
                onInit: function (self) {
                    var val = _this.currentDetail['partner_name']();
                    self.update(val);
                }
            });
        };
        return ItemPartner;
    })(lib.Views.Entry);
    exports.ItemPartner = ItemPartner;
});
//# sourceMappingURL=C:/umarket/umarket.web.ui/js/ts_admin/ts_item_partners.js.map