import React, { useEffect, useMemo, useState } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  PanGestureHandlerStateChangeEvent,
  State
} from 'react-native-gesture-handler';
import { ITEM_HEIGHT, ITEM_MIN_HEIGHT, ITEM_OFFSET, IWidgetTheme, Widget, WidgetAnimatedProps } from './Widget';

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
  const velocityAnimation = useMemo(() => new Animated.Value(0), []);
  const [offset, setOffset] = useState(0);
  const [position, setPosition] = useState(0);
  const [animatedValues, setAnimatedValues] = useState<WidgetAnimatedProps[]>([]);

  useEffect(() => {
    setAnimatedValues(items.map((val, idx) => ({
      id: idx,
      height: new Animated.Value(ITEM_HEIGHT), // 0
      scale: new Animated.Value(1.0), // 1.0
      opacity: new Animated.Value(1.0), // 1.0
      translate: new Animated.Value(0), // ITEM_OFFSET
    })));
  }, [items]);

  useEffect(() => {
    const minimumItemHeight = ITEM_MIN_HEIGHT + 5;
    const location = (position - offset) * -1;
    const processingItems = location / ITEM_HEIGHT;

    animatedValues.forEach((animated, idx) => {
      const offsetSize = ITEM_HEIGHT + (ITEM_HEIGHT * idx - location);

      if (offsetSize < 0 || offsetSize > ITEM_HEIGHT) {
        const visibility = offsetSize > 0;

        animated.height.setValue(visibility ? ITEM_HEIGHT : 0);
        animated.opacity.setValue(visibility ? 1 : 0);
      } else {
        const definedSize = offsetSize >= ITEM_HEIGHT
          ? ITEM_HEIGHT
          : offsetSize >= 0
            ? offsetSize
            : 0;

        const definedScale = offsetSize <= minimumItemHeight
          ? offsetSize / minimumItemHeight * 0.1 + 0.9
          : 1.0;

        const definedOpacity = offsetSize <= minimumItemHeight
          ? offsetSize / minimumItemHeight
          : 1.0;

        // const definedSize = offsetSize >= ITEM_MIN_HEIGHT
        //   ? offsetSize >= ITEM_HEIGHT
        //     ? ITEM_HEIGHT
        //     : offsetSize
        //   : ITEM_MIN_HEIGHT;

        animated.height.setValue(definedSize);
        animated.scale.setValue(definedScale);
        animated.opacity.setValue(definedOpacity);
      }

      // animated.scale.setValue(defineSize / ITEM_HEIGHT);
    });
  }, [position, offset, animatedValues]);

  // RENDERS
  const itemsList = useMemo(() => {
    if (!animatedValues.length) {
      return null;
    }

    return items.map((item, idx) => {
      const animatedValue = animatedValues[idx];

      return (
        <Widget
          key={`widget_${idx}`}
          theme={THEMES[themeName]}
          animated={animatedValue}
          label={item.label}
        >
          {item.content}
        </Widget>
      );
    })
  }, [animatedValues]);

  const handleGestureEvent = ({ nativeEvent }: PanGestureHandlerGestureEvent) => {
    const currentOffset = nativeEvent.translationY * -1;
    setOffset(currentOffset);
  };

  const handleHandlerStateChange = ({ nativeEvent }: PanGestureHandlerStateChangeEvent) => {
    if (nativeEvent.state === State.BEGAN) {
      setOffset(nativeEvent.translationY * -1);
    }

    if (nativeEvent.state === State.END) {
      // const velocity = nativeEvent.velocityY / 100;
      setOffset(0);

      const newPosition = position - offset;

      setPosition(newPosition <= 0 ? newPosition : 0);
    }
  };

  return (
    <View style={styles.container}>
      <PanGestureHandler
        minPointers={1}
        maxPointers={1}
        onGestureEvent={handleGestureEvent}
        onHandlerStateChange={handleHandlerStateChange}
      >
        <Animated.View
          style={[styles.widgetsListContainer, {
            transform: [
              { translateY: velocityAnimation }
            ]
          }]}
        >
          {itemsList}
        </Animated.View>
      </PanGestureHandler>
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
