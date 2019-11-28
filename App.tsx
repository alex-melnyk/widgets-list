import React from 'react';
import { Image, StyleSheet, Text, SafeAreaView, TouchableOpacity, View } from 'react-native';
import { randomColor, randomName } from './src/utils';
import { WidgetsList } from './src/components';

const THEMES = {
  light: {
    image: 'https://www.droidviews.com/wp-content/uploads/2019/06/ios-13-wallpaper-droidviews-04.jpg'
  },
  dark: {
    image: 'https://www.droidviews.com/wp-content/uploads/2019/06/ios-13-wallpaper-droidviews-01.jpg'
  }
};

const theme = THEMES['dark'];

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

const ITEMS = [...new Array(10)].map(() => ({
  label: randomName(),
  content: (
    <View
      pointerEvents="box-none"
      style={styles.widgetContent}
    >
      {[...new Array(4)].map((item, idx) => (
        <View
          pointerEvents="box-none"
          key={`wiget_content_item_${idx}`}
        >
          <TouchableOpacity
            style={[styles.widgetContentIcon, {
              backgroundColor: randomColor()
            }]}
            onPress={() => console.log('OK')}
          />
          <Text
            style={[styles.widgetContentIconLabel, {
              color: 'white'
            }]}
          >
            {randomName()}
          </Text>
        </View>
      ))}
    </View>
  )
}));

const App = () => {
  return (
    <View style={styles.rootContainer}>
      <View style={styles.backContainer}>
        <Image
          source={{ uri: theme.image }}
          style={styles.backImage}
        />
      </View>
      <SafeAreaView style={styles.screen}>
        <WidgetsList
          themeName="dark"
          items={ITEMS}
        />
      </SafeAreaView>
    </View>
  );
};

export default App;
