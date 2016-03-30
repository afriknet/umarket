/// <reference path="../ts_app/ts_main.ts" />
/// <reference path="../ts_app/ts_app.ts" />
define(["require", "exports", '../ts_app/ts_app', '../ts_app/ts_main'], function (require, exports, App, Main) {
    function init() {
        $(function () {
            var app = new App.Application();
            app.on("start", function () {
                $('#ts-templates').load('/html/templates.html', function () {
                    (new Main.MainView()).render();
                });
            });
            app.start();
        });
    }
    exports.init = init;
    init();
});
//# sourceMappingURL=C:/umarket/umarket.web.ui/js/app/boot.js.map