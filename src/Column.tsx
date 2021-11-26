import * as React from 'react'
import { forwardRef, ForwardedRef, ReactElement } from 'react';
import { FlatList, View, FlatListProps, LayoutChangeEvent, ListRenderItem } from 'react-native';

interface ColumnPropsWithoutRef<T> {
  generateOnLayout: (item: T) => (event: LayoutChangeEvent) => void
  keyExtractor: (item: T) => string
  renderItem: ListRenderItem<T>
  data: T[]
  columnFlatListProps?: Omit<FlatListProps<T>, 'data' | 'renderItem'>
}

interface ColumnProps<T> extends ColumnPropsWithoutRef<T> {
  ref?: ForwardedRef<FlatList<T>> | undefined,
}

function Column<T>({
  columnFlatListProps, keyExtractor, renderItem, generateOnLayout, data,
}: ColumnProps<T>, ref: ForwardedRef<FlatList<T>>) {
  return (
    <FlatList<T>
      removeClippedSubviews={true}
      {...columnFlatListProps}
      ref={ref}
      data={data}
      style={[{ flex: 1, }, columnFlatListProps?.style]}
      renderItem={(renderProps) => {
        return (
          <View
            key={keyExtractor(renderProps.item)}
            onLayout={generateOnLayout(renderProps.item)}
          >
            {renderItem(renderProps)}
          </View>
        );
      }}
    />
  );
}

export default forwardRef(Column) as <T>(
  props: ColumnProps<T>,
) => ReturnType<typeof Column>;
