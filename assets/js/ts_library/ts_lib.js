/// <reference path="../../typings/toastr/toastr.d.ts" />
/// <reference path="../../typings/backbone/backbone.d.ts" />
/// <reference path="../../typings/backbone/backbone-global.d.ts" />
/// <reference path="../../typings/knockout/knockout.d.ts" />
/// <reference path="../../typings/marionette/marionette.d.ts" />
/// <reference path="ts_types.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", './ts_types'], function (require, exports, Types) {
    _.mixin({
        guid: function () {
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
                var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
                return v.toString(16);
            });
        }
    });
    var __localDB;
    function get_localDB() {
        var d = Q.defer();
        var __url = utils.url('config/data');
        $.ajax({
            url: __url,
            "type": 'GET',
            contentType: "application/json; charset=utf-8",
            "cache": false,
            "success": function (json) {
                var data = json.payload;
                d.resolve(data);
            },
            "error": function (err) {
                toastr.error(err);
                d.reject(err);
            }
        });
        return d.promise;
    }
    var Constants;
    (function (Constants) {
        var Commands;
        (function (Commands) {
            Commands.EditRow = 'edit-row';
            Commands.AddRow = 'add-row';
            Commands.SaveRow = 'save-row';
            Commands.CancelEdit = 'cancel-edit';
            Commands.ReturnEdit = 'return-edit';
            Commands.openRecord = 'open-record';
            Commands.deleteRecord = 'record-deleted';
            Commands.pagePrevious = 'pagePrevious';
            Commands.PageNext = 'PageNext';
            Commands.Paging = 'Paging';
        })(Commands = Constants.Commands || (Constants.Commands = {}));
        (function (DialogResult) {
            DialogResult[DialogResult["Ok"] = 0] = "Ok";
            DialogResult[DialogResult["Yes"] = 1] = "Yes";
            DialogResult[DialogResult["No"] = 2] = "No";
            DialogResult[DialogResult["Cancel"] = 3] = "Cancel";
        })(Constants.DialogResult || (Constants.DialogResult = {}));
        var DialogResult = Constants.DialogResult;
    })(Constants = exports.Constants || (exports.Constants = {}));
    var Views;
    (function (Views) {
        var BaseView = (function (_super) {
            __extends(BaseView, _super);
            function BaseView(options) {
                _super.call(this, options);
            }
            BaseView.prototype.notify = function (cmd) {
                return Q.resolve(true);
            };
            BaseView.prototype.onRender = function () {
                if (_super.prototype.onRender) {
                    _super.prototype.onRender.call(this);
                }
            };
            return BaseView;
        })(Marionette.LayoutView);
        Views.BaseView = BaseView;
        var DataTable = (function (_super) {
            __extends(DataTable, _super);
            function DataTable(options) {
                _.extend(this, {
                    template: '#ts-datalist',
                    ui: {
                        'table': '.table'
                    }
                });
                _super.call(this, options);
            }
            DataTable.prototype.get_default_tblSettings = function () {
                var _this = this;
                return {
                    paging: true,
                    destroy: true,
                    info: false,
                    lengthChange: false,
                    ordering: true,
                    autoWidth: true,
                    createdRow: function (row, data, dataIndex) {
                        _this.created_row(row, data, dataIndex);
                    }
                };
            };
            DataTable.prototype.onRender = function () {
                _super.prototype.onRender.call(this);
                this.table = this.$el.find('.table');
                this.fill_table();
            };
            DataTable.prototype.initialize_settings = function () {
                var _this = this;
                var that = this;
                var _settings = this.get_tblSettings();
                if (_settings) {
                    this.rowCallback = _settings.rowCallback;
                    this.options_initComplete = _settings.initComplete;
                }
                var _options = _.extend(this.get_default_tblSettings(), _settings, {
                    initComplete: function (settings, json) {
                        _this.init_completed(settings, json);
                    }
                });
                _.extend(_options, this.options.tblSettings);
                if (_options.data) {
                    _options.data = _.filter(_options.data, function (d) {
                        return !d.entityAspect.entityState.isDeleted();
                    });
                }
                if (this.options.counting) {
                    _options.columns.unshift({
                        data: null, title: '', width: '5px'
                    });
                }
                var allow_edit = this.options.allow_edit;
                var allow_delete = this.options.allow_delete;
                if (allow_edit || allow_delete) {
                    _options.columns.push({
                        data: null, title: ' ', width: '50px'
                    });
                }
                return _options;
            };
            DataTable.prototype.fill_table = function () {
                var _this = this;
                var _options = this.initialize_settings();
                if (this.datatable != null) {
                    this.datatable.destroy();
                }
                this.datatable = this.table.DataTable(_options);
                this.datatable.on('draw.dt', function () {
                    _this.onTableDraw();
                });
            };
            DataTable.prototype.get_tblSettings = function () {
                return this.options.tblSettings;
            };
            DataTable.prototype.init_completed = function (settings, json) {
                if (this.options.counting) {
                    this.$el.find('.datalist-table th').first().css('width', '5px');
                }
                var allow_edit = this.options.allow_edit;
                var allow_delete = this.options.allow_delete;
                if (allow_delete || allow_edit) {
                    this.$el.find('.datalist-table th').last().css('width', '50px');
                }
                if (this.options_initComplete) {
                    this.options_initComplete(settings, json);
                }
            };
            DataTable.prototype.onTableDraw = function () {
            };
            DataTable.prototype.created_row = function (row, data, dataIndex) {
                var _this = this;
                $(row).data('id', _.result(data, 'id'));
                if (this.options.counting) {
                    var td = $(row).find('td').first();
                    td.empty();
                    td.html((dataIndex + 1).toString());
                }
                var allow_edit = this.options.allow_edit;
                var allow_delete = this.options.allow_delete;
                if (allow_delete || allow_edit) {
                    var td = $(row).find('td').last();
                    td.empty();
                    td.css('width', '50px');
                    var td_row = $('<div class="row row-actions" style="margin-right:-5px"></div>').appendTo(td);
                    if (allow_delete) {
                        var btn_del = $.zc('button[type="button" style="margin-left:10px"].pull-right.grid-row-action.btn.btn-default.btn-sm.btn-delete-row.opacity_5>i.fa.fa-trash');
                        $(btn_del).css('margin-left', '10px!important');
                        td_row.append($(btn_del));
                        $(btn_del).click(function () {
                            _this.options.owner.notify({
                                command: 'record-deleted',
                                data: {
                                    obj: data,
                                    row: $(row)
                                }
                            });
                        });
                    }
                    if (allow_edit) {
                        var btn_edit = $.zc('button[type="button"].pull-right.grid-row-action.btn.btn-default.btn-sm.btn-edit-row.opacity_5>i.fa.fa-edit');
                        td_row.append($(btn_edit));
                        var that = this;
                        $(btn_edit).click(function () {
                            that.options.owner.notify({
                                command: 'open-record',
                                data: data
                            }).then(function () {
                            });
                        });
                    }
                    if (this.options.toggle_action) {
                        td.find('.row-actions').addClass('hidden');
                    }
                }
                if (this.options.row_padding) {
                    _.each($(row).find('td'), function (td) {
                        $(td).css({ 'padding-top': '15px', 'padding-bottom': '15px', 'vertical-align': 'middle' });
                    });
                }
                if (this.options.row_padding) {
                    _.each($(row).find('td'), function (td) {
                        $(td).css({ 'padding-top': '15px', 'padding-bottom': '15px', 'vertical-align': 'middle' });
                    });
                }
                if (this.rowCallback) {
                    this.rowCallback(row, data);
                }
            };
            DataTable.prototype.reload = function () {
                if (this.datatable) {
                    this.datatable.destroy();
                }
                this.fill_table();
            };
            return DataTable;
        })(BaseView);
        Views.DataTable = DataTable;
        var srvDataTable = (function (_super) {
            __extends(srvDataTable, _super);
            function srvDataTable(options) {
                _super.call(this, options);
            }
            srvDataTable.prototype.internal_fetch = function () {
                return Q.resolve(true);
            };
            srvDataTable.prototype.retrieve_data = function () {
                return [];
            };
            srvDataTable.prototype.get_default_tblSettings = function () {
                var settings = _super.prototype.get_default_tblSettings.call(this);
                settings.serverSide = true;
                _.extend(settings, this.ajax_settings());
                return settings;
            };
            srvDataTable.prototype.ajax_settings = function () {
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
                        if (_this.options.spinner) {
                            _this.options.spinner.removeClass('hidden');
                        }
                        var _url = utils.url('{0}/exec_sql_incr'.format(_this.options.serviceName));
                        settings.jqXHR = $.ajax({
                            "url": _url,
                            "type": 'POST',
                            contentType: "application/json; charset=utf-8",
                            "data": JSON.stringify(request),
                            "dataType": "json",
                            "cache": false,
                            "success": function (json) {
                                drawCallBack(json.payload);
                                if (that.options.spinner) {
                                    that.options.spinner.addClass('hidden');
                                }
                            },
                            "error": function (err) {
                                if (that.options.spinner) {
                                    _this.options.spinner.addClass('hidden');
                                }
                            }
                        });
                    };
                };
                $.extend(_settings, {
                    "ajax": $.fn.dataTable.pipeline({})
                });
                return _settings;
            };
            srvDataTable.prototype.get_sql = function () {
                if (this.options.get_sql) {
                    return this.options.get_sql();
                }
                return null;
            };
            srvDataTable.prototype.get_orderBy = function () {
                if (this.options.get_orderBy) {
                    return this.options.get_orderBy();
                }
                return null;
            };
            return srvDataTable;
        })(DataTable);
        Views.srvDataTable = srvDataTable;
        var Explorer = (function (_super) {
            __extends(Explorer, _super);
            function Explorer(options) {
                this.beforeCreate();
                _super.call(this, options);
            }
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
            Explorer.prototype.getServiceName = function () {
                return this.options.serviceName;
            };
            Explorer.prototype.getResourceName = function () {
                return this.options.resourceName;
            };
            Explorer.prototype.beforeCreate = function () {
                _.extend(this, {
                    template: '#ts-data-explorer',
                    regions: {
                        reg_datalist: '.explorer-datalist',
                        reg_dataentry: '.explorer-edit'
                    }
                });
            };
            Explorer.prototype.onRender = function () {
                _super.prototype.onRender.call(this);
                this.actions = new Controls.ExplorerActions({
                    owner: this,
                    el: this.$el.find('.explorer-actions'),
                    startMode: Controls.ExplorerActionsStartMode.StartAdd
                });
                this.actions.render();
                this.spinner = this.$el.find('.spinner');
                this.fetch_data();
            };
            Explorer.prototype.fetch_data = function () {
                var _this = this;
                var d = Q.defer();
                this.spinner.removeClass('hidden');
                this.internal_fetch().then(function () {
                    _this.init_dataTable();
                    d.resolve(true);
                }).finally(function () {
                    _this.spinner.addClass('hidden');
                });
                return d.promise;
            };
            Explorer.prototype.internal_fetch = function () {
                var d = Q.defer();
                var qry = this.get_query();
                this.datasource.fetch(qry).then(function (data) {
                    d.resolve(data);
                });
                return d.promise;
            };
            Explorer.prototype.get_query = function () {
                if (this.options.get_query) {
                    return this.options.get_query();
                }
                return null;
            };
            Explorer.prototype.init_dataTable = function () {
                var options = this.get_tableProps();
                if (options && options.tblSettings) {
                    if (options.tblSettings) {
                        options.tblSettings.data = this.retrieve_data();
                    }
                    options.owner = this;
                }
                if (this.datatable) {
                    this.datatable.destroy();
                }
                this.datatable = this.get_dataTable(options);
                this.reg_datalist.show(this.datatable);
                this.datatable.$el.find('.datalist-content').css({ 'padding': '0', 'margin': '0' });
            };
            Explorer.prototype.get_tableProps = function () {
                var options = this.options.tableProps;
                if (!options) {
                    return {};
                }
                return this.options.tableProps;
            };
            Explorer.prototype.get_dataTable = function (options) {
                return new DataTable(options);
            };
            Explorer.prototype.can_exit_EditMode = function () {
                var _this = this;
                var d = Q.defer();
                if (!this.datasource.dataManager.hasChanges()) {
                    return Q.resolve(true);
                }
                else {
                    utils.can_looseChanges().then(function (res) {
                        if (res === true) {
                            _this.datasource.dataManager.rejectChanges();
                            d.resolve(true);
                        }
                        else {
                            d.reject(false);
                        }
                    });
                }
                return d.promise;
            };
            Explorer.prototype.notify = function (cmd) {
                var _this = this;
                var that = this;
                switch (cmd.command) {
                    case Constants.Commands.AddRow: {
                        this.actions.$el.find('.btn-add, .btn-save, .btn-cancel').addClass('hidden');
                        this.add_record();
                        return Q.resolve(true);
                    }
                    case Constants.Commands.EditRow:
                        {
                            this.$el.find('.explorer-datalist .row-actions').removeClass('hidden');
                        }
                        break;
                    case Constants.Commands.SaveRow: {
                        var d = Q.defer();
                        if (this.rowEditing) {
                            if (this.entryView) {
                                this.entryView.save().then(function () {
                                    d.reject(false);
                                });
                            }
                            else {
                                d.reject(false);
                            }
                        }
                        else {
                            this.spinner.removeClass('hidden');
                            this.datasource.save().then(function () {
                                if (that.get_tableProps().toggle_action) {
                                    _this.$el.find('.explorer-datalist .row-actions').addClass('hidden');
                                }
                                _this.datasource.dataManager.acceptChanges();
                                d.resolve(true);
                            }).fail(function () {
                                d.reject(false);
                            }).finally(function () {
                                _this.spinner.addClass('hidden');
                            });
                        }
                        return d.promise;
                    }
                    case Constants.Commands.ReturnEdit:
                    case Constants.Commands.CancelEdit: {
                        var d = Q.defer();
                        var that = this;
                        if (this.rowEditing) {
                            this.entryView.cancel().then(function () {
                                if (cmd.command === Constants.Commands.ReturnEdit || _this.rowAdding) {
                                    _this.rowAdding = false;
                                    _this.rowEditing = false;
                                    that.$el.find('.explorer-datalist .row-actions').addClass('hidden');
                                    that.$el.find('.explorer-actions button').addClass('hidden');
                                    that.$el.find('.explorer-actions .btn-add').removeClass('hidden');
                                    _this.display_dataList();
                                    _this.init_dataTable();
                                    d.resolve(true);
                                }
                            });
                        }
                        else {
                            this.can_exit_EditMode().then(function () {
                                _this.$el.find('.explorer-datalist .row-actions').addClass('hidden');
                                _this.rowAdding = false;
                                _this.rowEditing = false;
                                _this.init_dataTable();
                                d.resolve(true);
                            });
                        }
                        return d.promise;
                    }
                    case Constants.Commands.openRecord:
                        {
                            this.actions.btnAdd.addClass('hidden');
                            this.open_record(_.result(cmd.data, 'id'));
                        }
                        break;
                    case Constants.Commands.deleteRecord: {
                        var entity = cmd.data.obj;
                        if (entity.entityAspect) {
                            entity.entityAspect.setDeleted();
                        }
                        this.reload();
                        this.$el.find('.explorer-datalist .row-actions').removeClass('hidden');
                    }
                }
                return Q.resolve(true);
            };
            Explorer.prototype.reload = function () {
                if (this.datatable) {
                    this.datatable.destroy();
                }
                this.init_dataTable();
            };
            Explorer.prototype.add_record = function () {
                this.rowAdding = true;
                this.rowEditing = true;
                this.open_record(null);
            };
            Explorer.prototype.open_record = function (ID) {
                var d = Q.defer();
                this.rowEditing = true;
                this.$el.find('.explorer-actions .btn-return').removeClass('hidden');
                var options = {
                    autoLoadID: ID,
                    owner: this,
                    spinner: this.spinner,
                    serviceName: this.getServiceName(),
                    resourceName: this.getResourceName()
                };
                this.entryView = this.get_entry(options);
                this.reg_dataentry.show(this.entryView);
                this.display_dataEntry();
                return d.promise;
            };
            Explorer.prototype.display_dataEntry = function () {
                $(this.reg_datalist.el).addClass('hidden').removeClass('animated fadeIn');
                $(this.reg_dataentry.el).removeClass('hidden');
                $(this.reg_dataentry.el).find('.data-entry-root').removeClass('hidden');
            };
            Explorer.prototype.display_dataList = function () {
                $(this.reg_dataentry.el).removeClass('animated fadeInUp').addClass('hidden');
                $(this.reg_datalist.el).addClass('animated fadeIn').removeClass('hidden');
            };
            Explorer.prototype.retrieve_data = function () {
                var data = this.datasource.dataManager.getEntities(this.getResourceName());
                return _.filter(data, function (d) {
                    return !d.entityAspect.entityState.isDeleted();
                });
            };
            Explorer.prototype.get_entry = function (options) {
                return new Entry(options);
            };
            return Explorer;
        })(BaseView);
        Views.Explorer = Explorer;
        var Entry = (function (_super) {
            __extends(Entry, _super);
            function Entry(options) {
                _.extend(this, {
                    template: '#ts-entry'
                });
                _super.call(this, options);
            }
            Object.defineProperty(Entry.prototype, "datasource", {
                get: function () {
                    if (!this._ds) {
                        this._ds = this.get_datasource();
                    }
                    return this._ds;
                },
                enumerable: true,
                configurable: true
            });
            Entry.prototype.get_datasource = function () {
                //var url = utils.url(this.getServiceName());
                return new Data.Datasource({
                    serviceName: this.getServiceName(),
                    askMetadata: true
                });
            };
            Object.defineProperty(Entry.prototype, "owner", {
                get: function () {
                    return this.options.owner;
                },
                enumerable: true,
                configurable: true
            });
            Entry.prototype.getResourceName = function () {
                return this.options.resourceName;
            };
            Entry.prototype.getServiceName = function () {
                return this.options.serviceName;
            };
            Entry.prototype.init_newItem = function () {
                if (utils.is_null_or_empty(this.options.autoLoadID)) {
                    var e = this.insertNew();
                    this.options.autoLoadID = e['id']();
                }
            };
            Object.defineProperty(Entry.prototype, "currentItem", {
                get: function () {
                    var _this = this;
                    if (!this.options.autoLoadID) {
                        this.init_newItem();
                    }
                    var obj = _.find(this.datasource.dataManager.getEntities(this.getResourceName()), function (e) {
                        return e['id']() === _this.options.autoLoadID;
                    });
                    return obj;
                },
                enumerable: true,
                configurable: true
            });
            Entry.prototype.onRender = function () {
                var _this = this;
                _super.prototype.onRender.call(this);
                this.fetch_data().then(function () {
                    _this.init_form();
                });
            };
            Entry.prototype.insertNew = function () {
                return this.datasource.insert(this.getResourceName());
            };
            Entry.prototype.fetch_data = function () {
                var _this = this;
                if (utils.is_null_or_empty(this.options.autoLoadID)) {
                    if (!this.datasource.dataManager.metadataStore.hasMetadataFor(this.getResourceName())) {
                        var d = Q.defer();
                        this.datasource.dataManager.fetchMetadata().then(function () {
                            _this.init_newItem();
                            d.resolve(true);
                        });
                        return d.promise;
                    }
                    else {
                        return Q.resolve(true);
                    }
                }
                else {
                    this.options.spinner.removeClass('hidden');
                    var d = Q.defer();
                    this.datasource.fetch(this.get_query()).then(function () {
                        d.resolve(true);
                    }).catch(function (err) {
                        d.reject(err);
                    }).finally(function () {
                        _this.options.spinner.addClass('hidden');
                    });
                    return d.promise;
                }
            };
            Entry.prototype.get_query = function () {
                var qry = new breeze.EntityQuery(this.getResourceName()).where('id', '==', this.options.autoLoadID);
                return qry;
            };
            Entry.prototype.init_form = function () {
            };
            Entry.prototype.can_exit_EditMode = function () {
                var _this = this;
                var d = Q.defer();
                if (!this.datasource.dataManager.hasChanges()) {
                    return Q.resolve(true);
                }
                else {
                    utils.can_looseChanges().then(function (rsp) {
                        if (rsp) {
                            _this.datasource.dataManager.rejectChanges();
                            d.resolve(true);
                        }
                        else {
                            d.reject(false);
                        }
                    });
                }
                return d.promise;
            };
            Entry.prototype.cancel = function () {
                return this.can_exit_EditMode();
            };
            Entry.prototype.save = function () {
                var _this = this;
                if (this.options.spinner) {
                    this.options.spinner.removeClass('hidden');
                }
                return this.datasource.save()
                    .then(function () {
                    _this.datasource.dataManager.acceptChanges();
                    return true;
                })
                    .finally(function () {
                    if (_this.options.spinner) {
                        _this.options.spinner.addClass('hidden');
                    }
                });
            };
            Entry.prototype.reload = function (checkChanges) {
                var id = this.currentItem['id']();
                return this.owner.open_record(id);
            };
            return Entry;
        })(BaseView);
        Views.Entry = Entry;
        var ImgUploader = (function (_super) {
            __extends(ImgUploader, _super);
            function ImgUploader(options) {
                this.options = options;
                this.files = [];
                _.extend(this, {
                    template: '#ts-img-uploader'
                });
                _super.call(this, options);
            }
            ImgUploader.prototype.add_file = function (file) {
                var found = _.find(this.files, function (f) {
                    return f.name == file.name;
                }) != undefined;
                if (!found) {
                    this.files.push({
                        name: file.name,
                        size: file.size,
                        type: file.type
                    });
                }
            };
            ImgUploader.prototype.file_uploaded = function (file) {
                var f = _.find(this.files, function (f) {
                    return f.name === file.name;
                });
                f.status = true;
            };
            ImgUploader.prototype.onRender = function () {
                if (_super.prototype.onRender) {
                    _super.prototype.onRender.call(this);
                }
                Dropzone.autoDiscover = false;
                var that = this;
                this.dropzone = this.$el.find(".dropzone").dropzone({
                    withCredentials: true,
                    url: utils.url('files/upload'),
                    init: function () {
                        this.on('addedfile', function (file) {
                            that.add_file(file);
                        });
                        this.on('success', function (file) {
                            that.file_uploaded(file);
                        });
                        this.on('canceled', function (files) {
                        });
                        this.on('complete', function (args) {
                        });
                    }
                });
            };
            ImgUploader.prototype.onSave = function () {
                return Q.resolve({
                    result: Constants.DialogResult.Ok,
                    data: this.files
                });
            };
            ImgUploader.prototype.onCancel = function () {
                return Q.reject({
                    result: Constants.DialogResult.Cancel,
                    data: null
                });
            };
            return ImgUploader;
        })(BaseView);
        Views.ImgUploader = ImgUploader;
        var ArrayEditable = (function (_super) {
            __extends(ArrayEditable, _super);
            function ArrayEditable(options) {
                _super.call(this, options);
            }
            Object.defineProperty(ArrayEditable.prototype, "addBtn", {
                get: function () {
                    return this.$el.find('.btn-add');
                },
                enumerable: true,
                configurable: true
            });
            ArrayEditable.prototype.onRender = function () {
                _super.prototype.onRender.call(this);
                this.init_array();
            };
            ArrayEditable.prototype.init_array = function () {
                var _this = this;
                $('<button class="btn btn-info btn-rw hidden mb20"><i class="fa fa-plus"></i><span class="ml10">Add</span></button>').insertBefore(this.$el.find('.datalist-content'));
                this.addBtn.click(function () {
                    _this.add_row();
                });
                if (this.options.display_add_btn === undefined) {
                    this.options.display_add_btn = true;
                }
                if (this.options.display_add_btn) {
                    this.addBtn.removeClass('hidden');
                }
            };
            ArrayEditable.prototype.add_row = function () {
                alert('bingo');
            };
            return ArrayEditable;
        })(DataTable);
        Views.ArrayEditable = ArrayEditable;
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
                                    that.dataManager.importEntities(data.payload, {
                                        mergeStrategy: breeze.MergeStrategy.OverwriteChanges
                                    });
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
                    if (this.dataManager.metadataStore.isEmpty()) {
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
            Datasource.prototype.retrieve_results = function (rst) {
                if (rst.results && rst.results.length) {
                    return rst.results[0];
                }
                else {
                    return rst;
                }
            };
            Datasource.prototype.saveChanges = function () {
                var _this = this;
                var d = Q.defer();
                var data = this.dataManager.exportEntities();
                this.process({
                    operation: 'savechanges',
                    params: data
                }).then(function (rst) {
                    var result = _this.retrieve_results(rst);
                    toastr.clear();
                    if (result) {
                        if (result.success) {
                            toastr.success('Les donnees ont ete sauvegardees', 'Information');
                            _this.dataManager.acceptChanges();
                            d.resolve(result);
                        }
                        else {
                            if (result.error) {
                                toastr.error(result.error, 'Erreur');
                                d.reject(result);
                            }
                        }
                    }
                    else {
                        toastr.info('Les donnees ont ete sauvegardees', 'Information');
                        d.resolve(result);
                    }
                }).catch(function (err) {
                    toastr.clear();
                    toastr.error(err, 'Erreur');
                    d.reject(err);
                });
                return d.promise;
            };
            Datasource.prototype.fetch = function (qry) {
                return this.process({
                    operation: 'fetch',
                    params: qry.toJSON()
                });
            };
            Datasource.prototype.fetch_localDB = function () {
                if (__localDB != undefined) {
                    return Q.resolve(__localDB);
                }
                return get_localDB().then(function (data) {
                    __localDB = new Types.LocalDB(data);
                    return __localDB;
                });
            };
            Datasource.prototype.insert = function (entityName, values) {
                var entity = this.dataManager.metadataStore.getEntityType(entityName);
                entity.setProperties({
                    autoGeneratedKeyType: breeze.AutoGeneratedKeyType.Identity
                });
                var __id = _.guid();
                var initial_values = _.extend({ id: __id }, values || {});
                return this.dataManager.createEntity(entity, initial_values);
            };
            Datasource.prototype.save = function () {
                if (!this.dataManager.hasChanges()) {
                    return Q.resolve(true);
                }
                return this.saveChanges();
            };
            Datasource.prototype.clone = function () {
                var that = this;
                var ds = new Datasource({
                    serviceName: that.serviceName,
                    askMetadata: that.askMetadata
                });
                ds.dataManager.metadataStore.importMetadata(this.dataManager.metadataStore.exportMetadata());
                ds.dataManager.importEntities(this.dataManager.exportEntities(), { mergeStrategy: breeze.MergeStrategy.OverwriteChanges });
                return ds;
            };
            return Datasource;
        })();
        Data.Datasource = Datasource;
    })(Data = exports.Data || (exports.Data = {}));
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
                _.extend(this, {
                    template: '#ts-explorer-actions'
                });
                _super.call(this, props);
            }
            ExplorerActions.prototype.onRender = function () {
                _super.prototype.onRender.call(this);
                this.btnAdd = this.$el.find('.btn-add');
                this.btnEdit = this.$el.find('.btn-edit');
                this.btnSave = this.$el.find('.btn-save');
                this.btnCancel = this.$el.find('.btn-cancel');
                this.btnReturn = this.$el.find('.btn-return');
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
            ExplorerActions.prototype.exec_action = function (action) {
                var _this = this;
                switch (action) {
                    case ExplorerAction.Add:
                        {
                            this.btnAdd.addClass('hidden');
                            this.btnEdit.addClass('hidden');
                            this.btnReturn.removeClass('hidden');
                            this.btnSave.removeClass('hidden');
                            this.btnCancel.removeClass('hidden');
                            this.options.owner.notify({
                                command: Constants.Commands.AddRow,
                                data: null
                            });
                        }
                        break;
                    case ExplorerAction.Edit:
                        {
                            this.btnEdit.addClass('hidden');
                            this.btnSave.removeClass('hidden');
                            this.btnCancel.removeClass('hidden');
                            if (this.options.startMode === ExplorerActionsStartMode.StartEdit) {
                                this.btnAdd.removeClass('hidden');
                            }
                            this.options.owner.notify({
                                command: Constants.Commands.EditRow,
                                data: null
                            });
                        }
                        break;
                    case ExplorerAction.Save:
                        {
                            this.options.owner.notify({
                                command: Constants.Commands.SaveRow,
                                data: null
                            }).then(function () {
                                _this.btnSave.addClass('hidden');
                                _this.btnCancel.addClass('hidden');
                                _this.btnReturn.addClass('hidden');
                                if (_this.options.startMode === ExplorerActionsStartMode.StartAdd) {
                                    _this.btnAdd.removeClass('hidden');
                                    _this.btnEdit.addClass('hidden');
                                }
                                if (_this.options.startMode === ExplorerActionsStartMode.StartEdit) {
                                    _this.btnAdd.addClass('hidden');
                                    _this.btnEdit.removeClass('hidden');
                                }
                            });
                        }
                        break;
                    case ExplorerAction.Return:
                        {
                            this.options.owner.notify({
                                command: Constants.Commands.ReturnEdit,
                                data: null
                            }).then(function (res) {
                                if (res === true) {
                                    _this.btnSave.addClass('hidden');
                                    _this.btnCancel.addClass('hidden');
                                    _this.btnReturn.addClass('hidden');
                                    if (_this.options.startMode === ExplorerActionsStartMode.StartAdd) {
                                        _this.btnAdd.removeClass('hidden');
                                        _this.btnEdit.addClass('hidden');
                                    }
                                    if (_this.options.startMode === ExplorerActionsStartMode.StartEdit) {
                                        _this.btnAdd.addClass('hidden');
                                        _this.btnEdit.removeClass('hidden');
                                    }
                                }
                            });
                        }
                        break;
                    case ExplorerAction.Cancel:
                        {
                            this.options.owner.notify({
                                command: Constants.Commands.CancelEdit,
                                data: null
                            }).then(function (res) {
                                if (res === true) {
                                    _this.btnSave.addClass('hidden');
                                    _this.btnCancel.addClass('hidden');
                                    _this.btnReturn.addClass('hidden');
                                    if (_this.options.startMode === ExplorerActionsStartMode.StartAdd) {
                                        _this.btnAdd.removeClass('hidden');
                                        _this.btnEdit.addClass('hidden');
                                    }
                                    if (_this.options.startMode === ExplorerActionsStartMode.StartEdit) {
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
                switch (this.options.startMode) {
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
        })(Views.BaseView);
        Controls.ExplorerActions = ExplorerActions;
        (function (EditMode) {
            EditMode[EditMode["Readonly"] = 0] = "Readonly";
            EditMode[EditMode["Edit"] = 1] = "Edit";
        })(Controls.EditMode || (Controls.EditMode = {}));
        var EditMode = Controls.EditMode;
        var BaseControl = (function (_super) {
            __extends(BaseControl, _super);
            function BaseControl(options) {
                _super.call(this, options);
            }
            return BaseControl;
        })(Views.BaseView);
        Controls.BaseControl = BaseControl;
        var TextEdit = (function (_super) {
            __extends(TextEdit, _super);
            function TextEdit(options) {
                var _template = this.template;
                if (!_template) {
                    _template = '#ts-textedit';
                }
                _.extend(this, {
                    template: _template
                });
                _super.call(this, options);
            }
            TextEdit.prototype.onRender = function () {
                _super.prototype.onRender.call(this);
                this.$el.find('.title').html(this.options.title);
                this.$el.find('control-editable').attr('placeholder', this.options.placeholder);
                if (this.options.required) {
                    this.$el.find('control-editable').attr('require', "true");
                }
                if (this.options.binding) {
                    this.$el.find('.control-readonly').attr('data-bind', 'text:{0}'.format(this.options.binding.property));
                    this.$el.find('.control-editable').attr('data-bind', 'textInput:{0}'.format(this.options.binding.property));
                    ko.applyBindings(this.options.binding.source, this.$el[0]);
                }
                this.set_visibility();
            };
            TextEdit.prototype.set_visibility = function () {
                switch (this.options.editmode) {
                    case EditMode.Edit:
                        {
                            this.$el.find('.control-readonly').addClass('hidden');
                            this.$el.find('.control-editable').removeClass('hidden');
                        }
                        break;
                    case EditMode.Readonly:
                        {
                            this.$el.find('.control-readonly').removeClass('hidden');
                            this.$el.find('.control-editable').addClass('hidden');
                        }
                        break;
                }
            };
            return TextEdit;
        })(BaseControl);
        Controls.TextEdit = TextEdit;
        var TextArea = (function (_super) {
            __extends(TextArea, _super);
            function TextArea(options) {
                _.extend(this, {
                    template: '#ts-textarea'
                });
                _super.call(this, options);
            }
            Object.defineProperty(TextArea.prototype, "notes", {
                get: function () {
                    return this.$el.find('.summernote');
                },
                enumerable: true,
                configurable: true
            });
            TextArea.prototype.onRender = function () {
                _super.prototype.onRender.call(this);
            };
            TextArea.prototype.init_editor = function () {
                this.$el.find('.txtEditor').Editor();
            };
            TextArea.prototype.init_summernote = function () {
                var _this = this;
                var that = this;
                this.$el.find('.summernote').summernote({
                    toolbar: [
                        ['style', ['bold', 'italic', 'underline', 'clear']],
                        ['font', ['strikethrough', 'superscript', 'subscript']],
                        ['fontsize', ['fontsize']],
                        ['color', ['color']],
                        ['para', ['ul', 'ol', 'paragraph']],
                        ['height', ['height']]
                    ],
                    airMode: false,
                    dialogsFade: true,
                    callbacks: {
                        onInit: function () {
                            var text = that.options.binding.source[that.options.binding.property]();
                            _this.$el.find('.note-editable').empty();
                            if (text != undefined) {
                                _this.$el.find('.note-editable').html(text);
                            }
                        },
                        onChange: function (text) {
                        }
                    }
                });
                this.$el.find('.note-editable').css({
                    'min-height': '150px'
                });
                this.can_update_text = true;
            };
            return TextArea;
        })(TextEdit);
        Controls.TextArea = TextArea;
        var Lookup = (function (_super) {
            __extends(Lookup, _super);
            function Lookup(options) {
                _.extend(this, {
                    template: '#ts-lookup'
                });
                _super.call(this, options);
            }
            Lookup.render = function (options) {
                var ctrl = new Lookup(options);
                ctrl.render();
                return ctrl;
            };
            Object.defineProperty(Lookup.prototype, "select", {
                get: function () {
                    return this.$el.find('select');
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Lookup.prototype, "value", {
                get: function () {
                    return this.elementValue.val();
                },
                enumerable: true,
                configurable: true
            });
            Object.defineProperty(Lookup.prototype, "elementValue", {
                get: function () {
                    return this.select.find('option:selected');
                },
                enumerable: true,
                configurable: true
            });
            Lookup.prototype.onRender = function () {
                _super.prototype.onRender.call(this);
                this.fill_data();
            };
            Lookup.prototype.update = function (value) {
                this.select.val(value);
                this.select.trigger('chosen:updated');
            };
            Lookup.prototype.map = function (data) {
                var _this = this;
                return _.map(data, function (d) {
                    var val = { name: _.result(d, _this.options.displaymember) };
                    if (!utils.is_null_or_empty(_this.options.valuemember)) {
                        val.value = _.result(d, _this.options.displaymember);
                    }
                    if (!utils.is_null_or_empty(_this.options.submember)) {
                        val.items = _this.map(d[_this.options.submember]);
                    }
                    return val;
                });
            };
            Lookup.prototype.fill_data = function () {
                var _this = this;
                var items = this.map(this.options.data);
                this.fill_with_items(this.select, items);
                this.select.chosen({ disable_search_threshold: 10 });
                this.select.chosen().change(function (args) {
                    _this.on_value_changed();
                });
                if (this.options.onInit) {
                    this.options.onInit(this);
                }
            };
            Lookup.prototype.fill_with_items = function (root, items) {
                var _this = this;
                items.forEach(function (t) {
                    if ($.isArray(t.items) && t.items.length > 0) {
                        var group = $('<optgroup label="{0}"></optgroup>'.format(t.name)).appendTo(root);
                        _this.fill_with_items(group, t.items);
                    }
                    else {
                        root.append($('<option data-value="{0}">{1}</option>'.format(t.value, t.name)));
                    }
                });
            };
            Lookup.prototype.on_value_changed = function () {
                if (this.options.onchange) {
                    this.options.onchange(this.elementValue, this.value);
                }
            };
            Lookup.prototype.onInit = function () {
                if (this.options.onInit) {
                    this.options.onInit(this);
                }
            };
            Lookup.prototype.reset_values = function (data) {
                this.select.find('option').remove();
                var items = this.map(data);
                this.fill_with_items(this.select, items);
                this.select.trigger('chosen:updated');
            };
            return Lookup;
        })(Views.BaseView);
        Controls.Lookup = Lookup;
    })(Controls = exports.Controls || (exports.Controls = {}));
    var Modal;
    (function (Modal) {
        var count = 0;
        var ModalBox = (function (_super) {
            __extends(ModalBox, _super);
            function ModalBox(defer, options) {
                this.defer = defer;
                this.options = options;
                _.extend(this, {
                    template: '#ts-modal',
                    regions: {
                        'modalbody': '.modal-internal-content'
                    }
                });
                _super.call(this, options);
            }
            ModalBox.prototype.onRender = function () {
                if (_super.prototype.onRender) {
                    _super.prototype.onRender.call(this);
                }
                this.ctrl_modal = this.$el.find('.modal');
                this.modalbody = this.getRegion('modalbody');
                this.content = this.options.get_content(this);
                if (this.content) {
                    this.modalbody.show(this.content);
                }
                this.ctrl_modal.find('.modal-title').html(this.options.title);
                this.init_modal_events();
                this.init_actions();
            };
            ModalBox.prototype.fix_dimensions = function () {
                this.$el.find('.modal-header').css('padding', '0 10px 0 10px!important');
                this.$el.find('.modal-header').css('margin-bottom', '20px!important');
                this.$el.find('.modal-body').css('padding', '20px!important');
            };
            ModalBox.prototype.init_modal_events = function () {
            };
            ModalBox.prototype.init_actions = function () {
                var _this = this;
                this.$el.find('.save-btn').click(function (e) {
                    _this.save();
                });
                this.$el.find('.select-btn').click(function (e) {
                    _this.save();
                });
                this.$el.find('.cancel-btn').click(function (e) {
                    _this.cancel();
                });
            };
            ModalBox.prototype.save = function () {
                var _this = this;
                return this.content.onSave().then(function (rst) {
                    if (rst.result === Constants.DialogResult.Ok
                        || rst.result === Constants.DialogResult.Yes) {
                        _this.ctrl_modal.modal('hide');
                        _this.defer.resolve(rst);
                        return rst;
                    }
                    else {
                        _this.defer.reject(rst);
                        return rst;
                    }
                });
            };
            ModalBox.prototype.cancel = function () {
                var _this = this;
                return this.content.onCancel().then(function (rst) {
                    _this.ctrl_modal.modal('hide');
                    _this.defer.reject(rst);
                    return rst;
                });
            };
            return ModalBox;
        })(Marionette.LayoutView);
        Modal.ModalBox = ModalBox;
        function Show(options) {
            var d = Q.defer();
            var $modal_handler = $('#modal-handler');
            if ($modal_handler.length == 0) {
                $modal_handler = $('<div id="modal-handler"></div>').appendTo($('body'));
            }
            var $current_holder = $("<div class=\"modal-placeholder-" + count + "\"></div>").appendTo($modal_handler);
            var mbox = new ModalBox(d, _.extend(options, {
                el: $current_holder
            }));
            mbox.render();
            mbox.ctrl_modal.modal({
                show: true,
                backdrop: 'static'
            });
            return d.promise;
        }
        Modal.Show = Show;
    })(Modal = exports.Modal || (exports.Modal = {}));
    var Extensions;
    (function (Extensions) {
        function CurrenyObservable(fn) {
            var format = function (value) {
                var toks = value.toFixed(2).replace('-', '').split('.');
                var display = '€ ' + $.map(toks[0].split('').reverse(), function (elm, i) {
                    return [(i % 3 === 0 && i > 0 ? ',' : ''), elm];
                }).reverse().join('') + '.' + toks[1];
                return value < 0 ? '-' + display : display;
            };
            var target = fn;
            var writeTarget = function (value) {
                if (value) {
                    var stripped = value.replace(/[^0-9.-]/g, '');
                    target(parseFloat(stripped));
                }
                else {
                    target(null);
                }
            };
            var result = ko.computed({
                read: function () {
                    return target();
                },
                write: writeTarget
            });
            result['formatted'] = ko.computed({
                read: function () {
                    var value = target();
                    if (value === null || value === undefined) {
                        return value;
                    }
                    return format(value);
                },
                write: writeTarget
            });
            return result;
        }
        Extensions.CurrenyObservable = CurrenyObservable;
    })(Extensions = exports.Extensions || (exports.Extensions = {}));
});
//# sourceMappingURL=C:/umarket/umarket.web.ui/js/ts_library/ts_lib.js.map