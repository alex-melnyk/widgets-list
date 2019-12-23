import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Animated, Dimensions, StyleSheet, View } from 'react-native';
import {
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
  PanGestureHandlerStateChangeEvent,
  State
} from 'react-native-gesture-handler';
import { ITEM_HEIGHT, ITEM_MIN_HEIGHT, ITEM_OFFSET, IWidgetTheme, Widget, WidgetAnimatedProps } from './Widget';

const MINIMUM_ITEM_HEIGHT = (ITEM_MIN_HEIGHT + 5);

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
  const [animatedValues, setAnimatedValues] = useState<WidgetAnimatedProps[]>([]);
  const positionAnimation = useMemo(() => new Animated.Value(0), []);
  const velocityAnimation = useMemo(() => new Animated.Value(0), []);
  const totalHeight = useMemo(() => {
    return animatedValues.length * ITEM_HEIGHT - screenHeight + ITEM_HEIGHT;
  }, [animatedValues]);

  useEffect(() => {
    const listener = positionAnimation.addListener(({ value }) => setPosition(value));
    return () => positionAnimation.removeListener(listener);
  }, [positionAnimation]);

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
    const location = (position - offset) * -1;
    const processingItems = location / ITEM_HEIGHT;

    animatedValues.forEach((animated, idx) => {
      const offsetSize = ITEM_HEIGHT + (ITEM_HEIGHT * idx - location);

      if (offsetSize < 0) {
        animated.height.setValue(0);
        animated.opacity.setValue(0);
        animated.scale.setValue(0.9);
      } else if (offsetSize > ITEM_HEIGHT) {
        animated.height.setValue(ITEM_HEIGHT);
        animated.opacity.setValue(1.0);
        animated.scale.setValue(1.0);
      } else {
        const definedSize = offsetSize >= ITEM_HEIGHT
          ? ITEM_HEIGHT
          : offsetSize >= 0
            ? offsetSize
            : 0;

        const definedScale = offsetSize <= MINIMUM_ITEM_HEIGHT
          ? offsetSize / MINIMUM_ITEM_HEIGHT * 0.1 + 0.9
          : 1.0;

        const definedOpacity = offsetSize <= MINIMUM_ITEM_HEIGHT
          ? offsetSize / MINIMUM_ITEM_HEIGHT
          : 1.0;

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
    const newPosition = position - nativeEvent.translationY * -1;

    if (newPosition >= 0) {
      velocityAnimation.setValue(newPosition);
    } else {
      velocityAnimation.setValue(0);
    }

    setOffset(nativeEvent.translationY * -1);
  };

  const handleHandlerStateChange = ({ nativeEvent }: PanGestureHandlerStateChangeEvent) => {
    if (nativeEvent.state === State.BEGAN) {
      velocityAnimation.stopAnimation();
      positionAnimation.stopAnimation();

      setOffset(nativeEvent.translationY * -1);
    }

    if (nativeEvent.state === State.END) {
      const newPosition = position - offset;
      positionAnimation.setValue(newPosition > 0 ? 0 : newPosition);
      setOffset(0);

      if (newPosition > 0) {
        Animated.spring(velocityAnimation, {
          useNativeDriver: true,
          toValue: 0,
          friction: 20
        }).start();
      } else if (Math.abs(newPosition) > (totalHeight)) {
        Animated.spring(positionAnimation, {
          useNativeDriver: true,
          toValue: totalHeight * -1,
          friction: 20
        }).start();
      }
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
