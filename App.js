import React, {Component} from 'react';
import {Text, View} from 'react-native';
import AppNavigator from './src/navigation/AppNavigator';

export class App extends Component {
  render() {
    return (
      <View style={{flex: 1}}>
        <AppNavigator />
      </View>
    );
  }
}

export default App;
