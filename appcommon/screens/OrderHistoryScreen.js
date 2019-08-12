import React from 'react';

import Display from 'react-native-display';

import * as styles from '../CSS/StyleProps.js';
const PropTypes = require('prop-types')
import { StatusBar, YellowBox, Platform, RefreshControl, Vibration, Text, View, Image, TextInput, Button, Alert, ListView, TouchableOpacity, Dimensions, ScrollView, TouchableHighlight, Modal, ActivityIndicator, FlatList, Linking, ToastAndroid, BackHandler, AppState, AsyncStorage, DatePickerAndroid } from 'react-native';
import Global from '../Urls/Global';
import Icon from 'react-native-vector-icons/FontAwesome';
const BASEPATH = Global.BASE_PATH;


class OrderHistoryScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      orderid: this.props.navigation.getParam("OrderId"),
      OrderTotal: this.props.navigation.getParam("OrderTotal"),
      show: true,
      restaurantId: '',
      deliveryPerson: '',
      deliveryPersonPhone: '',
    }
  }
  async retrieveItem(key) {
    console.log("OrderHistoryScreen retrieveItem() key: ", key);
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
    console.log("OrderHistoryScreen storeItem() key: ", key);
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
    console.log("OrderHistoryScreen removeItem() key: ", key);
    try {
      await AsyncStorage.removeItem(key);
      return true;
    }
    catch (exception) {
      return false;
    }
  }
  getRestaurantData = () => {
    console.log("OrderHistoryScreen getRestaurantData()");
    this.retrieveItem('RestaurantData').then((restaurant) => {
      if (restaurant == null) {
        this.props.navigation.navigate('Login');
        ToastAndroid.show("Session Expired, Please Login!", ToastAndroid.SHORT)
      }
      else if (restaurant != null) {
        this.setState({ restaurantId: restaurant.RestaurantId });
        console.log('Saved restaurant info: ', restaurant);
        this.getOrderDetails();
      }
    }).catch((error) => {
      console.log('Promise is rejected with error: ' + error);
    });
  }
  getOrderDetails = () => {
    fetch(BASEPATH + Global.GET_ORDER_DETAILS, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'restaurant-id': this.state.restaurantId,
        'order-id': this.state.orderid
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.Success == 'Y') {
          this.setState({ dataSource: responseJson.Data });
          this.setState({ show: false, deliveryPerson: responseJson.EmployeeName, deliveryPersonPhone: responseJson.EmployeePhone });
        }
        else {
          console.log('Not Success');
        }
      })
  }
  componentDidMount() {
    this.getRestaurantData();
  }
  render() {
    return (
      <View style={{ flexDirection: 'column', flex: 1 }}>
        <View style={[styles.header, { justifyContent: 'flex-start', padding: 10 }]}>
          <TouchableOpacity onPress={() => { this.props.navigation.goBack(null); }} style={{}}>
            <Icon name='arrow-left' color='#999' size={25} />
          </TouchableOpacity>
          <View>
            <Text style={{ fontSize: 18, fontWeight: '500', color: '#666' }}>&nbsp;&nbsp;#{this.state.orderid}</Text>
          </View>
        </View>
        <View style={{ height: 40, paddingLeft: 10, justifyContent: 'center' }}>
          <Text style={{ fontSize: 15, color: '#555' }}>Order Details</Text>
        </View>
        <View style={{ flex: 4, backgroundColor: 'white' }}>
          <Display enable={this.state.show} style={{ justifyContent: 'center' }}>
            <ActivityIndicator size="large" color="#CD2121" />
          </Display>
          <ScrollView style={styles.scrollViewStyle}>
            {this.state.dataSource.map((data, index) => (
              <Display enable={!this.state.show} key={index}>
                <View style={[styles.listcontainer, styles.align, styles.boxShadow, styles.dir]}>
                  <View style={{ flexDirection: 'row', flex: 8, padding: 5 }}>
                    <View style={{ flex: 7, padding: 3 }}>
                      <Text style={{ fontSize: 20 }}>{data.ProductName}</Text>
                    </View>
                    <View style={{ flex: 1, padding: 3 }}>
                      <Text style={{ fontSize: 20 }}>X {data.Qty}</Text>
                    </View>
                    <View style={{ flex: 2, padding: 3 }}>
                      <Text style={{ fontSize: 20 }}>₹ {data.TotalItemPrice}</Text>
                    </View>
                  </View>
                </View>
              </Display>
            ))}
            <View style={[styles.listcontainer, styles.align, styles.boxShadow, styles.dir]}>
              <Image source={require('../assets/bmf-business-logo.png')} style={{ width: Dimensions.get('window').width - 150, height: 60 }} />
            </View>
          </ScrollView>
        </View>
        <View style={styles.boxShadow} style={{ backgroundColor: 'white', flexDirection: 'column', height: 100, width: Dimensions.get('window').width - 10, margin: 6 }}>
          <View style={{ flex: 8, flexDirection: 'column', borderTopColor: 'black', borderTopWidth: 1, padding: 5 }}>
            <View style={{ justifyContent: 'flex-start' }}>
              <Text style={{ fontSize: 15, fontWeight: "bold" }}>Special Instructions :</Text>
            </View>
            <ScrollView>
              <Text style={{ fontSize: 12, color: '#555' }}>
                No special instructions from Customer.
                </Text>
            </ScrollView>
          </View>
          <View style={{ flex: 2, flexDirection: 'row', borderTopColor: 'black', borderTopWidth: 1, padding: 10 }}>
            <View style={{ flex: 7, alignItems: 'flex-start', justifyContent: 'center' }}>
              <Text style={{ fontSize: 15, fontWeight: "bold", color: '#555' }}>Total amount :</Text>
            </View>
            <View style={{ flex: 3, alignItems: 'flex-end', justifyContent: 'center' }}>
              <Text style={{ fontSize: 15, fontWeight: "bold" }}>₹ {this.state.OrderTotal} /-</Text>
            </View>
          </View>
        </View>
        <View style={{ justifyContent: 'center', padding: 10 }}>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>Delivery Person Assigned :</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: 'white', width: Dimensions.get('window').width - 10, margin: 6, shadowColor: '#000', shadowOffset: { width: 10, height: 10 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 2, }}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center', paddingRight: 10 }}>
              <Image source={require('../assets/deliveryman.png')} style={{ width: 50, height: 50 }} />
            </View>
            <View style={{ flex: 2, flexDirection: 'column', paddingLeft: 10 }}>
              <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }}>
                <Text style={{ fontSize: 15, fontWeight: "bold", color: '#555' }}>{this.state.deliveryPerson}</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'flex-start' }}>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#555' }}>{this.state.deliveryPersonPhone}</Text>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  }
}

export default OrderHistoryScreen;