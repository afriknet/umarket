/// <reference path="../../typings/breeze/breeze.d.ts" />
/// <reference path="../../typings/q/q.d.ts" />
/// <reference path="../../typings/underscore/underscore.d.ts" />
/// <reference path="../../typings/jquery/jquery.d.ts" />
/// <reference path="../../typings/knockout/knockout.d.ts" />
/// <reference path="../ts_library/ts_lib.ts" />
// A '.tsx' file enables JSX support in the TypeScript compiler, 
// for more information see the following page on the TypeScript wiki:
// https://github.com/Microsoft/TypeScript/wiki/JSX
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', 'react-dom', '../library/corebase', '../ts_library/ts_lib'], function (require, exports, React, ReactDOM, core, lib) {
    var AdminView = (function (_super) {
        __extends(AdminView, _super);
        function AdminView() {
            _super.apply(this, arguments);
        }
        AdminView.prototype.render = function () {
            return null;
        };
        AdminView.prototype.componentDidMount = function () {
            var _this = this;
            $('#page-wrapper').load('/master_page.html', function () {
                _this.start_page();
            });
        };
        AdminView.prototype.start_page = function () {
            ReactDOM.render(React.createElement(AdminExplorer, null), $('.content-page')[0]);
        };
        return AdminView;
    })(core.Base.Component);
    exports.AdminView = AdminView;
    var AdminExplorer = (function (_super) {
        __extends(AdminExplorer, _super);
        function AdminExplorer() {
            _super.apply(this, arguments);
        }
        AdminExplorer.prototype.render = function () {
            var html = React.createElement("div", {"className": "col-lg-12"}, this.init_explorer());
            return html;
        };
        AdminExplorer.prototype.init_explorer = function () {
            var props = {
                owner: this,
                resourceName: 'item',
                serviceName: 'item-srv',
                dataTableProps: {
                    allow_edit: true,
                    allow_delete: true,
                    resourceName: 'item',
                    serviceName: 'item-srv',
                    counting: true,
                    serverSide: true,
                    spinner: null,
                    get_sql: function () {
                        var sql = 'select * from item';
                        return sql;
                    },
                    get_orderBy: function () {
                        return 'itemname';
                    },
                    tblSettings: {
                        columns: [
                            { title: 'Produit', data: 'itemname' },
                            { title: 'Description', data: 'itemdescr' },
                        ]
                    }
                }
            };
            return React.createElement(ProductsExplorer, React.__spread({}, props));
        };
        return AdminExplorer;
    })(core.Base.Component);
    var ProductsExplorer = (function (_super) {
        __extends(ProductsExplorer, _super);
        function ProductsExplorer(props) {
            _super.call(this, props);
        }
        ProductsExplorer.prototype.get_dataEntry = function (ID) {
            var props = {
                owner: this,
                AutoLoadID: ID
            };
            return React.createElement(ProductDataEntry, React.__spread({}, props));
        };
        return ProductsExplorer;
    })(core.Views.Explorer);
    var ProductDataEntry = (function (_super) {
        __extends(ProductDataEntry, _super);
        function ProductDataEntry(props) {
            _super.call(this, props);
            this.state = _.extend(this.state, {
                loading: true
            });
        }
        ProductDataEntry.prototype.get_resourceName = function () {
            return 'item';
        };
        ProductDataEntry.prototype.get_serviceName = function () {
            return 'item-srv';
        };
        ProductDataEntry.prototype.render = function () {
            if (this.state.loading) {
                return React.createElement("div", {"className": "text-center"}, React.createElement("i", {"className": "fa fa-spinner fa-spin fa-2x"}));
            }
            var html = React.createElement("div", {"className": "mt10 content-entry col-lg-12 no-padding-l-r"}, this.build_content());
            return html;
        };
        ProductDataEntry.prototype.build_content = function () {
            var _this = this;
            var views = [];
            _.each(this.get_content(), function (info) {
                views.push(React.createElement("h3", null, info.title));
                views.push(React.createElement(Section, {"title": info.title, "datasource": _this.datasource, "getcontent": info.getcontent}));
            });
            return views;
        };
        ProductDataEntry.prototype.init_wizard_view = function () {
            this.$root.steps({
                headerTag: "h3",
                bodyTag: "section",
                transitionEffect: "fade",
                stepsOrientation: "vertical",
                enableFinishButton: 'false',
                enableAllSteps: true,
                enableKeyNavigation: false,
                enablePagination: false,
            });
            this.$root.find('.content').css({ 'background': 'none' });
            _.each(this.$root.find('[aria-controls]'), function (a) {
                $(a).click();
            });
            this.$root.find('[aria-controls]:eq(0)').click();
            this.$root.find('.number').empty();
            this.$root.find('.steps').css('width', '25%');
            this.$root.find('.content').css('margin-top', 0);
        };
        ProductDataEntry.prototype.get_content = function () {
            return [
                {
                    title: 'Profile du produit',
                    getcontent: function (props) {
                        return React.createElement(ProductProfile, React.__spread({}, props));
                    }
                },
                {
                    title: 'Images',
                    getcontent: function (props) {
                        return React.createElement("h3", null, "Images");
                    }
                },
            ];
        };
        ProductDataEntry.prototype.componentDidMount = function () {
            var _this = this;
            this.load_data().then(function () {
                _this.setState({
                    loading: false
                });
            });
        };
        ProductDataEntry.prototype.componentDidUpdate = function () {
            this.init_wizard_view();
        };
        ProductDataEntry.prototype.load_data = function () {
            var d = Q.defer();
            var qry = new breeze.EntityQuery(this.get_resourceName()).where('id', '==', this.props.AutoLoadID);
            this.datasource.fetch(qry).then(function (rsp) {
                d.resolve(true);
            });
            return d.promise;
        };
        return ProductDataEntry;
    })(core.Views.DataEntry);
    var Section = (function (_super) {
        __extends(Section, _super);
        function Section(props) {
            _super.call(this, props);
        }
        Section.prototype.render = function () {
            var ds = this.props.datasource.clone();
            var html = React.createElement("section", null, React.createElement("div", {"className": "heading mb20"}, React.createElement("h4", null, this.props.title)), React.createElement("div", {"className": "col-lg-12 section-content no-padding-l-r", "style": { paddingLeft: 0, paddingRight: 0, minHeight: '400px' }}, this.props.getcontent({ datasource: ds })));
            return html;
        };
        return Section;
    })(core.Base.Component);
    exports.Section = Section;
    var SectionContext = (function (_super) {
        __extends(SectionContext, _super);
        function SectionContext(props) {
            _super.call(this, props);
        }
        return SectionContext;
    })(core.Base.Component);
    var ProductProfile = (function (_super) {
        __extends(ProductProfile, _super);
        function ProductProfile() {
            _super.apply(this, arguments);
        }
        Object.defineProperty(ProductProfile.prototype, "current", {
            get: function () {
                var data = this.props.datasource.dataManager.getEntities('item');
                if (data.length > 0) {
                    return data[0];
                }
                return null;
            },
            enumerable: true,
            configurable: true
        });
        ProductProfile.prototype.componentDidMount = function () {
            this.state.reload = false;
            var __root = $('<div></div>').appendTo(this.$root);
            var templ = $('#ts-product-profile');
            (new ProductProfileView({
                el: __root,
                datacontext: this.current
            })).render();
        };
        ProductProfile.prototype.componentDidUpdate = function () {
            this.state.reload = false;
        };
        ProductProfile.prototype.render = function () {
            return null;
        };
        ProductProfile.prototype.can_looseChanges = function () {
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
        };
        ProductProfile.prototype.cancelEdit = function () {
            var _this = this;
            var that = this;
            var d = Q.defer();
            if (this.props.datasource.dataManager.hasChanges()) {
                this.can_looseChanges().then(function (rsp) {
                    that.props.datasource.dataManager.rejectChanges();
                    _this.setState({
                        realod: true
                    });
                    d.resolve(true);
                }).fail(function () {
                    d.reject(false);
                });
            }
            return d.promise;
        };
        ProductProfile.prototype.saveChanges = function () {
        };
        return ProductProfile;
    })(SectionContext);
    var ProductProfileView = (function (_super) {
        __extends(ProductProfileView, _super);
        function ProductProfileView(options) {
            _.extend(this, {
                template: '#ts-product-profile'
            });
            _super.call(this, options);
        }
        ProductProfileView.prototype.onRender = function () {
            ko.applyBindings(this.options.datacontext, this.$el[0]);
        };
        return ProductProfileView;
    })(lib.Views.BaseView);
});
//# sourceMappingURL=C:/umarket/umarket.web.ui/js/app/admin.js.map