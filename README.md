# react-native-masonry-flat-list

Typescript. React Hooks. Flatlist based. 

## Getting started

```bash
$ npm install react-native-masonry-flat-list --save
```

or

```bash
$ yarn add react-native-masonry-flat-list
```

### methods

- scrollToEnd
- scrollToIndex
- scrollToItem
- scrollToOffset
- clear

### options

- `data: T[]`
- `numColumns: number`
- `renderItem: ListRenderItem<T>`
- `keyExtractor: (item: T) => string`
- `heightExtractor?: (item: T) => number`
- `asyncHeightExtractor?: (item: T) => Promise<number>`
- `onEndReached?: () => void`
- `onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void`
- `columnsFlatListProps?: Omit<FlatListProps<ColumnItem<T>>, 'data' | 'renderItem'>`
- `columnFlatListProps?: Omit<FlatListProps<T>, 'data' | 'renderItem'>`

## Usage Example
TODO

## Credits
Heavily inspired by a few projects below.

https://github.com/hyochan/react-native-masonry-list

https://github.com/Luehang/react-native-masonry-list

https://github.com/ZakZheng/react-native-waterflow-list
