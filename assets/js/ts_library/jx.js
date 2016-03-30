// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', 'react-dom'], function (require, exports, React, ReactDOM) {
    var JXView = (function (_super) {
        __extends(JXView, _super);
        function JXView(props) {
            this.state = this.initialize_state();
            _super.call(this, props);
        }
        Object.defineProperty(JXView.prototype, "$root", {
            get: function () {
                return $(ReactDOM.findDOMNode(this));
            },
            enumerable: true,
            configurable: true
        });
        JXView.prototype.initialize_state = function () {
            return {};
        };
        JXView.prototype.notify = function (cmd, data) {
            return Q.resolve(true);
        };
        JXView.prototype.render = function () {
            return null;
        };
        JXView.prototype.componentDidMount = function () {
        };
        return JXView;
    })(React.Component);
    exports.JXView = JXView;
    var JXDataTableView = (function (_super) {
        __extends(JXDataTableView, _super);
        function JXDataTableView(props) {
            _super.call(this, props);
        }
        Object.defineProperty(JXDataTableView.prototype, "table", {
            get: function () {
                return this.$root.find('.datalist-table');
            },
            enumerable: true,
            configurable: true
        });
        JXDataTableView.prototype.render = function () {
            var html = React.createElement("div", {"className": "datalist-root", "style": { borderWidth: '0' }}, React.createElement("table", {"className": "table table-hover datalist-table", "style": { width: '100%' }}));
            return html;
        };
        JXDataTableView.prototype.componentDidMount = function () {
            _super.prototype.componentDidMount.call(this);
            this.fill_dataTable();
        };
        JXDataTableView.prototype.fill_dataTable = function () {
            if (this.datatable) {
                this.datatable.destroy();
            }
            var _setting = this.init_settings();
            this.initialize_columns(_setting);
            this.datatable = this.table.DataTable(_setting);
        };
        JXDataTableView.prototype.initialize_columns = function (settings) {
            if (this.props.counting) {
                if (settings.columns) {
                    settings.columns.unshift({
                        data: null, title: '', width: '5px'
                    });
                }
            }
            if (this.props.allow_delete || this.props.allow_edit) {
                settings.columns.push({
                    data: null, title: '', width: '50px'
                });
            }
        };
        JXDataTableView.prototype.get_default_settings = function () {
            var _this = this;
            return {
                paging: true,
                destroy: true,
                info: true,
                pageLength: 10,
                ordering: false,
                createdRow: function (row, data, dataIndex) {
                    _this.created_row(row, data, dataIndex);
                },
                initComplete: function (settings, json) {
                    _this.init_completed(settings, json);
                },
                data: []
            };
        };
        JXDataTableView.prototype.init_settings = function () {
            var settings = this.get_default_settings();
            if (this.props.get_tableSettings) {
                _.extend(settings, this.props.get_tableSettings());
            }
            if (settings.serverSide) {
                _.extend(settings, this.ajax_settings());
            }
            return settings;
        };
        JXDataTableView.prototype.created_row = function (row, data, dataIndex) {
            $(row).data('id', _.result(data, 'id'));
            if (this.props.counting) {
                var td = $(row).find('td').first();
                td.empty();
                td.html((dataIndex + 1).toString());
            }
            var allow_edit = this.props.allow_edit;
            var allow_delete = this.props.allow_delete;
            if (allow_delete || allow_edit) {
                var td = $(row).find('td').last();
                td.empty();
                td.css('width', '15%');
                var td_row = $('<div class="row row-actions" style="margin-right:-5px"></div>').appendTo(td);
                if (allow_delete) {
                    var btn_del = $.zc('button[type="button" style="margin-left:10px"].pull-right.grid-row-action.btn.btn-default.btn-sm.btn-delete-row.opacity_5>i.fa.fa-trash');
                    $(btn_del).css('margin-left', '10px!important');
                    td_row.append($(btn_del));
                }
                if (allow_edit) {
                    var btn_edit = $.zc('button[type="button"].pull-right.grid-row-action.btn.btn-default.btn-sm.btn-edit-row.opacity_5>i.fa.fa-edit');
                    td_row.append($(btn_edit));
                    var that = this;
                    $(btn_edit).click(function () {
                        //this.props.owner.notify(Constants.ExplorerAction.openRecord, data);
                    });
                }
            }
        };
        JXDataTableView.prototype.init_completed = function (settings, json) {
            this.$root = null;
            if (this.props.counting) {
                this.$root.find('.datalist-table th').first().css('width', '5px');
            }
            var allow_edit = this.props.allow_edit;
            var allow_delete = this.props.allow_delete;
            if (allow_delete || allow_edit) {
                this.$root.find('.datalist-table th').last().css('width', '50px');
            }
        };
        JXDataTableView.prototype.get_sql = function () {
            if (this.props.get_sql) {
                return this.props.get_sql();
            }
            return null;
        };
        JXDataTableView.prototype.get_orderBy = function () {
            if (this.props.get_orderBy) {
                return this.props.get_orderBy();
            }
            return null;
        };
        JXDataTableView.prototype.ajax_settings = function () {
            var _this = this;
            var that = this;
            var __settings = {};
            $.fn.dataTable.pipeline = function () {
                return function (request, drawCallBack, settings) {
                    request.sql = _this.get_sql();
                    request.total_count_sql = null;
                    request.returnedColums = [];
                    var __orderBy = _this.get_orderBy();
                    if (__orderBy) {
                        request.order_by_offset = ' ORDER BY {0} LIMIT {1} OFFSET {2} '.format(__orderBy, request.length, request.start);
                    }
                    if (_this.props.spinner) {
                        _this.props.spinner.removeClass('hidden');
                    }
                    var _url = utils.url('{0}/exec_sql_incr'.format(that.props.serviceName));
                    settings.jqXHR = $.ajax({
                        "url": _url,
                        "type": 'POST',
                        contentType: "application/json; charset=utf-8",
                        "data": JSON.stringify(request),
                        "dataType": "json",
                        "cache": false,
                        "success": function (json) {
                            drawCallBack(json.payload);
                            if (that.props.spinner) {
                                that.props.spinner.addClass('hidden');
                            }
                        },
                        "error": function (err) {
                            if (that.props.spinner) {
                                _this.props.spinner.addClass('hidden');
                            }
                            toastr.error(err);
                        }
                    });
                };
            };
            $.extend(__settings, {
                "ajax": $.fn.dataTable.pipeline({})
            });
            return __settings;
        };
        return JXDataTableView;
    })(JXView);
    exports.JXDataTableView = JXDataTableView;
    var JXDataExplorer = (function (_super) {
        __extends(JXDataExplorer, _super);
        function JXDataExplorer(props) {
            _super.call(this, props);
        }
        JXDataExplorer.prototype.render = function () {
            var html = React.createElement("div", {"className": "data-explorer rlw"}, React.createElement("div", {"className": "row"}, React.createElement("div", {"className": "col-lg-12", "style": { paddingTop: '30px' }}, React.createElement("button", {"type": "button", "className": "btn btn-success btn-rw mr10"}, React.createElement("i", {"className": "fa fa-plus mr10"}), " ", React.createElement("span", null, "add"), "  "), React.createElement("button", {"type": "button", "className": "btn btn-warning btn-rw mr10"}, React.createElement("i", {"className": "fa fa-reply mr10"}), " ", React.createElement("span", null, "return "), "  "), React.createElement("button", {"type": "button", "className": "btn btn-warning btn-rw pull-right"}, React.createElement("i", {"className": "fa fa-times mr10"}), " ", React.createElement("span", null, "cancel "), "  "), React.createElement("button", {"type": "button", "className": "btn btn-info btn-rw pull-right mr10"}, React.createElement("i", {"className": "fa fa-edit mr10"}), " ", React.createElement("span", null, "edit "), "  "))), React.createElement("hr", null), React.createElement("div", {"className": "row"}, React.createElement("div", {"className": "col-lg-12"}, this.get_dataTableView())));
            return html;
        };
        JXDataExplorer.prototype.get_table_settings = function () {
            return {};
        };
        JXDataExplorer.prototype.get_dataTableViewProps = function () {
            var _this = this;
            var props = {
                owner: this,
                spinner: this.spinner,
                allow_delete: true,
                allow_edit: true,
                counting: true,
                serverSide: true,
                serviceName: this.props.serviceName,
                resourceName: this.props.resourceName,
                get_sql: function () {
                    return _this.get_sql();
                },
                get_orderBy: function () {
                    return _this.get_orderBy();
                },
                get_tableSettings: function () {
                    return _this.get_table_settings();
                }
            };
            return props;
        };
        JXDataExplorer.prototype.get_sql = function () {
            return null;
        };
        JXDataExplorer.prototype.get_orderBy = function () {
            return null;
        };
        JXDataExplorer.prototype.get_dataTableView = function () {
            var props = this.get_dataTableViewProps();
            return React.createElement(JXDataTableView, React.__spread({}, props));
        };
        return JXDataExplorer;
    })(JXView);
    exports.JXDataExplorer = JXDataExplorer;
});
//# sourceMappingURL=C:/umarket/umarket.web.ui/js/ts_library/jx.js.map