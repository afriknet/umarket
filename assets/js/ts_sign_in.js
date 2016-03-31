/// <reference path="ts_admin/ts_admin_explorer.ts" />
/// <reference path="ts_library/ts_lib.ts" />
/// <reference path="ts_library/ts_types.ts" />
/// <reference path="ts_user/ts_usr_profile.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'ts_library/ts_lib', './ts_admin/ts_admin_explorer', './ts_user/ts_usr_profile'], function (require, exports, lib, Admin, Usr) {
    var SignInView = (function (_super) {
        __extends(SignInView, _super);
        function SignInView(options) {
            _.extend(this, {
                template: false
            });
            _super.call(this, options);
        }
        Object.defineProperty(SignInView.prototype, "root", {
            get: function () {
                return $('#page-wrapper .products .content-page');
            },
            enumerable: true,
            configurable: true
        });
        SignInView.prototype.onRender = function () {
            var _this = this;
            _super.prototype.onRender.call(this);
            $('#page-wrapper').empty();
            $('#page-wrapper').load('/master_page.html', function () {
                $('.page-title').empty();
                $('.page-descr').empty();
                _this.load_view();
            });
        };
        SignInView.prototype.load_view = function () {
            var _this = this;
            var template = _.template($("#ts-signin").html())();
            this.root.html(template);
            this.validator = this.root.find('form').validate({
                rules: {
                    'email': {
                        required: true,
                        email: true
                    },
                    'password': 'required'
                }
            });
            this.root.find('.btn-signin').click(function () {
                if (_this.root.find('form').valid()) {
                    var email = _this.root.find('[type="email"]').val();
                    var password = _this.root.find('[type="password"]').val();
                    if (email === 'admin@admin.com' && password === 'admin') {
                        _this.navigate_to_adminArea();
                    }
                    else if (email === 'guest@guest.com' && password === 'guest') {
                        _this.navigate_to_userArea();
                    }
                    else {
                        toastr.error('Email ou mot de passe incorrect');
                        _this.validator.showErrors({
                            "email": " ",
                            'password': ' '
                        });
                    }
                }
            });
        };
        SignInView.prototype.navigate_to_adminArea = function () {
            (new Admin.AdminExplorerView()).render();
            page.show('/admin', null, false);
        };
        SignInView.prototype.navigate_to_userArea = function () {
            (new Usr.UsrProfileExplorer()).render();
            page.show('/usr', null, false);
        };
        return SignInView;
    })(lib.Views.BaseView);
    exports.SignInView = SignInView;
});
//# sourceMappingURL=C:/umarket/umarket.web.ui/js/ts_sign_in.js.map