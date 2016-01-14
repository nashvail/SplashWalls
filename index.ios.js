/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
var RandManager = require('./RandManager.js');
var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Component,
  ActivityIndicatorIOS
} = React;

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

  renderResults() {
    var {wallsJSON, isLoading} = this.state;
    if( !isLoading ) {
      return (
        <View>
          {wallsJSON.map((wallpaper, index) => {
            return(
              <Text key={index}>
                {wallpaper.author}
              </Text>
            );
          })}
        </View>
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
  }
});

AppRegistry.registerComponent('SplashWalls', () => SplashWalls);
