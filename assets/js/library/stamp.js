define(["require", "exports"], function (require, exports) {
    var ajax;
    (function (ajax) {
        function server_url(url) {
            return 'http://localhost:1337/api' + url;
        }
        ajax.server_url = server_url;
    })(ajax = exports.ajax || (exports.ajax = {}));
});
//# sourceMappingURL=C:/umarket/umarket.web.ui/js/library/stamp.js.map