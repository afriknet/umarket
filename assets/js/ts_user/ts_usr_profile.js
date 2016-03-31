/// <reference path="../ts_library/ts_lib.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", '../ts_library/ts_lib'], function (require, exports, lib) {
    var UsrProfileExplorer = (function (_super) {
        __extends(UsrProfileExplorer, _super);
        function UsrProfileExplorer() {
            _.extend(this, {
                template: false
            });
            _super.call(this, {});
        }
        Object.defineProperty(UsrProfileExplorer.prototype, "root", {
            get: function () {
                return $('#page-wrapper .products .content-page');
            },
            enumerable: true,
            configurable: true
        });
        UsrProfileExplorer.prototype.onRender = function () {
            var _this = this;
            _super.prototype.onRender.call(this);
            $('#page-wrapper').load('/master_page.html', function () {
                $('.page-title').html('Espace utilisateur');
                $('.page-descr').empty();
                _this.load_view();
            });
        };
        UsrProfileExplorer.prototype.load_view = function () {
            var html = _.template($('#ts-usr-account').html())();
            var content = $('<div class="col-lg-12" style="padding-left:0;padding-right:0"></div>').appendTo(this.root);
            content.html(html);
        };
        return UsrProfileExplorer;
    })(lib.Views.BaseView);
    exports.UsrProfileExplorer = UsrProfileExplorer;
});
//# sourceMappingURL=C:/umarket/umarket.web.ui/js/ts_user/ts_usr_profile.js.map