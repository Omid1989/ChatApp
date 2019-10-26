import React, {Component} from 'react';
import {Text, View, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {withNavigation} from 'react-navigation';
import {Icon} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
export class NavigationView extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const {selfobjectId} = this.props;
    const {senderUsername} = this.props;
    const {usernameinAPP} = this.props;
    const {navigate} = this.props.navigation;

    const {closeDrawer} = this.props;
    //  let drawer = this.props;
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <View
          style={{
            flex: 1,
            backgroundColor: '#225599',
            justifyContent: 'center',
            alignItems: 'center',
            borderBottomEndRadius: 50,
          }}>
          <Image
            source={{
              uri:
                'https://jobinja.ir/file-secretary/js_avatar_image/js_avatar_image_blob/0/a/6/405435-0a699c3af159beaaaf5439b59a3016574830f3ae/cv_avatar_256x256.jpg',
              width: 100,
              height: 100,
            }}
            style={[styles.image, {borderWidth: 4, borderColor: '#fff'}]}
          />
          <Text
            style={{
              fontWeight: 'bold',
              fontFamily: 'BNazanin',
              color: 'white',
              paddingTop: 10,
            }}>
            {usernameinAPP}
          </Text>
        </View>
        <View
          style={{
            flex: 2,
            backgroundColor: '#225599',
          }}>
          <View
            style={{
              flex: 2,
              backgroundColor: '#fff',
              borderTopStartRadius: 50,
              borderBottomStartRadius: 50,
            }}>
            <TouchableOpacity
              onPress={() => {
                closeDrawer();

                navigate('Contact', {
                  selfobjectId: selfobjectId,
                  senderUsername: senderUsername,
                });
              }}
              style={{
                padding: 10,
              }}>
              <View style={{flexDirection: 'row-reverse'}}>
                <Icon
                  name="ios-person"
                  style={{
                    color: 'rgb(180,180,180)',

                    padding: 10,
                    borderRadius: 5,
                  }}></Icon>
                <Text
                  style={{
                    padding: 10,
                    fontFamily: 'BNazanin',
                    fontWeight: 'bold',
                    fontSize: 18,
                    color: 'rgba(10,10,10,0.8)',
                  }}>
                  لیست دوستان
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                // this.refs['DRAWER'].closeDrawer();
                closeDrawer();
                navigate('Messagelist');
              }}
              style={{padding: 10}}>
              <View style={{flexDirection: 'row-reverse'}}>
                <Icon
                  name="ios-chatboxes"
                  style={{
                    color: 'rgb(180,180,180)',

                    padding: 10,
                    borderRadius: 5,
                  }}></Icon>
                <Text
                  style={{
                    padding: 10,
                    fontFamily: 'BNazanin',
                    fontWeight: 'bold',
                    fontSize: 18,
                    color: 'rgba(10,10,10,0.8)',
                  }}>
                  پیام ها
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            backgroundColor: '#225599',
            borderTopEndRadius: 50,
            width: '30%',
          }}>
          <TouchableOpacity
            style={{padding: 10}}
            onPress={() => {
              //  AsyncStorage.setItem('userToken', 'ddd');
              //  this.props.navigation.navigate('login');
              // alert('test');

              AsyncStorage.clear();
              this.props.navigation.navigate('login');
            }}>
            <View
              style={{
                flexDirection: 'row-reverse',
                justifyContent: 'flex-end',
              }}>
              <Text
                style={{
                  padding: 10,
                  fontFamily: 'BNazanin',
                  fontWeight: 'bold',
                  fontSize: 18,
                  color: '#fff',
                }}>
                خروج
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
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

export default withNavigation(NavigationView);
