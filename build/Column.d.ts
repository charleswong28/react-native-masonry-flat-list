import { ForwardedRef } from 'react';
import { FlatList, FlatListProps, LayoutChangeEvent, ListRenderItem } from 'react-native';
interface ColumnPropsWithoutRef<T> {
    generateOnLayout: (item: T) => (event: LayoutChangeEvent) => void;
    keyExtractor: (item: T) => string;
    renderItem: ListRenderItem<T>;
    data: T[];
    columnFlatListProps?: Omit<FlatListProps<T>, 'data' | 'renderItem'>;
}
interface ColumnProps<T> extends ColumnPropsWithoutRef<T> {
    ref?: ForwardedRef<FlatList<T>> | undefined;
}
declare function Column<T>({ columnFlatListProps, keyExtractor, renderItem, generateOnLayout, data, }: ColumnProps<T>, ref: ForwardedRef<FlatList<T>>): JSX.Element;
declare const _default: <T>(props: ColumnProps<T>) => ReturnType<typeof Column>;
export default _default;
