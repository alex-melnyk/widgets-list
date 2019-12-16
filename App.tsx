import React, { useEffect, useMemo } from 'react';
import { Image, SafeAreaView, StatusBar, StatusBarStyle, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useColorScheme } from 'react-native-appearance';
import { randomColor, randomName } from './src/utils';
import { WidgetsList } from './src/components';

const APP_THEME_NAME = 'light';

type IAppTheme = {
  [key: string]: {
    statusBar: StatusBarStyle;
    image: string;
    contentColor: string;
  };
};

const AppThemes: IAppTheme = {
  light: {
    statusBar: 'light-content',
    image: 'https://www.droidviews.com/wp-content/uploads/2019/06/ios-13-wallpaper-droidviews-04.jpg',
    contentColor: '#000000'
  },
  dark: {
    statusBar: 'dark-content',
    image: 'https://www.droidviews.com/wp-content/uploads/2019/06/ios-13-wallpaper-droidviews-01.jpg',
    contentColor: '#FFFFFF'
  }
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1
  },
  backContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    width: '100%',
    height: '100%'
  },
  backImage: {
    resizeMode: 'cover',
    width: '100%',
    height: '100%'
  },
  screen: {
    flex: 1
  },
  widgetContent: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  widgetContentIcon: {
    width: 60,
    height: 60,
    borderRadius: 10
  },
  widgetContentIconLabel: {
    marginTop: 4,
    fontSize: 12,
    textAlign: 'center',
  }
});

const App = () => {
  const colorScheme = useColorScheme();
  const appTheme = useMemo(() => AppThemes[colorScheme], [colorScheme]);

  useEffect(() => {
    StatusBar.setBarStyle(appTheme.statusBar, true);
  }, [appTheme]);

  const ITEMS = useMemo(() => [...new Array(10)].map(() => ({
    label: randomName(),
    content: (
      <View style={styles.widgetContent}>
        {[...new Array(4)].map((item, idx) => (
          <View key={`wiget_content_item_${idx}`}>
            <TouchableOpacity
              style={[styles.widgetContentIcon, {
                backgroundColor: randomColor()
              }]}
              onPress={() => console.log('Icon clicked')}
            />
            <Text
              style={[styles.widgetContentIconLabel, {
                color: appTheme.contentColor
              }]}
            >
              {randomName()}
            </Text>
          </View>
        ))}
      </View>
    )
  })), [appTheme]);

  return (
    <View style={styles.rootContainer}>
      <View style={styles.backContainer}>
        <Image
          source={{ uri: appTheme.image }}
          style={styles.backImage}
        />
      </View>
      <SafeAreaView style={styles.screen}>
        <WidgetsList
          themeName={APP_THEME_NAME}
          items={ITEMS}
        />
      </SafeAreaView>
    </View>
  );
};

export default App;
