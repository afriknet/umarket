// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../library/corebase'], function (require, exports, core) {
    var Home = (function (_super) {
        __extends(Home, _super);
        function Home() {
            _super.apply(this, arguments);
        }
        Home.prototype.render = function () {
            return null;
        };
        Home.prototype.componentDidMount = function () {
            $('#page-wrapper').load('/home.html');
        };
        return Home;
    })(core.Base.Component);
    exports.Home = Home;
});
//# sourceMappingURL=C:/umarket/umarket.web.ui/js/app/home.js.map