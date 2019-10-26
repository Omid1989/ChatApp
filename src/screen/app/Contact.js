import React, {Component} from 'react';
import {
  FlatList,
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  I18nManager,
  StatusBar,
  PermissionsAndroid,
  DrawerLayoutAndroid,
} from 'react-native';
import {
  Container,
  Header,
  Content,
  Button,
  ListItem,
  Icon,
  Left,
  Body,
  Right,
  Switch,
} from 'native-base';

//import {localStorage} from 'localstorage-polyfill';
//global.localStorage; // now has your in memory localStorage
import Parse from 'parse';
import AsyncStorage from '@react-native-community/async-storage';
import key from '../../constants/Key';

import Contacts from 'react-native-contacts';
import Realm from 'realm';

//import datamessage from '../constants/datamessage';

import {Listmessageview} from '../../components/Listmessageview';
import NavigationView from '../../components/NavigationView';
export class Contact extends Component {
  constructor(props) {
    super(props);
    this.state = {
      senderUsername: this.props.navigation.getParam('senderUsername'),
      selfobjectId: this.props.navigation.getParam('selfobjectId'),
      datamessage: [],
      usernameinAPP: this.props.navigation.getParam('senderUsername'),
      //contacts: [],
    };
    let realm = new Realm({
      schema: [
        {
          name: 'Student_Info',
          properties: {
            student_id: {type: 'int', default: 0},
            selfobjectId_id: 'string',
          },
        },
      ],
    });

    var mydata = realm.objects('Student_Info');
    let {selfobjectId_id} = mydata[0];
    // alert(selfobjectId_id);
    //  alert(JSON.stringify(mydata));
    // alert(this.props.navigation.getParam('selfobjectId'));
    PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
      title: 'مخاطبین',
      message: 'نیازمند دسترسی به مخاطبین  ',
    }).then(() => {
      Contacts.getAll((err, contacts) => {
        if (err === 'denied') {
          // error
        } else {
          let testaray = [];

          contacts.map(value => {
            //alert(value.givenName);
            value.phoneNumbers.map(phone => {
              try {
                //alert(phone.number);
                const Post = Parse.Object.extend('User');
                const query = new Parse.Query(Post);
                query.equalTo('mobile', phone.number);
                query.find().then(results => {
                  let l = JSON.stringify(results);
                  //alert(l);
                  if (l.length == 2) {
                    ////////////////////شماره مخاطبین  ثبت نشده  نرم افزار را ندارد
                  } else {
                    let objectId1 = JSON.parse(JSON.stringify(results[0]));

                    //(testaray = [...testaray, ...objectId1]),
                    // alert(JSON.stringify(testaray));
                    let {objectId} = objectId1;
                    let {username} = objectId1;
                    //alert(objectId);
                    var obj = [];
                    obj.push({
                      image:
                        'https://jobinja.ir/file-secretary/js_avatar_image/js_avatar_image_blob/0/a/6/405435-0a699c3af159beaaaf5439b59a3016574830f3ae/cv_avatar_256x256.jpg',
                      name: username,
                      message: phone.number,
                      date: null,
                      new: 0,
                      objectIdContact: objectId,
                      recipientUsername: username,
                    });
                    this.setState({
                      datamessage: [...this.state.datamessage, ...obj],
                    });
                  }
                });
              } catch (error) {
                alert(error);
              }
            });
          });
        }
      });
    });
  }
  _setDrawer() {
    this.refs['DRAWER'].openDrawer();
  }

  closeDrawer() {
    this.refs['DRAWER'].closeDrawer();
  }
  render() {
    // let drawer = this.refs['DRAWER'];
    let realm = new Realm({
      schema: [
        {
          name: 'Student_Info',
          properties: {
            student_id: {type: 'int', default: 0},
            selfobjectId_id: 'string',
          },
        },
      ],
    });
    var mydata = realm.objects('Student_Info');
    let {selfobjectId_id} = mydata[0];

    const {navigate} = this.props.navigation;
    const {datamessage} = this.state;
    const selfobjectId = selfobjectId_id;
    const {senderUsername} = this.state;
    const {usernameinAPP} = this.state;
    return (
      <DrawerLayoutAndroid
        ref={'DRAWER'}
        drawerWidth={300}
        drawerPosition="right"
        renderNavigationView={() => (
          <NavigationView
            usernameinAPP
            selfobjectId
            senderUsername
            styles
            closeDrawer={this.closeDrawer.bind(this)}
          />
        )}>
        <View style={{flex: 1}}>
          <StatusBar backgroundColor="transparent" translucent={true} />

          <View
            style={{
              elevation: 5,

              backgroundColor: '#225599',

              height: 80,
              flexDirection: 'row-reverse',
              justifyContent: 'space-between',
              padding: 10,
              paddingTop: 40,
              paddingHorizontal: 22,
              paddingBottom: 10,
              //  marginHorizontal: 10,
            }}>
            <Icon
              name="list"
              style={{color: 'rgb(180,180,180)'}}
              onPress={() => {
                this._setDrawer();
              }}
            />
            <Text
              style={{
                fontFamily: 'BNazanin',
                fontWeight: 'bold',
                fontSize: 20,
                color: 'rgb(191,191,191)',
              }}>
              لیست دوستان
            </Text>
            <Icon name="search" style={{color: 'rgb(191,191,191)'}} />
          </View>

          <ScrollView
            style={
              {
                /*
            backgroundColor: '#fff',
            borderTopWidth: 5,
            borderTopColor: '#225599',
            width: '110%',
            alignSelf: 'center',
            position: 'relative',
            paddingHorizontal: 25,
            top: -20,
            zIndex: 1,
            borderRadius: 50,*/
              }
            }>
            {datamessage.map((item, i) =>
              Listmessageview({
                item,
                i,
                navigate,
                selfobjectId,
                senderUsername,
                styles,
              }),
            )}
          </ScrollView>
        </View>
      </DrawerLayoutAndroid>
    );
  }
}

const styles = StyleSheet.create({
  listview: {
    flexDirection: 1,
    flexDirection: 'row-reverse',
    //justifyContent: 'space-between',
    paddingBottom: 10,
    paddingTop: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc',
    margin: 10,
  },
  image: {borderRadius: 50},
  dot: {
    position: 'relative',
    //right: -70,
    top: 30,
    zIndex: 100,
    width: 10,
    height: 10,
    backgroundColor: '#225599',
    borderRadius: 50,
  },
  newmessage: {
    fontWeight: 'bold',
    color: 'rgb(100,100,100)',
    fontFamily: 'BNazanin',
    // fontFamily: 'BNazanin',
  },
  oldmessage: {
    color: 'rgb(191,191,191)',
    fontFamily: 'BNazanin',
  },
});
export default Contact;

/*
<FlatList
data={datamessage}
renderItem={({item, index}) => (
  <Listmessageview key={index} item={item} />
)}
keyExtractor={(item, index) => index}
/>*/
