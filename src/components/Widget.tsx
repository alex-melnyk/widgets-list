import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { BlurView } from 'expo-blur';

export const ITEM_HEIGHT = 150;
export const ITEM_MIN_HEIGHT = 40;
export const ITEM_OFFSET = 8;

export type IWidgetTheme = {
  blurTint: 'default' | 'dark' | 'light',
  headerTextColor: string;
};

type Props = {
  theme: IWidgetTheme
  translate: number;
  scale: number;
  opacity: number;
  offset: number;
  margin: number;
  label: string;
};

export const Widget: React.FC<Props> = ({
  theme,
  translate,
  scale,
  opacity,
  offset,
  margin,
  label,
  children
}) => {
  return (
    <View
      style={{
        transform: [
          { translateY: translate },
          { scaleY: scale },
          { scaleX: scale }
        ],
        opacity: opacity
      }}
    >
      <View
        style={{
          minHeight: ITEM_MIN_HEIGHT + ITEM_OFFSET,
          height: ITEM_HEIGHT - offset
        }}
      >
        <BlurView
          tint={theme.blurTint}
          intensity={100}
          style={[styles.widgetBlurredContainer, {
            marginBottom: margin
          }]}
        >
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
          <View style={styles.widgetWrapperContainer}>
            <View style={styles.widgetWrapper}>
              {children}
            </View>
          </View>
        </BlurView>
      </View>
    </View>
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
