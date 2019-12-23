import React, { useMemo } from 'react';
import { Animated, StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';

export const ITEM_HEIGHT = 150;
export const ITEM_MIN_HEIGHT = 40;
export const ITEM_OFFSET = 8;

export type IWidgetTheme = {
  blurTint: 'default' | 'dark' | 'light',
  headerTextColor: string;
};

export type WidgetAnimatedProps = {
  id: number;
  height: Animated.Value;
  translate: Animated.Value;
  scale: Animated.Value;
  opacity: Animated.Value;
};

type Props = {
  theme: IWidgetTheme
  animated: WidgetAnimatedProps;
  label: string;
};

export const Widget: React.FC<Props> = ({
  children,
  theme,
  animated,
  label
}) => {
  const headerBlock = useMemo(() => (
    <View
      style={[styles.widgetHeader, {
        height: ITEM_MIN_HEIGHT
      }]}
    >
      <View style={styles.widgetHeaderIcon}/>
      <Text
        style={[styles.widgetHeaderLabel, {
          color: theme.headerTextColor
        }]}
      >
        {label}
      </Text>
    </View>
  ), [theme, label]);

  const contentBlock = useMemo(() => (
    <View style={styles.widgetWrapperContainer}>
      <View style={styles.widgetWrapper}>
        {children}
      </View>
    </View>
  ), [children]);

  return (
    <Animated.View
      style={{
        transform: [
          { translateY: animated.translate },
          { scaleY: animated.scale },
          { scaleX: animated.scale }
        ],
        opacity: animated.opacity
      }}
    >
      <Animated.View
        style={{
          minHeight: ITEM_MIN_HEIGHT + ITEM_OFFSET,
          height: animated.height
        }}
      >
        <BlurView
          tint={theme.blurTint}
          intensity={100}
          style={[styles.widgetBlurredContainer, {
            marginBottom: ITEM_OFFSET
          }]}
        >
          {headerBlock}
          {contentBlock}
        </BlurView>
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  widgetBlurredContainer: {
    flex: 1,
    overflow: 'hidden',
    borderRadius: 12,
    backgroundColor: '#393E41'
  },
  widgetHeader: {
    paddingHorizontal: ITEM_OFFSET,
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    position: 'absolute'
  },
  widgetHeaderIcon: {
    width: 20,
    height: 20,
    borderRadius: 6,
    backgroundColor: '#FFFFFF9B'
  },
  widgetHeaderLabel: {
    marginHorizontal: ITEM_OFFSET,
    flex: 1,
    fontSize: 14,
    textTransform: 'uppercase'
  },
  widgetWrapperContainer: {
    margin: ITEM_OFFSET,
    marginTop: ITEM_MIN_HEIGHT,
    flex: 1,
    overflow: 'hidden'
  },
  widgetWrapper: {
    position: 'absolute',
    bottom: ITEM_OFFSET,
    width: '100%'
  }
});
