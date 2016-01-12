/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';

var React = require('react-native');
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Component,
  ActivityIndicatorIOS
} = React;

class SplashWalls extends Component{
  constructor(props) {
    super(props);

    this.state = {
      wallsJSON: [],
      isLoading: true
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
        console.log(jsonData);
        this.setState({isLoading: false});
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
    return (
      <View>
        <Text>
          Data loaded
        </Text>
      </View>
    );
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
