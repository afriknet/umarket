/// <reference path="../ts_library/ts_lib.ts" />
/// <reference path="../ts_library/launch.tsx" />
/// <reference path="ts_item_details.ts" />
/// <reference path="ts_item_images.ts" />
/// <reference path="ts_item_cats.ts" />
/// <reference path="ts_item_partners.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../ts_library/ts_lib', './ts_item_images', './ts_item_details', './ts_item_cats', './ts_item_partners'], function (require, exports, lib, Img, Dets, Cats, Parts) {
    var AdminExplorerView = (function (_super) {
        __extends(AdminExplorerView, _super);
        function AdminExplorerView() {
            _.extend(this, {
                template: false
            });
            _super.call(this, {});
        }
        Object.defineProperty(AdminExplorerView.prototype, "root", {
            get: function () {
                return $('#page-wrapper .products .content-page');
            },
            enumerable: true,
            configurable: true
        });
        AdminExplorerView.prototype.onRender = function () {
            var _this = this;
            _super.prototype.onRender.call(this);
            $('#page-wrapper').load('/master_page.html', function () {
                $('.page-title').html('Administration');
                $('.page-descr').empty();
                _this.load_view();
            });
        };
        AdminExplorerView.prototype.load_view = function () {
            var html = _.template($('#ts-admin-explorer').html())();
            this.root.html(html);
            (new ArticlesExplorer({ el: this.root.find('#tabs-articles-list') })).render();
        };
        return AdminExplorerView;
    })(lib.Views.BaseView);
    exports.AdminExplorerView = AdminExplorerView;
    var ArticlesExplorer = (function (_super) {
        __extends(ArticlesExplorer, _super);
        function ArticlesExplorer(options) {
            _super.call(this, options);
        }
        ArticlesExplorer.prototype.getServiceName = function () {
            return 'item-srv';
        };
        ArticlesExplorer.prototype.getResourceName = function () {
            return 'item';
        };
        ArticlesExplorer.prototype.internal_fetch = function () {
            return Q.resolve(true);
        };
        ArticlesExplorer.prototype.get_dataTable = function (options) {
            var settings = _.extend(options, {
                owner: this,
                allow_delete: true,
                allow_edit: true,
                toggle_action: false,
                counting: true,
                spinner: this.spinner,
                tblSettings: {
                    autoWidth: false,
                    columns: [
                        { title: 'nom du produit', data: 'itemname' },
                        {
                            title: 'description', data: 'itemdescr', width: '50%'
                        },
                        { title: 'prix', data: 'itemprice' }
                    ]
                },
                get_sql: function () {
                    var sql = "select * from item";
                    return sql;
                },
                get_orderBy: function () {
                    return 'itemname ';
                }
            });
            settings.serviceName = 'item-srv';
            var table = new lib.Views.srvDataTable(settings);
            return table;
        };
        ArticlesExplorer.prototype.get_entry = function (options) {
            return new ProductEntryExplorer(options);
        };
        return ArticlesExplorer;
    })(lib.Views.Explorer);
    var ProductEntryExplorer = (function (_super) {
        __extends(ProductEntryExplorer, _super);
        function ProductEntryExplorer(options) {
            _.extend(this, {
                template: '#ts-productview-explorer'
            });
            _super.call(this, options);
        }
        ProductEntryExplorer.prototype.get_query = function () {
            var qry = _super.prototype.get_query.call(this);
            return qry.expand(['item_imgs', 'item_details']);
        };
        ProductEntryExplorer.prototype.insertNew = function () {
            var e = _super.prototype.insertNew.call(this);
            e['itemcreated'](new Date());
            return e;
        };
        ProductEntryExplorer.prototype.init_form = function () {
            this.build_content();
            this.init_content();
        };
        ProductEntryExplorer.prototype.build_content = function () {
            var root = this.$el.find('.content-entry');
            var itemname = this.currentItem['itemname']();
            if (utils.is_null_or_empty(itemname)) {
                itemname = 'Nouveau produit';
            }
            root.append($('<h4>{0}</h4>'.format(itemname)));
            root.append($('<hr/>'));
            var wiz_root = $('<div class="wiz_root" ></div>').appendTo(root);
            var index = 0;
            this.contentList = this.get_list_of_content();
            _.each(this.contentList, function (c) {
                var h3 = $('<h3>{0}</h3>'.format(c.title)).appendTo(wiz_root);
                var section = $('<section class="rlw" data-index="{0}"></section>'.format(index++)).appendTo(wiz_root);
                section.append($('<div class="heading mb20"><h4 style="display:inline-block">{0}</h4><i class="pull-right fa fa-spin fa-spinner fa-2x text-primary loader hidden"></i></div>'.format(c.title)));
                section.append($('<div class="col-lg-12 section-content" style="padding-left:0; padding-right:0; min-height:380px" ></div>'));
            });
        };
        ProductEntryExplorer.prototype.init_content = function () {
            var that = this;
            this.$el.find('.wiz_root').steps({
                headerTag: "h3",
                bodyTag: "section",
                transitionEffect: "fade",
                stepsOrientation: "vertical",
                enableFinishButton: 'false',
                enableAllSteps: true,
                enableKeyNavigation: false,
                enablePagination: false,
                onStepChanged: function (event, currentIndex, priorIndex) {
                    that.display_current_content(currentIndex);
                },
                onInit: function (event, currentIndex) {
                    that.display_current_content(0);
                },
            });
            this.$el.find('.content').css({ 'background': 'none' });
            _.each(this.$el.find('[aria-controls]'), function (a) {
                $(a).click();
            });
            this.$el.find('[aria-controls]:eq(0)').click();
            this.$el.find('.number').empty();
            this.$el.find('.steps').css('width', '25%');
            this.$el.find('.content').css('padding-top', '0');
        };
        ProductEntryExplorer.prototype.display_current_content = function (index) {
            var info = this.contentList[index];
            if (!info.get_content) {
                return;
            }
            if (info.initialized) {
                return;
            }
            info.initialized = true;
            var section = this.$el.find('section[data-index="{0}"]'.format(index));
            var props = {
                owner: this,
                el: section.find('.section-content'),
                datasource: this.datasource,
                loader: section.find('.loader')
            };
            var view = info.get_content(props);
            view.render();
        };
        ProductEntryExplorer.prototype.get_list_of_content = function () {
            if (this.currentItem.entityAspect.entityState === breeze.EntityState.Added) {
                return [
                    {
                        title: 'Profile general', get_content: function (options) {
                            options.datasource = options.datasource.clone();
                            return new ProductProfileEntry(options);
                        }
                    }];
            }
            else {
                return [
                    {
                        title: 'Profile general', get_content: function (options) {
                            options.datasource = options.datasource.clone();
                            return new ProductProfileEntry(options);
                        }
                    },
                    {
                        title: 'Images', get_content: function (options) {
                            var _options = _.extend(options, {
                                datasource: options.datasource.clone()
                            });
                            return new Img.ItemImagesExplorer(_options);
                        }
                    },
                    {
                        title: 'Details', get_content: function (options) {
                            var _options = _.extend(options, {
                                datasource: options.datasource.clone()
                            });
                            return new Dets.ItemDetailsExplorer(_options);
                        }
                    },
                    {
                        title: 'Categories', get_content: function (options) {
                            var _options = _.extend(options, {
                                datasource: options.datasource.clone()
                            });
                            return new Cats.ItemCatsExplorer(_options);
                        }
                    },
                    {
                        title: 'Partenaires', get_content: function (options) {
                            var _options = _.extend(options, {
                                datasource: options.datasource.clone()
                            });
                            return new Parts.ItemPartnerExplorer(_options);
                        }
                    }
                ];
            }
        };
        return ProductEntryExplorer;
    })(lib.Views.Entry);
    var ProductProfileEntry = (function (_super) {
        __extends(ProductProfileEntry, _super);
        function ProductProfileEntry(props) {
            _.extend(this, {
                template: '#ts-product-profile'
            });
            _super.call(this, props);
        }
        Object.defineProperty(ProductProfileEntry.prototype, "datasource", {
            get: function () {
                if (!this._ds) {
                    this._ds = this.options.datasource.clone();
                }
                return this._ds;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProductProfileEntry.prototype, "owner", {
            get: function () {
                return this.options.owner;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProductProfileEntry.prototype, "currentItem", {
            get: function () {
                var obj = _.first(this.datasource.dataManager.getEntities('item'));
                if (obj === undefined) {
                    obj = this.datasource.insert('item');
                    obj['itemcreated'](new Date());
                }
                if (obj['currPrice'] === undefined) {
                    obj['currPrice'] = lib.Extensions.CurrenyObservable(obj['itemprice']);
                }
                return obj;
            },
            enumerable: true,
            configurable: true
        });
        ProductProfileEntry.prototype.onRender = function () {
            _super.prototype.onRender.call(this);
            this.set_amazon_binding();
            ko.applyBindings(this.currentItem, this.$el[0]);
            this.init_events();
        };
        ProductProfileEntry.prototype.add_controls = function () {
            var el1 = $('<div class="col-lg-8 mt30" style="padding-left:0"></div>').appendTo(this.$el.find('.content'));
            var txt_prod_name = new lib.Controls.TextEdit({
                el: el1,
                editmode: lib.Controls.EditMode.Edit,
                required: true,
                title: 'Produit',
                placeholder: 'required',
                binding: { property: 'itemname', source: this.currentItem }
            });
            txt_prod_name.render();
            var el2 = $('<div class="col-lg-4 mt30" style="padding-right:0"></div>').appendTo(this.$el.find('.content'));
            var txt2 = new lib.Controls.TextEdit({
                el: el2,
                editmode: lib.Controls.EditMode.Edit,
                required: true,
                title: 'Prix',
                binding: { property: 'currPrice.formatted', source: this.currentItem }
            });
            txt2.render();
            var el2 = $('<div class="col-lg-12 mt30 no-padding-l-r"></div>').appendTo(this.$el.find('.content'));
            (new lib.Controls.TextArea({
                el: el2,
                editmode: lib.Controls.EditMode.Edit,
                required: false,
                title: 'Description',
                rows: 10,
                binding: { property: 'itemdescr', source: this.currentItem }
            })).render();
        };
        ProductProfileEntry.prototype.set_amazon_binding = function () {
            var _this = this;
            var check = this.$el.find('.checkbox-x input');
            check.iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio'
            });
            if (this.currentItem['amazon']() === 1) {
                $(check).iCheck('check');
            }
            $(check).on('ifChecked', function (e) {
                _this.currentItem['amazon'](1);
            });
            $(check).on('ifUnchecked', function (e) {
                _this.currentItem['amazon'](0);
            });
        };
        ProductProfileEntry.prototype.init_events = function () {
            var _this = this;
            this.$el.find('.btn-edit').click(function () {
                _this.$el.find('.control-readonly').addClass('hidden');
                _this.$el.find('.control-editable').removeClass('hidden');
            });
            this.$el.find('.btn-save').click(function (e) {
                _this.options.loader.removeClass('hidden');
                var reload = _this.currentItem.entityAspect.entityState === breeze.EntityState.Added;
                _this.datasource.save().finally(function () {
                    _this.options.loader.addClass('hidden');
                    _this.$el.find('.control-readonly').removeClass('hidden');
                    _this.$el.find('.control-editable').addClass('hidden');
                    if (reload) {
                        _this.owner.reload(false);
                    }
                });
            });
            this.$el.find('.btn-cancel').click(function () {
                _this.owner.reload(true).then(function (ok) {
                    if (ok) {
                        _this.$el.find('.control-readonly').removeClass('hidden');
                        _this.$el.find('.control-editable').addClass('hidden');
                    }
                });
            });
        };
        return ProductProfileEntry;
    })(lib.Views.BaseView);
    var ProductDetails = (function (_super) {
        __extends(ProductDetails, _super);
        function ProductDetails(options) {
            _super.call(this, options);
        }
        ProductDetails.prototype.get_tblSettings = function () {
            var settings = {
                columns: [
                    {
                        title: 'title', data: 'item_detail_title'
                    },
                    {
                        title: 'value', data: 'item_detail_value'
                    }
                ],
                data: this.options.datasource.dataManager.getEntities('item_detail')
            };
            return settings;
        };
        return ProductDetails;
    })(lib.Views.ArrayEditable);
});
//# sourceMappingURL=C:/umarket/umarket.web.ui/js/ts_admin/ts_admin_explorer.js.map