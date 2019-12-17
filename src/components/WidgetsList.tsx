import React, { useCallback, useMemo, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  PanGestureHandlerStateChangeEvent,
  State
} from 'react-native-gesture-handler';
import { ITEM_HEIGHT, ITEM_MIN_HEIGHT, ITEM_OFFSET, IWidgetTheme, Widget } from './Widget';

const {
  width: screenWidth,
  height: screenHeight
} = Dimensions.get('screen');

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
  const [offset, setOffset] = useState(0);
  const [position, setPosition] = useState(0);
  const [overScroll, setOverScroll] = useState(0);

  // CALLBACKS
  // const handleFakeListScroll = useCallback(({ nativeEvent: { contentOffset: { y } } }) => {
  //   if (y <= 0) {
  //     setOverScroll(Math.abs(y));
  //   } else {
  //     setOverScroll(0);
  //   }
  //
  //   setPosition(y);
  // }, [overScroll]);

  // RENDERS
  const animatedValues = items.map((val, idx) => ({
    id: idx,
    offset: ITEM_HEIGHT, // 0
    scale: 1.0, // 1.0
    opacity: 1.0, // 1.0
    translate: 0, // ITEM_OFFSET
  }));

  const location = position + offset;
  const effort = location / ITEM_HEIGHT;
  const count = Math.abs(effort);

  // const totalVisibleElements = Math.round(screenHeight / ITEM_HEIGHT) + 3;
  // const invisibleElements = Math.floor(location / (ITEM_HEIGHT + ITEM_OFFSET)) - 1;

  const startOffset = ITEM_HEIGHT - ITEM_MIN_HEIGHT - ITEM_OFFSET;
  const itemHeightWithOffset = ITEM_HEIGHT + ITEM_MIN_HEIGHT;
  const opacityDiv = ITEM_HEIGHT / 2;
  const scaleMul = ITEM_HEIGHT * 5;

  const itemsList = items.map((item, idx) => {
    // const visible = idx >= invisibleElements && idx < invisibleElements + totalVisibleElements;

    const animatedValue = animatedValues[idx];

    if (location >= 0 && idx <= count) {
      const delta = location - (ITEM_HEIGHT * idx);
      const deltaStart = delta - startOffset;

      animatedValue.offset = delta > ITEM_HEIGHT || delta < 0
        ? 0
        : ITEM_HEIGHT - delta;

      if (delta >= startOffset && delta <= itemHeightWithOffset) {
        animatedValue.opacity = 1.0 - deltaStart / opacityDiv;
        animatedValue.scale = 1.0 - deltaStart / scaleMul;
        const ty = delta - startOffset;
        animatedValue.translate = ty < 0 ? 0 : ty / 10;
      } else if (delta >= ITEM_HEIGHT) {
        animatedValue.scale = 0;
        animatedValue.opacity = 0;
      }
    }

    return (
      <Widget
        key={`widget_${idx}`}
        theme={THEMES[themeName]}
        animated={animatedValue}
        label={item.label}
        visible={true}
      >
        {item.content}
      </Widget>
    );
  });

  // const fakeList = useMemo(() => {
  //   const totalHeight = (ITEM_HEIGHT + ITEM_OFFSET) * items.length;
  //
  //   return (
  //     <FlatList
  //       contentContainerStyle={styles.scroll}
  //       showsVerticalScrollIndicator={false}
  //       scrollEventThrottle={16}
  //       onScroll={handleFakeListScroll}
  //       keyExtractor={(val, idx) => `item_${idx}`}
  //       data={[0]}
  //       renderItem={() => (
  //         <View
  //           pointerEvents="none"
  //           style={{
  //             height: totalHeight
  //           }}
  //         />
  //       )}
  //     />
  //   )
  // }, [items]);

  const handleGestureEvent = useCallback(({ nativeEvent }: PanGestureHandlerGestureEvent) => {
    setOffset(nativeEvent.translationY * -1);
  }, []);

  const handleHandlerStateChange = useCallback(({ nativeEvent }: PanGestureHandlerStateChangeEvent) => {
    if (nativeEvent.state === State.BEGAN) {
      setOffset(nativeEvent.translationY * -1);
    }

    if (nativeEvent.state === State.END) {
      setOffset(0);

      const newPosition = position + nativeEvent.translationY * -1;

      setPosition(newPosition >= 0 ? newPosition : 0);
    }
  }, [position]);

  return (
    <View style={styles.container}>
      <PanGestureHandler
        minPointers={1}
        maxPointers={1}
        onGestureEvent={handleGestureEvent}
        onHandlerStateChange={handleHandlerStateChange}
      >
        <View
          style={[styles.widgetsListContainer, {
            transform: [
              { translateY: overScroll }
            ]
          }]}
        >
          {itemsList}
        </View>
      </PanGestureHandler>
      {/*{fakeList}*/}
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
