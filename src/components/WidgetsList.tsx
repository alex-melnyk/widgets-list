import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { ITEM_HEIGHT, ITEM_MIN_HEIGHT, ITEM_OFFSET, IWidgetTheme, Widget } from './Widget';

interface ITheme {
  [key: string]: IWidgetTheme;
}

export const THEMES: ITheme = {
  light: {
    blurTint: 'light',
    headerTextColor: '#666666'
  },
  dark: {
    blurTint: 'dark',
    headerTextColor: '#AAAAAA'
  }
};

type Props = {
  themeName: keyof ITheme,
  items: Array<{
    label: string;
    content?: any;
  }>
};

export const WidgetsList: React.FC<Props> = ({ themeName, items }) => {
  const [position, setPosition] = useState(0);
  const [scroll, setScroll] = useState(0);
  const [movePoint, setMovePoint] = useState(0);
  const [captured, setCaptured] = useState(false);

  const itemsList = () => {
    const location = position + scroll;
    const effort = location / ITEM_HEIGHT;
    const count = Math.abs(effort);

    return items.map((item, idx) => {
      let offset = 0;
      let scale = 1.0;
      let opacity = 1.0;
      let margin = ITEM_OFFSET;
      let translate = 0;

      // if (location < 0) {
      //   translate = Math.abs(location);
      // }

      if (idx <= count) {
        const delta = location - (ITEM_HEIGHT * idx);

        offset = delta > ITEM_HEIGHT ? ITEM_HEIGHT : delta < 0 ? 0 : delta;

        const startOffset = ITEM_HEIGHT - ITEM_MIN_HEIGHT - ITEM_OFFSET;

        if (delta >= startOffset && delta <= (ITEM_HEIGHT + ITEM_MIN_HEIGHT)) {
          opacity = 1.0 - (delta - startOffset) / (ITEM_HEIGHT / 2);
          scale = 1.0 - (delta - startOffset) / (ITEM_HEIGHT * 5);
          const ty = delta - startOffset;
          translate = ty < 0 ? 0 : ty / 10;

          const m = ITEM_OFFSET - ITEM_OFFSET * (delta - startOffset) / ITEM_HEIGHT;
          margin = m >= 0 ? m : 0;
        } else if (delta >= ITEM_HEIGHT) {
          scale = 0;
          opacity = 0;
          margin = 0;
        }
      }

      return (
        <Widget
          key={`widget_${idx}`}
          theme={THEMES[themeName]}
          translate={translate}
          scale={scale}
          opacity={opacity}
          offset={offset}
          margin={margin}
          label={item.label}
        >
          {item.content}
        </Widget>
      );
    });
  };

  return (
    <View
      style={[styles.container, {
        // backgroundColor: captured ? '#FF00009B' : 'transparent'
      }]}
      onStartShouldSetResponder={() => true}
      onMoveShouldSetResponder={() => false}
      onResponderGrant={({ nativeEvent: { pageY } }) => {
        setCaptured(true);
        setMovePoint(pageY);
      }}
      onResponderReject={({ nativeEvent: { pageY } }) => {
        setCaptured(false);
        setMovePoint(pageY);
      }}
      onResponderMove={({ nativeEvent: { pageY } }) => {
        if (captured) {
          setScroll(movePoint - pageY);
        }
      }}
      onResponderRelease={() => {
        if (captured) {
          setCaptured(false);
          setPosition(position + scroll);
        }
        setMovePoint(0);
        setScroll(0);
      }}
      onResponderTerminate={() => {
        if (captured) {
          setCaptured(false);
          setPosition(position + scroll);
        }
        setMovePoint(0);
        setScroll(0);
      }}
      onStartShouldSetResponderCapture={() => false}
      onMoveShouldSetResponderCapture={() => true}
    >
      <View
        style={styles.widgetsListContainer}
      >
        {itemsList()}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: ITEM_OFFSET,

  },
  scroll: {
    flexGrow: 1,
    backgroundColor: 'transparent'
  },
  widgetsListContainer: {
    position: 'absolute',
    width: '100%',
  }
});
