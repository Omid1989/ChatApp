import React, {Component} from 'react';
import {
  Text,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

export class Authentication extends Component {
  constructor(props) {
    super(props);
    this.state = {
      number1: '',
      number2: '',
      number3: '',
      number4: '',
      objectId: this.props.navigation.getParam('objectId'),
      senderUsername: this.props.navigation.getParam('senderUsername'),
    };
  }

  _Authentication = async () => {
    //ایت تابع برای اهراز هویت و ثبت نام  اگر ثبت نام شده بود   برای ورود می باشد
    const Number1 = this.props.navigation.getParam('Number1');
    const Number2 = this.props.navigation.getParam('Number2');
    const Number3 = this.props.navigation.getParam('Number3');
    const Number4 = this.props.navigation.getParam('Number4');

    let {number1, number2, number3, number4} = this.state;
    const {navigate} = this.props.navigation;

    if (
      number1 == Number1 &&
      number2 == Number2 &&
      number3 == Number3 &&
      number4 == Number4
    ) {
      await AsyncStorage.setItem('userToken', 'فقط نباید خالی باشه');
      navigate('Messagelist', {
        objectId: this.props.navigation.getParam('objectId'),
        senderUsername: this.state.senderUsername,
      }); //انتقال یه stack navigator app
    }
  };
  render() {
    const Number1 = this.props.navigation.getParam('Number1');
    const Number2 = this.props.navigation.getParam('Number2');
    const Number3 = this.props.navigation.getParam('Number3');
    const Number4 = this.props.navigation.getParam('Number4');
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(233,233,233,1)',
          justifyContent: 'flex-start',
          alignItems: 'flex-start',
          paddingHorizontal: 34,
          paddingTop: 70,
        }}>
        <View style={{flexDirection: 'row'}}>
          <Text>{Number1}</Text>
          <Text>{Number2}</Text>
          <Text>{Number3}</Text>
          <Text>{Number4}</Text>
        </View>

        <Text
          style={{
            // borderWidth: 1,
            fontSize: 27,
            alignSelf: 'flex-end',
            paddingRight: 5,
          }}>
          کد ارسالی را وارد کنید
        </Text>
        <View
          style={{
            // borderWidth: 1,
            flexDirection: 'row',
            justifyContent: 'space-around',
            marginTop: 10,
          }}>
          <View style={[styles.boxinput, {marginLeft: -1}]}>
            <TextInput
              style={styles.textinput}
              maxLength={1}
              value={this.state.number1}
              onChangeText={text => {
                this.setState({number1: text});
              }}
            />
          </View>
          <View style={styles.boxinput}>
            <TextInput
              style={styles.textinput}
              maxLength={1}
              value={this.state.number2}
              onChangeText={text => {
                this.setState({number2: text});
              }}
            />
          </View>
          <View style={styles.boxinput}>
            <TextInput
              style={styles.textinput}
              maxLength={1}
              value={this.state.number3}
              onChangeText={text => {
                this.setState({number3: text});
              }}
            />
          </View>
          <View style={[styles.boxinput, {marginRight: -1}]}>
            <TextInput
              style={[styles.textinput]}
              maxLength={1}
              value={this.state.number4}
              onChangeText={text => {
                this.setState({number4: text});
              }}
            />
          </View>
        </View>
        <View style={{flexDirection: 'row', paddingRight: 5}}>
          <TouchableOpacity
            onPress={() => {
              this._Authentication();
            }}
            style={{
              backgroundColor: 'rgba(33,185,228,1)',
              flex: 1,
              paddingVertical: 15,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 5,
            }}>
            <Text style={{color: 'rgba(255, 255, 255, 0.7)', fontSize: 20}}>
              ثبت
            </Text>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row'}}>
          <TouchableOpacity
            style={{
              flex: 1,
              paddingVertical: 25,
              justifyContent: 'flex-start',
              alignItems: 'flex-end',
              borderRadius: 5,
            }}>
            <Text
              style={{
                color: 'rgba(33,185,228,1)',
                fontSize: 18,
                marginRight: 10,
              }}>
              ارسال دوباره
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
                color: 'rgba(10,10,10,0.2)',
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
    );
  }
}

const styles = StyleSheet.create({
  boxinput: {
    backgroundColor: '#fff',
    margin: 10,
    width: 70,
    height: 60,
    borderRadius: 10,
  },
  textinput: {
    borderBottomWidth: 3,
    borderBottomColor: 'rgba(233,233,233,1)',
    borderBottomEndRadius: 10,
    marginHorizontal: 10,
    marginVertical: 10,
    fontSize: 18,
    textAlign: 'center',
    fontWeight: 'bold',
    color: 'rgba(10,10,10,0.5)',
    //fontFamily: 'BNazanin',
  },
});
export default Authentication;
