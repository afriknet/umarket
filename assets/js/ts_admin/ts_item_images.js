/// <reference path="../ts_library/ts_lib.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../ts_library/ts_lib'], function (require, exports, lib) {
    var ItemImagesExplorer = (function (_super) {
        __extends(ItemImagesExplorer, _super);
        function ItemImagesExplorer(options) {
            _super.call(this, options);
        }
        ItemImagesExplorer.prototype.get_datasource = function () {
            var _this = this;
            var __ds = this.options.datasource.clone();
            __ds.dataManager.entityChanged.subscribe(function (args) {
                var is_modified = (args.entityAction == breeze.EntityAction.EntityStateChange)
                    || (args.entityAction == breeze.EntityAction.PropertyChange);
                if (is_modified) {
                    _this.actions.btnCancel.removeClass('hidden');
                    _this.actions.btnSave.removeClass('hidden');
                }
                else {
                    _this.actions.btnCancel.addClass('hidden');
                    _this.actions.btnSave.addClass('hidden');
                }
            });
            return __ds;
        };
        ItemImagesExplorer.prototype.getServiceName = function () {
            return 'item-srv';
        };
        ItemImagesExplorer.prototype.getResourceName = function () {
            return 'item';
        };
        ItemImagesExplorer.prototype.onRender = function () {
            var _this = this;
            _super.prototype.onRender.call(this);
            var link = $('<button type="button" class="btn btn-warning btn-rw btn-sm btn-link ml10"><i class="fa fa-external-link"><span data-loxalize="str_save"> lien </span></i></button>').insertAfter(this.actions.$el.find('.btn-add'));
            link.click(function () {
                _this.add_link();
            });
        };
        ItemImagesExplorer.prototype.insert_img_link = function (link) {
            var item = this.datasource.dataManager.getEntities('item')[0];
            this.datasource.insert('item_img', {
                itemID: item['id'](),
                filename: link,
                filepath: 'lien image',
                filesize: 0,
                filetype: 'link',
                filecreated: new Date(),
                ismain: 0
            });
            this.save_imgs();
        };
        ItemImagesExplorer.prototype.add_link = function () {
            var _this = this;
            lib.Modal.Show({
                title: "<h4>Lien image</h4>",
                get_content: function (options) {
                    return new ImgLink();
                },
            }).then(function (rst) {
                if (rst.result === lib.Constants.DialogResult.Ok) {
                    _this.insert_img_link(rst.data);
                }
            });
        };
        ItemImagesExplorer.prototype.internal_fetch = function () {
            return Q.resolve(true);
        };
        ItemImagesExplorer.prototype.sort_imgs = function (list) {
            var src = list.slice();
            var dest = [];
            _.each(src, function (e) {
                if (e['ismain']() === 1) {
                    dest.unshift(e);
                }
                else {
                    dest.push(e);
                }
            });
            return dest;
        };
        ItemImagesExplorer.prototype.retrieve_data = function () {
            var data = this.datasource.dataManager.getEntities('item_img');
            return this.sort_imgs(data);
        };
        ItemImagesExplorer.prototype.open_record = function (ID) {
            var _this = this;
            this.actions.btnReturn.addClass('hidden');
            this.actions.btnAdd.removeClass('hidden');
            var d = Q.defer();
            lib.Modal.Show({
                title: "<h4>Telecharger une ou plusieurs images</h4>",
                get_content: function (options) {
                    return new lib.Views.ImgUploader({
                        owner: _this
                    });
                },
            }).then(function (rst) {
                if (rst.result === lib.Constants.DialogResult.Ok) {
                    _this.add_new_images(rst.data);
                }
            });
            return d.promise;
        };
        ItemImagesExplorer.prototype.add_new_images = function (files) {
            var _this = this;
            var item = this.datasource.dataManager.getEntities('item')[0];
            files.forEach(function (f) {
                _this.datasource.insert('item_img', {
                    itemID: item['id'](),
                    filename: f.name,
                    filepath: f.name,
                    filesize: f.size,
                    filetype: f.type,
                    filecreated: new Date(),
                    ismain: 0
                });
            });
            this.save_imgs();
        };
        ItemImagesExplorer.prototype.save_imgs = function () {
            var _this = this;
            this.spinner.removeClass('hidden');
            this.datasource.save().then(function () {
                _this.datasource.dataManager.acceptChanges();
                _this.init_dataTable();
            }).finally(function () {
                _this.spinner.addClass('hidden');
            });
        };
        ItemImagesExplorer.prototype.get_tableProps = function () {
            var _this = this;
            var options = _super.prototype.get_tableProps.call(this);
            _.extend(options, {
                allow_delete: true,
                allow_edit: false,
                counting: true,
                toggle_action: false,
                spinner: this.spinner,
                tblSettings: {
                    columns: [
                        {
                            title: 'image', data: 'filename', width: '20%!important', createdCell: function (cell, cellData, rowData, row, col) {
                                function get_img_path() {
                                    return '{0}/images/{1}'.format(utils.server_url, cellData);
                                }
                                $(cell).empty();
                                var is_link = _.result(rowData, 'filetype') === 'link';
                                if (!is_link) {
                                    $('<img src="{0}" class="img-rounded" width="80%" alt=""></img>'.format(get_img_path())).appendTo($(cell));
                                }
                                else {
                                    var a = $(_.result(rowData, 'filename'));
                                    $(cell).append(a);
                                }
                            }
                        },
                        { title: 'fichier', data: 'filepath' },
                        {
                            title: 'affiche', data: 'ismain', createdCell: function (cell, cellData, rowData) {
                                _this.set_ismain_column(cell, rowData);
                            }
                        }
                    ],
                    data: [],
                    initComplete: function (settings, json) {
                    }
                }
            });
            options.tblSettings["bAutoWidth"] = false;
            return options;
        };
        ItemImagesExplorer.prototype.set_ismain_column = function (cell, e) {
            var __cell = $(cell);
            __cell.empty();
            var chk_html = "\n            <div class=\"checkbox-x custom\">\n                <label>\n                    <input type=\"checkbox\"> <span class=\"chk-caption\"></span>\n                </label>\n            </div>";
            $('<div class="col-lg-12" style="margin:0">{0}</div>'.format(chk_html)).appendTo(__cell);
            __cell.find('input').iCheck({
                checkboxClass: 'icheckbox_square-green',
                radioClass: 'iradio'
            });
            if (e['ismain']() === 1) {
                __cell.find('input').addClass('is-main');
                __cell.find('input').iCheck('check');
            }
            var that = this;
            __cell.find('input').on('ifChecked', function (event) {
                if (!this.__skip) {
                    var ent = that.get_rowObject($(this).closest('tr'));
                    that.check_item(ent, true);
                    $(this).addClass('is-main');
                }
            });
            __cell.find('input').on('ifUnchecked', function (event) {
                if (!this.__skip) {
                    var ent = that.get_rowObject($(this).closest('tr'));
                    that.check_item(ent, false);
                }
            });
            __cell.find('label').css('padding', '0');
            __cell.find('.chk-caption').css('margin-top', '-15px');
        };
        ItemImagesExplorer.prototype.check_item = function (e, checked) {
            if (checked === true) {
                var checked_obj = _.find(this.datasource.dataManager.getEntities('item_img'), function (c) {
                    return c['ismain']() === 1;
                });
                if (checked_obj != undefined) {
                    checked_obj['ismain'](0);
                }
            }
            var old_val = this.__skip;
            try {
                this.__skip = true;
                this.datatable.table.find('.is-main').iCheck('uncheck');
                e['ismain'](checked === true ? 1 : 0);
            }
            finally {
                this.__skip = old_val;
            }
        };
        ItemImagesExplorer.prototype.get_rowObject = function (row) {
            var id = row.data('id');
            return _.find(this.datasource.dataManager.getEntities('item_img'), function (e) {
                return e['id']() === id;
            });
        };
        ItemImagesExplorer.prototype.notify = function (cmd) {
            switch (cmd.command) {
                case lib.Constants.Commands.ReturnEdit:
                case lib.Constants.Commands.CancelEdit: {
                    this.actions.btnCancel.addClass('hidden');
                    this.actions.btnSave.addClass('hidden');
                    this.actions.btnAdd.removeClass('hidden');
                }
                default:
                    return _super.prototype.notify.call(this, cmd);
            }
        };
        return ItemImagesExplorer;
    })(lib.Views.Explorer);
    exports.ItemImagesExplorer = ItemImagesExplorer;
    var ImgLink = (function (_super) {
        __extends(ImgLink, _super);
        function ImgLink(options) {
            _.extend(this, {
                template: false
            });
            _super.call(this, options);
        }
        ImgLink.prototype.onRender = function () {
            var txt = new lib.Controls.TextArea({
                el: this.$el,
                editmode: lib.Controls.EditMode.Edit,
                required: false,
                rows: 5,
                title: 'Inserer un lien image',
            });
            txt.render();
        };
        ImgLink.prototype.onSave = function () {
            return Q.resolve({
                result: lib.Constants.DialogResult.Ok,
                data: this.$el.find('textarea').val()
            });
        };
        ImgLink.prototype.onCancel = function () {
            return Q.reject({
                result: lib.Constants.DialogResult.Cancel,
                data: null
            });
        };
        return ImgLink;
    })(lib.Views.BaseView);
});
//# sourceMappingURL=C:/umarket/umarket.web.ui/js/ts_admin/ts_item_images.js.map