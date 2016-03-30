/// <reference path="../ts_library/ts_types.ts" />
/// <reference path="../ts_library/ts_lib.ts" />
/// <reference path="../jx/pagination.tsx" />
/// <reference path="../jx/pagination.tsx" />
/// <reference path="../jx/jx_brg.tsx" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../ts_library/ts_lib', '../jx/jx_brg'], function (require, exports, lib, jx) {
    var pagingactions = {};
    var ProductsExplorer = (function (_super) {
        __extends(ProductsExplorer, _super);
        function ProductsExplorer(options) {
            _.extend(this, {
                template: false
            });
            _super.call(this, options);
        }
        ProductsExplorer.prototype.onRender = function () {
            var _this = this;
            $('#page-wrapper').empty();
            $('#page-wrapper').load('/master_page.html', function () {
                _this.load_view();
            });
        };
        ProductsExplorer.prototype.load_view = function () {
            var _this = this;
            var that = this;
            var root = $('#page-wrapper .products .content-page');
            root.load('/products.html', function (rs, tx, xml) {
                $('.content-page').css({ 'background-color': 'transparent', 'padding': '0' });
                $('.content.products > .container').css('padding', '0');
                _this.request_products();
            });
        };
        ProductsExplorer.prototype.build_request_params = function () {
            if (!this.pagingProps) {
                this.pagingProps = {
                    activepage: 1,
                    owner: this,
                    pagesize: 5,
                    pagestart: 1,
                    totalcount: 0,
                };
            }
            var info = {
                limit: this.pagingProps.pagesize,
                offset: (this.pagingProps.activepage * this.pagingProps.pagesize) - this.pagingProps.pagesize
            };
            if (!utils.is_null_or_empty(this.options.catname)) {
                info.cats = [this.options.catname];
            }
            return info;
        };
        ProductsExplorer.prototype.request_products = function () {
            var _this = this;
            var ds = new lib.Data.Datasource({
                askMetadata: true,
                serviceName: 'item-srv'
            });
            ds.process({
                operation: 'request_products',
                params: this.build_request_params()
            }, false).then(function (rst) {
                var payload = rst.results[0].payload;
                ds.dataManager.importEntities(payload.data);
                _this.pagingProps.totalcount = payload.total;
                _this.fill_with_products(ds);
                if (!_this.specs_built) {
                    _this.specs_built = true;
                    ds.fetch_localDB().then(function (db) {
                        _this.build_categories(ds, db, _this.options.catname);
                        _this.init_price_slider(ds);
                        _this.build_specs(ds, db, $('.widget-color'));
                        _this.mount_pagination();
                        utils.adjust();
                    });
                }
                else {
                    _this.init_price_slider(ds);
                    _this.mount_pagination();
                    utils.adjust();
                }
            });
        };
        ProductsExplorer.prototype.mount_pagination = function () {
            jx.Api.mount_pagination(this.pagingProps, $('.pagination-wrapper'));
        };
        ProductsExplorer.prototype.fill_with_products = function (ds) {
            var root = $('#page-wrapper').find('#products');
            root.empty();
            var data = ds.dataManager.getEntities('item');
            _.each(data, function (d) {
                var __el = $('<div class="col-sm-4 col-xs-6" ></div>').appendTo(root);
                var view = new ProductItem({
                    el: __el,
                    item: d
                });
                view.render();
            });
        };
        ProductsExplorer.prototype.build_categories = function (ds, db, catname) {
            var _this = this;
            if (catname === void 0) { catname = null; }
            var root = $('#page-wrapper').find('.widget-categories .widget-body');
            root.empty();
            var ul = $('<ul class="list-unstyled" id="categories" role="tablist" aria-multiselectable="true"></ul>').appendTo(root);
            var index = 1;
            _.each(db.cats_toArray(), function (c) {
                var name = c.name;
                if (c.display) {
                    name = c.display;
                }
                var li = $('<li class="panel"></li>').appendTo(ul);
                var a = $('<a class="collapsed" role="button" data-toggle="collapse" data-parent="#categories" href="#parent-{0}" aria-expanded="false" aria-controls="parent-{0}"></a>'.format(index)).appendTo(li);
                $(a).html(name);
                var ul_sub = $('<ul id="parent-{0}" class="list-unstyled panel-collapse collapse" role="menu"></ul>'.format(index)).appendTo(li);
                _.each(Object.keys(c.subs), function (key) {
                    var sub = c.subs[key];
                    var sub_name = key;
                    if (sub.display) {
                        sub_name = sub.display;
                    }
                    var li = $('<li data-cat-name="{0}"><a href="#">{0}</a></li>'.format(key)).appendTo(ul_sub);
                    li.find('a').click(function (e) {
                        e.preventDefault();
                        e.stopPropagation();
                        _this.select_cat(li.attr('data-cat-name'));
                    });
                });
                index++;
            });
            if (!utils.is_null_or_empty(catname)) {
                this.select_cat(catname);
            }
        };
        ProductsExplorer.prototype.select_cat = function (catname) {
            var root = $('#page-wrapper').find('.widget-categories .widget-body');
            root.find('.list-unstyled').removeClass('in');
            root.find('li[data-cat-name]').removeClass('active');
            root.find('li[data-cat-name="{0}"]'.format(catname)).addClass('active');
            root.find('li[data-cat-name="{0}"]'.format(catname)).closest('ul').addClass('in');
        };
        ProductsExplorer.prototype.init_price_slider = function (ds) {
            var items = ds.dataManager.getEntities('item');
            var prices = _.map(items, function (itm) {
                var p = itm['itemprice']();
                if (utils.is_null_or_empty(p)) {
                    p = 10;
                }
                return p;
            });
            var __min = _.min(prices);
            var __max = _.max(prices);
            if (__min === __max) {
                __max += __min;
            }
            __min = this.fix_min_max(Math.floor(__min));
            __max = this.fix_min_max(Math.ceil(__max));
            $('#price-slider-range').slider({
                range: true,
                min: __min,
                max: __max,
                values: [__min, __max],
                slide: function (e, ui) {
                    $("#amount").val("$" + ui.values[0]);
                    $("#amount2").val("$" + ui.values[1]);
                }
            });
            $("#amount").val("$" + $("#price-slider-range").slider("values", 0));
            $("#amount2").val("$" + $("#price-slider-range").slider("values", 1));
        };
        ProductsExplorer.prototype.fix_min_max = function (value) {
            var values = [0, 10, 100, 200, 300, 400, 500, 600, 700, 800, 900, 1000, 5000, 10000, 20000, 30000, 50000, 1000000];
            for (var i = 0; i < values.length; i++) {
                var val = values[i];
                if (val >= value) {
                    value = val;
                    break;
                }
            }
            return value;
        };
        ProductsExplorer.prototype.build_specs = function (ds, db, root) {
            var _this = this;
            var specs = _.map(ds.dataManager.getEntities('item_detail'), function (i) { return i['item_detail_title'](); });
            var processed = [];
            _.each(specs, function (s) {
                if (!_.find(processed, function (p) { return p === s; })) {
                    processed.push(s);
                    var spec = _.find(db.specs_toArray(), function (p) {
                        return p.name === s;
                    });
                    _this.build_specs_ui(spec, root);
                }
            });
        };
        ProductsExplorer.prototype.build_specs_ui = function (__spec, root) {
            var widget = $('<div class="widget widget-checkbox"></div>').insertAfter(root);
            var specsui = new specUi({
                el: widget,
                specs: __spec
            });
            specsui.render();
        };
        ProductsExplorer.prototype.notify = function (cmd) {
            switch (cmd.command) {
                case lib.Constants.Commands.pagePrevious: {
                    return null;
                }
                case lib.Constants.Commands.PageNext: {
                    return null;
                }
                case lib.Constants.Commands.Paging: {
                    _.extend(this.pagingProps, cmd.data);
                    this.pagingProps.owner = this;
                    this.request_products();
                    return _super.prototype.notify.call(this, cmd);
                }
                default:
                    return _super.prototype.notify.call(this, cmd);
            }
        };
        return ProductsExplorer;
    })(lib.Views.BaseView);
    exports.ProductsExplorer = ProductsExplorer;
    var ProductItem = (function (_super) {
        __extends(ProductItem, _super);
        function ProductItem(options) {
            _.extend(this, {
                template: false
            });
            _super.call(this, options);
        }
        Object.defineProperty(ProductItem.prototype, "item", {
            get: function () {
                return this.options.item;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(ProductItem.prototype, "images", {
            get: function () {
                return this.options.item['item_imgs']();
            },
            enumerable: true,
            configurable: true
        });
        ProductItem.prototype.retrieve_images = function () {
            var images = [];
            var img1 = _.find(this.images, function (g) {
                return g['ismain']() === 1;
            });
            if (img1) {
                images.push(img1);
            }
            else {
                var img = _.first(this.images);
                if (img) {
                    images.push(img);
                }
                else {
                    images.push({
                        filename: function () {
                            return 'no_image.gif.png';
                        }
                    });
                }
            }
            return images;
        };
        ProductItem.prototype.onRender = function () {
            _super.prototype.onRender.call(this);
            var html = $('#ts-product-item-1').html();
            var tmplate = _.template(html)();
            this.$el.html(tmplate);
            this.$el.find('.product-permalink').attr('href', '/single-product/id={0}'.format(this.item['id']()));
            var images = this.retrieve_images();
            if (images.length > 0) {
                var img = images[0];
                var is_link = _.result(img, 'filetype') === 'link';
                if (is_link) {
                    var a = $(_.result(img, 'filename'));
                    this.$el.find('.product-permalink').after(a);
                }
                else {
                    var img_path = '{0}/images/{1}'.format(utils.server_url, img['filename']());
                    var img_1 = $('<img src="{0}" class="img-responsive img-grid" alt=""/>'.format(img_path));
                    this.$el.find('.product-permalink').after(img_1);
                }
            }
            else {
                this.$el.find('.product-permalink').after($('<div style="width:100%; height:350.583px;" ></div>'));
            }
            this.item['currPrice'] = lib.Extensions.CurrenyObservable(this.item['itemprice']);
            this.html_bind(this.item, 'itemname', this.$el.find('.product-name'));
        };
        ProductItem.prototype.html_bind = function (item, property, root) {
            root.empty();
            var val = _.result(item, property);
            root.html(val);
        };
        ProductItem.prototype.is_html = function (text) {
            var ok = false;
            try {
                ok = $(text).length > 0;
            }
            catch (e) {
            }
            return ok;
        };
        return ProductItem;
    })(lib.Views.BaseView);
    exports.ProductItem = ProductItem;
    var specUi = (function (_super) {
        __extends(specUi, _super);
        function specUi(options) {
            _.extend(this, {
                template: '#ts-widget-checkbox'
            });
            _super.call(this, options);
        }
        specUi.prototype.onRender = function () {
            _super.prototype.onRender.call(this);
            var display = this.options.specs.name;
            if (!utils.is_null_or_empty(this.options.specs.display)) {
                display = this.options.specs.display;
            }
            this.$el.find('.specs-title').html(display);
            this.$el.find('.specs-title').attr('href', '#{0}'.format(this.options.specs.name));
            this.$el.find('.specs-title').attr('aria-controls', '{0}'.format(this.options.specs.name));
            this.$el.find('.widget-content').attr('id', '{0}'.format(this.options.specs.name));
            this.fill_with_values();
        };
        specUi.prototype.fill_with_values = function () {
            var body = this.$el.find('.widget-body');
            _.each(this.options.specs.values, function (val) {
                var check = $('<div class="checkbox"></div>').appendTo(body);
                var value = val.name;
                if (!utils.is_null_or_empty(val.value)) {
                    value = val.value;
                }
                var display = val.name;
                if (!utils.is_null_or_empty(val.display)) {
                    display = val.display;
                }
                check.append($('<input id="check-{0}" type="checkbox" value="{0}">'.format(value)));
                check.append($('<label for="check-{0}">{1}</label>'.format(value, display)));
            });
        };
        return specUi;
    })(lib.Views.BaseView);
});
//# sourceMappingURL=C:/umarket/umarket.web.ui/js/ts_admin/ts_product_explorer.js.map