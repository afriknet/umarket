// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
/// <reference path="../ts_library/ts_lib.ts" />
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', 'react-dom'], function (require, exports, React, ReactDOM) {
    var BaseView = (function (_super) {
        __extends(BaseView, _super);
        function BaseView(props) {
            this.props = props;
            this.state = this.initalize_state();
            _super.call(this, props);
        }
        BaseView.prototype.initalize_state = function () {
            return {};
        };
        Object.defineProperty(BaseView.prototype, "root", {
            get: function () {
                return $(ReactDOM.findDOMNode(this));
            },
            enumerable: true,
            configurable: true
        });
        BaseView.prototype.notify = function (cmd, data) {
            return Q.resolve(true);
        };
        return BaseView;
    })(React.Component);
    exports.BaseView = BaseView;
});
//# sourceMappingURL=C:/umarket/umarket.web.ui/js/jx/base.js.map