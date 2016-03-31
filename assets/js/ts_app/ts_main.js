/// <reference path="../ts_library/ts_types.ts" />
/// <reference path="../ts_library/ts_menus.ts" />
/// <reference path="../ts_library/ts_lib.ts" />
/// <reference path="../ts_admin/ts_admin.ts" />
/// <reference path="../ts_admin/ts_product_explorer.ts" />
/// <reference path="../ts_sign_in.ts" />
/// <reference path="../ts_admin/ts_admin_explorer.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../ts_library/ts_lib', '../ts_admin/ts_product_explorer', '../ts_library/ts_menus', '../ts_sign_in', '../ts_admin/ts_admin_explorer'], function (require, exports, lib, products, menus, sign, Admin) {
    var MainView = (function (_super) {
        __extends(MainView, _super);
        function MainView() {
            _.extend(this, {
                template: false
            });
            _super.call(this, null);
        }
        MainView.prototype.onRender = function () {
            this.init_routes();
        };
        MainView.prototype.init_routes = function () {
            var routes = this.get_routes();
            _.each(routes, function (r) {
                var url = r.url;
                page(url, function (ctx) {
                    if (r.mount) {
                        r.mount(ctx);
                    }
                });
            });
            page.start();
        };
        MainView.prototype.get_routes = function () {
            var _this = this;
            var routes = [
                {
                    url: '/', mount: function (ops) {
                        _this.load_homePage();
                    }
                },
                {
                    url: '/index.html', mount: function (ops) {
                        _this.load_homePage();
                    }
                },
                {
                    url: '/admin', mount: function (ops) {
                        (new Admin.AdminExplorerView()).render();
                    }
                },
                {
                    url: '/products/:catid', mount: function (ops) {
                        var catid = ops.params.catid;
                        if (!utils.is_null_or_empty(catid)) {
                            catid = parseInt(catid);
                        }
                        switch (catid) {
                            case 1:
                                {
                                    catid = "fashion-men";
                                }
                                break;
                            case 2:
                                {
                                    catid = "fashion-women";
                                }
                                break;
                            case 3:
                                {
                                    catid = "accessories";
                                }
                                break;
                        }
                        (new products.ProductsExplorer({
                            catname: catid
                        })).render();
                    }
                },
                {
                    url: '/products', mount: function (ops) {
                        (new products.ProductsExplorer({
                            catname: null
                        })).render();
                    }
                },
                {
                    url: '/signin', mount: function (ops) {
                        (new sign.SignInView(ops)).render();
                    }
                },
                {
                    url: '*', mount: function (ops) {
                    }
                }
            ];
            return routes;
        };
        MainView.prototype.load_homePage = function () {
            var that = this;
            $('#page-wrapper').load('/home.html', function () {
            });
        };
        MainView.prototype.load_menus = function (__db) {
            var top = $('.navbar-fixed-top');
            var mn = new menus.Menus({
                el: top,
                db: __db,
                onTitle: function (li, cat) {
                }
            });
            mn.render();
        };
        return MainView;
    })(lib.Views.BaseView);
    exports.MainView = MainView;
});
//# sourceMappingURL=C:/umarket/umarket.web.ui/js/ts_app/ts_main.js.map