import React, {Component} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Button,
  Image,
  ScrollView,
  TouchableHighlight,
  PermissionsAndroid,
  I18nManager,
} from 'react-native';
//import {localStorage} from 'localstorage-polyfill';
//global.localStorage; // now has your in memory localStorage
import Parse from 'parse';
import {ScaledSheet} from 'react-native-size-matters';
import key from '../../constants/Key';

import {Icon, Right} from 'native-base';

const scaledSheet = ScaledSheet.create({
  container: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  inputBox: {
    alignSelf: 'stretch',
    height: '45@ms',
    padding: '6@ms',
    flexDirection: 'row',
  },
  textInput: {
    paddingHorizontal: '10@ms0.3',
    flex: 1,
    borderRadius: '25@ms',
    backgroundColor: 'white',
    borderWidth: 0.25,
    borderColor: '#545454',
  },
  chatBox: {
    maxWidth: '270@s',
    margin: '5@s',
    borderRadius: '8@ms',
    padding: '10@ms',
  },
  chatText: {
    fontSize: '15@ms0.3',
  },
});

let image = [];
function chatdialog({entry, i}) {
  const regularSheet = scaledSheet;
  image[i] = entry.me;
  let counter = i == 0 ? 0 : 1;
  let firstimage = i == 0 ? 1 : 0;
  let positionarrow = [
    entry.me ? styles.positionarrowright : styles.positionarrowleft,
  ];
  return (
    <View
      key={i}
      style={[
        {
          alignSelf: entry.me ? 'flex-end' : 'flex-start',
          //  backgroundColor: entry.me ? '#B6F6B3' : 'white',
          flexDirection: entry.me ? 'row-reverse' : 'row',
        },
      ]}>
      <Image
        source={{
          uri:
            'https://dok7xy59qfw9h.cloudfront.net/603/567/160/-39996965-2067o23-4t4915imkj5lcap/large/avatar.jpg',
          width: 50,
          height: 50,
        }}
        style={[
          regularSheet.chatBox,
          {
            alignSelf: entry.me ? 'flex-end' : 'flex-start',
            //backgroundColor: entry.me ? '#B6F6B3' : 'white',
            borderRadius: 50,
            opacity: image[i - counter] == entry.me ? firstimage : 1,
          },
        ]}
      />

      <View
        style={[
          regularSheet.chatBox,
          {
            alignSelf: entry.me ? 'flex-end' : 'flex-start',
            backgroundColor: entry.me ? '#fff' : '#225599',
          },
        ]}>
        <View
          style={[
            positionarrow,
            {
              width: 20,
              height: 20,
              // borderWidth: 1,
              position: 'absolute',
              top: 10,

              borderRadius: 3,
              rotation: 45,
              backgroundColor: entry.me ? '#fff' : '#225599',
              zIndex: -100,
            },
          ]}></View>
        <Text
          style={[
            regularSheet.chatText,
            {
              fontFamily: 'BNazanin',
              color: '#ccc',
              alignSelf: entry.me ? 'flex-end' : 'flex-start',
              marginHorizontal: 10,
              textAlign: entry.me ? 'right' : 'left',
            },
          ]}>
          {entry.text}
        </Text>
      </View>
    </View>
  );
}

export class ChatRom extends Component {
  constructor(props) {
    super(props);
    this.state = {
      threadID: null,
      datamessage: [],
      senderUsername: this.props.navigation.getParam('senderUsername'),
      recipientUsername: this.props.navigation.getParam('recipientUsername'),
      txtmessage: null,
      selfobjectId: this.props.navigation.getParam('selfobjectId'),
      objectIdContact: this.props.navigation.getParam('objectIdContact'),
    };
  }

