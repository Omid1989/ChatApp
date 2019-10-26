import React, {Component} from 'react';
import {
  FlatList,
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  YellowBox,
  ScrollView,
  I18nManager,
  StatusBar,
  DrawerLayoutAndroid,
} from 'react-native';
import {Header, Right, Content, Left, Icon} from 'native-base';
//import {localStorage} from 'localstorage-polyfill';
//global.localStorage; // now has your in memory localStorage
import Parse from 'parse';
//import AsyncStorage from '@react-native-community/async-storage';
import key from '../../constants/Key';
import Realm from 'realm';
import NavigationView from '../../components/NavigationView';

import {Listmessageview} from '../../components/Listmessageview';

//import datamessage from '../constants/datamessage';

export class Messagelist extends Component {
  constructor(props) {
    super(props);
    this.state = {
      //  realm: null,
      datamessage: [],
      selfobjectId: this.props.navigation.getParam('objectId'),
      senderUsername: this.props.navigation.getParam('senderUsername'),
      usernameinAPP: null,
      selfobjectId_id: this.props.navigation.getParam('objectId'),
      // dataSource: null,
    };

    let realm = new Realm({
      //CREAT DATABASE
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
    realm.write(() => {
      //ADD DATA
      var ID = realm.objects('Student_Info').length + 1;
      //var mydata = realm.objects('Student_Info');
      // alert(JSON.stringify(mydata));
      if (ID <= 1) {
        realm.create('Student_Info', {
          student_id: ID,
          selfobjectId_id: this.state.selfobjectId_id,
        });
      }
    });

    //var mydata = realm.objects('Student_Info');

    // realm.write(() => {
    ///DELET
    //  var ID = this.state.Student_Id - 1;
    //  realm.delete(realm.objects('Student_Info')[0]);
    //});

    YellowBox.ignoreWarnings([
      'Warning: componentWillMount is deprecated',
      'Warning: componentWillReceiveProps is deprecated',
      'Warning: isMounted(...) is deprecated',
      'Module RCTImageLoader',
    ]);
    /* UPDATE
    realm.write(() => {
 
      var ID = this.state.Student_Id - 1;

      var obj = realm.objects('Student_Info');

      obj[ID].student_name = this.state.Student_Name;
      obj[ID].student_class = this.state.Student_Class;
      obj[ID].student_subject = this.state.Student_Subject;

     });*/
    // let {selfobjectId_id} = mydata[0];
    // alert(JSON.stringify(mydata));
    //let ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    //let {selfobjectId_id} = mydata[0];
    try {
      const LiveQueryClient = Parse.LiveQueryClient;
      const client = new LiveQueryClient({
        applicationId: key.applicationID,
        serverURL: key.serverURL,
        javascriptKey: key.javascriptKey,
        masterKey: key.masterKey,
      });
      client.open();
      var query = new Parse.Query('Message');
      // query.ascending('createdAt').limit(5);
      var subscription = client.subscribe(query);
      subscription.on('create', todo => {
        let object = JSON.parse(JSON.stringify(todo));
        let {threadID} = object; ////شماره ای دی threed گه تازه ثبنت شده
        this.state.datamessage.map((item, i) => {
          if (item.threadID == threadID) {
            let {body} = object;
            this.setState(prevState => {
              let newArray = prevState.datamessage;
              newArray[i]['message'] = body;
              return {datamessage: newArray};
            });
          }
        });

        //this._getMessageRecive();
      });
    } catch (error) {
      alert(error);
    }
  }

  componentDidMount = async () => {
    try {
      this._getMessageRecive();
    } catch (error) {
      alert(error);
    }
  };
  _getMessageRecive = async () => {
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
    //  alert(selfobjectId_id);

    let iduser = this.state.selfobjectId;
    !this.state.selfobjectId && (iduser = selfobjectId_id); //درصورنی داده stat پاک شده بود از جدول بگیر

    const Post = Parse.Object.extend('ChatThread');
    // const query = new Parse.Query(Post);

    ////در صورتی که درخواست چت وجود داشت از طرف شما
    const senderId = new Parse.Query(Post);
    senderId.equalTo('senderId', iduser);

    const recipientId = new Parse.Query(Post);
    recipientId.equalTo('recipientId', iduser);
    const composedQuery = Parse.Query.or(senderId, recipientId);
    composedQuery.find().then(results => {
      let l = JSON.stringify(results);
      if (l.length === 2) {
      } else {
        //let ChatThread = JSON.parse(JSON.stringify(results[0]));

        //   alert(JSON.stringify(results));
        Object.keys(results).map(key => {
          let objectId1 = JSON.parse(JSON.stringify(results[key]));
          // alert(JSON.stringify(results[key]));

          let {objectId} = objectId1;

          let {senderUsername} = objectId1;
          let {senderId} = objectId1;

          let {recipientUsername} = objectId1;
          let {recipientId} = objectId1;
          let name = null;
          let idcontact = null;
          if (senderId == iduser) {
            name = recipientUsername;
            idcontact = recipientId;
            this.setState({usernameinAPP: senderUsername});
          } else {
            name = senderUsername;
            idcontact = senderId;
            this.setState({usernameinAPP: recipientUsername});
          }

          let newmessage = '';
          const Message = Parse.Object.extend('Message');
          const query = new Parse.Query(Message);
          query.equalTo('threadID', objectId);
          query.descending('createdAt');
          query.limit(1);
          query.find().then(
            resul => {
              let ob = JSON.parse(JSON.stringify(resul[0]));
              // alert(ob);
              let {body} = ob;
              newmessage = body;
              let {createdAt} = ob;
              let {seeRec} = ob;
              let {senderID} = ob;
              let newm = 0;
              if (senderID != iduser) {
                if (seeRec == '0') {
                  newm = 1;
                }
              }
              // alert(body);
              //   console.log('Message found', results);
              var obj = [];
              obj.push({
                image:
                  'https://jobinja.ir/file-secretary/js_avatar_image/js_avatar_image_blob/0/a/6/405435-0a699c3af159beaaaf5439b59a3016574830f3ae/cv_avatar_256x256.jpg',
                name: name,
                message: newmessage,
                date: createdAt,
                new: newm,
                objectIdContact: idcontact,
                recipientUsername: name,
                threadID: objectId,
              });
              this.setState({
                datamessage: [...this.state.datamessage, ...obj],
              });
            },
            error => {},
          );
        });
        //let messagelist = JSO
      }
    });
  };
  _setDrawer() {
    this.refs['DRAWER'].openDrawer();
  }
  closeDrawer() {
    this.refs['DRAWER'].closeDrawer();
  }
  render() {
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
    // const {selfobjectId} = this.state;

    const selfobjectId = selfobjectId_id;

    //  alert(selfobjectId);
    const {usernameinAPP} = this.state;
    const {senderUsername} = this.state;

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
              پیام ها
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
export default Messagelist;

/*
<FlatList
data={datamessage}
renderItem={({item, index}) => (
  <Listmessageview key={index} item={item} />
)}
keyExtractor={(item, index) => index}
/>*/
