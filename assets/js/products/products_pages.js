/// <reference path="../library/utils.ts" />
/// <reference path="../library/corebase.tsx" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', '../library/corebase'], function (require, exports, React, core) {
    var ProductsPage = (function (_super) {
        __extends(ProductsPage, _super);
        function ProductsPage() {
            _super.apply(this, arguments);
        }
        ProductsPage.prototype.render = function () {
            return React.createElement("div", {"className": "page-view hidden"});
        };
        ProductsPage.prototype.componentDidMount = function () {
            $('#page-wrapper').load('/products.html');
        };
        return ProductsPage;
    })(core.Base.Component);
    exports.ProductsPage = ProductsPage;
});
//# sourceMappingURL=C:/umarket/umarket.web.ui/js/products/products_pages.js.map