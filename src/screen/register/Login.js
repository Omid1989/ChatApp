import React, {Component} from 'react';
import {
  Text,
  View,
  ImageBackground,
  Image,
  StyleSheet,
  TextInput,
  ToastAndroid,
  TouchableOpacity,
  I18nManager,
  StatusBar,
} from 'react-native';
import {localStorage} from 'localstorage-polyfill';
global.localStorage; // now has your in memory localStorage
import Parse from 'parse';
import SendSMS from 'react-native-sms';
export class Login extends Component {
  constructor(props) {
    super(props);
    I18nManager.allowRTL(false);
    this.state = {
      register: 1,
      mobile: '',
      Number1: this.generateNumber(9, 0), //ایجاد اعداد تصادفی
      Number2: this.generateNumber(9, 0), //ایجاد اعداد تصادفی
      Number3: this.generateNumber(9, 0), //ایجاد اعداد تصادفی
      Number4: this.generateNumber(9, 0), //ایجاد اعداد تصادفی
    };
  }

  generateNumber = (min, max) => {
    return Math.floor(Math.random() * (max - min + 1) + min);
  };
  registe = () => {
    const Post = Parse.Object.extend('User');
    const query = new Parse.Query(Post);
    query.equalTo('mobile', this.state.mobile);
    query.find().then(results => {
      let l = JSON.stringify(results);
      if (l.length === 2) {
        ToastAndroid.showWithGravityAndOffset(
          ' اکانتی با این شماره موبایل وجود ندارد !!',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50,
        );
      } else {
        let objectId1 = JSON.parse(JSON.stringify(results[0]));

        let {objectId} = objectId1;
        let {username} = objectId1;

        /*
        JSON.parse(objectId1, (key, value) => {
          if (key === 'objectId') {
            mobile = value;
          }
          //  alert(key + ' ' + value);
        });
            
 */
        // alert(objectId);
        this.props.navigation.navigate('Authentication', {
          mobile: this.state.mobile,
          register: this.state.register,
          Number1: this.state.Number1,
          Number2: this.state.Number2,
          Number3: this.state.Number3,
          Number4: this.state.Number4,
          objectId: objectId,
          senderUsername: username,
        });
      }
    });
  };
  _register = () => {
    this.state.mobile ? this.registe() : '';
  };
  render() {
    return (
      <ImageBackground
        source={require('../../assets/images/Android.jpg')}
        style={{flex: 1}}>
        <StatusBar backgroundColor="transparent" translucent={true} />
        <View
          style={{
            flex: 1,
            //  backgroundColor: 'rgba(233,233,233,1)',

            paddingHorizontal: 34,
            paddingTop: 150,
          }}>
          <Image
            source={require('../../assets/images/Omid.png')}
            style={{height: 100, width: '99%'}}
          />
          <Text
            style={{
              // borderWidth: 1,
              color: 'rgba(255,255,255,1)',
              fontSize: 27,
              alignSelf: 'center',
              paddingRight: 5,
            }}>
            خوش آمدید ، ورود
          </Text>
          <View
            style={{
              // borderWidth: 1,

              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: 10,
            }}>
            <TextInput
              value={this.state.mobile}
              onChangeText={text => {
                this.setState({mobile: text});
              }}
              style={[styles.textinput, {flex: 1, height: 49}]}
              placeholder="شماره موبایل"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={this._register}
              style={{
                backgroundColor: 'rgba(33,185,228,1)',
                flex: 1,
                paddingVertical: 15,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius: 5,
                height: 49,
              }}>
              <Text
                style={{
                  color: 'rgba(255, 255, 255, 0.7)',
                  fontSize: 20,
                }}>
                ورود
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('SignOut');
              }}
              style={{
                // flex: 1,
                paddingVertical: 25,
                // justifyContent: 'flex-start',
                //alignItems: 'flex-end',
                borderRadius: 5,
              }}>
              <Text
                style={{
                  color: 'rgba(255,255,255,1)',
                  fontWeight: 'bold',
                  fontSize: 18,
                  marginRight: 10,
                }}>
                عضو نیستم ثبت نام
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', flex: 1}}>
            <TouchableOpacity
              style={{
                flex: 1,
                paddingVertical: 15,
                justifyContent: 'flex-end',
                alignItems: 'center',
                borderRadius: 5,
              }}>
              <Text
                style={{
                  color: 'rgba(255,255,255,0.4)',
                  fontSize: 18,
                  alignSelf: 'center',
                  paddingBottom: 10,
                  fontWeight: 'bold',
                }}>
                پیام رسان امید
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    );
  }
}
const styles = StyleSheet.create({
  textinput: {
    paddingHorizontal: 10,
    backgroundColor: 'white',
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: 'rgba(0,0,0,0.24)',
    color: '#fff',
    //fontFamily: 'BNazanin',
  },
});
export default Login;
