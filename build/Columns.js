"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_1 = require("react");
var react_native_1 = require("react-native");
var Column_1 = require("./Column");
var usePrevious_1 = require("./usePrevious");
var generateDefaultItems = function (numColumns) { return Array(numColumns)
    .fill('')
    .map(function (_, index) { return ({
    items: [],
    itemHeights: {},
    index: index,
    height: 0,
}); }); };
function Columns(_a, ref) {
    var _this = this;
    var numColumns = _a.numColumns, data = _a.data, renderItem = _a.renderItem, keyExtractor = _a.keyExtractor, heightExtractor = _a.heightExtractor, asyncHeightExtractor = _a.asyncHeightExtractor, onEndReached = _a.onEndReached, onScroll = _a.onScroll, columnsFlatListProps = _a.columnsFlatListProps, columnFlatListProps = _a.columnFlatListProps;
    var previousData = usePrevious_1.default(data);
    var listRef = react_1.useRef(null);
    var columnsRef = react_1.useRef([]);
    var columns = react_1.useRef(generateDefaultItems(numColumns));
    var _b = react_1.useState(false), forceUpdate = _b[1];
    /* Refactored function for saving columns information */
    var saveColumnHeight = react_1.useCallback(function (_a) {
        var _b;
        var column = _a.column, item = _a.item, height = _a.height;
        var key = keyExtractor(item);
        var itemHeights = __assign(__assign({}, column.itemHeights), (_b = {}, _b[key] = height, _b));
        var clonedColumn = {
            items: column.itemHeights[key] != null ? column.items : __spreadArrays(column.items, [
                item,
            ]),
            itemHeights: itemHeights,
            index: column.index,
            height: Object.values(itemHeights).reduce(function (sum, thisHeight) { return sum + thisHeight; }, 0),
        };
        /* Sort it according to index for rendering */
        columns.current = __spreadArrays(columns.current.filter(function (thisColumn) { return thisColumn.index !== column.index; }), [
            clonedColumn,
        ]).sort(function (itemA, itemB) { return itemA.index - itemB.index; });
    }, []);
    /* For both initial item adding and onLayout with height */
    var addItemWithHeight = react_1.useCallback(function (_a) {
        var item = _a.item, layoutHeight = _a.layoutHeight;
        return __awaiter(_this, void 0, void 0, function () {
            var key, targetColumn, height;
            return __generator(this, function (_b) {
                key = keyExtractor(item);
                targetColumn = columns.current.find(function (column) { return (column.itemHeights[key] != null); });
                if (targetColumn == null) {
                    /* If item does not exist in any column, targetColumn is the column with minimum height */
                    targetColumn = columns.current.reduce(function (min, column) { return column.height < min.height ? column : min; }, columns.current[0]);
                }
                if (targetColumn != null) {
                    height = 0;
                    if (layoutHeight != null) {
                        height = layoutHeight;
                    }
                    else {
                        if (heightExtractor != null) {
                            height = heightExtractor(item);
                        }
                        if (asyncHeightExtractor != null) {
                            asyncHeightExtractor(item).then(function (asyncHeight) {
                                /* Save again after async call finished */
                                if (targetColumn != null) {
                                    saveColumnHeight({ column: targetColumn, item: item, height: asyncHeight });
                                }
                            });
                        }
                    }
                    saveColumnHeight({ column: targetColumn, item: item, height: height });
                }
                return [2 /*return*/];
            });
        });
    }, [saveColumnHeight, keyExtractor, heightExtractor, asyncHeightExtractor, columns]);
    /* Add Items */
    react_1.useEffect(function () {
        var initializeItems = function () { return __awaiter(_this, void 0, void 0, function () {
            var previousKeys, currentKeys, dataNotAdded, dataRemoved;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        previousKeys = (previousData === null || previousData === void 0 ? void 0 : previousData.map(function (item) { return keyExtractor(item); })) || [];
                        currentKeys = (data === null || data === void 0 ? void 0 : data.map(function (item) { return keyExtractor(item); })) || [];
                        dataNotAdded = (data === null || data === void 0 ? void 0 : data.filter(function (item) { return !previousKeys.includes(keyExtractor(item)); })) || [];
                        dataRemoved = (previousData === null || previousData === void 0 ? void 0 : previousData.filter(function (item) { return !currentKeys.includes(keyExtractor(item)); })) || [];
                        if (!(dataRemoved.length > 0)) return [3 /*break*/, 2];
                        /* If data is removed, re-constructure the columns */
                        columns.current = generateDefaultItems(numColumns);
                        return [4 /*yield*/, Promise.all(data.map(function (item) { return addItemWithHeight({ item: item }); }))];
                    case 1:
                        _a.sent();
                        /* Hacky way to delay re-render to prevent force close */
                        setTimeout(function () {
                            forceUpdate(function (bool) { return !bool; });
                        }, 10);
                        return [3 /*break*/, 4];
                    case 2:
                        if (!(dataNotAdded.length > 0)) return [3 /*break*/, 4];
                        /* If data is changed, clear the result and add item again */
                        return [4 /*yield*/, Promise.all(dataNotAdded.map(function (item) { return addItemWithHeight({ item: item }); }))];
                    case 3:
                        /* If data is changed, clear the result and add item again */
                        _a.sent();
                        /* Hacky way to delay re-render to prevent force close */
                        setTimeout(function () {
                            forceUpdate(function (bool) { return !bool; });
                        }, 10);
                        _a.label = 4;
                    case 4: return [2 /*return*/];
                }
            });
        }); };
        initializeItems();
    }, [data, previousData]);
    react_1.useImperativeHandle(ref, function () { return ({
        scrollToEnd: function (params) {
            var _a;
            (_a = listRef === null || listRef === void 0 ? void 0 : listRef.current) === null || _a === void 0 ? void 0 : _a.scrollToEnd(params);
        },
        scrollToIndex: function (params) {
            var _a;
            (_a = listRef === null || listRef === void 0 ? void 0 : listRef.current) === null || _a === void 0 ? void 0 : _a.scrollToIndex(params);
        },
        scrollToItem: function (params) {
            var _a;
            var key = keyExtractor(params.item);
            var existingColumn = columns.current.find(function (column) { return column.itemHeights[key]; });
            if ((existingColumn === null || existingColumn === void 0 ? void 0 : existingColumn.index) != null && columnsRef.current[existingColumn.index] != null) {
                (_a = columnsRef.current[existingColumn.index]) === null || _a === void 0 ? void 0 : _a.scrollToItem(params);
            }
        },
        scrollToOffset: function (params) {
            var _a;
            (_a = listRef === null || listRef === void 0 ? void 0 : listRef.current) === null || _a === void 0 ? void 0 : _a.scrollToOffset(params);
        },
        clear: function () {
            columns.current = generateDefaultItems(numColumns);
            forceUpdate(function (bool) { return !bool; });
        },
    }); });
    var generateOnLayout = react_1.useCallback(function (item) { return function (event) {
        addItemWithHeight({
            item: item,
            layoutHeight: event.nativeEvent.layout.height,
        });
    }; }, [addItemWithHeight]);
    var columnKeyExtractory = react_1.useCallback(function (columnItem) { return "column-" + columnItem.index; }, []);
    return (<react_native_1.FlatList ref={listRef} data={columns.current} keyExtractor={columnKeyExtractory} onScroll={onScroll} onEndReached={onEndReached} removeClippedSubviews={true} {...columnsFlatListProps} contentContainerStyle={[{
            flexDirection: 'row',
            flexWrap: 'wrap',
        }, (columnsFlatListProps === null || columnsFlatListProps === void 0 ? void 0 : columnsFlatListProps.contentContainerStyle) || {}]} renderItem={function (_a) {
        var item = _a.item;
        return <Column_1.default ref={{
            current: columnsRef.current[item.index]
        }} key={"item-" + item.index} data={item.items} keyExtractor={keyExtractor} renderItem={renderItem} columnFlatListProps={columnFlatListProps} generateOnLayout={generateOnLayout}/>;
    }}/>);
}
exports.default = react_1.forwardRef(Columns);
//# sourceMappingURL=Columns.js.map