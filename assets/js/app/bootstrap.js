/// <reference path="../../typings/tsd.d.ts" />
/// <reference path="main.tsx" />
define(["require", "exports", 'react', 'react-dom', './main'], function (require, exports, React, ReactDOM, main) {
    function bootup() {
        $(function () {
            $('#ts-templates').load('/assets/html/templates.html', function () {
                ReactDOM.render(React.createElement(main.Main, null), $('body')[0]);
            });
        });
    }
    exports.bootup = bootup;
    bootup();
});
//# sourceMappingURL=C:/umarket/umarket.web.ui/js/app/bootstrap.js.map