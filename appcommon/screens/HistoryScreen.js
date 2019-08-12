import React from 'react';
import {
  StatusBar, YellowBox, Platform, RefreshControl, Vibration, Text,
  View, Image, TextInput, Button, Alert, TouchableOpacity, Dimensions, ScrollView,
  TouchableHighlight, Modal, ActivityIndicator, FlatList, Linking, ToastAndroid,
  BackHandler, AppState, AsyncStorage, DatePickerAndroid
} from 'react-native';
import Display from 'react-native-display';
import { Bubbles, Bars, Pulse } from 'react-native-loader';
import * as styles from '../CSS/StyleProps.js';
import Global from '../Urls/Global';
import Icon from 'react-native-vector-icons/FontAwesome';

const BASEPATH = Global.BASE_PATH;

class HistoryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      orderData: [],
      refreshing: false,
      show: true,
      restaurantId: '',
      fromdate: 'From Date',
      todate: 'To Date',
      dailySales: '0.0',
      weeklySales: '0.0',
      monthlySales: '0.0',
      nodata: true,
    }
  }
  toast() {
    ToastAndroid.show('Delivered Orders to BringMyFood.', ToastAndroid.LONG);
  }
  async fromDate() {
    try {
      let { action, year, month, day } = await DatePickerAndroid.open({
        date: new Date(),
        maxDate: new Date(),
      });
      month = month + 1;
      var c1 = 0;
      var c2 = 0;
      for (var i = 1; i < 10; i++) {
        if (day == i) {
          c1 = 1;
        }
        if (month == i) {
          c2 = 1;
        }
      }
      if (action != DatePickerAndroid.dismissedAction) {
        if (c1 == 1 && c2 == 1) {
          this.setState({
            fromdate: "" + year + "-0" + month + "-0" + day
          });
        }
        else if (c1 == 1 && c2 != 1) {
          this.setState({
            fromdate: "" + year + "-" + month + "-0" + day
          });
        }
        else if (c1 != 1 && c2 == 1) {
          this.setState({
            fromdate: "" + year + "-0" + month + "-" + day
          });
        }
        else {
          this.setState({
            fromdate: "" + year + "-" + month + "-" + day
          });
        }
        console.log(this.state.fromdate)
      }
      else {
        this.setState({ fromdate: 'From Date' });
        ToastAndroid.show('Please select a date.', ToastAndroid.LONG);
      }
    } catch ({ code, message }) {
      console.warn('Cannot open date picker', message);
    }
  }
  async toDate() {
    try {
      let { action, year, month, day } = await DatePickerAndroid.open({
        date: new Date(),
        maxDate: new Date(),
      });
      month = month + 1;
      var c1 = 0;
      var c2 = 0;
      for (var i = 1; i < 10; i++) {
        if (day == i) {
          c1 = 1;
        }
        if (month == i) {
          c2 = 1;
        }
      }
      if (action != DatePickerAndroid.dismissedAction) {
        if (c1 == 1 && c2 == 1) {
          this.setState({
            todate: "" + year + "-0" + month + "-0" + day
          });
        }
        else if (c1 == 1 && c2 != 1) {
          this.setState({
            todate: "" + year + "-" + month + "-0" + day
          });
        }
        else if (c1 != 1 && c2 == 1) {
          this.setState({
            todate: "" + year + "-0" + month + "-" + day
          });
        }
        else {
          this.setState({
            todate: "" + year + "-" + month + "-" + day
          });
        }
      }
      else {
        this.setState({ todate: 'To Date' });
        ToastAndroid.show('Please select a date.', ToastAndroid.LONG);
      }
    } catch ({ code, message }) {
      console.warn('Cannot open date picker', message);
    }
  }
  async retrieveItem(key) {
    console.log("HistoryScreen retrieveItem() key: ", key);
    let item = null;
    try {
      const retrievedItem = await AsyncStorage.getItem(key);
      item = JSON.parse(retrievedItem);
    }
    catch (error) {
      console.log(error.message);
    }
    return item;
  }

  async storeItem(key, item) {
    console.log("HistoryScreen storeItem() key: ", key);
    let jsonItem = null;
    try {
      jsonItem = await AsyncStorage.setItem(key, JSON.stringify(item));
    }
    catch (error) {
      console.log(error.message);
    }
    return jsonItem;
  }

  async removeItem(key) {
    console.log("HistoryScreen removeItem() key: ", key);
    try {
      await AsyncStorage.removeItem(key);
      return true;
    }
    catch (exception) {
      return false;
    }
  }
  getRestaurantData = () => {
    console.log("CheckLoginScreen getRestaurantData()");
    this.retrieveItem('RestaurantData').then((restaurant) => {
      if (restaurant == null) {
        this.props.navigation.navigate('Login');
        ToastAndroid.show("Session Expired, Please Login!", ToastAndroid.SHORT)
      }
      else if (restaurant != null) {
        this.setState({ restaurantId: restaurant.RestaurantId });
        console.log('Saved restaurant info: ', restaurant);
        this.fetchOrderHistory();
      }
    }).catch((error) => {
      console.log('Promise is rejected with error: ' + error);
    });
  }
  fetchOrderHistory = () => {

    var todayDate = new Date().toJSON().slice(0, 10);
    console.log("todayDate: ", todayDate)
    let formData = JSON.stringify({
      'restaurant-id': this.state.restaurantId,
      'order-status': '',
      'order-from-date': todayDate,
      'order-to-date': todayDate
    })
    console.log('FormData to fetch orders: ', formData);
    fetch(BASEPATH + Global.GET_RESTAURANT_ORDERS_MIN, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: formData
    })
      .then((response) => response.json())
      .then((responseJson) => {
        console.log(responseJson)
        this.setState({
          dailySales: responseJson.DailySales,
          weeklySales: responseJson.WeeklySales,
          monthlySales: responseJson.MonthlySales
        })
        if (responseJson.Success == 'Y') {
          this.setState({ orderData: responseJson.Data });
          console.log("orderData : ", this.state.orderData);
          this.setState({
            show: false,
          })
        }
        else {
          console.log('No orders to display', responseJson.Message);
          this.setState({
            nodata: true,
            show: false,
          })
        }
      })
  }
  componentDidMount() {
    this.getRestaurantData();

  }
  updateHistory() {
    var from = new Date(this.state.fromdate);
    var to = new Date(this.state.todate);
    console.log("To:", to)
    console.log("from: ", from)
    if (this.state.fromdate == 'From Date') {
      ToastAndroid.show('Please select From Date.', ToastAndroid.LONG);
    }
    else if (this.state.todate == 'To Date') {
      ToastAndroid.show('Please select To Date.', ToastAndroid.LONG);
    }
    else if (from > to) {
      ToastAndroid.show('Incorrect Date Format', ToastAndroid.LONG);
    }
    else {
      let formData = JSON.stringify({
        'restaurant-id': this.state.restaurantId,
        'order-status': '',
        'order-from-date': this.state.fromdate,
        'order-to-date': this.state.todate
      })
      this.setState({ show: true });
      fetch(BASEPATH + Global.GET_RESTAURANT_ORDERS_MIN, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: formData
      })
        .then((response) => response.json())
        .then((responseJson) => {
          console.log(responseJson);
          if (responseJson.Success == 'Y') {
            this.setState({ orderData: responseJson.Data });
            this.setState({
              show: false
            })
          }
          else {
            this.setState({
              show: false
            })
            console.log('Not Success');
          }
        })
    }
  }

  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <View style={styles.header}>
          <Text style={{ color: '#cd2121', fontSize: 18, fontWeight: "bold", marginRight: 5 }}>Payments</Text>
        </View>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={{ padding: 5 }}>
            <View style={{ backgroundColor: '#073B4C', padding: 10, flexDirection: 'column' }}>
              <View style={{ flexDirection: 'row' }}>
                <View style={{ padding: 10, flex: 1, borderRightColor: '#ebebeb', borderRightWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>Today's Sales</Text>
                  <Text style={{ color: '#fff', fontSize: 24, fontWeight: '600' }}>₹ {this.state.dailySales}</Text>
                </View>
                <View style={{ padding: 10, flex: 1, borderRightColor: '#ebebeb', borderRightWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>Week So Far</Text>
                  <Text style={{ color: '#fff', fontSize: 24, fontWeight: '600' }}>₹ {this.state.weeklySales}</Text>
                </View>
                <View style={{ padding: 10, flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                  <Text style={{ color: '#fff', fontSize: 14, fontWeight: '600' }}>Month So Far</Text>
                  <Text style={{ color: '#fff', fontSize: 24, fontWeight: '600' }}>₹ {this.state.monthlySales}</Text>
                </View>
              </View>
            </View>
            {/* <Text style={{ color: '#fff', textAlign: 'center', fontSize: 12, backgroundColor: '#073B4C', padding: 5, marginTop: 5 }}>
            LAST PAYMENT DATE: 05-12-2018
          </Text> */}
            <View style={{ backgroundColor: '#2081C3', padding: 10, flexDirection: 'column', marginTop: 5 }}>
              <View style={{ backgroundColor: 'transparent', justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
                <Text style={{ color: '#fefefe', fontWeight: '400', fontSize: 20 }}>Hotline: +918339000801</Text>
                <TouchableOpacity onPress={() => {
                  Linking.openURL("tel:8339000801")
                }}>
                  <Icon name='phone' size={24} color='#999' style={{ backgroundColor: 'green', paddingHorizontal: 5, paddingVertical: 2, borderRadius: 6 }} />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View style={{
            flex: 1, shadowColor: '#000', margin: 5, shadowOffset: { width: 10, height: 10 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 2, borderRadius: 4, backgroundColor: '#fff',
            width: Dimensions.get('window').width - 10
          }}>
            <View style={{ flex: 1, flexDirection: 'row', backgroundColor: 'white', padding: 10, alignItems: 'center', justifyContent: 'center' }}>
              <View style={{ flex: 4, flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ padding: 10 }}>{this.state.fromdate}</Text>
                <TouchableOpacity onPress={() => { this.fromDate() }}>
                  <Image source={require('../assets/datepicker.png')} style={{ width: 25, height: 25 }} />
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Image source={require('../assets/to.png')} style={{ width: 25, height: 25 }} />
              </View>
              <View style={{ flex: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ padding: 10 }}>{this.state.todate}</Text>
                <TouchableOpacity onPress={() => { this.toDate() }}>
                  <Image source={require('../assets/datepicker.png')} style={{ width: 25, height: 25 }} />
                </TouchableOpacity>
              </View>
              <View style={{ flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Button color='#cd2121' title='View' style={styles.fontColorSize}
                  onPress={() => { this.updateHistory() }} />
              </View>
            </View>
          </View>
          <View style={{ flex: 9, backgroundColor: '#EBEBEC' }}>
            <Display enable={this.state.show} style={{ height: Dimensions.get('window').height - 300, justifyContent: 'center', alignItems: 'center' }}>
              <View>
                <Bubbles size={20} color="#CD2121" />
              </View>
            </Display>
            <Display enable={this.state.nodata} style={{ height: Dimensions.get('window').height - 300, justifyContent: 'center' }}>
              <Image style={{ width: 100, height: 100, padding: 0, marginLeft: 150, alignItems: 'center' }} source={require('../assets/no-ordersp.png')} />
              <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', color: '#5b5959' }}>Relax</Text>
              <Text style={{ fontSize: 15, color: '#5b5959', textAlign: 'center' }}>No History for Today</Text>
            </Display>
            {this.state.orderData.map((data, index) => (
              <Display key={index} enable={(data.OrderStatus == 'ORDER CANCELLED' ? 1 : 0 || data.OrderStatus == 'ORDER DELIVERED' ? 1 : 0)}>
                <View style={[styles.listcontainer, styles.align, styles.boxShadow, styles.dir]}>
                  <View style={{ flex: 1, flexDirection: 'row' }}>
                    <View style={styles.splitcontainer4}>
                      <View style={{ flexDirection: 'row', padding: 2 }}>
                        <Display enable={(data.OrderStatus == 'ORDER DELIVERED' ? 1 : 0)}>
                          <Image source={require('../assets/delivered.png')} style={{ width: 20, height: 20 }} />
                        </Display>
                        <Display enable={(data.OrderStatus == 'ORDER CANCELLED' ? 1 : 0)}>
                          <Image source={require('../assets/cancelled.png')} style={{ width: 20, height: 20 }} />
                        </Display>
                        <Text style={styles.fontColorSize}>{data.OrderStatus}</Text>
                      </View>
                      <Text style={styles.fontColorSize}>{data.OrderDate}</Text>
                    </View>
                    <View style={styles.splitcontainer5}>
                      <Text style={styles.fontColorSize}>#{data.OrderId}</Text>
                      <Text style={styles.fontColorSize}>₹{data.OrderTotal}</Text>
                    </View>
                  </View>
                  <TouchableHighlight underlayColor='#d4d4d6' onPress={() => this.props.navigation.navigate('OrderHistory', { "OrderId": data.OrderId, "OrderTotal": data.OrderTotal })}>
                    <View style={{ backgroundColor: '#3cb256', width: Dimensions.get('window').width, paddingLeft: Dimensions.get('window').width - 100 }}>
                      <Text style={{ color: 'white', fontSize: 14, padding: 5, textAlign: 'right', marginRight: 5 }}>View Details</Text>
                    </View>
                  </TouchableHighlight>
                </View>
              </Display>
            ))}
          </View>
        </ScrollView>
      </View>
    );
  }
}

export default HistoryScreen;