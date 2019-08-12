import React from 'react';
import { StatusBar, YellowBox, Platform, RefreshControl, Vibration, Text, View, Image, TextInput, Button, Alert, ListView, TouchableOpacity, Dimensions, ScrollView, TouchableHighlight, Modal, ActivityIndicator, FlatList, Linking, ToastAndroid, BackHandler, AppState, AsyncStorage, DatePickerAndroid } from 'react-native';
import Display from 'react-native-display';
import { Bubbles, Bars, Pulse } from 'react-native-loader';
import * as styles from '../CSS/StyleProps.js';
const PropTypes = require('prop-types')
import Global from '../Urls/Global';
const BASEPATH = Global.BASE_PATH;
class PaymentScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: true,
      refreshing: false,
    }
  }

  toast() {
    ToastAndroid.show('Payments from to BringMyFood.', ToastAndroid.LONG);
  }
  createData = () => {
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    let currentDate = year + '-' + ((month < 10) ? '0' + month : month) + '-' + ((date < 10) ? '0' + date : date);
    return currentDate;
  }
  componentDidMount() {

  }
  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'column', backgroundColor: '#ebebeb' }}>
        <View style={styles.header}>
          <Text style={{ color: '#cd2121', fontSize: 18, fontWeight: "bold", marginRight: 5 }}>Payments</Text>
        </View>
        <View style={{ padding: 10 }}>
          <View style={{ backgroundColor: '#073B4C', padding: 10, flexDirection: 'column' }}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ padding: 10, flex: 1, borderRightColor: '#ebebeb', borderRightWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>Today's Sales</Text>
                <Text style={{ color: '#fff', fontSize: 24, fontWeight: '600' }}>₹ 2,630</Text>
              </View>
              <View style={{ padding: 10, flex: 1, borderRightColor: '#ebebeb', borderRightWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>Week So Far</Text>
                <Text style={{ color: '#fff', fontSize: 24, fontWeight: '600' }}>₹ 9,630</Text>
              </View>
              <View style={{ padding: 10, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>Month So Far</Text>
                <Text style={{ color: '#fff', fontSize: 24, fontWeight: '600' }}>₹ 34,630</Text>
              </View>
            </View>
          </View>
          <Text style={{ color: '#fff', textAlign: 'center', fontSize: 12, backgroundColor: '#073B4C', padding: 5, marginTop: 5 }}>
            LAST PAYMENT DATE: 05-12-2018
          </Text>
          <View style={{ backgroundColor: '#2081C3', padding: 10, flexDirection: 'column', marginTop: 5 }}>
            <Text style={{ color: '#fff' }}>Date: 05-12-2018</Text>
            <View style={{backgroundColor:'#fefefe', height:100}}>
                
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default PaymentScreen;