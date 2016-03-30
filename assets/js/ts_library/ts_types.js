define(["require", "exports"], function (require, exports) {
    (function (SpecsType) {
        SpecsType[SpecsType["enum_list"] = 0] = "enum_list";
    })(exports.SpecsType || (exports.SpecsType = {}));
    var SpecsType = exports.SpecsType;
    (function (ValueType) {
        ValueType[ValueType["text"] = 0] = "text";
        ValueType[ValueType["number"] = 1] = "number";
        ValueType[ValueType["date"] = 2] = "date";
        ValueType[ValueType["price"] = 3] = "price";
        ValueType[ValueType["bool"] = 4] = "bool";
        ValueType[ValueType["color"] = 5] = "color";
    })(exports.ValueType || (exports.ValueType = {}));
    var ValueType = exports.ValueType;
    var LocalDB = (function () {
        function LocalDB(db) {
            this.__db = db;
        }
        Object.defineProperty(LocalDB.prototype, "specs", {
            get: function () {
                return this.__db.specs;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LocalDB.prototype, "cats", {
            get: function () {
                return this.__db.cats;
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(LocalDB.prototype, "parts", {
            get: function () {
                return this.__db.parts;
            },
            enumerable: true,
            configurable: true
        });
        LocalDB.prototype.specs_toArray = function () {
            var _this = this;
            var data = _.map(Object.keys(this.specs), function (k) {
                _this.specs[k].name = k;
                return _this.specs[k];
            });
            return data;
        };
        LocalDB.prototype.specs_values_toArray = function (name) {
            var specs = this.specs[name];
            return specs.values;
        };
        LocalDB.prototype.cats_toArray = function () {
            var _this = this;
            var data = _.map(Object.keys(this.cats), function (k) {
                var cat = _this.cats[k];
                cat.name = k;
                return cat;
            });
            return data;
        };
        return LocalDB;
    })();
    exports.LocalDB = LocalDB;
});
//# sourceMappingURL=C:/umarket/umarket.web.ui/js/ts_library/ts_types.js.map