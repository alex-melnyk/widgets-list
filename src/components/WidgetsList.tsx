import React, { useCallback, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
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

  // CALLBACKS
  const handleFakeListScroll = useCallback(({ nativeEvent: { contentOffset: { y } } }) => {
    setPosition(y);
  }, []);

  // RENDERS
  const itemsList = useMemo(() => {
    const location = position;
    const effort = location / ITEM_HEIGHT;
    const count = Math.abs(effort);

    const startOffset = ITEM_HEIGHT - ITEM_MIN_HEIGHT - ITEM_OFFSET;
    const itemHeightWithOffset = ITEM_HEIGHT + ITEM_MIN_HEIGHT;
    const opacityDiv =  ITEM_HEIGHT / 2;
    const scaleMul = ITEM_HEIGHT * 5;

    return items.map((item, idx) => {
      let offset = 0;
      let scale = 1.0;
      let opacity = 1.0;
      let margin = ITEM_OFFSET;
      let translate = 0;

      if (location < 0) {
        translate = Math.abs(location);
      }

      if (idx <= count) {
        const delta = location - (ITEM_HEIGHT * idx);
        const deltaStart = delta - startOffset;

        offset = delta > ITEM_HEIGHT
          ? ITEM_HEIGHT
          : delta < 0
            ? 0
            : delta;

        if (delta >= startOffset && delta <= itemHeightWithOffset) {
          opacity = 1.0 - deltaStart / opacityDiv;
          scale = 1.0 - deltaStart / scaleMul;
          const ty = delta - startOffset;
          translate = ty < 0 ? 0 : ty / 10;

          const m = ITEM_OFFSET - (ITEM_OFFSET * deltaStart / ITEM_HEIGHT);
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
  }, [position]);

  const fakeList = useMemo(() => {
    const totalHeight = (ITEM_HEIGHT + ITEM_OFFSET) * items.length;

    return (
      <FlatList
        contentContainerStyle={styles.scroll}
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={32}
        onScroll={handleFakeListScroll}
        keyExtractor={(val, idx) => `item_${idx}`}
        data={[0]}
        renderItem={() => (
          <View
            pointerEvents="none"
            style={{
              height: totalHeight
            }}
          />
        )}
      />
    )
  }, [items]);

  return (
    <View style={styles.container}>
      <View style={styles.widgetsListContainer}>
        {itemsList}
      </View>
      {fakeList}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: ITEM_OFFSET
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
