import React from 'react';

import Icon from 'react-native-vector-icons/Ionicons';

import * as styles from '../CSS/StyleProps.js';
const PropTypes = require('prop-types')
import { StatusBar, YellowBox, Platform, RefreshControl, Vibration, Text, View, Image, TextInput, Button, Alert, ListView, TouchableOpacity, Dimensions, ScrollView, TouchableHighlight, Modal, ActivityIndicator, FlatList, Linking, ToastAndroid, BackHandler, AppState, AsyncStorage, DatePickerAndroid } from 'react-native';

class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ifnotLoggedIn: false,
      restaurantName: '',
      restaurantId: '',
      restaurantPhone: '',
      restaurantAddress: '',
      restaurantEmail: ''
    }
  }
  async retrieveItem(key) {
    console.log("CheckLoginScreen retrieveItem() key: ", key);
    let item = null;
    try {
      const retrievedItem = await AsyncStorage.getItem(key);
      console.log("Got it here");
      item = JSON.parse(retrievedItem);
    }
    catch (error) {
      console.log(error.message);
    }
    return item;
  }

  async storeItem(key, item) {
    console.log("CheckLoginScreen storeItem() key: ", key);
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
    console.log("CheckLoginScreen removeItem() key: ", key);
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
        this.setState({ ifnotLoggedIn: true });
        this.props.navigation.navigate('Login');
        ToastAndroid.show("Session Expired, Please Login!", ToastAndroid.SHORT)
      }
      else if (restaurant != null) {
        this.setState({ ifnotLoggedIn: false, restaurantName: restaurant.RestaurantName, restaurantEmail: restaurant.RestaurantEmail, restaurantPhone: restaurant.RestaurantPhone });
      }
    }).catch((error) => {
      console.log('Promise is rejected with error: ' + error);
    });
  }
  removeRestaurantData = () => {
    this.removeItem('RestaurantData');
    this.removeItem("fcmToken");
    setTimeout(() => {
      this.props.navigation.navigate('Login');
    });
  }
  logout = () => {
    console.log("Checking for User Login Status");
    this.removeRestaurantData();
  }
  componentDidMount() {
    this.props.navigation.addListener('didFocus', () => this.getRestaurantData());
  }
  
  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'column' }}>
        <View style={{ flex: 3, alignItems: 'center', justifyContent: 'center', padding: 10, backgroundColor: "white" }}>
          <Image source={require('../assets/BMF-logo.png')} style={{ height: 200, width: 200 }} />
        </View>
        <View style={{ flex: 7, flexDirection: 'column', margin: 6, padding: 10, borderRadius: 4, justifyContent: 'center', backgroundColor: 'white', shadowColor: '#000', shadowOffset: { width: 10, height: 10 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 2, }}>
          <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10 }}>
            <Image source={require('../assets/user.png')} style={{ width: 65, height: 65 }} />
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name='md-contact' />
            <Text style={[styles.fontColorSize, { padding: 5 }]}>{this.state.restaurantName}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name='md-call' />
            <Text style={[styles.fontColorSize, { padding: 5 }]}>{this.state.restaurantPhone}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name='md-mail' />
            <Text style={[styles.fontColorSize, { padding: 5 }]}>{this.state.restaurantEmail}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name='md-information-circle' />
            <Text style={[styles.fontColorSize, { padding: 5 }]}>{this.state.restaurantGst}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Icon name='md-compass' />
            <Text style={[styles.fontColorSize, { padding: 5 }]}>{this.state.restaurantAddress}</Text>
          </View>
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Button color='#cd2121' title='Logout' buttonStyle={{ width: 145, height: 45, borderRadius: 25 }}
              onPress={() => {
                this.logout();
              }
              }
            ></Button>
          </View>
        </View>
      </View>
    );
  }
}


export default ProfileScreen;