/// <reference path="corebase.tsx" />
/// <reference path="schema_builder.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", './corebase'], function (require, exports, base) {
    var explorerBuilder = (function (_super) {
        __extends(explorerBuilder, _super);
        function explorerBuilder(props) {
            _super.call(this, props);
        }
        explorerBuilder.prototype.getSchema = function () {
            return this.props.schema;
        };
        explorerBuilder.prototype.getDataTableProps = function () {
            var props = _super.prototype.getDataTableProps.call(this);
            if (!props) {
            }
            return props;
        };
        explorerBuilder.prototype.getDefaultDataTableProps = function () {
            return {
                spinner: $('<div class="dummy" ></div>'),
                counting: true,
                allow_delete: true,
                allow_edit: true,
                resourceName: this.props.master.name,
                serviceName: this.props.schema.service,
                get_sql: function () {
                    return null;
                },
                tblSettings: {
                    columns: this.getExplorerColumns(this.props.master),
                    data: []
                }
            };
        };
        explorerBuilder.prototype.getExplorerColumns = function (ent) {
            var properties = _.filter(ent.Properties, function (p) {
                return p.title != undefined && p.title != null;
            });
            var columns = [];
            _.each(properties, function (p) {
                columns.push({
                    title: p.title, data: p.name
                });
            });
            return columns;
        };
        explorerBuilder.prototype.getSql = function (ent) {
            var sql = "select * from {0}".format(this.props.master.name);
            return sql;
        };
        explorerBuilder.prototype.get_orderBy = function () {
            function sort(a, b) {
                if (!a && !b) {
                    return 0;
                }
                if (a && !b) {
                    return 1;
                }
                if (!a && b) {
                    return -1;
                }
                return a - b;
            }
            var schm = _.find(this.props.schema.entities, function (e) {
                return e.isMaster;
            });
            var props = _.filter(schm.Properties, function (p) {
                return p.sortindex != undefined;
            });
            props = props.sort(function (a, b) {
                return sort(a.sortindex, b.sortindex);
            });
            var order_by = undefined;
            _.each(props, function (p) {
                if (!order_by) {
                    order_by = p.name;
                }
                else {
                    order_by += ',' + p.name;
                }
            });
            return order_by;
        };
        return explorerBuilder;
    })(base.Views.Explorer);
    exports.explorerBuilder = explorerBuilder;
});
//# sourceMappingURL=C:/umarket/umarket.web.ui/js/library/explorerbuild.js.map