/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
var NetworkImage = require('react-native-image-progress');
var Progress = require('react-native-progress');
var Swiper = require('react-native-swiper');
var RandManager = require('./RandManager.js');
var Utils = require('./Utils.js');
var React = require('react-native');

// Components 
var ProgressHUD = require('./ProgressHUD.js');

var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Component,
  ActivityIndicatorIOS,
  Dimensions,
  PanResponder,
  CameraRoll,
  AlertIOS
} = React;

var {width, height} = Dimensions.get('window');

const NUM_WALLPAPERS = 5;
const DOUBLE_TAP_DELAY = 300; // milliseconds
const DOUBLE_TAP_RADIUS = 20;

class SplashWalls extends Component{
  constructor(props) {
    super(props);

    this.state = {
      wallsJSON: [],
      isLoading: true,
      isHudVisible: false
    };

    this.imagePanResponder = {};

    // Previous touch information
    this.prevTouchInfo = {
      prevTouchX: 0,
      prevTouchY: 0,
      prevTouchTimeStamp: 0
    };

    this.currentWallIndex = 0;

    // Binding this to methods
    this.handlePanResponderGrant = this.handlePanResponderGrant.bind(this);
    this.onMomentumScrollEnd = this.onMomentumScrollEnd.bind(this);

  }

  componentDidMount() {
    this.fetchWallsJSON();      
  }

  componentWillMount() {
    this.imagePanResponder = PanResponder.create({
      onStartShouldSetPanResponder: this.handleStartShouldSetPanResponder,
      onPanResponderGrant: this.handlePanResponderGrant,
      onPanResponderRelease: this.handlePanResponderEnd,
      onPanResponderTerminate: this.handlePanResponderEnd
    });
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

  saveCurrentWallpaperToCameraRoll() {
    console.log('this function was called', this);
    var {wallsJSON} = this.state;
    var currentWall = wallsJSON[this.currentWallIndex];
    var currentWallURL = `http://unsplash.it/${currentWall.width}/${currentWall.height}?image=${currentWall.id}`;

    this.setState({isHudVisible: true});

    CameraRoll.saveImageWithTag(currentWallURL, (data) => {
      console.log('Now I am inside this function');
      this.setState({isHudVisible: false});
      AlertIOS.alert(
        'Saved',
        'Wallpaper successfully saved to Camera Roll',
        [
          {text: 'High 5!', onPress: () => console.log('OK Pressed!')}
        ]
      );
    },(err) =>{
      console.log('Error saving to camera roll', err);
    });

  }

  onMomentumScrollEnd(e, state, context) {
    this.currentWallIndex = state.index;
  }

  renderResults() {
    var {wallsJSON, isHudVisible} = this.state;
    return (
      <View>
      <Swiper
        activeDot={<View style={{backgroundColor: '#fff', width: 13, height: 13, borderRadius: 7, marginLeft: 7, marginRight: 7}} />}
        onMomentumScrollEnd={this.onMomentumScrollEnd}
        index={this.currentWallIndex}
        loop={false}>
        {wallsJSON.map((wallpaper, index) => {
          return(
            <View key={wallpaper.id}>
              <NetworkImage
                source={{uri: `https://unsplash.it/${wallpaper.width}/${wallpaper.height}?image=${wallpaper.id}`}}
                indicator={Progress.Circle}
                indicatorProps={{
                  color: 'rgba(255, 255, 255)',
                  size: 60,
                  thickness: 7
                }}
                threshold={0}
                style={styles.wallpaperImage}
                {...this.imagePanResponder.panHandlers}>

                  <Text style={styles.label}>Photo by</Text>
                  <Text style={styles.label_authorName}>{wallpaper.author}</Text>

              </NetworkImage>
            </View>
          );
        })}
      </Swiper>
      <ProgressHUD width={width} height={height} isVisible={isHudVisible}/>
      </View>
    );
  }

  // Pan Handler methods
  handleStartShouldSetPanResponder(e, gestureState){
    return true;
  }

  handlePanResponderGrant(e, gestureState) {
    var currentTouchTimeStamp = Date.now();

    if( this.isDoubleTap(currentTouchTimeStamp, gestureState) ) 
      this.saveCurrentWallpaperToCameraRoll();

    this.prevTouchInfo = {
      prevTouchX: gestureState.x0,
      prevTouchY: gestureState.y0,
      prevTouchTimeStamp: currentTouchTimeStamp
    };
  }

  handlePanResponderEnd(e, gestureState) {
    // When finger is pulled up from the screen
  }

  isDoubleTap(currentTouchTimeStamp, {x0, y0}) {
    var {prevTouchX, prevTouchY, prevTouchTimeStamp} = this.prevTouchInfo;
    var dt = currentTouchTimeStamp - prevTouchTimeStamp;

    return (dt < DOUBLE_TAP_DELAY && Utils.distance(prevTouchX, prevTouchY, x0, y0) < DOUBLE_TAP_RADIUS);
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
