/// <reference path="base.tsx" />
/// <reference path="../ts_library/ts_lib.ts" />
/// <reference path="../library/utils.ts" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', './base', '../ts_library/ts_lib'], function (require, exports, React, base, lib) {
    var Pagination = (function (_super) {
        __extends(Pagination, _super);
        function Pagination(props) {
            _super.call(this, props);
        }
        Pagination.prototype.calc_limits = function () {
            var _total = parseInt(this.props.totalcount);
            var _pagesize = parseInt(this.props.pagesize);
            var _start = this.props.pagestart;
            var size = this.props.totalcount / this.props.pagesize;
            size = parseInt(size);
            var mode = 0;
            if (this.props.totalcount > this.props.pagesize) {
                mode = this.props.totalcount % this.props.pagesize;
            }
            if (size == 0) {
                size = 1;
                mode = 0;
            }
            if (mode > 0) {
                size++;
            }
            var _end = this.props.pagestart + this.props.pagesize;
            if (_end > size) {
                _end = size + 1;
            }
            return {
                start: _start,
                end: _end,
                total: size
            };
        };
        Pagination.prototype.render = function () {
            var that = this;
            var list = [];
            var limit = this.calc_limits();
            for (var i = limit.start; i < limit.end; i++) {
                var index = i;
                var li = React.createElement("li", null, React.createElement("a", {"href": "#", "className": "page-index", "data-page-index": index}, index));
                list.push(li);
            }
            var ul = React.createElement("ul", {"className": "pagination"}, React.createElement("li", {"onClick": this.on_previous.bind(this), "className": "prev-page"}, React.createElement("a", {"className": "fa fa-angle-double-left", "href": "#"})), list, React.createElement("li", {"className": "next-page", "onClick": this.on_next.bind(this)}, React.createElement("a", {"className": "fa fa-angle-double-right", "href": "#"})));
            return ul;
        };
        Pagination.prototype.componentDidMount = function () {
            this.setup_page_actions();
        };
        Pagination.prototype.on_previous = function (e) {
            e.preventDefault();
        };
        Pagination.prototype.on_next = function (e) {
            e.preventDefault();
        };
        Pagination.prototype.setup_page_actions = function () {
            var that = this;
            this.root.find('a[data-page-index="{0}"]'.format(this.props.activepage)).closest('li').addClass('active');
            this.root.find('.page-index').click(function (e) {
                e.preventDefault();
                var index = $(this).attr('data-page-index');
                that.on_pageclick(parseInt(index));
            });
            this.root.find('.prev-page>a').click(function (e) {
                e.preventDefault();
                if (that.props.pagestart === 1) {
                    return;
                }
                that.props.owner.notify({ command: lib.Constants.Commands.pagePrevious, data: that.get_args() });
            });
            this.root.find('.next-page>a').click(function (e) {
                e.preventDefault();
                var limit = that.calc_limits();
                var can_proceed = (that.props.pagestart + that.props.pagesize) < limit.total;
                if (!can_proceed) {
                    return;
                }
                that.props.owner.notify({ command: lib.Constants.Commands.PageNext, data: that.get_args() });
            });
        };
        Pagination.prototype.on_pageclick = function (i) {
            var args = _.extend(this.get_args(), {
                activepage: i
            });
            this.props.owner.notify({ command: lib.Constants.Commands.Paging, data: args }).then(function () {
                utils.scrollToObj('body', 0, 1000);
            });
        };
        Pagination.prototype.get_args = function () {
            var args = {
                activepage: this.props.activepage,
                owner: null,
                pagesize: this.props.pagesize,
                pagestart: this.props.pagestart,
                totalcount: this.props.totalcount
            };
            return args;
        };
        return Pagination;
    })(base.BaseView);
    exports.Pagination = Pagination;
});
//# sourceMappingURL=C:/umarket/umarket.web.ui/js/jx/pagination.js.map