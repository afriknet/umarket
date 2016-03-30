/// <reference path="pagination.tsx" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
define(["require", "exports", 'react', 'react-dom', './pagination'], function (require, exports, React, ReactDOM, paging) {
    exports.Api = {
        mount_pagination: function (props, root) {
            if (root.length > 0) {
                ReactDOM.unmountComponentAtNode(root[0]);
            }
            ReactDOM.render(React.createElement(paging.Pagination, React.__spread({}, props)), root[0]);
        }
    };
});
//# sourceMappingURL=C:/umarket/umarket.web.ui/js/jx/jx_brg.js.map