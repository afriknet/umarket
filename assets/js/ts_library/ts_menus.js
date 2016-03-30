/// <reference path="ts_lib.ts" />
/// <reference path="ts_types.ts" />
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", './ts_lib'], function (require, exports, lib) {
    var Menus = (function (_super) {
        __extends(Menus, _super);
        function Menus(options) {
            _.extend(this, {
                template: '#ts-menus'
            });
            _super.call(this, options);
        }
        Object.defineProperty(Menus.prototype, "db", {
            get: function () {
                return this.options.db;
            },
            enumerable: true,
            configurable: true
        });
        Menus.prototype.onRender = function () {
            var _this = this;
            _super.prototype.onRender.call(this);
            var root = this.$el.find('.boutique');
            _.each(this.db.cats_toArray(), function (cat) {
                _this.build_menu(root, cat);
            });
        };
        Menus.prototype.build_menu = function (ul, cat) {
            var li = $('<li class="col-sm-4 col-md-3"></li>').appendTo(ul);
            var li_ul = $('<ul class="list-unstyled" data-cat="{0}" ></ul>'.format(cat.name)).appendTo(li);
            var li_title = $('<li class="title"></li>').appendTo(li_ul);
            this.options.onTitle(li, cat);
            _.each(cat.subs, function (s) {
                var li = $('<li></li>').appendTo(li_ul);
                var a = $('<a></a>').appendTo(li);
                a.attr('href', '/products/{0}/{1}'.format(cat.name, s.name));
                var display = s.name;
                if (!utils.is_null_or_empty(s.display)) {
                    display = s.display;
                }
                a.html(display);
            });
        };
        return Menus;
    })(lib.Views.BaseView);
    exports.Menus = Menus;
});
//# sourceMappingURL=C:/umarket/umarket.web.ui/js/ts_library/ts_menus.js.map