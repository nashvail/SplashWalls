'use strict';

var React = require('react-native');

var {
  StyleSheet,
  Text,
  View,
  Component,
  ActivityIndicatorIOS,
} = React;

class ProgressHUD extends Component {
	constructor(props) {
		super(props);	
	}

	render() {
		var {width, height, isVisible} = this.props;
		if( isVisible ) {
			return(
				<View 
				 style={{
				 	flex: 1,
				 	flexDirection: 'row',
				 	justifyContent: 'center',
				 	alignItems: 'center',
				 	width: width,
				 	height: height,
				 	position: 'absolute',
				 	top: 0,
				 	left: 0,
				 	backgroundColor: 'rgba(0, 0, 0, 0.5)'
				 }}>
				 <ActivityIndicatorIOS
	          animating={true}
	          color={'#fff'}
	          size={'small'} 
	          style={{margin: 15}} />
				</View>	

			);
		} else {
			return(<View></View>);
		}
	}	
};

module.exports = ProgressHUD;