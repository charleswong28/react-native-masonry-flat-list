"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_1 = require("react");
var react_native_1 = require("react-native");
function Column(_a, ref) {
    var columnFlatListProps = _a.columnFlatListProps, keyExtractor = _a.keyExtractor, renderItem = _a.renderItem, generateOnLayout = _a.generateOnLayout, data = _a.data;
    return (<react_native_1.FlatList removeClippedSubviews={true} {...columnFlatListProps} ref={ref} data={data} style={[{ flex: 1, }, columnFlatListProps === null || columnFlatListProps === void 0 ? void 0 : columnFlatListProps.style]} renderItem={function (renderProps) {
        return (<react_native_1.View key={keyExtractor(renderProps.item)} onLayout={generateOnLayout(renderProps.item)}>
            {renderItem(renderProps)}
          </react_native_1.View>);
    }}/>);
}
exports.default = react_1.forwardRef(Column);
//# sourceMappingURL=Column.js.map