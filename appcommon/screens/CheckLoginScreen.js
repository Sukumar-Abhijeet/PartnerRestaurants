import React from 'react';
import {
  StatusBar, Platform, RefreshControl, Vibration, Text, View, Image, TextInput,
  Button, Alert, ListView, TouchableOpacity, Dimensions, ScrollView, TouchableHighlight,
  Modal, ActivityIndicator, FlatList, Linking, ToastAndroid, BackHandler, AppState,
  AsyncStorage, DatePickerAndroid, PermissionsAndroid, StyleSheet, ImageBackground
} from 'react-native';
import Display from 'react-native-display';
const PropTypes = require('prop-types');
import firebase from 'react-native-firebase';
import Global from '../Urls/Global.js';
import { registerAppListener } from '../router/Listener';

const BASEPATH = Global.BASE_PATH;


class CheckLoginScreen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      ifnotLoggedIn: false,
      appState: AppState.currentState,
      splashImage: true,
      noti_permission: true,
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

  checkPermissions = async () => {
    const enabled = await firebase.messaging().hasPermission();
    if (enabled) {
      console.log("Permission Enabled")
    } else {
      this.setState({ noti_permission: false });
      console.log("Permission Denied")
    }
  }

  async checkAllPermissions() {
    console.log("CheckLoginScreen checkAllPermissions()");
    try {
      var granted = {};
      granted = await PermissionsAndroid.requestMultiple(
        [
          PermissionsAndroid.PERMISSIONS.CAMERA,
          PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
        ]
      );

      var check = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
      if (check) {
        console.log("Camera Permission Enabled")
      } else {
        console.log("Camera Permission Disabled");
        BackHandler.exitApp();
      }

    } catch (err) {
      console.warn(err);
    }
  }

  getRestaurantData = () => {
    console.log("CheckLoginScreen getRestaurantData()");
    this.retrieveItem('RestaurantData').then((restaurant) => {
      console.log("Hello");
      if (restaurant == null) {
        this.props.navigation.navigate('Login');
        ToastAndroid.show("Session Expired, Please Login!", ToastAndroid.SHORT)
      }
      else if (restaurant != null) {
        this.setState({ ifnotLoggedIn: false });
        this.checkPermissions();
        console.log("Permission: ", this.state.permission)
        // if (this.state.noti_permission === true) {
        //   registerAppListener(this.props.navigation);
        // }
        this.props.navigation.navigate('Tabs');
        ToastAndroid.show("Logged In!", ToastAndroid.SHORT);
      }
    }).catch((error) => {
      console.log('Promise is rejected with error: ' + error);
    });
  }

  checkLogin = () => {
    console.log("Checking for User Login Status");
    this.getRestaurantData();
  }

  checkAppVersionCode = () => {
    console.log("AppLoader checkAppVersionCode()");
    let pack = require('../../app.json');
    let appVersion = pack.android.versionCode;
    console.log("Device App VersionCode : ", appVersion);
    fetch(BASEPATH + Global.VERSION_CHECK_URL, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    }).then((response) => response.json()).then((responseData) => {
      console.log("Latest App VersionCode", responseData.Version);
      if (appVersion != responseData.Version) {
        this.setState({ latestVersion: false });
        this.checkLogin();
      }
      else {
        this.setState({ latestVersion: true });
        console.log("New update available. Please update.");
      }
    }).catch((error) => {
      console.log("Error App Version: ", error);
      ToastAndroid.show("We could not find an active internet connection.", ToastAndroid.SHORT);
    });

  }

  async componentDidMount() {
    console.log("CheckLoginScreen componentDidMount()");
    console.log("CheckLoginScreen Screen Props: ", this.props);

    registerAppListener(this.props.navigation);
    firebase.notifications().getInitialNotification()
      .then((notificationOpen) => {
        if (notificationOpen) {
          const notif = notificationOpen.notification;
        }
      });

    if (!await firebase.messaging().hasPermission()) {
      try {
        await firebase.messaging().requestPermission();
      } catch (e) {
        alert("Failed to grant permission")
      }
    }
    this.checkAllPermissions();
    this.props.navigation.addListener('didFocus', () => this.checkAppVersionCode());
  }

  render() {
    return (
      <ImageBackground source={require('../assets/splash.png')} style={styles.mainContainer}>
        {/* <Display
        enable = {this.state.splashImage}
        defaultDuration = {500}
      >
            <Image source={require('../assets/splash.png')} />
      </Display> */}
        <Display enable={this.state.latestVersion} style={styles.update}>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 14, fontWeight: '200', color: '#aaa7a7' }}>Please Update To Continue</Text>
          </View>
          <TouchableOpacity onPress={() => Linking.openURL("https://play.google.com/store/apps/details?id=in.bringmyfood.partner")} style={{ flex: 1, backgroundColor: '#2dbe60', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 16, fontWeight: '600', color: '#fff' }}>Update Now</Text>
          </TouchableOpacity>
        </Display>
      </ImageBackground>

    );
  }
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'flex-end'
  },
  upperContainer: {
    backgroundColor: 'transparent',
    flex: 9,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  update:
  {
    alignSelf: 'flex-end',
    flexDirection: 'row',
    backgroundColor: '#fff',
    width: Dimensions.get('window').width,
    bottom: 0,
    height: 50
  }
});

export default CheckLoginScreen;