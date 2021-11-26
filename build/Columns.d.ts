import { ForwardedRef } from 'react';
import { FlatListProps, ListRenderItem, NativeScrollEvent, NativeSyntheticEvent } from 'react-native';
export interface ColumnItem<T> {
    items: T[];
    itemHeights: Record<string, number>;
    index: number;
    height: number;
}
export interface ColumnsPropsWithoutRef<T> {
    numColumns: number;
    data: T[];
    renderItem: ListRenderItem<T>;
    keyExtractor: (item: T) => string;
    heightExtractor?: (item: T) => number;
    asyncHeightExtractor?: (item: T) => Promise<number>;
    onEndReached?: () => void;
    onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
    columnsFlatListProps?: Omit<FlatListProps<ColumnItem<T>>, 'data' | 'renderItem'>;
    columnFlatListProps?: Omit<FlatListProps<T>, 'data' | 'renderItem'>;
}
export interface ColumnsProps<T> extends ColumnsPropsWithoutRef<T> {
    ref?: ForwardedRef<ColumnsRef<T>> | undefined;
}
export interface ColumnsRef<T> {
    scrollToEnd: (params?: {
        animated?: boolean | undefined;
    } | undefined) => void;
    scrollToIndex: (params: {
        index: number;
        animated?: boolean | undefined;
        viewOffset?: number | undefined;
        viewPosition?: number | undefined;
    }) => void;
    scrollToItem: (params: {
        item: T;
        animated?: boolean | undefined;
        viewPosition?: number | undefined;
    }) => void;
    scrollToOffset: (params: {
        animated?: boolean | undefined;
        offset: number;
    }) => void;
    clear: () => void;
}
declare function Columns<T>({ numColumns, data, renderItem, keyExtractor, heightExtractor, asyncHeightExtractor, onEndReached, onScroll, columnsFlatListProps, columnFlatListProps, }: ColumnsProps<T>, ref: ForwardedRef<ColumnsRef<T>>): JSX.Element;
declare const _default: <T>(props: ColumnsProps<T>) => ReturnType<typeof Columns>;
export default _default;
