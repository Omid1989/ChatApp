import React, {Component} from 'react';
import {Text, View, ActivityIndicator, NetInfo} from 'react-native';
import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';

//import {createDrawerNavigator} from 'react-navigation-drawer';
import AsyncStorage from '@react-native-community/async-storage';
//import {localStorage} from 'localstorage-polyfill';
//global.localStorage; // now has your in memory localStorage
import Parse from 'parse';

import key from '../constants/Key';
import {Login} from '../screen/register/Login';
import {SignOut} from '../screen/register/SignOut';
import {Authentication} from '../screen/register/Authentication'; ////

const AuthStack = createStackNavigator({
  SignOut: {
    screen: SignOut,
    navigationOptions: ({navigation}) => ({
      header: null,
    }),
  },
  login: {
    screen: Login,
    navigationOptions: ({navigation}) => ({
      header: null,
    }),
  },
  Authentication: {
    screen: Authentication,
    navigationOptions: ({navigation}) => ({header: null}),
  },
});

import {Messagelist} from '../screen/app/Messagelist';
import {ChatRom} from '../screen/app/ChatRom';
import Contact from '../screen/app/Contact';

//import {parse} from 'handlebars';
//import {parse} from 'react-native-svg';

const mainstack = createStackNavigator({
  Messagelist: {
    screen: Messagelist,
    navigationOptions: ({navigation}) => ({header: null}),
  },
  Contact: {
    screen: Contact,
    navigationOptions: ({navigation}) => ({header: null}),
  },

  ChatRom: {
    screen: ChatRom,
    navigationOptions: ({navigation}) => ({header: null}),
  },
});

class Authloadingscreen extends Component {
  constructor(props) {
    super(props);

    try {
      Parse.setAsyncStorage(AsyncStorage);

      Parse.initialize(
        key.applicationID, // This is your Application ID
        key.javascriptKey, // This is your Javascript key
        key.masterKey,
      );
      Parse.serverURL = key.serverURL; // This is your Server URL
      //Parse.liveQueryServerURL = key.liveQueryServerURL;

      //    const LiveQueryClient = Parse.LiveQueryClient;

      /*  const client = new LiveQueryClient({
        applicationId: key.applicationID,
        serverURL: key.serverURL,
        javascriptKey: key.javascriptKey,
        masterKey: key.masterKey,
      });*/
      //client.open();
    } catch (error) {
      alert(error);
    }

    /*
    var query = new Parse.Query('_User');
    // query.ascending('createdAt').limit(5);
    var subscription = client.subscribe(query);
    subscription.on('delete', todo => {
      alert('On delete event');
    });
    /* subscription.on('create', response => {
      alert('On create event');
    });*/

    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    const usertoken = await AsyncStorage.getItem('userToken');
    this.props.navigation.navigate(usertoken ? 'App' : 'Auth');
    // await AsyncStorage.clear();
  };
  render() {
    return (
      <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
        <ActivityIndicator size="large" />
      </View>
    );
  }
}

export default createAppContainer(
  createSwitchNavigator(
    {
      Authloadingscreen: Authloadingscreen,
      App: mainstack,
      Auth: AuthStack,
    },
    {initialRouteName: 'Authloadingscreen'},
  ),
);
