/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
var NetworkImage = require('react-native-image-progress');
var Progress = require('react-native-progress');
var Swiper = require('react-native-swiper');
var RandManager = require('./RandManager.js');
var React = require('react-native');


var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Component,
  ActivityIndicatorIOS,
  Dimensions 
} = React;

var {width, height} = Dimensions.get('window');

const NUM_WALLPAPERS = 5;

class SplashWalls extends Component{
  constructor(props) {
    super(props);

    this.state = {
      wallsJSON: [],
      isLoading: true,
      randomWallIds: [],
      currentWallIndex: 0
    };

  }

  componentDidMount() {
    this.fetchWallsJSON();      
  }

  render() {
    var {isLoading} = this.state;
    if(isLoading)
      return this.renderLoadingMessage();
    else
      return this.renderResults();
  }

  fetchWallsJSON() {
    var url = 'http://unsplash.it/list';
    fetch(url)
      .then( response => response.json() )
      .then( jsonData => {
        var randomIds = RandManager.uniqueRandomNumbers(NUM_WALLPAPERS, 0, jsonData.length);
        var walls = [];
        randomIds.forEach(index => {
          walls.push(jsonData[index]);
        });

        this.setState({
          isLoading: false,
          randomWallIds: [].concat(randomIds),
          wallsJSON: [].concat(walls)
        });
      })
      .catch( error => console.log('JSON Fetch error : ' + error) );
  }

  renderLoadingMessage() {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicatorIOS
          animating={true}
          color={'#fff'}
          size={'small'} 
          style={{margin: 15}} />
          <Text style={{color: '#fff'}}>Contacting Unsplash</Text>
      </View>
    );
  }

  onMomentumScrollEnd() {
    console.log('The screen was swiped');
  }

  renderResults() {
    var {wallsJSON, isLoading} = this.state;
    if( !isLoading ) {
      return (
        <Swiper
          showsPagination={false}
          showsHorizontalScrollIndicator={true}
          onMomentumScrollEnd={this.onMomentumScrollEnd}>
          {wallsJSON.map((wallpaper, index) => {
            return(
              <View key={index}>
                <NetworkImage
                  source={{uri: `https://unsplash.it/${width}/${height}?image=${wallpaper.id}`}}
                  indicator={Progress.Circle}
                  indicatorProps={{
                    showsText: true,
                    color: 'rgba(255, 255, 255)',
                    size: 60,
                    thickness: 7,
                    textStyle: {
                      color: '#fff',
                      fontWeight: 'bold'
                    }
                  }}
                  style={styles.wallpaperImage}>

                    <Text style={styles.label}>Photo by</Text>
                    <Text style={styles.label_authorName}>{wallpaper.author}</Text>

                </NetworkImage>
              </View>
            );
          })}
        </Swiper>
      );
    }
  }

};

var styles = StyleSheet.create({
  loadingContainer: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000'
  },
  wallpaperImage: {
    flex: 1,
    width: width,
    height: height,
    backgroundColor: '#000'
  },
  label: {
    position: 'absolute',
    color: '#fff',
    fontSize: 13,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 2,
    paddingLeft: 5,
    top: 20,
    left: 20,
    width: width/2
  },
  label_authorName: {
    position: 'absolute',
    color: '#fff',
    fontSize: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    padding: 2,
    paddingLeft: 5,
    top: 41,
    left: 20,
    fontWeight: 'bold',
    width: width/2
  }
});

AppRegistry.registerComponent('SplashWalls', () => SplashWalls);
