/// <reference path="../../typings/jquery.datatables/jquery.datatables.d.ts" />
/// <reference path="../../typings/knockout/knockout.d.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', 'react-dom'], function (require, exports, React, ReactDOM) {
    var Constants;
    (function (Constants) {
        var ExplorerAction;
        (function (ExplorerAction) {
            ExplorerAction.EditRow = 'edit-row';
            ExplorerAction.AddRow = 'add-row';
            ExplorerAction.SaveRow = 'save-row';
            ExplorerAction.CancelEdit = 'cancel-edit';
            ExplorerAction.ReturnEdit = 'return-edit';
            ExplorerAction.openRecord = 'open-record';
            ExplorerAction.deleteRecord = 'record-deleted';
        })(ExplorerAction = Constants.ExplorerAction || (Constants.ExplorerAction = {}));
    })(Constants = exports.Constants || (exports.Constants = {}));
    var Base;
    (function (Base) {
        var Component = (function (_super) {
            __extends(Component, _super);
            function Component(props) {
                this.props = props;
                this.state = this.initialize_state();
                _super.call(this, props);
            }
            Object.defineProperty(Component.prototype, "$root", {
                get: function () {
                    return $(ReactDOM.findDOMNode(this));
                },
                enumerable: true,
                configurable: true
            });
            Component.prototype.initialize_state = function () {
                return {};
            };
            Component.prototype.notify = function (cmd, data) {
                return Q.resolve(true);
            };
            return Component;
        })(React.Component);
        Base.Component = Component;
    })(Base = exports.Base || (exports.Base = {}));
    var Controls;
    (function (Controls) {
        (function (ExplorerActionsStartMode) {
            ExplorerActionsStartMode[ExplorerActionsStartMode["StartAdd"] = 0] = "StartAdd";
            ExplorerActionsStartMode[ExplorerActionsStartMode["StartEdit"] = 1] = "StartEdit";
            ExplorerActionsStartMode[ExplorerActionsStartMode["StartSimpleEntry"] = 2] = "StartSimpleEntry";
        })(Controls.ExplorerActionsStartMode || (Controls.ExplorerActionsStartMode = {}));
        var ExplorerActionsStartMode = Controls.ExplorerActionsStartMode;
        (function (ExplorerAction) {
            ExplorerAction[ExplorerAction["Add"] = 0] = "Add";
            ExplorerAction[ExplorerAction["Edit"] = 1] = "Edit";
            ExplorerAction[ExplorerAction["Save"] = 2] = "Save";
            ExplorerAction[ExplorerAction["Cancel"] = 3] = "Cancel";
            ExplorerAction[ExplorerAction["Return"] = 4] = "Return";
        })(Controls.ExplorerAction || (Controls.ExplorerAction = {}));
        var ExplorerAction = Controls.ExplorerAction;
        var ExplorerActions = (function (_super) {
            __extends(ExplorerActions, _super);
            function ExplorerActions(props) {
                _super.call(this, props);
            }
            ExplorerActions.prototype.render = function () {
                var html = React.createElement("div", {"className": "rw"}, React.createElement("div", {"className": "table-actions row mt10 mb30", "style": { paddingLeft: '20px', paddingRight: '20px' }}, React.createElement("button", {"type": "button", "className": "pull-left btn btn-warning btn-outline btn-rw btn-sm btn-return hidden mr10"}, React.createElement("i", {"className": "fa fa-reply"}, React.createElement("span", {"data-localize": "str_return"}, " return "))), React.createElement("i", {"className": "fa fa-spin fa-spinner text-primary fa-2x spinner hidden pull-left"}), React.createElement("button", {"type": "button", "className": "pull-left btn btn-primary btn-outline btn-rw btn-sm btn-add hidden"}, React.createElement("i", {"className": "fa fa-plus"}, React.createElement("span", {"data-localize": "str_add"}, " add "))), React.createElement("button", {"type": "button", "className": "btn btn-warning btn-rw btn-outline pull-right btn-sm btn-cancel hidden ml10"}, React.createElement("i", {"className": "fa fa-times"}, React.createElement("span", {"data-localize": "str_cancel"}, " cancel "))), React.createElement("button", {"type": "button", "className": "pull-right btn btn-info btn-outline btn-rw btn-sm btn-save hidden ml10"}, React.createElement("i", {"className": "fa fa-check"}, React.createElement("span", {"data-loxalize": "str_save"}, " save "))), React.createElement("button", {"type": "button", "className": "pull-right btn btn-primary btn-outline btn-rw btn-sm btn-edit hidden ml10"}, React.createElement("i", {"className": "fa fa-edit"}, React.createElement("span", {"data-localize": "str_edit"}, " edit ")))));
                return html;
            };
            ExplorerActions.prototype.componentDidMount = function () {
                this.btnAdd = this.$root.find('.btn-add');
                this.btnEdit = this.$root.find('.btn-edit');
                this.btnSave = this.$root.find('.btn-save');
                this.btnCancel = this.$root.find('.btn-cancel');
                this.btnReturn = this.$root.find('.btn-return');
                this.assign_handlers();
                this.set_visibility();
            };
            ExplorerActions.prototype.assign_handlers = function () {
                var _this = this;
                this.btnAdd.click(function () {
                    _this.exec_action(ExplorerAction.Add);
                });
                this.btnEdit.click(function () {
                    _this.exec_action(ExplorerAction.Edit);
                });
                this.btnSave.click(function () {
                    _this.exec_action(ExplorerAction.Save);
                });
                this.btnCancel.click(function () {
                    _this.exec_action(ExplorerAction.Cancel);
                });
                this.btnReturn.click(function () {
                    _this.exec_action(ExplorerAction.Return);
                });
            };
            ExplorerActions.prototype.exec_action = function (action, notify) {
                var _this = this;
                if (notify === void 0) { notify = true; }
                switch (action) {
                    case ExplorerAction.Add:
                        {
                            this.btnAdd.addClass('hidden');
                            this.btnEdit.addClass('hidden');
                            this.btnReturn.removeClass('hidden');
                            this.btnSave.removeClass('hidden');
                            this.btnCancel.removeClass('hidden');
                            if (notify) {
                                this.props.owner.notify(Constants.ExplorerAction.AddRow);
                            }
                        }
                        break;
                    case ExplorerAction.Edit:
                        {
                            this.btnEdit.addClass('hidden');
                            this.btnSave.removeClass('hidden');
                            this.btnCancel.removeClass('hidden');
                            if (this.props.startMode === ExplorerActionsStartMode.StartEdit) {
                                this.btnAdd.removeClass('hidden');
                            }
                            if (notify) {
                                this.props.owner.notify(Constants.ExplorerAction.EditRow);
                            }
                        }
                        break;
                    case ExplorerAction.Save:
                        {
                            var promise = Q.resolve(true);
                            if (notify) {
                                promise = this.props.owner.notify(Constants.ExplorerAction.SaveRow);
                            }
                            promise.then(function () {
                                _this.btnSave.addClass('hidden');
                                _this.btnCancel.addClass('hidden');
                                _this.btnReturn.addClass('hidden');
                                if (_this.props.startMode === ExplorerActionsStartMode.StartAdd) {
                                    _this.btnAdd.removeClass('hidden');
                                    _this.btnEdit.addClass('hidden');
                                }
                                if (_this.props.startMode === ExplorerActionsStartMode.StartEdit) {
                                    _this.btnAdd.addClass('hidden');
                                    _this.btnEdit.removeClass('hidden');
                                }
                            });
                        }
                        break;
                    case ExplorerAction.Return:
                        {
                            var promise = Q.resolve(true);
                            if (notify) {
                                promise = this.props.owner.notify(Constants.ExplorerAction.ReturnEdit);
                            }
                            promise.then(function (res) {
                                if (res === true) {
                                    _this.btnSave.addClass('hidden');
                                    _this.btnCancel.addClass('hidden');
                                    _this.btnReturn.addClass('hidden');
                                    if (_this.props.startMode === ExplorerActionsStartMode.StartAdd) {
                                        _this.btnAdd.removeClass('hidden');
                                        _this.btnEdit.addClass('hidden');
                                    }
                                    if (_this.props.startMode === ExplorerActionsStartMode.StartEdit) {
                                        _this.btnAdd.addClass('hidden');
                                        _this.btnEdit.removeClass('hidden');
                                    }
                                }
                            });
                        }
                        break;
                    case ExplorerAction.Cancel:
                        {
                            var promise = Q.resolve(true);
                            if (notify) {
                                promise = this.props.owner.notify(Constants.ExplorerAction.CancelEdit);
                            }
                            promise.then(function (res) {
                                if (res === true) {
                                    _this.btnSave.addClass('hidden');
                                    _this.btnCancel.addClass('hidden');
                                    _this.btnReturn.addClass('hidden');
                                    if (_this.props.startMode === ExplorerActionsStartMode.StartAdd) {
                                        _this.btnAdd.removeClass('hidden');
                                        _this.btnEdit.addClass('hidden');
                                    }
                                    if (_this.props.startMode === ExplorerActionsStartMode.StartEdit) {
                                        _this.btnAdd.addClass('hidden');
                                        _this.btnEdit.removeClass('hidden');
                                    }
                                }
                            });
                        }
                        break;
                }
            };
            ExplorerActions.prototype.set_visibility = function () {
                switch (this.props.startMode) {
                    case ExplorerActionsStartMode.StartAdd:
                        {
                            this.btnAdd.removeClass('hidden');
                        }
                        break;
                    case ExplorerActionsStartMode.StartEdit:
                        {
                            this.btnEdit.removeClass('hidden');
                        }
                        break;
                    case ExplorerActionsStartMode.StartSimpleEntry:
                        {
                            this.btnSave.removeClass('hidden');
                            this.btnCancel.removeClass('hidden');
                        }
                        break;
                }
            };
            return ExplorerActions;
        })(Base.Component);
        Controls.ExplorerActions = ExplorerActions;
        var EditCtrl = (function (_super) {
            __extends(EditCtrl, _super);
            function EditCtrl(props) {
                _super.call(this, props);
                this.skip_refresh = false;
                this.state.refresh = false;
            }
            Object.defineProperty(EditCtrl.prototype, "ctrl", {
                get: function () {
                    return this.getcontrol();
                },
                enumerable: true,
                configurable: true
            });
            EditCtrl.prototype.getcontrol = function () {
                return null;
            };
            EditCtrl.prototype.update_datacontext = function () {
                if (this.props.datacontext && this.props.property) {
                    this.skip_refresh = true;
                    try {
                        var val = this.ctrl.val();
                        alert(val);
                        this.props.datacontext[this.props.property](this.ctrl.val());
                    }
                    finally {
                        this.skip_refresh = false;
                    }
                }
            };
            EditCtrl.prototype.bind_control = function () {
                var _this = this;
                if (this.props.datacontext && this.props.property) {
                    if (this.subscribe_token) {
                        this.props.datacontext.entityAspect.propertyChanged.unsubscribe(this.subscribe_token);
                    }
                    this.subscribe_token = this.props.datacontext.entityAspect.propertyChanged.subscribe(function (data) {
                        if (data.propertyName === _this.props.property) {
                            if (!_this.skip_refresh) {
                                _this.setState({
                                    refresh: true
                                });
                            }
                        }
                    });
                }
            };
            EditCtrl.prototype.getValue = function () {
                if (this.props.datacontext && this.props.property) {
                    return this.props.datacontext[this.props.property]();
                }
                return null;
            };
            EditCtrl.prototype.componentDidMount = function () {
                this.bind_control();
            };
            EditCtrl.prototype.componentDidUpdate = function () {
                this.bind_control();
            };
            return EditCtrl;
        })(Base.Component);
        Controls.EditCtrl = EditCtrl;
        var TextInput = (function (_super) {
            __extends(TextInput, _super);
            function TextInput() {
                _super.apply(this, arguments);
            }
            TextInput.prototype.getcontrol = function () {
                return this.$root.find('input');
            };
            TextInput.prototype.render = function () {
                var that = this;
                var html = React.createElement("div", {"className": "form-group"}, React.createElement("label", {"className": "control-label"}, this.props.title, React.createElement("span", {"className": "required"}, this.props.required ? '*' : '')), React.createElement("input", {"className": "form-control", "name": this.props.property, "type": "text", "onKeyUp": function () { that.update_datacontext(); }, "onPaste": function () { that.update_datacontext(); }, "placeholder": this.props.placeholder}));
                return html;
            };
            return TextInput;
        })(EditCtrl);
        Controls.TextInput = TextInput;
        var TextInputArea = (function (_super) {
            __extends(TextInputArea, _super);
            function TextInputArea(props) {
                _super.call(this, props);
            }
            TextInputArea.prototype.getcontrol = function () {
                return this.$root.find('textarea');
            };
            TextInputArea.prototype.render = function () {
                var that = this;
                var html = React.createElement("div", {"className": "form-group"}, React.createElement("label", {"className": "control-label"}, this.props.title, React.createElement("span", {"className": "required"}, this.props.required ? '*' : '')), React.createElement("textarea", {"className": "form-control", "name": this.props.property, "onKeyUp": function () { that.update_datacontext(); }, "onPaste": function () { that.update_datacontext(); }, "rows": this.props.rows ? this.props.rows : 4, "placeholder": this.props.placeholder}));
                return html;
            };
            return TextInputArea;
        })(EditCtrl);
        Controls.TextInputArea = TextInputArea;
    })(Controls = exports.Controls || (exports.Controls = {}));
    var Layout;
    (function (Layout) {
        var PanelBox = (function (_super) {
            __extends(PanelBox, _super);
            function PanelBox(props) {
                this.props = props;
                _super.call(this, props);
            }
            PanelBox.prototype.render = function () {
                return React.createElement("div", {"className": "ibox float-e-margins"}, React.createElement("div", {"className": "ibox-title"}, React.createElement("h5", {"style": { "font-size": "23px", "font-weight": "300" }}, this.props.title)), React.createElement("div", {"className": "ibox-content"}, React.createElement("hr", null), React.createElement("div", {"className": "row"}, this.props.children)));
            };
            PanelBox.prototype.componentDidMount = function () {
                var root = ReactDOM.findDOMNode(this);
                if (!this.props.title) {
                    $(root).find('.ibox-title').addClass('hidden');
                }
            };
            return PanelBox;
        })(Base.Component);
        Layout.PanelBox = PanelBox;
    })(Layout = exports.Layout || (exports.Layout = {}));
    var Views;
    (function (Views) {
        var DataTable = (function (_super) {
            __extends(DataTable, _super);
            function DataTable(props) {
                _super.call(this, props);
            }
            DataTable.prototype.render = function () {
                var html = React.createElement("div", {"className": "datalist-root", "style": { borderWidth: '0' }}, React.createElement("div", {"className": "col-lg-12 datalist-content"}, React.createElement("table", {"className": "table table-hover datalist-table", "style": { width: '100%' }})));
                return html;
            };
            DataTable.prototype.get_defaultSettings = function () {
                var _this = this;
                return {
                    paging: true,
                    destroy: true,
                    info: true,
                    pageLength: 10,
                    serverSide: true,
                    ordering: false,
                    data: [],
                    createdRow: function (row, data, dataIndex) {
                        _this.created_row(row, data, dataIndex);
                    },
                    initComplete: function (settings, json) {
                        _this.init_completed(settings, json);
                    }
                };
            };
            DataTable.prototype.created_row = function (row, data, dataIndex) {
                var _this = this;
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
                        var btn_edit = $.zc('button[type="button"].pull-right.grid-row-action.btn.btn-default.btn-sm.btn-edit-row.opacity_5>i.fa.fa-search');
                        td_row.append($(btn_edit));
                        var that = this;
                        $(btn_edit).click(function () {
                            _this.props.owner.notify(Constants.ExplorerAction.openRecord, data);
                        });
                    }
                }
            };
            DataTable.prototype.componentDidMount = function () {
                this.table = this.$root.find('table');
                this.initDataTable();
            };
            DataTable.prototype.getTableSettings = function () {
                return this.props.tblSettings;
            };
            DataTable.prototype.initDataTable = function () {
                var settings = this.init_settings();
                if (!settings.columns) {
                    settings.columns = [];
                }
                this.init_columns(settings.columns);
                if (this.datatable) {
                    this.datatable.destroy();
                }
                this.datatable = this.table.DataTable(settings);
            };
            DataTable.prototype.init_settings = function () {
                var _defaults = this.get_defaultSettings();
                var _options = this.getTableSettings();
                var settings = _.extend(_defaults, _options);
                if (settings.serverSide) {
                    _.extend(settings, this.ajax_settings());
                }
                return settings;
            };
            DataTable.prototype.ajax_settings = function () {
                var _this = this;
                var that = this;
                var _settings = {};
                $.fn.dataTable.pipeline = function () {
                    return function (request, drawCallBack, settings) {
                        request.sql = _this.get_sql();
                        request.total_count_sql = null;
                        request.returnedColums = [];
                        if (_this.get_orderBy) {
                            request.order_by_offset = ' ORDER BY {0} LIMIT {1} OFFSET {2} '.format(_this.get_orderBy(), request.length, request.start);
                        }
                        var params = {
                            request: request
                        };
                        if (_this.props.spinner) {
                            _this.props.spinner.removeClass('hidden');
                        }
                        var _url = utils.url('{0}/exec_sql_incr'.format(_this.props.serviceName));
                        settings.jqXHR = $.ajax({
                            "url": _url,
                            "type": 'POST',
                            contentType: "application/json; charset=utf-8",
                            "data": JSON.stringify(request),
                            "dataType": "json",
                            "cache": false,
                            "success": function (result) {
                                drawCallBack(result);
                                if (that.props.spinner) {
                                    that.props.spinner.addClass('hidden');
                                }
                            },
                            "error": function (err) {
                                if (that.props.spinner) {
                                    _this.props.spinner.addClass('hidden');
                                }
                            }
                        });
                    };
                };
                $.extend(_settings, {
                    "ajax": $.fn.dataTable.pipeline({
                        "url": '/stamp/Usr/FetchSql',
                        pages: 5,
                    })
                });
                return _settings;
            };
            DataTable.prototype.get_sql = function () {
                if (this.props.get_sql) {
                    return this.props.get_sql();
                }
                return null;
            };
            DataTable.prototype.get_orderBy = function () {
                if (this.props.get_orderBy) {
                    return this.props.get_orderBy();
                }
                return null;
            };
            DataTable.prototype.init_columns = function (columns) {
                if (this.props.counting) {
                    columns.unshift({
                        data: null, title: '', width: '5px'
                    });
                    var allow_edit = this.props.allow_edit;
                    var allow_delete = this.props.allow_delete;
                    if (allow_edit || allow_delete) {
                        columns.push({
                            data: null, title: '', width: '50px'
                        });
                    }
                }
            };
            DataTable.prototype.init_completed = function (settings, json) {
                if (this.props.counting) {
                    this.$root.find('.datalist-table th').first().css('width', '5px');
                }
                var allow_edit = this.props.allow_edit;
                var allow_delete = this.props.allow_delete;
                if (allow_delete || allow_edit) {
                    this.$root.find('.datalist-table th').last().css('width', '50px');
                }
            };
            return DataTable;
        })(Base.Component);
        Views.DataTable = DataTable;
        var Explorer = (function (_super) {
            __extends(Explorer, _super);
            function Explorer(props) {
                _super.call(this, props);
            }
            Object.defineProperty(Explorer.prototype, "rowEditing", {
                get: function () {
                    return this.currentRowID != undefined && this.currentRowID != null;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Explorer.prototype, "datasource", {
                get: function () {
                    if (!this._ds) {
                        this._ds = this.get_datasource();
                    }
                    return this._ds;
                },
                enumerable: true,
                configurable: true
            });
            Explorer.prototype.get_datasource = function () {
                return new Data.Datasource({
                    serviceName: utils.url(this.getServiceName()),
                    askMetadata: true,
                });
            };
            Object.defineProperty(Explorer.prototype, "actions", {
                get: function () {
                    return this.refs["actions"];
                },
                enumerable: true,
                configurable: true
            });
            Explorer.prototype.getServiceName = function () {
                return this.props.serviceName;
            };
            Explorer.prototype.getResourceName = function () {
                return this.props.resourceName;
            };
            Explorer.prototype.getDataTableProps = function () {
                var props = this.props.dataTableProps;
                return props;
            };
            Explorer.prototype.render = function () {
                var _actions_props = {
                    owner: this,
                    startMode: Controls.ExplorerActionsStartMode.StartAdd
                };
                var _tblProps = this.getDataTableProps();
                _tblProps.owner = this;
                var html = React.createElement("div", {"className": "rlw"}, React.createElement("div", {"className": "explorer-actions"}, React.createElement(Controls.ExplorerActions, React.__spread({"ref": "actions"}, _actions_props))), React.createElement("div", {"className": "explorer-datalist mt20"}, React.createElement(DataTable, React.__spread({}, _tblProps))), React.createElement("div", {"className": "explorer-switch hidden mt20"}));
                return html;
            };
            Explorer.prototype.get_dataEntry = function (ID) {
                var props = {
                    owner: this,
                    AutoLoadID: ID
                };
                return React.createElement(DataEntry, React.__spread({}, props));
            };
            Explorer.prototype.notify = function (cmd, data) {
                var that = this;
                switch (cmd) {
                    case Constants.ExplorerAction.AddRow: {
                        return Q.resolve(true);
                    }
                    case Constants.ExplorerAction.openRecord: {
                        this.currentRowID = _.result(data, 'id');
                        this.display_dataentry();
                        this.actions.exec_action(Controls.ExplorerAction.Add, false);
                        this.$root.find('.explorer-actions .btn-save').addClass('hidden');
                        this.$root.find('.explorer-actions .btn-cancel').addClass('hidden');
                        return Q.resolve(true);
                    }
                    case Constants.ExplorerAction.EditRow:
                        {
                            this.$root.find('.explorer-datalist .row-actions').removeClass('hidden');
                        }
                        break;
                    case Constants.ExplorerAction.ReturnEdit:
                    case Constants.ExplorerAction.CancelEdit: {
                        var d = Q.defer();
                        if (this.rowEditing) {
                            this.currentRowID = undefined;
                            this.display_datalist();
                            this.actions.exec_action(Controls.ExplorerAction.Return, false);
                        }
                        return d.promise;
                    }
                }
                return Q.resolve(true);
            };
            Explorer.prototype.display_datalist = function () {
                this.$root.find('.explorer-switch').removeClass('animated fadeInUp').addClass('hidden');
                this.$root.find('.explorer-datalist').addClass('animated fadeIn').removeClass('hidden');
            };
            Explorer.prototype.display_dataentry = function () {
                this.$root.find('.explorer-datalist').addClass('hidden');
                if (this.dataEntry) {
                    ReactDOM.unmountComponentAtNode(this.$root.find('.explorer-switch')[0]);
                    this.dataEntry = undefined;
                }
                ReactDOM.render(this.get_dataEntry(this.currentRowID), this.$root.find('.explorer-switch')[0]);
                this.$root.find('.explorer-switch').addClass('animated fadeInUp').removeClass('hidden');
            };
            return Explorer;
        })(Base.Component);
        Views.Explorer = Explorer;
        var DataEntry = (function (_super) {
            __extends(DataEntry, _super);
            function DataEntry(props) {
                _super.call(this, props);
                this.props.owner.dataEntry = this;
            }
            Object.defineProperty(DataEntry.prototype, "datasource", {
                get: function () {
                    if (!this._ds) {
                        this._ds = new Data.Datasource({
                            serviceName: this.get_serviceName(),
                            askMetadata: true
                        });
                    }
                    return this._ds;
                },
                enumerable: true,
                configurable: true
            });
            DataEntry.prototype.get_datasource = function () {
                return null;
            };
            DataEntry.prototype.get_resourceName = function () {
                return null;
            };
            DataEntry.prototype.get_serviceName = function () {
                return null;
            };
            DataEntry.prototype.render = function () {
                var html = React.createElement("div", {"className": "cta mt30 col-lg-12"}, React.createElement("div", {"className": "content-entry col-lg-12 no-padding-l-r"}, React.createElement("h3", null, "Data Entry")));
                return html;
            };
            DataEntry.prototype.ask_loose_changes = function () {
                var d = Q.defer();
                swal({
                    title: "Are you sure?",
                    text: "You will not be able to recover this imaginary file!",
                    type: "warning",
                    showCancelButton: true,
                    confirmButtonColor: "#DD6B55",
                    confirmButtonText: "Yes, delete it!",
                    cancelButtonText: "No, cancel plx!",
                    closeOnConfirm: false,
                    closeOnCancel: false,
                    animation: false,
                    function: function (confirmed) {
                        if (confirmed) {
                            d.resolve(true);
                        }
                        else {
                            d.reject(false);
                        }
                    }
                });
                return d.promise;
            };
            DataEntry.prototype.cancel = function () {
                var _this = this;
                var d = Q.defer();
                if (this.datasource.dataManager.hasChanges()) {
                    this.ask_loose_changes().then(function (res) {
                        if (res) {
                            _this.datasource.dataManager.rejectChanges();
                            d.resolve(true);
                        }
                        else {
                            d.reject(false);
                        }
                    });
                }
                else {
                    return Q.resolve(true);
                }
                return d.promise;
            };
            return DataEntry;
        })(Base.Component);
        Views.DataEntry = DataEntry;
    })(Views = exports.Views || (exports.Views = {}));
    var Data;
    (function (Data) {
        var Datasource = (function () {
            function Datasource(options) {
                this.askMetadata = true;
                this.options = options;
                this.serviceName = options.serviceName;
                this.askMetadata = options.askMetadata;
            }
            Datasource.prototype.exec_query = function (options) {
                var d = Q.defer();
                var query = breeze.EntityQuery.from(options.method)
                    .withParameters({
                    $method: 'POST',
                    $encoding: 'JSON',
                    $data: {
                        header: 'header',
                        payload: options.payload
                    }
                });
                query = query.using(options.mergeStrategy ? (options.mergeStrategy || breeze.MergeStrategy.OverwriteChanges) : breeze.MergeStrategy.OverwriteChanges);
                this.dataManager.executeQuery(query).then(function (rs) {
                    d.resolve(rs);
                }).catch(function (err) {
                    d.reject(err);
                });
                return d.promise;
            };
            Object.defineProperty(Datasource.prototype, "dataService", {
                get: function () {
                    if (!this._dataservice) {
                        this._dataservice = new breeze.DataService({
                            serviceName: utils.url(this.serviceName)
                        });
                    }
                    return this._dataservice;
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Datasource.prototype, "dataManager", {
                get: function () {
                    if (!this._datamanager) {
                        this._datamanager = new breeze.EntityManager({
                            dataService: this.dataService,
                            validationOptions: new breeze.ValidationOptions({
                                validateOnSave: false,
                                validateOnAttach: false,
                                validateOnQuery: true
                            })
                        });
                    }
                    return this._datamanager;
                },
                enumerable: true,
                configurable: true
            });
            Datasource.prototype.fetch_metadata = function () {
                var _this = this;
                var d = Q.defer();
                this.dataManager.fetchMetadata().then(function () {
                    _this.dataManager.dataService.hasServerMetadata = true;
                    d.resolve(true);
                });
                return d.promise;
            };
            Datasource.prototype.process_call = function (options, isEntity) {
                var _this = this;
                if (isEntity === void 0) { isEntity = true; }
                var str_data = JSON.stringify({
                    operation: options.operation,
                    params: options.params
                });
                var query = breeze.EntityQuery.from(options.operation)
                    .withParameters({
                    $method: 'POST',
                    $encoding: 'JSONP',
                    $data: {
                        operation: options.operation,
                        params: options.params
                    }
                });
                var that = this;
                return this.dataManager.executeQuery(query).then(function (rst) {
                    if (rst.results && rst.results.length > 0) {
                        var qry = query;
                        if (isEntity) {
                            if (qry.resourceName !== 'savechanges') {
                                if (rst.httpResponse != undefined) {
                                    var data = rst.results[0];
                                    var srvName = _this.dataManager.dataService.serviceName;
                                    that.dataManager.importEntities(data);
                                    if (that.dataManager.dataService.serviceName != srvName) {
                                        that.dataManager.dataService.serviceName =
                                            that.dataManager.serviceName = srvName;
                                    }
                                    rst.results = _this.dataManager.getEntities();
                                }
                            }
                        }
                    }
                    else {
                        return rst;
                    }
                    return rst;
                });
            };
            Datasource.prototype.process = function (options, isEntity) {
                var _this = this;
                if (isEntity === void 0) { isEntity = true; }
                if (this.options.askMetadata) {
                    if (!this.dataManager.metadataStore.hasMetadataFor(this.serviceName)) {
                        var d = Q.defer();
                        this.fetch_metadata().then(function () {
                            _this.process_call(options, isEntity).then(function (rs) {
                                d.resolve(rs);
                            });
                        }).catch(function (err) {
                            d.reject(err);
                        });
                        return d.promise;
                    }
                    else {
                        return this.process_call(options, isEntity);
                    }
                }
                else {
                    return this.process_call(options, isEntity);
                }
            };
            Datasource.prototype.fetch = function (qry) {
                return this.process({
                    operation: 'fetch',
                    params: qry.toJSON()
                });
            };
            Datasource.prototype.insert = function (entityName, values) {
                var entity = this.dataManager.metadataStore.getEntityType(entityName);
                entity.setProperties({
                    autoGeneratedKeyType: breeze.AutoGeneratedKeyType.Identity
                });
                var initial_values = _.extend({ ID: _.guid() }, values || {});
                return this.dataManager.createEntity(entity, initial_values);
            };
            Datasource.prototype.save = function () {
                var _this = this;
                var d = Q.defer();
                if (!this.dataManager.hasChanges()) {
                    d.resolve(true);
                }
                this.dataManager.saveChanges().then(function () {
                    _this.dataManager.acceptChanges();
                    d.resolve(true);
                }).catch(function (err) {
                    if (err.hasOwnProperty('entityErrors')) {
                        d.reject(err.entityErrors[0].errorMessage);
                    }
                    else {
                        d.reject(err);
                    }
                });
                return d.promise;
            };
            Datasource.prototype.clone = function () {
                var that = this;
                var ds = new Datasource({
                    serviceName: that.serviceName,
                    askMetadata: that.askMetadata
                });
                ds.dataManager.importEntities(this.dataManager.exportEntities(), { mergeStrategy: breeze.MergeStrategy.OverwriteChanges });
                return ds;
            };
            return Datasource;
        })();
        Data.Datasource = Datasource;
    })(Data = exports.Data || (exports.Data = {}));
    var UI;
    (function (UI) {
        var Manager = (function () {
            function Manager() {
            }
            return Manager;
        })();
        UI.Manager = Manager;
    })(UI = exports.UI || (exports.UI = {}));
});
//# sourceMappingURL=C:/umarket/umarket.web.ui/js/library/corebase.js.map