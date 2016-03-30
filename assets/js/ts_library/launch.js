/// <reference path="jx.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', 'react-dom', './jx'], function (require, exports, React, ReactDOM, jx) {
    function launch_test(root) {
        ReactDOM.render(React.createElement(DataExplorer, {"serviceName": "item-srv", "resourceName": "item"}), root[0]);
    }
    exports.launch_test = launch_test;
    var DataExplorer = (function (_super) {
        __extends(DataExplorer, _super);
        function DataExplorer() {
            _super.apply(this, arguments);
        }
        DataExplorer.prototype.get_table_settings = function () {
            return {
                serverSide: true,
                columns: [
                    { title: 'product name', data: 'itemname' }
                ]
            };
        };
        DataExplorer.prototype.get_sql = function () {
            return 'select * from item';
        };
        DataExplorer.prototype.get_orderBy = function () {
            return 'itemname';
        };
        return DataExplorer;
    })(jx.JXDataExplorer);
});
//# sourceMappingURL=C:/umarket/umarket.web.ui/js/ts_library/launch.js.map