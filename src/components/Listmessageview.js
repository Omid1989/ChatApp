import React, {Component} from 'react';
import {Text, View, Image, TouchableOpacity} from 'react-native';
import {Icon} from 'native-base';

function getDisplayDate(year, month, day) {
  let today = new Date();
  today.setHours(0);
  today.setMinutes(0);
  today.setSeconds(0);
  today.setMilliseconds(0);
  let compDate = new Date(year, month - 1, day); // month - 1 because January == 0
  let diff = today.getTime() - compDate.getTime(); // get the difference between today(at 00:00:00) and the date
  if (compDate.getTime() == today.getTime()) {
    return 'امروز';
  } else if (diff <= 24 * 60 * 60 * 1000) {
    return 'دیروز';
  } else {
    //return compDate.toDateString(); // or format it what ever way you want
    let year = compDate.getFullYear();
    let month = compDate.getMonth();
    let months = new Array(
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    );
    let day = compDate.getDate();
    let d = compDate.getDay();
    let days = new Array('Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat');

    var formattedDate = days[d] + ' ' + day + ' ' + months[month] + ' ' + year;
    return formattedDate;
  }
}

export const Listmessageview = ({
  item,
  i,
  navigate,
  selfobjectId,
  senderUsername,
  styles,
}) => {
  let dat1 = item.date;
  let timenewmessage = null;
  let splitdata = null;
  if (dat1 !== null) {
    let dat = item.date.split('T');
    //  alert(dat[0]);
    splitdata = dat[0].split('-');
    timenewmessage = dat[1].split('.');
  }

  const newmessage = [item.new == '1' ? styles.dot : ''];
  const textbold = [item.new == 1 ? styles.newmessage : styles.oldmessage];
  // alert(selfobjectId);
  return (
    <TouchableOpacity
      style={{zIndex: -1}}
      key={i}
      onPress={() => {
        navigate('ChatRom', {
          selfobjectId: selfobjectId,
          objectIdContact: item.objectIdContact,
          name: item.name,
          recipientUsername: item.recipientUsername,
          senderUsername: senderUsername,
        });
      }}>
      <View style={styles.listview}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row-reverse',
          }}>
          <View style={newmessage}></View>
          <Image
            source={{uri: item.image, width: 60, height: 60}}
            style={styles.image}
          />
          <View
            style={{
              marginRight: 10,
              justifyContent: 'center',
            }}>
            <Text
              style={{
                textAlign: 'right',
                color: 'rgb(100,100,100)',
                fontWeight: 'bold',
                fontSize: 20,
                fontFamily: 'BNazanin',
              }}>
              {item.name}
            </Text>
            <Text style={([textbold], {textAlign: 'right'})}>
              {item.message}
              {
                //item.objectIdContact
              }
            </Text>
          </View>
        </View>
        {dat1 !== null ? (
          <Text style={{color: 'rgb(191,191,191)'}}>
            ( {timenewmessage[0]} )
            {getDisplayDate(splitdata[0], splitdata[1], splitdata[2])}
          </Text>
        ) : (
          <Icon
            name="arrow-back"
            style={{
              color: 'rgb(180,180,180)',
              fontSize: 40,
            }}
          />
        )}
      </View>
    </TouchableOpacity>
  );
};
