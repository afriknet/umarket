/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="register.tsx" />
/// <reference path="page_notfound.tsx" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', 'react-dom', '../library/corebase', '../products/products_pages', './home', './admin'], function (require, exports, React, ReactDOM, corebase, products, Home, Admin) {
    var Main = (function (_super) {
        __extends(Main, _super);
        function Main(props) {
            this.routes = this.get_routes();
            _super.call(this, props);
        }
        Main.prototype.render = function () {
            return React.createElement("div", {"id": "page-wrapper"});
        };
        Main.prototype.componentDidMount = function () {
            this.init_router();
        };
        Main.prototype.init_router = function () {
            var that = this;
            this.routes.forEach(function (r) {
                var url = r.url;
                page(url, function (ctx) {
                    if (r.mount) {
                        r.mount(null);
                    }
                });
            });
            page.start();
        };
        Main.prototype.get_routes = function () {
            var _this = this;
            var routes = [
                {
                    url: '/products', mount: function (p) {
                        var props = {
                            owner: _this,
                        };
                        var $view = $('.products-view');
                        if ($view.length == 0) {
                            $view = $('<div class="products-view" ></div>').appendTo($('body'));
                        }
                        ReactDOM.render(React.createElement(products.ProductsPage, React.__spread({}, props)), $view[0]);
                    }
                },
                {
                    url: '/', mount: function (p) {
                        ReactDOM.render(React.createElement(Home.Home, React.__spread({}, p)), $('#page-wrapper')[0]);
                    }
                },
                {
                    url: '/index.html', mount: function (p) {
                        ReactDOM.render(React.createElement(Home.Home, React.__spread({}, p)), $('#page-wrapper')[0]);
                    }
                },
                {
                    url: '/admin', mount: function (p) {
                        ReactDOM.render(React.createElement(Admin.AdminView, React.__spread({}, p)), $('#page-wrapper')[0]);
                    }
                },
                {
                    url: '*', mount: function (p) {
                    }
                }
            ];
            return routes;
        };
        return Main;
    })(corebase.Base.Component);
    exports.Main = Main;
});
//# sourceMappingURL=C:/umarket/umarket.web.ui/js/app/main.js.map