  componentDidMount = async () => {
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
      ///بصورت
      let object = JSON.parse(JSON.stringify(todo));
      let {objectId} = object; ////شماره ای دی پیامی گه تازه ثبنت شده
      // alert(objectId);
      let objectIdnewMessage = objectId;
      this._getmessage({objectIdnewMessage});
    });
    let objectIdnewMessage = 0;
    this._getmessage({objectIdnewMessage});
  };
  _getmessage = async ({objectIdnewMessage}) => {
    const {selfobjectId} = this.state;
    const {objectIdContact} = this.state;
    const Post = Parse.Object.extend('ChatThread');
    // const query = new Parse.Query(Post);

    ////در صورتی که درخواست چت وجود داشت از طرف شما
    const senderId = new Parse.Query(Post);
    senderId.equalTo('senderId', selfobjectId);

    const recipientId = new Parse.Query(Post);
    recipientId.equalTo('recipientId', objectIdContact);
    //////////////////////در صورتی که درخواست چت وجود داشت از طرف مقابل/////////////////////////////////
    const senderIdrec = new Parse.Query(Post);
    senderIdrec.equalTo('senderId', objectIdContact);

    const recipientIdsen = new Parse.Query(Post);
    recipientIdsen.equalTo('recipientId', selfobjectId);

    // The query is satisfied when one of the constraints matches
    const composedQuery = Parse.Query.or(
      //اظلاعاتی برگردن که اگر شما یا طرف مقابل  در خواست چت گرده اید
      Parse.Query.and(senderId, recipientId),
      Parse.Query.and(senderIdrec, recipientIdsen),
    );

    composedQuery.find().then(results => {
      let l = JSON.stringify(results);
      if (l.length === 2) {
        // ChatThread  هم از طرف شما و هم از ظرف مقابل   اگر درخواست چت وجود نداشت
      } else {
        // hatThread اگر درخواست چت وجودداشت
        let ChatThread = JSON.parse(JSON.stringify(results[0]));
        let {objectId} = ChatThread;
        let objectIdThread = objectId;
        let {senderId} = ChatThread;
        //alert(objectId);
        this.setState({
          threadID: objectId,
        });

        const Message = Parse.Object.extend('Message');
        const myNewObject = new Parse.Query(Message);
        myNewObject.equalTo('threadID', this.state.threadID);
        if (objectIdnewMessage != 0) {
          myNewObject.equalTo('objectId', objectIdnewMessage);
        }
        myNewObject.find().then(
          result => {
            //alert('Message created', result);
            //alert('test');
            Object.keys(result).map(key => {
              let objectId1 = JSON.parse(JSON.stringify(result[key]));

              let {body} = objectId1;
              let {senderID} = objectId1;

              //  alert(objectIdContact);
              // alert(selfobjectId);
              let me = true;
              if (senderID == objectIdContact) {
                me = false;
              }

              // alert(me);
              var obj = [];
              obj.push({
                text: body,
                me: me,
              });
              this.setState({
                datamessage: [...this.state.datamessage, ...obj],
              });
            });
            //let messagelist = JSON.parse(JSON.stringify(result));

            // alert(arraymessage);
          },
          error => {
            alert('Error while creating Message: ', error);
          },
        );
      }
    });
  };

  _savemessage = async ({objectId}) => {
    ///ذحیره نهایی پیام
    const {selfobjectId} = this.state;
    const {txtmessage} = this.state;
    const Message = Parse.Object.extend('Message');
    const myNewObject = new Message();

    myNewObject.set('threadID', objectId);
    myNewObject.set('body', txtmessage);
    myNewObject.set('seeRec', false);
    myNewObject.set('senderID', selfobjectId);

    myNewObject.save().then(
      result => {
        //alert('Message created', result);
        this.setState({txtmessage: null});
      },
      error => {
        alert('Error while creating Message: ', error);
      },
    );
  };
  _sendmessage = async () => {
    ///برای ساخت threed
    ////ارسال پیام
    const {selfobjectId} = this.state;
    const {objectIdContact} = this.state;
    const {recipientUsername} = this.state;
    const {senderUsername} = this.state;
    const Post = Parse.Object.extend('ChatThread');
    // const query = new Parse.Query(Post);

    ////در صورتی که درخواست چت وجود داشت از طرف شما
    const senderId = new Parse.Query(Post);
    senderId.equalTo('senderId', selfobjectId);

    const recipientId = new Parse.Query(Post);
    recipientId.equalTo('recipientId', objectIdContact);
    //////////////////////در صورتی که درخواست چت وجود داشت از طرف مقابل/////////////////////////////////
    const senderIdrec = new Parse.Query(Post);
    senderIdrec.equalTo('senderId', objectIdContact);

    const recipientIdsen = new Parse.Query(Post);
    recipientIdsen.equalTo('recipientId', selfobjectId);

    // The query is satisfied when one of the constraints matches
    const composedQuery = Parse.Query.or(
      //اظلاعاتی برگردن که اگر شما یا طرف مقابل  در خواست چت گرده اید
      Parse.Query.and(senderId, recipientId),
      Parse.Query.and(senderIdrec, recipientIdsen),
    );

    composedQuery.find().then(results => {
      let l = JSON.stringify(results);
      if (l.length === 2) {
        // ChatThread  هم از طرف شما و هم از ظرف مقابل   اگر درخواست چت وجود نداشت

        const ChatThread = Parse.Object.extend('ChatThread');
        const myNewObject = new ChatThread();
        const createdAtDate = new Date();
        myNewObject.set('senderId', selfobjectId);
        myNewObject.set('createdAtDate', createdAtDate.toString());
        myNewObject.set('recipientId', objectIdContact);
        myNewObject.set('recipientUsername', recipientUsername);
        myNewObject.set('senderUsername', senderUsername);

        myNewObject.save().then(
          result => {
            let ChatThread = JSON.parse(JSON.stringify(result));

            let {objectId} = ChatThread;
            this.setState({
              threadID: objectId,
            });

            //  alert(objectId);
            this._savemessage({objectId});
          },
          error => {
            alert(error);
          },
        );
      } else {
        // hatThread اگر درخواست چت وجودداشت
        let ChatThread = JSON.parse(JSON.stringify(results[0]));
        let {objectId} = ChatThread;
        // alert(objectId);
        this.setState({
          threadID: objectId,
        });
        this._savemessage({objectId});
      }
    });
  };
  render() {
    const regularSheet = scaledSheet;

    return (
      <View style={styles.container}>
        <View
          style={{
            //marginHorizontal: 10,
            //borderBottomWidth: 1,
            elevation: 5,
            // borderBottomColor: '#ccc',
            backgroundColor: '#225599',

            height: 80,
            flexDirection: 'row-reverse',
            justifyContent: 'space-between',
            padding: 10,
            paddingTop: 40,
            paddingHorizontal: 22,
            paddingBottom: 10,
          }}>
          <Icon
            onPress={() => this.props.navigation.goBack()}
            name="arrow-forward"
            style={{
              color: 'rgb(180,180,180)',
            }}
          />

          <Text
            style={{
              fontFamily: 'BNazanin',
              fontWeight: 'bold',
              fontSize: 20,
              color: 'rgb(180,180,180)',
            }}>
            {this.props.navigation.getParam('name')}
          </Text>
          <Icon name="search" style={{color: 'rgb(191,191,191)'}} />
        </View>

        <View
          style={{
            width: '94%',

            borderTopWidth: 0.5,
            borderTopColor: '#ccc',

            alignSelf: 'center',
          }}></View>
        <View style={regularSheet.container}>
          <View
            style={{
              flex: 1,

              height: '100%',
              backgroundColor: '#ccc',
              justifyContent: 'flex-end',
            }}>
            <ScrollView
              ref={ref => (this.scrollView = ref)}
              onContentSizeChange={(contentWidth, contentHeight) => {
                this.scrollView.scrollToEnd({animated: true});
              }}>
              {this.state.datamessage.map((entry, i) => chatdialog({entry, i}))}
            </ScrollView>
          </View>
        </View>
        <View style={styles.footer}>
          <View
            style={{
              flexDirection: 'row-reverse',
              flex: 1,
              //  margin: 10,
              // borderRadius: 10,
              // backgroundColor: 'white',
              backgroundColor: '#fff',
              elevation: 5,
            }}>
            <TextInput
              style={{
                flex: 2,
                textAlign: 'right',
                paddingHorizontal: 10,
                color: '#ccc',
                paddingHorizontal: 30,
                fontFamily: 'BNazanin',
                fontWeight: 'bold',
              }}
              value={this.state.txtmessage}
              onChangeText={txtmessage => this.setState({txtmessage})}
              multiline
              placeholder="پیام خود را وارد کنید "
              placeholderTextColor="rgb(180,180,180)"
            />
            <View
              style={{
                flex: 1,

                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
              }}>
              <Icon
                name="send"
                style={{
                  color: 'rgb(158,158,158)',
                  transform: [{rotateY: '180deg'}],
                }}
                onPress={this._sendmessage}
              />
              <Icon name="camera" style={{color: 'rgb(158,158,158)'}} />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  navbar: {
    height: 55,
    backgroundColor: '#fff',

    elevation: 3,
  },
  body: {
    flex: 1,
    paddingHorizontal: 10,
    // backgroundColor:'#223344',
    //padding:20
  },
  footer: {
    height: 66,
    //   backgroundColor:'#223344',
    flexDirection: 'row-reverse',
  },
  sendbutton: {
    backgroundColor: 'red',
  },
  chat: {},
  imagechat: {
    width: 40,
    height: 40,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: '#225599',
    margin: 10,
  },
  imagechatprofile: {
    width: 60,

    height: 60,
    borderRadius: 50,
    borderWidth: 1,
    //borderColor: 'white',
    margin: 10,
  },
  textmessage: {
    fontFamily: 'BNazanin',

    // flex: 1,
    //elevation:5,
    //backgroundColor: 'rgb(174,182,255)',
    //borderRadius: 5,
    //paddingHorizontal: 30,
    // paddingVertical: 10,
    marginTop: 20,
  },
  positionarrowleft: {
    left: -8,
  },
  positionarrowright: {
    right: -8,
  },
});
export default ChatRom;
