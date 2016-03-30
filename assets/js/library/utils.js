String.prototype.format = function () {
    var d = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        d[_i - 0] = arguments[_i];
    }
    var args = (arguments.length === 1 && $.isArray(arguments[0])) ? arguments[0] : arguments;
    var formattedString = this;
    for (var i = 0; i < args.length; i++) {
        var pattern = new RegExp("\\{" + i + "\\}", "gm");
        formattedString = formattedString.replace(pattern, args[i]);
    }
    return formattedString;
};
var utils;
(function (utils) {
    utils.url = function (call) {
        return "{0}/{1}/{2}/".format(utils.server_url, utils.path_url, call);
    };
    utils.server_url = 'http://localhost:1337';
    utils.path_url = 'api';
    function can_looseChanges() {
        var d = Q.defer();
        swal({
            title: "Voulez-vous reellement quitter cette page?",
            text: "Les modifications faites seront perdues",
            type: "warning",
            showCancelButton: true,
            confirmButtonColor: "#DD6B55",
            confirmButtonText: "Ok",
            cancelButtonText: "Annuler",
            closeOnConfirm: true,
            closeOnCancel: true,
            animation: false,
        }, function (confirmed) {
            if (confirmed) {
                d.resolve(true);
            }
            else {
                d.reject(false);
            }
        });
        return d.promise;
    }
    utils.can_looseChanges = can_looseChanges;
    function is_null_or_empty(val) {
        return val === null || val === undefined
            || !val || (0 === val.length);
    }
    utils.is_null_or_empty = is_null_or_empty;
    function adjust() {
        customs.adjust();
    }
    utils.adjust = adjust;
    function scrollToObj(target, offset, time) {
        $('html, body').animate({ scrollTop: $(target).offset().top - offset }, time);
    }
    utils.scrollToObj = scrollToObj;
})(utils || (utils = {}));
//# sourceMappingURL=C:/umarket/umarket.web.ui/js/library/utils.js.map