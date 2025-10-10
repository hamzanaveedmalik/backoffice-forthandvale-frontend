declare module 'react-window' {
  import { ComponentType, CSSProperties, ReactElement } from 'react';

  export interface ListChildComponentProps {
    index: number;
    style: CSSProperties;
  }

  export interface FixedSizeListProps {
    children: ComponentType<ListChildComponentProps>;
    className?: string;
    direction?: 'ltr' | 'rtl';
    height: number | string;
    initialScrollOffset?: number;
    innerRef?: any;
    innerElementType?: any;
    itemCount: number;
    itemSize: number;
    itemKey?: (index: number) => any;
    onItemsRendered?: (props: {
      overscanStartIndex: number;
      overscanStopIndex: number;
      visibleStartIndex: number;
      visibleStopIndex: number;
    }) => void;
    onScroll?: (props: {
      scrollDirection: 'forward' | 'backward';
      scrollOffset: number;
      scrollUpdateWasRequested: boolean;
    }) => void;
    outerRef?: any;
    outerElementType?: any;
    overscanCount?: number;
    style?: CSSProperties;
    width: number | string;
  }

  export class FixedSizeList extends React.Component<FixedSizeListProps> {}
}

