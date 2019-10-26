import React, {Component} from 'react';
import {
  Text,
  ToastAndroid,
  View,
  ImageBackground,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  StatusBar,
  I18nManager,
} from 'react-native';
import {Toast} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
//import Parse from 'parse';
import {localStorage} from 'localstorage-polyfill';
global.localStorage; // now has your in memory localStorage
import Parse from 'parse';

export class SignOut extends Component {
  constructor(props) {
    super(props);

    this.state = {
      register: 0,
      user: '',
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

  registerfinal = () => {
    ////چک کردن شماره موبایل تکرای
    const Post = Parse.Object.extend('User');
    const query = new Parse.Query(Post);
    query.equalTo('mobile', this.state.mobile);
    query.find().then(results => {
      let l = JSON.stringify(results);
      if (l.length === 2) {
        // registredMOBILE = true;
        //////////////////////////////در صورتی که شماره موبایل وجود نداشت ثبت نام انجام شود

        let email =
          'omid' + Math.floor(Math.random() * 10000) + 'ahmadi@gmail.com';

        const user = new Parse.User();
        user.set('username', this.state.user);
        user.set('email', email);
        user.set('mobile', this.state.mobile);
        user.set('password', '#Password123');

        user
          .signUp()
          .then(user => {
            let objectId1 = JSON.parse(JSON.stringify(user));

            let {objectId} = objectId1;

            ToastAndroid.showWithGravityAndOffset(
              ' ثبت نام انجام شد کد فعال سازی برای شما ارسال شد ',
              ToastAndroid.LONG,
              ToastAndroid.BOTTOM,
              25,
              50,
            );

            this.state.user && this.state.mobile
              ? this.props.navigation.navigate('Authentication', {
                  user: this.state.user,
                  mobile: this.state.mobile,
                  register: this.state.register,
                  Number1: this.state.Number1,
                  Number2: this.state.Number2,
                  Number3: this.state.Number3,
                  Number4: this.state.Number4,
                  objectId: objectId,
                })
              : '';
          })
          .catch(error => {
            let {code} = error;

            if (code == -1) {
              ToastAndroid.showWithGravityAndOffset(
                `خطا  ! نام   کاربری  وارد کنید  `,
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50,
              );
            }
            if (code == 202) {
              ToastAndroid.showWithGravityAndOffset(
                `خطا  ! این نام کاربری وجود دارد  `,
                ToastAndroid.LONG,
                ToastAndroid.BOTTOM,
                25,
                50,
              );
            }
            // alert('Error while signing up user', error);
          });
      } else {
        ToastAndroid.showWithGravityAndOffset(
          ' اکانتی با این شماره موبایل وجود دارد !!',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50,
        );
      }
    });
  };
  _register = () => {
    let {mobile} = this.state;
    this.state.user && this.state.mobile
      ? this.state.user && mobile.length === 11
        ? this.registerfinal()
        : mobile.length !== 11
        ? ToastAndroid.showWithGravityAndOffset(
            ' شماره موبایل را صحیح وارد کنید ',
            ToastAndroid.LONG,
            ToastAndroid.BOTTOM,
            25,
            50,
          )
        : ''
      : ToastAndroid.showWithGravityAndOffset(
          ' نام کاربری و شماره موبایل را وارد کنید ',
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50,
        );

    /*
     */
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
            paddingTop: 100,
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
            خوش آمدید ، ثبت نام
          </Text>
          <View
            style={{
              // borderWidth: 1,

              flexDirection: 'column',
              //  justifyContent: 'space-around',
              marginTop: 30,
            }}>
            <TextInput
              style={[styles.textinput, {height: 49}]}
              placeholder="نام کاربری"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={this.state.user}
              onChangeText={text => {
                this.setState({user: text});
              }}
            />
            <TextInput
              style={[styles.textinput, {height: 49}]}
              placeholder="شماره موبایل"
              placeholderTextColor="rgba(255, 255, 255, 0.7)"
              value={this.state.mobile}
              onChangeText={text => {
                this.setState({mobile: text});
              }}
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              onPress={this._register}
              style={{
                backgroundColor: 'rgba(33,185,228,1)',
                flex: 1,
                // paddingVertical: 15,
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
                ثبت نام
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'flex-end'}}>
            <TouchableOpacity
              onPress={() => {
                this.props.navigation.navigate('login');
              }}
              style={{
                //   flex: 1,
                paddingVertical: 25,
                //justifyContent: 'flex-end',

                borderRadius: 5,
              }}>
              <Text
                style={{
                  color: 'rgba(255,255,255,1)',
                  fontWeight: 'bold',
                  fontSize: 18,
                  marginRight: 10,
                }}>
                عضو هستم ورود
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
export default SignOut;
