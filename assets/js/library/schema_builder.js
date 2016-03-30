/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="../../typings/react/react-dom.d.ts" />
define(["require", "exports", 'react', 'react-dom', './corebase'], function (require, exports, React, ReactDOM, base) {
    (function (PropertyType) {
        PropertyType[PropertyType["string"] = 0] = "string";
        PropertyType[PropertyType["integer"] = 1] = "integer";
        PropertyType[PropertyType["decimal"] = 2] = "decimal";
        PropertyType[PropertyType["boolean"] = 3] = "boolean";
        PropertyType[PropertyType["datetime"] = 4] = "datetime";
    })(exports.PropertyType || (exports.PropertyType = {}));
    var PropertyType = exports.PropertyType;
    var Builder = (function () {
        function Builder() {
        }
        Object.defineProperty(Builder.prototype, "schema", {
            get: function () {
                return this._schema;
            },
            enumerable: true,
            configurable: true
        });
        Builder.prototype.buildSchema = function (schema, target) {
            this._schema = schema;
            this._target = target;
            this.buildExplorer(target);
        };
        Builder.prototype.getMasterEntity = function () {
            var _this = this;
            var s = _.find(Object.keys(this.schema.entities), function (e) {
                return _this.schema.entities[e].isMaster === true;
            });
            return this.schema.entities[s];
        };
        Object.defineProperty(Builder.prototype, "master", {
            get: function () {
                return this.getMasterEntity();
            },
            enumerable: true,
            configurable: true
        });
        Builder.prototype.buildExplorer = function (target) {
            var master = this.getMasterEntity();
            var props = this.getExplorerProps(master);
            ReactDOM.render(this.getExplorer(props), target[0]);
        };
        Builder.prototype.getExplorerProps = function (ent) {
            var props = {
                resourceName: ent.name,
                serviceName: this.schema.service,
                dataTableProps: {
                    spinner: $('<div class="dummy" ></div>'),
                    counting: true,
                    allow_delete: true,
                    allow_edit: true,
                    serviceName: this.schema.service,
                    resourceName: ent.name,
                    tblSettings: {}
                }
            };
            props.dataTableProps = this.getDatatableProps(ent);
            return props;
        };
        Builder.prototype.getDatatableProps = function (ent) {
            var _this = this;
            var props = {
                spinner: $('<div class="dummy" ></div>'),
                counting: true,
                allow_delete: true,
                allow_edit: true,
                resourceName: ent.name,
                serviceName: this.schema.service,
                get_sql: function () {
                    return _this.getSql(ent);
                },
                get_orderBy: function () {
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
                    var schm = _.find(_this.schema.entities, function (e) {
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
                },
                tblSettings: {
                    data: []
                }
            };
            props.tblSettings.columns = this.getExplorerColumns(ent);
            return props;
        };
        Builder.prototype.getSql = function (ent) {
            var sql = "select * from {0}".format(ent.name);
            return sql;
        };
        Builder.prototype.getExplorerColumns = function (ent) {
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
        Builder.prototype.getExplorer = function (props) {
            return React.createElement(base.Views.Explorer, React.__spread({}, props));
        };
        return Builder;
    })();
    exports.Builder = Builder;
});
//# sourceMappingURL=C:/umarket/umarket.web.ui/js/library/schema_builder.js.map