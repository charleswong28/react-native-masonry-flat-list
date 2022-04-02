import * as _ from 'lodash';
import * as React from 'react';
import {
  ForwardedRef, useState, useMemo, useCallback, useEffect, useImperativeHandle, forwardRef, useRef,
  MutableRefObject, LegacyRef,
} from 'react';
import {
  FlatList,
  FlatListProps,
  LayoutChangeEvent,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import Column from './Column';
import usePrevious from './usePrevious';

const generateDefaultItems = (numColumns: number) => Array(numColumns)
  .fill('')
  .map((_, index) => ({
    items: [],
    itemHeights: {},
    index,
    height: 0,
  }));

export interface ColumnItem<T> {
  items: T[],
  /* Hash for checking existence and height */
  itemHeights: Record<string, number>,
  index: number,
  height: number,
}

export interface ColumnsPropsWithoutRef<T> {
  numColumns: number
  data: T[]
  renderItem: ListRenderItem<T>
  keyExtractor: (item: T) => string
  heightExtractor?: (item: T) => number
  asyncHeightExtractor?: (item: T) => Promise<number>
  onEndReached?: () => void
  onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void

  columnsFlatListProps?: Omit<FlatListProps<ColumnItem<T>>, 'data' | 'renderItem'>
  columnFlatListProps?: Omit<FlatListProps<T>, 'data' | 'renderItem'>
}

export interface ColumnsProps<T> extends ColumnsPropsWithoutRef<T> {
  ref?: ForwardedRef<ColumnsRef<T>> | undefined,
}

export interface ColumnsRef<T> {
  scrollToEnd: (params?: {
    animated?: boolean | undefined,
  } | undefined) => void
  scrollToIndex: (params: {
    index: number,
    animated?: boolean | undefined,
    viewOffset?: number | undefined,
    viewPosition?: number | undefined,
  }) => void
  scrollToItem: (params: {
    item: T,
    animated?: boolean | undefined,
    viewPosition?: number | undefined,
  }) => void
  scrollToOffset: (params: {
    animated?: boolean | undefined,
    offset: number,
  }) => void
  clear: () => void
}

function Columns<T>({
  numColumns, data, renderItem, keyExtractor, heightExtractor, asyncHeightExtractor, onEndReached,
  onScroll, columnsFlatListProps, columnFlatListProps,
}: ColumnsProps<T>, ref: ForwardedRef<ColumnsRef<T>>) {
  const previousData = usePrevious<T[]>(data);
  const listRef = useRef<FlatList<ColumnItem<T>> | null>(null);
  const columnsRef = useRef<FlatList<T>[]>([]);
  const columns = useRef<ColumnItem<T>[]>(generateDefaultItems(numColumns));
  const [, forceUpdate] = useState(false);
  const ids = useMemo(() => data.map(item => keyExtractor(item)), [data]);

  /* Refactored function for saving columns information */
  const saveColumnHeight = useCallback(({
    column, item, height,
  }: {
    column: ColumnItem<T>, item: T, height: number,
  }) => {
    const key = keyExtractor(item);

    const itemHeights = {
      ...column.itemHeights,
      [key]: height,
    };

    const clonedColumn = {
      items: column.itemHeights[key] != null ? column.items : _.sortBy([
        ...column.items,
        item,
      ], (object: T) => ids.indexOf(keyExtractor(object))),
      itemHeights,
      index: column.index,
      height: Object.values(itemHeights).reduce((sum, thisHeight) => sum + thisHeight, 0),
    }

    /* Sort it according to index for rendering */
    columns.current = [
      ...columns.current.filter((thisColumn) => thisColumn.index !== column.index),
      clonedColumn,
    ].sort((itemA, itemB) => itemA.index - itemB.index);
  }, [ids]);

  /* For both initial item adding and onLayout with height */ 
  const addItemWithHeight = useCallback(async ({ item, layoutHeight }: {
    item: T, layoutHeight?: number | undefined,
  }) => {
    const key = keyExtractor(item);
    let targetColumn = columns.current.find((column) => (column.itemHeights[key] != null));
    if (targetColumn == null) {
      /* If item does not exist in any column, targetColumn is the column with minimum height */
      targetColumn = columns.current.reduce(
        (min, column) => column.height < min.height ? column : min,
        columns.current[0],
      );
    }

    if (targetColumn != null) {
      let height = 0;
      if (layoutHeight != null) {
        height = layoutHeight;
      } else {
        if (heightExtractor != null) {
          height = heightExtractor(item);
        }

        if (asyncHeightExtractor != null) {
          asyncHeightExtractor(item).then((asyncHeight) => {
            /* Save again after async call finished */
            if (targetColumn != null) {
              saveColumnHeight({ column: targetColumn, item, height: asyncHeight });
            }
          });
        }
      }

      saveColumnHeight({ column: targetColumn, item, height });
    }
  }, [saveColumnHeight, keyExtractor, heightExtractor, asyncHeightExtractor, columns]);

  /* Add Items */
  useEffect(() => {
    const initializeItems = async () => {
      const previousKeys = previousData?.map((item) => keyExtractor(item)) || [];
      const currentKeys = data?.map((item) => keyExtractor(item)) || [];
      const dataNotAdded = data?.filter((item) => !previousKeys.includes(keyExtractor(item))) || [];
      const dataRemoved = previousData?.filter((item) => !currentKeys.includes(keyExtractor(item))) || [];

      if (dataRemoved.length > 0) {
        /* If data is removed, re-constructure the columns */
        columns.current = generateDefaultItems(numColumns);
        await Promise.all(data.map((item) => addItemWithHeight({ item })));

        /* Hacky way to delay re-render to prevent force close */
        setTimeout(() => {
          forceUpdate((bool) => !bool);
        }, 10);
      } else if (dataNotAdded.length > 0) {
        /* If data is changed, clear the result and add item again */
        await Promise.all(dataNotAdded.map((item) => addItemWithHeight({ item })));

        /* Hacky way to delay re-render to prevent force close */
        setTimeout(() => {
          forceUpdate((bool) => !bool);
        }, 10);
      }
    };

    initializeItems();
  }, [data, previousData]);

  useImperativeHandle(ref, () => ({
    scrollToEnd: (params) => {
      listRef?.current?.scrollToEnd(params);
    },
    scrollToIndex: (params) => {
      listRef?.current?.scrollToIndex(params);
    },
    scrollToItem: (params) => {
      const key = keyExtractor(params.item);
      const existingColumn = columns.current.find((column) => column.itemHeights[key]);
      if (existingColumn?.index != null && columnsRef.current[existingColumn.index] != null) {
        columnsRef.current[existingColumn.index]?.scrollToItem(params); 
      }
    },
    scrollToOffset: (params) => {
      listRef?.current?.scrollToOffset(params);
    },
    clear: () => {
      columns.current = generateDefaultItems(numColumns);
      forceUpdate((bool) => !bool);
    },
  }));

  const generateOnLayout = useCallback((item: T) => (event: LayoutChangeEvent) => {
    addItemWithHeight({
      item,
      layoutHeight: event.nativeEvent.layout.height,
    });
  }, [addItemWithHeight]);

  const columnKeyExtractory = useCallback((columnItem: ColumnItem<T>) => `column-${columnItem.index}`, []);
  const dataCache: Record<string, T> = useMemo(() => data.reduce((cache, item) => ({
    ...cache,
    [keyExtractor(item)]: item,
  }), {}), [data]);

  return (
    <FlatList<ColumnItem<T>>
      ref={listRef}
      data={columns.current}
      keyExtractor={columnKeyExtractory}
      onScroll={onScroll}
      onEndReached={onEndReached}
      removeClippedSubviews={true}
      {...columnsFlatListProps}
      contentContainerStyle={[{
        flexDirection: 'row',
        flexWrap: 'wrap',
      }, columnsFlatListProps?.contentContainerStyle || {}]}
      renderItem={({ item }) => {
        return <Column<T>
          ref={{
            current: columnsRef.current[item.index] 
          }}
          key={`item-${item.index}`}
          data={
            item.items
              .map<T | undefined>((thisItem) => dataCache[keyExtractor(thisItem)] || thisItem)
              .filter<T>((thisItem): thisItem is T => thisItem != null)
          }
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          columnFlatListProps={columnFlatListProps}
          generateOnLayout={generateOnLayout}
        />
      }}
      extraData={{
        data, numColumns, renderItem, columnFlatListProps, keyExtractor, heightExtractor, asyncHeightExtractor,
        dataCache,
      }}
    />
  )
}

export default forwardRef(Columns) as <T>(
  props: ColumnsProps<T>,
) => ReturnType<typeof Columns>;
