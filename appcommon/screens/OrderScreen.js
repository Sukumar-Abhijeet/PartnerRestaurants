import React from 'react';
import Display from 'react-native-display';
import { Bubbles, Bars, Pulse } from 'react-native-loader';
import CodeInput from 'react-native-confirmation-code-input';
import * as styles from '../CSS/StyleProps.js';
import {
  StatusBar, YellowBox, Platform, RefreshControl, Vibration, Text, View,
  Image, TextInput, Button, Alert, ListView, TouchableOpacity, Dimensions, ScrollView,
  TouchableHighlight, ActivityIndicator, FlatList, Linking, ToastAndroid, BackHandler,
  AppState, AsyncStorage, ImageBackground, Switch, PermissionsAndroid
} from 'react-native';
import Global from '../Urls/Global';
import Modal from 'react-native-modal';
import Icon from 'react-native-vector-icons/FontAwesome';
import { RNCamera } from 'react-native-camera';
import Sound from 'react-native-sound';
import { registerAppListener } from '../router/Listener';
import firebase from 'react-native-firebase';
import { Notification } from 'react-native-firebase';

const BASEPATH = Global.BASE_PATH;
const PropTypes = require('prop-types')
const PATTERN = [100, 200, 300];


export default class OrderScreen extends React.Component {
  _didFocusSubscription;
  _willBlurSubscription;
  constructor(props) {
    super(props);
    this._didFocusSubscription = props.navigation.addListener('didFocus', payload =>
      BackHandler.addEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    );
    this.state = {
      dataSource: [],
      refreshing: false,
      show: true,
      networkerror: false,
      noorder: false,
      count: false,
      countback: true,
      notification: '',
      actionLoader: true,
      ifnotLoggedIn: false,
      restaurantId: '',
      restaurantServingStatus: '',
      restaurantName: '',
      visibleModal: null,
      modalLoader: false,
      pictureSize: '640x480',
      camera: false,
      photoClicked: false,
      cameraLoader: false,
      ViewOtp: false,
      type: RNCamera.Constants.Type.back,
      photo: {},
      textValue: 'Enter Otp',
      audioPlayer1: {},
      orderDetails: {
        OrderProducts: []
      }
    }
    global.ringing = false;
  }

  audiocreate2 = async () => {
    console.log("OrderScreen audiocreate ")
    var soundObject = new Sound('plucky.mp3', Sound.MAIN_BUNDLE, (error) => {
      if (error) {
        console.log('SoundObj Error:', error);
      } else {
        console.log('SoundObj Created : ', soundObject);
        global.ringing = true;
      }
    });

    soundObject.setVolume(1);
    soundObject.setNumberOfLoops(1);
    this.setState({ audioPlayer1: soundObject });
  }


  async retrieveItem(key) {
    console.log("OrderScreen retrieveItem() key: ", key);
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
    console.log("OrderScreen storeItem() key: ", key);
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
    console.log("OrderScreen removeItem() key: ", key);
    try {
      await AsyncStorage.removeItem(key);
      return true;
    }
    catch (exception) {
      return false;
    }
  }


  getRestaurantData = () => {
    console.log("OrderSreen getRestaurantData()");
    this.retrieveItem('RestaurantData').then((restaurant) => {
      if (restaurant == null) {
        this.setState({ ifnotLoggedIn: true });
      }
      else if (restaurant != null) {

        this.setState({ ifnotLoggedIn: false, restaurantName: restaurant.RestaurantName, restaurantId: restaurant.RestaurantId, restaurantServingStatus: restaurant.RestaurantServingStatus }, () => {
          console.log("Restaurant ID : ", this.state.restaurantId);
        });
      }
    }).catch((error) => {
      console.log('Promise is rejected with error: ' + error);
    });
  }


  changeRestaurantServingStatus = () => {
    console.log('TabBarScreen changeRestaurantServingStatus()');
    let status = '';
    let temp = this.state.restaurantServingStatus;
    if (this.state.restaurantServingStatus == 'ACTIVE') {
      status = "INACTIVE";
    }
    else {
      status = "ACTIVE";
    }
    this.setState({ restaurantServingStatus: status, show: true });
    const formData = JSON.stringify({
      'restaurant_id': this.state.restaurantId,
      'restaurant_status': status,
    })
    console.log('FormData to change Status: ', formData);
    fetch(BASEPATH + Global.CHANGE_RESTAURANT_SERVING_STATUS_URL, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: formData
    }).then((response) => response.json()
    ).then((responseData) => {
      if (responseData.Success == "Y") {
        //this.setState({ restaurantServingStatus: status });
        this.retrieveItem('RestaurantData').then((restaurant) => {
          if (restaurant != null) {
            restaurant.RestaurantServingStatus = status;
            this.storeItem('RestaurantData', restaurant);
            console.log('Rechecking Restaurant Data', restaurant);
            this.setState({ show: false, networkerror: false })
          }
        }).catch((error) => {
          console.log('Promise is rejected with error: ' + error);
        });
      } else {
        ToastAndroid.show("Coudn't Change Status, Try Again", ToastAndroid.LONG);
      }
      this.setState({ show: false, networkerror: false })
    }).catch((error) => {

      console.log("Error Changing Status: ", error);
      ToastAndroid.show("We could not find an active internet connection.", ToastAndroid.SHORT);
      this.setState({ show: false, networkerror: true, restaurantServingStatus: temp });
    });
  }

  onBackButtonPressAndroid = () => {
    if (this.state.countback) {
      ToastAndroid.show("Press again to close the app.", ToastAndroid.SHORT);
      this.setState({ countback: false });
      return true;
    }
    else {
      ToastAndroid.show("Closing the app.", ToastAndroid.SHORT);
      this.setState({ countback: true });
      this.props.navigation.navigate("Tabs");
      BackHandler.exitApp();
      //return false;
    }
  };

  activateSoundAndVibrations = (result) => {
    console.log('activateSoundAndVibrations :', result)
    if (result == 'allow') {
      this.state.audioPlayer1.play();
      Vibration.vibrate(PATTERN, true);
      global.ringing = true;
    }
    if (result == 'stop') {
      Vibration.cancel();
      this.state.audioPlayer1.stop();
      global.ringing = false;
    }

  }

  // _handleNotification = (notification) => {
  //   this.setState({ notification: notification });
  //   this._onRefresh(this);
  //   this.activateSoundAndVibrations('allow');
  //   console.log("Notification Recieved");
  // };


  fetchOrders = () => {
    console.log("OrderScreen fetchOrders()");
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    let currentDate = year + '-' + ((month < 10) ? '0' + month : month) + '-' + ((date < 10) ? '0' + date : date);
    console.log(currentDate);
    if (global.ringing) {
      this.activateSoundAndVibrations("stop");
    }
    this.setState({ show: true });
    ToastAndroid.show('Checking Orders.', ToastAndroid.SHORT);
    let formValue = JSON.stringify({
      'restaurant-id': this.state.restaurantId,
      'order-status': '',
      'order-from-date': currentDate,
      'order-to-date': currentDate
    });
    console.log("OrderScreen fetchOrders() FormValue : ", formValue);
    fetch(BASEPATH + Global.GET_RESTAURANT_ORDERS, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: formValue
    }).then((response) => response.json()).then((responseJson) => {
      console.log("OrderScreen fetchOrders() response :", responseJson);
      if (responseJson.Success == 'Y') {
        this.setState({ dataSource: responseJson.Data });
        console.log("Global Ringing : ", global.ringing)
        console.log("Object keys: ", Object.keys(responseJson).length)
        if (Object.keys(responseJson).length > 0) {
          if (responseJson.AllowTone == 'YES') { this.activateSoundAndVibrations("allow"); }
          this.setState({ noorder: false });
          this.setState({ show: false, networkerror: false });
        }
        else {
          this.setState({ noorder: true });
          if (global.ringing) {
            this.activateSoundAndVibrations("stop");
          }
        }
      }
      else {
        this.setState({ noorder: true });
        this.setState({ show: false, networkerror: false });
        console.log('Not Success');
        console.log(responseJson);
        if (global.ringing) {
          this.activateSoundAndVibrations("stop");
        }
      }
      this.setState({ show: false });
      // if (global.ringing) {
      // this.activateSoundAndVibrations("stop");
      // }
    }).catch((error) => {
      this.setState({ show: false, networkerror: true }, () => { console.log("Network Value ", this.state.networkerror) });
      console.log('Promise is rejected with error from server: ' + error);
      ToastAndroid.show('Something went wrong, try again', ToastAndroid.LONG);

    });
  }

  acceptOrder = (data) => {
    console.log("OrderScreen acceptOrder()");
    this.setState({ actionLoader: false });
    let formData = JSON.stringify({
      'rest-id': this.state.restaurantId,
      'order-id': data.OrderId,
      'order-acceptance': 'YES'
    });
    console.log("Formdata for accept order: ", formData);
    fetch(BASEPATH + Global.ACCEPT_RESTAURANT_ORDERS, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: formData
    })
      .then((response) => response.json()).then((responseJson) => {
        console.log("Response: ", responseJson);
        if (responseJson.Success == 'Y') {
          this.activateSoundAndVibrations("stop");
          ToastAndroid.show(responseJson.Message, ToastAndroid.LONG);
          this.setState({ actionLoader: true });
          this._onRefresh();
        }
        else {
          ToastAndroid.show('Something went wrong. Please try again.', ToastAndroid.LONG);
          // this._onRefresh();
        }
      }).catch((error) => {
        console.log('Promise is rejected with error: ' + error);
        ToastAndroid.show('Something went wrong, try again', ToastAndroid.LONG);
      });
  }
  cookOrder = (data) => {
    console.log("OrderScreen cookOrder()");
    this.setState({ actionLoader: false });
    let formData = JSON.stringify({
      'rest-id': this.state.restaurantId,
      'order-id': data.OrderId,
      'order-cook': 'YES'
    });
    console.log("Formdata for cook order: ", formData);
    fetch(BASEPATH + Global.START_ORDER_COOKING_URL, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: formData
    })
      .then((response) => response.json()).then((responseJson) => {
        console.log("Response: ", responseJson);
        if (responseJson.Success == 'Y') {
          ToastAndroid.show(responseJson.Message, ToastAndroid.LONG);
          this._onRefresh();
        }
        else {
          ToastAndroid.show('Something went wrong. Please try again.', ToastAndroid.LONG);
        }
        this.setState({ actionLoader: true });
      }).catch((error) => {
        console.log('Promise is rejected with error: ' + error);
        ToastAndroid.show('Something went wrong, try again', ToastAndroid.LONG);
        this.setState({ noorder: true, networkerror: true, actionLoader: true });
      });
  }
  packOrder = (data) => {
    console.log("OrderScreen packOrder()");
    this.setState({ actionLoader: false, modalLoader: true });
    let formData = JSON.stringify({
      'rest-id': this.state.restaurantId,
      'order-id': data.OrderId,
    });
    console.log("Formdata for cook order: ", formData);
    fetch(BASEPATH + Global.RESTAURANT_ORDER_ACTION_URL, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: formData
    })
      .then((response) => response.json()).then((responseJson) => {
        console.log("Response: ", responseJson);
        if (responseJson.Success == 'Y') {
          ToastAndroid.show(responseJson.Message, ToastAndroid.LONG);
          this._onRefresh();
          this.setState({ modalLoader: false });
        }
        else {
          ToastAndroid.show('Something went wrong. Please try again.', ToastAndroid.LONG);
        }
        this.setState({ actionLoader: true, modalLoader: false });
      }).catch((error) => {
        console.log('Promise is rejected with error: ' + error);
        ToastAndroid.show('Something went wrong, try again', ToastAndroid.LONG);
        this.setState({ noorder: true, networkerror: true, actionLoader: true, modalLoader: false });
      });
  }

  async snap() {
    //this.setState({ cameraLoader: true, camera: false, });
    console.log("Async snap()");
    if (this.camera) {
      const options = { quality: 0.3, base64: true };
      const data = await this.camera.takePictureAsync(options);
      console.log(data.uri);
      this.setState({ photo: data })
      this.setState({ camera: false, photoClicked: true });
    }
  }

  savePhoto = (orderId) => {
    console.log('savePhoto ()');
    this.setState({ camera: false, cameraLoader: false, photoClicked: false, actionLoader: false, visibleModal: null, verifyOtp: false, uploadPhoto: false, loader: true, networkRequest: false });
    console.log("File", this.state.photo);
    let localUri = this.state.photo.uri;
    let filename = localUri.split('/').pop();

    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : `image`;

    let formData = new FormData();
    formData.append('order-id', orderId);
    formData.append('rest-id', this.state.restaurantId);
    formData.append('order-image', { uri: localUri, name: filename, type });
    console.log("HANDOVER_ORDER_URL formValue ", formData);
    fetch(BASEPATH + Global.HANDOVER_ORDER_URL, {
      method: "POST",
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      body: formData
    }).then((response) => response.json()).then((responseJson) => {
      console.log("COLLECT ORDER response", responseJson);
      if (responseJson.Success == "Y") {
        this.setState({
          visibleModal: null, textValue: 'Enter Otp', camera: false,
          photoClicked: false, cameraLoader: false, ViewOtp: false, actionLoader: true
        }, () => {
          this.fetchOrders();
        });
      }
      else {
        ToastAndroid.show(responseJson.Message, ToastAndroid.SHORT);
        this.setState({
          visibleModal: null, textValue: 'Enter Otp', camera: false,
          photoClicked: false, cameraLoader: false, ViewOtp: false, actionLoader: true
        });
      }

    }).catch((error) => {
      console.log('Promise is rejected with error: ' + error);
      ToastAndroid.show("Network error , please try again", ToastAndroid.SHORT);
      this.setState({ networkRequest: true, loader: false, actionLoader: true })
    });
  }

  onFinishCheckingCode(otp, UserOTP) {
    console.log("OrderRestaurantScreen  onFinishCheckingCode() : ", otp, UserOTP);
    this.refs.codeInputRef.clear();
    this.setState({ loader: true, verifyOtp: true, wrongOtp: false });
    if (otp == UserOTP)
      this.setState({ uploadPhoto: true, loader: false, wrongOtp: false, textValue: 'Click Photo' })
    else {
      this.setState({ wrongOtp: true, loader: false, verifyOtp: false })
    }
  }
  __renderOrderDetails = (data) => (
    <View>
      <Display enable={!this.state.camera && !this.state.photoClicked} style={{ bottom: 0 }}>
        <View style={[styles.mainHeaderContainer, styles.modalheader]}>
          <Text style={[styles.textBig]}>Order Details #{this.state.orderDetails.OrderId}</Text>
          <Text>{this.state.orderDetails.OrderStatus}</Text>
        </View>
        <Display enable={!this.state.modalLoader}>
          <View style={styles.modalBody}>
            <ScrollView style={{ maxHeight: 350, padding: 0 }}
              showsVerticalScrollIndicator={false} >
              <View style={[styles.itemList]}>
                {
                  this.state.orderDetails.OrderProducts.map((item, index) => (
                    <View style={styles.itemItem} key={index}>
                      {/* Veg and Non veg Here */}
                      {/* <Display enable={true} style={{ padding: 12, paddingRight: 0, justifyContent: 'center' }}>
                  <View style={{ borderColor: '#008000', width: 16, height: 16, borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ backgroundColor: '#008000', borderRadius: 10, width: 8, height: 8 }} ></View>
                  </View>
                </Display>
                <Display enable={false} style={{ padding: 12, paddingRight: 0, justifyContent: 'center' }}>
                  <View style={{ borderColor: '#cd2121', width: 10, height: 10, borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ backgroundColor: '#cd2121', borderRadius: 10, width: 6, height: 6 }} ></View>
                  </View>
                </Display> */}

                      <View style={{ flexDirection: 'column', padding: 10, opacity: (!true ? .3 : 1), flex: 2 }}>
                        <Text style={{ fontSize: 18, fontWeight: '400', color: '#262626' }}>{item.ProductName}</Text>
                        <Display enable={item.Variant != ''} style={{ flex: 1 }}>
                          <Text style={{ fontSize: 12, color: '#666', fontWeight: '400' }}>{item.Variant}</Text>
                        </Display>
                        <Display enable={item.Addons != ''} style={{ flex: 1 }}>
                          <Text style={{ fontSize: 14, color: '#888' }}><Text style={{ fontStyle: 'italic', fontSize: 12 }}>with</Text> {item.Addons}</Text>
                        </Display>
                      </View>
                      <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                        <View style={{ borderWidth: 1, borderColor: "transparent", backgroundColor: "transparent", justifyContent: 'center', alignItems: 'center', width: 100, height: 40, borderRadius: 1 }}>
                          <Text style={{ fontSize: 22, fontWeight: '500' }}>{item.Qty}</Text>
                        </View>
                      </View>
                    </View>
                  ))
                }
              </View>
              <Display enable={true}>
                <View style={{ flexDirection: 'row', paddingHorizontal: 0, flex: 2 }}>
                  <View style={{ flex: 1, }}>
                    <View style={[styles.box, { borderTopRightRadius: 0, borderBottomRightRadius: 0 }]}>
                      <Image style={{ width: 60, height: 60, padding: 0, }} source={require('../assets/deliveryman.png')} />
                    </View>
                  </View>
                  <Display enable={this.state.orderDetails.ServingType != "PICKUP"} style={{ flex: 2, }}>
                    <View style={[styles.box, { height: 70, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, justifyContent: 'center' }]}>
                      <Text style={{ color: '#cd2121', fontSize: 14, alignSelf: 'flex-start' }}>Delivery Person Assigned.</Text>
                      <Text style={{ alignSelf: 'flex-start' }}>
                        <Text style={{ fontSize: 22, fontWeight: '500' }}>{this.state.orderDetails.DelPerName} </Text>
                        will pick up the order in some time.</Text>
                    </View>
                  </Display>
                  <Display enable={this.state.orderDetails.ServingType == "PICKUP"} style={{ flex: 2, }}>
                    <View style={[styles.box, { height: 70, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, justifyContent: 'center' }]}>
                      <Text style={{ color: '#cd2121', fontSize: 14, alignSelf: 'flex-start' }}>Order will be picked up when you will mark ready.</Text>
                    </View>
                  </Display>
                </View>
              </Display>
              <Display enable={false}>
                <View style={{ flexDirection: 'row', paddingHorizontal: 0, flex: 2 }}>
                  <View style={{ flex: 1, }}>
                    <View style={[styles.box, { borderTopRightRadius: 0, borderBottomRightRadius: 0 }]}>
                      <Image style={{ width: 60, height: 60, padding: 0, }} source={require('../assets/deliveryman.png')} />
                    </View>
                  </View>
                  <View style={{ flex: 3, }}>
                    <View style={[styles.box, { height: 70, borderTopLeftRadius: 0, borderBottomLeftRadius: 0, justifyContent: 'center' }]}>
                      <Text style={{ fontSize: 22, fontWeight: '500' }}>No Runner Assigned! </Text>
                    </View>
                  </View>
                </View>
              </Display>
              <Display enable={this.state.orderDetails.ServingType != "PICKUP"}>
                <View style={{ flexDirection: 'row', paddingHorizontal: 0, flex: 2, marginBottom: 10 }}>
                  <View style={{ flex: 1, }}>
                    <View style={styles.box}>
                      <Text style={{ color: '#cd2121', fontSize: 14 }}>ORDER OTP</Text>
                      <Text style={{ fontSize: 22, fontWeight: '500', letterSpacing: 10, backgroundColor: '#cd2121', padding: 5, borderRadius: 6, color: '#fff' }}>{this.state.orderDetails.OrderOTP}</Text>
                    </View>
                  </View>
                </View>
              </Display>
              <Display enable={this.state.orderDetails.OrderStatus != 'Packed'}>
                <TouchableOpacity style={{ backgroundColor: '#cd2121', padding: 10, borderRadius: 4, justifyContent: 'center', alignItems: 'center', marginBottom: 10 }} onPress={() => {
                  this.packOrder(this.state.orderDetails);
                }}>
                  <Text style={{ color: '#fff', fontWeight: '400', fontSize: 18 }}>Mark Ready</Text>
                </TouchableOpacity>
              </Display>
              <Display enable={this.state.orderDetails.OrderStatus == 'Packed' && this.state.orderDetails.ServingType == "PICKUP"}>
                <TouchableOpacity disabled={this.state.textValue == 'Click Photo'} style={{ backgroundColor: '#3cb256', padding: 10, borderRadius: 4, justifyContent: 'center', alignItems: 'center', marginBottom: 10 }} onPress={() => this.setState({ ViewOtp: true })}>
                  <Text style={{ color: '#fff', fontWeight: '400', fontSize: 18 }}>{this.state.textValue}</Text>
                </TouchableOpacity>
              </Display>
            </ScrollView>

          </View>
        </Display>
        <Display enable={this.state.modalLoader}>
          <View style={[styles.modalBody, { height: 300, justifyContent: 'center', alignItems: 'center' }]}>
            <ActivityIndicator size='large' color='#cd2121' />
          </View>
        </Display>
      </Display>
      <Display enable={this.state.camera}
        style={styles.otpContainer}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "flex-end",
            width: Dimensions.get('window').width,
            height: Dimensions.get('window').height / 2,
            backgroundColor: 'black',
          }}>
          <RNCamera
            type={this.state.type}
            style={styles.preview}
            ref={ref => { this.camera = ref; }}
            // pictureSize={this.state.pictureSize}
            type={RNCamera.Constants.Type.back}
            autoFocus={RNCamera.Constants.AutoFocus.on}
          />

          {/* <View style={styles.cameraTop}>
            <TouchableOpacity onPress={() => this.setState({ camera: false, textValue: 'Enter Otp' })} >
              <Icon name="times" size={25} color="#cd2121" />
            </TouchableOpacity>
          </View> */}

          <View style={styles.cameraBottom}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity style={{ marginLeft: 8 }} onPress={this.snap.bind(this)} >
                <Icon name="camera" size={35} color="#fff" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Display>

      <Display enable={this.state.cameraLoader} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#CD2121" />
        <Text style={{ color: 'green', fontSize: 16 }}>Just a moment ..</Text>
      </Display>

      <Display enable={this.state.photoClicked && !this.state.camera} style={styles.otpContainer}>
        <ScrollView>
          <ImageBackground source={{ uri: this.state.photo.uri }} style={{ width: Dimensions.get('window').width, height: Dimensions.get('window').height, padding: 10, }}>
            <View style={{ height: 50, padding: 10, }}>
              <TouchableOpacity style={{ width: 100 }} onPress={() => this.setState({ camera: true, photoClicked: false, cameraLoader: false })}>
                <View style={{ flexDirection: 'row', backgroundColor: '#fff', padding: 5, borderRadius: 4, justifyContent: 'center', alignItems: 'center' }}>
                  <Icon name="times" size={22} color="#cd2121" />
                  <Text style={{ color: '#cd2121', marginLeft: 3 }}>Retry</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={{ width: 100, marginTop: 8 }} onPress={this.savePhoto.bind(this, this.state.orderDetails.OrderId)}>
                <View style={{ flexDirection: 'row', backgroundColor: '#fff', padding: 5, borderRadius: 4, justifyContent: 'center', alignItems: 'center' }}>
                  <Icon name="check" size={22} color="green" />
                  <Text style={{ color: 'green', marginLeft: 3 }}>Upload</Text>
                </View>
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </ScrollView>
      </Display>
      <Display enable={this.state.ViewOtp} style={{ backgroundColor: '#fff' }}>
        <View style={{ paddingTop: 20 }}>

        </View>
        <View style={{ paddingTop: 35 }}>
          <Display style={{ height: 90 }} enable={!this.state.verifyOtp}>
            <CodeInput
              ref="codeInputRef"
              secureTextEntry={false}
              codeLength={4}
              activeColor='rgba(49, 180, 4, 1)'
              inactiveColor='rgba(49, 180, 4, 1.3)'
              autoFocus={false}
              keyboardType="numeric"
              ignoreCase={true}
              inputPosition='center'
              size={50}
              onFulfill={(code) => this.onFinishCheckingCode(code, this.state.orderDetails.CustomerOTP)}
              containerStyle={{ marginTop: 30 }}
              codeInputStyle={{ borderWidth: 1.5 }}
            />
          </Display>
          <Display enable={this.state.loader} style={{ justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#CD2121" />
            <Text style={{ color: 'green', fontSize: 16 }}>Verifying ...</Text>
          </Display>
          <Display enable={!this.state.verifyOtp} style={{ marginTop: 10, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#cec4c4', fontSize: 14, alignSelf: 'center', fontWeight: '300' }}>Please enter tho otp  for verification!</Text>
          </Display>
          <Display enable={this.state.wrongOtp} style={{ marginTop: 10, justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ color: '#cd2121', fontSize: 18 }}>Invalid Otp !</Text>
          </Display>
          <Display enable={this.state.uploadPhoto} style={{ padding: 10, justifyContent: 'center', alignItems: 'center' }}>
            <View style={{ justifyContent: 'center', alignItems: 'center' }}>
              <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#605d5d', borderRadius: 50, width: 100, height: 100 }} onPress={() => this.setState({ camera: true, ViewOtp: false })}>
                <Image style={{ width: 60, height: 60, padding: 0 }} source={require('../assets/camera.png')} resizeMode={'center'} />
              </TouchableOpacity>
              <Text style={{ color: '#cec4c4', fontSize: 14, marginTop: 15 }}>Upload Cooked Food Image</Text>
            </View>
          </Display>
        </View>
      </Display>
    </View>
  );
  async checkCameraPermission() {
    console.log("OrderScreen checkCameraPermission() : ");
    var check = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
    if (check) {
      console.log("Camera Permission Enabled");
    }
  }
  componentWillMount() {
    this._willBlurSubscription = this.props.navigation.addListener('willBlur', payload =>
      BackHandler.removeEventListener('hardwareBackPress', this.onBackButtonPressAndroid)
    );
    this.audiocreate2();
    this.getRestaurantData();
  }

  componentDidMount() {

    this.checkCameraPermission();
    // this._notificationSubscription = Notifications.addListener(this._handleNotification);
    this.props.navigation.addListener('didFocus', () => {
      this.fetchOrders();
    });
    this.notificationListener = firebase.notifications().onNotification(receivedNotification => {
      console.log("OrderScreen onNotificationReceived :", receivedNotification)
      this._onRefresh();
    })
    //   this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
    //     console.log("ListenerScreen notificationOpenedListener()", notificationOpen);
    //     const notif = notificationOpen.notification;

    //     if (notif.data.targetScreen === 'OrderScreen') {
    //       this._onRefresh();
    //     }
    //     console.log("Vibration Stops")
    //     Vibration.cancel();
    //     firebase.notifications().removeDeliveredNotification(notif.notificationId)
    //   });
  }
  _onRefresh() {
    let date = new Date().getDate();
    let month = new Date().getMonth() + 1;
    let year = new Date().getFullYear();
    let currentDate = year + '-' + ((month < 10) ? '0' + month : month) + '-' + ((date < 10) ? '0' + date : date);
    console.log(currentDate);
    this.setState({ refreshing: true, show: false });
    if (global.ringing) {
      this.activateSoundAndVibrations("stop");
    }
    this.fetchOrders();
    this.setState({ refreshing: false, show: false });
  }

  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <View style={styles.header}>
          <Text style={{ color: '#cd2121', fontSize: 18, fontWeight: "bold", marginRight: 5 }}>{this.state.restaurantName}</Text>
          <Switch
            onValueChange={this.changeRestaurantServingStatus.bind(this)}
            value={this.state.restaurantServingStatus == 'ACTIVE'} />
          <View>
            <Text style={{ color: '#cd2121', fontSize: 18, fontWeight: "bold", marginRight: 5 }}>{(this.state.restaurantServingStatus == 'ACTIVE' ? 'Online' : 'Offline')} </Text>
          </View>
        </View>
        <Display enable={this.state.show} style={{ height: Dimensions.get('window').height, justifyContent: 'center' }}>
          <View>
            <Bubbles size={20} color="#CD2121" />
          </View>
        </Display>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
          showsVerticalScrollIndicator={false}
        >
          <Display enable={this.state.noorder && !this.state.networkerror && this.state.restaurantServingStatus == 'ACTIVE'} style={{ height: Dimensions.get('window').height - 100, justifyContent: 'center' }}>
            <Image style={{ width: 100, height: 100, padding: 0, }} source={require('../assets/no-ordersp.png')} />
            <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', color: '#5b5959' }}>Relax</Text>
            <Text style={{ fontSize: 15, color: '#5b5959' }}>No Active Orders</Text>
          </Display>
          <Display enable={this.state.restaurantServingStatus != 'ACTIVE' && !this.state.networkerror} style={{ height: Dimensions.get('window').height - 100, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
            <Image style={{ width: 100, height: 100, padding: 0, alignSelf: 'center' }} source={require('../assets/ofline.png')} />
            <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', color: '#5b5959' }}>You are currently offline!</Text>
            <Text style={{ fontSize: 15, color: '#5b5959' }}>Not Accepting Orders</Text>
            <TouchableOpacity style={{ width: "70%", backgroundColor: "#2dbe60", padding: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 6 }} onPress={this.changeRestaurantServingStatus}>
              <Text style={{ color: '#fff', fontSize: 14, fontWeight: '300' }}>Go Online</Text>
            </TouchableOpacity>
          </Display>
          <Display enable={this.state.networkerror} style={{ height: Dimensions.get('window').height - 100, justifyContent: 'center', alignItems: 'center' }}>
            <Image style={{ width: 100, height: 100, padding: 0, alignSelf: 'center' }} source={require('../assets/networkerror.png')} />
            <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', color: '#5b5959' }}>Network Error!</Text>
            <Text style={{ fontSize: 15, color: '#5b5959' }}>Server Disconnected , Unable to fetch orders.</Text>
            <TouchableOpacity style={{ width: "70%", backgroundColor: "#333", padding: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 6 }} onPress={this.fetchOrders}>
              <Text style={{ color: '#fff', fontSize: 14, fontWeight: '300' }}>Retry</Text>
            </TouchableOpacity>
          </Display>
          <Display enable={!this.state.noorder && !this.state.networkerror}>
            <View style={{ flexDirection: 'row', padding: 10, justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
              <Text style={{ fontSize: 15, color: '#5b5959', }}>ONGOING ORDERS</Text>
            </View>
          </Display>
          {
            this.state.dataSource.map((data, index) => (
              <Display enable={!this.state.noorder} key={index}>
                <Display enable={data.OrderStatus == 'Order Placed'}>
                  <View style={[styles.listcontainerNewOrder, styles.dir, styles.align, { paddingVertical: 0 }]}>
                    <View style={{ flex: 2, justifyContent: 'center', padding: 10, alignItems: 'center', flexDirection: 'row', backgroundColor: '#3185FC', width: Dimensions.get('window').width - 10 }}>
                      <View style={{ flex: 1, flexDirection: 'row', padding: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 5, borderRadius: 20 }}>
                        <Image style={{ width: 30, height: 30 }} source={require('../assets/placed.png')} />
                        <Text style={{ fontSize: 14, color: '#cd2121', paddingLeft: 5, fontWeight: 'bold', textAlign: 'center' }}>New Order</Text>
                      </View>
                      <View style={{ flex: 2, alignItems: 'flex-end', justifyContent: 'flex-end', paddingRight: 10 }}>
                        <Text style={[styles.align, { fontSize: 20, fontWeight: 'bold', color: '#ebebeb' }]}>#{data.OrderId}</Text>
                      </View>
                    </View>
                    <View style={{ flex: 8, flexDirection: 'row', padding: 10, paddingVertical: 5 }}>
                      <View style={{ flex: 5, flexDirection: 'column' }}>
                        <Text style={{ fontSize: 18, color: '#666' }}>Items to prepare</Text>
                        {
                          data.OrderProducts.map((item, index) => (
                            <View key={index} style={{ borderBottomColor: '#ebebeb', borderBottomWidth: 2, paddingBottom: 5 }}>
                              <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                                <Text style={{ fontSize: 22, flex: 3 }}>{item.ProductName}{item.Variant != '' ? ' - ' + item.Variant : ""}</Text>
                                <Text style={{ fontSize: 20, fontWeight: '400', flex: 1, textAlign: 'right' }}>X {item.Qty}</Text>
                              </View>
                              <Display enable={item.CustomizationType != 'NONE'} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-end' }}>
                                <Text style={{ fontStyle: 'italic' }}>with </Text>
                                <Text style={{ fontSize: 16, fontWeight: '400' }}>{item.Addons}</Text>
                              </Display>
                            </View>
                          ))
                        }
                      </View>
                    </View>
                    <View style={styles.align}>
                      <TouchableOpacity style={{ width: Dimensions.get('window').width - 10, height: 50, backgroundColor: '#3cb256', justifyContent: 'center', alignItems: 'center' }}
                        onPress={this.acceptOrder.bind(this, data)}>
                        <Display enable={this.state.actionLoader}>
                          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 20, padding: 10 }}>Accept</Text>
                        </Display>
                        <Display enable={!this.state.actionLoader} style={{ padding: 10 }} >
                          <ActivityIndicator size="large" color="#fff" />
                        </Display>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Display>
                <Display enable={data.OrderStatus == 'Confirmed & Waiting'}>
                  <View style={[styles.listcontainerNewOrder, styles.dir, styles.align, { paddingVertical: 0 }]}>
                    <View style={{ flex: 2, justifyContent: 'center', padding: 10, alignItems: 'center', flexDirection: 'row', backgroundColor: '#27213C', width: Dimensions.get('window').width - 10 }}>
                      <View style={{ flex: 1, flexDirection: 'row', padding: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 5, borderRadius: 20 }}>
                        <Image style={{ width: 30, height: 30 }} source={require('../assets/waiting.png')} />
                        <Text style={{ fontSize: 14, color: '#cd2121', paddingLeft: 5, fontWeight: 'bold', textAlign: 'center' }}>Waiting</Text>
                      </View>
                      <View style={{ flex: 2, alignItems: 'flex-end', justifyContent: 'flex-end', paddingRight: 10 }}>
                        <Text style={[styles.align, { fontSize: 20, fontWeight: 'bold', color: '#ebebeb' }]}>#{data.OrderId}</Text>
                      </View>
                    </View>
                    <View style={{ flex: 8, flexDirection: 'row', padding: 10, paddingVertical: 5 }}>
                      <View style={{ flex: 5, flexDirection: 'column' }}>
                        <Text style={{ fontSize: 18, color: '#666' }}>Items to prepare</Text>
                        {
                          data.OrderProducts.map((item, index) => (
                            <View key={index} style={{ borderBottomColor: '#ebebeb', borderBottomWidth: 2, paddingBottom: 5 }}>
                              <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                                <Text style={{ fontSize: 22, flex: 3 }}>{item.ProductName}{item.Variant != '' ? ' - ' + item.Variant : ""}</Text>
                                <Text style={{ fontSize: 20, fontWeight: '400', flex: 1, textAlign: 'right' }}>X {item.Qty}</Text>
                              </View>
                              <Display enable={item.CustomizationType != 'NONE'} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-end' }}>
                                <Text style={{ fontStyle: 'italic' }}>with </Text>
                                <Text style={{ fontSize: 16, fontWeight: '400' }}>{item.Addons}</Text>
                              </Display>
                            </View>
                          ))
                        }
                      </View>
                    </View>
                    <View style={styles.align}>
                      <View style={{ width: Dimensions.get('window').width - 10, height: 50, backgroundColor: '#3cb256', justifyContent: 'center', alignItems: 'center' }}
                      // onPress={this.cookOrder.bind(this, data)}>
                      >
                        <Display enable={this.state.actionLoader}>
                          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 20, padding: 10 }}>Awaiting Confirmation</Text>
                        </Display>
                        <Display enable={!this.state.actionLoader} style={{ padding: 10 }} >
                          <ActivityIndicator size="large" color="#fff" />
                        </Display>
                      </View>
                    </View>
                  </View>

                </Display>
                <Display enable={data.OrderStatus == 'Order Confirmed'}>
                  <View style={[styles.listcontainerNewOrder, styles.dir, styles.align, { paddingVertical: 0 }]}>
                    <View style={{ flex: 2, justifyContent: 'center', padding: 10, alignItems: 'center', flexDirection: 'row', backgroundColor: '#27213C', width: Dimensions.get('window').width - 10 }}>
                      <View style={{ flex: 1, flexDirection: 'row', padding: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 5, borderRadius: 20 }}>
                        <Image style={{ width: 30, height: 30 }} source={require('../assets/confirmed.png')} />
                        <Text style={{ fontSize: 14, color: '#cd2121', paddingLeft: 5, fontWeight: 'bold', textAlign: 'center' }}>Confirmed</Text>
                      </View>
                      <View style={{ flex: 2, alignItems: 'flex-end', justifyContent: 'flex-end', paddingRight: 10 }}>
                        <Text style={[styles.align, { fontSize: 20, fontWeight: 'bold', color: '#ebebeb' }]}>#{data.OrderId}</Text>
                      </View>
                    </View>
                    <View style={{ flex: 8, flexDirection: 'row', padding: 10, paddingVertical: 5 }}>
                      <View style={{ flex: 5, flexDirection: 'column' }}>
                        <Text style={{ fontSize: 18, color: '#666' }}>Items to prepare</Text>
                        {
                          data.OrderProducts.map((item, index) => (
                            <View key={index} style={{ borderBottomColor: '#ebebeb', borderBottomWidth: 2, paddingBottom: 5 }}>
                              <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                                <Text style={{ fontSize: 22, flex: 3 }}>{item.ProductName}{item.Variant != '' ? ' - ' + item.Variant : ""}</Text>
                                <Text style={{ fontSize: 20, fontWeight: '400', flex: 1, textAlign: 'right' }}>X {item.Qty}</Text>
                              </View>
                              <Display enable={item.CustomizationType != 'NONE'} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-end' }}>
                                <Text style={{ fontStyle: 'italic' }}>with </Text>
                                <Text style={{ fontSize: 16, fontWeight: '400' }}>{item.Addons}</Text>
                              </Display>
                            </View>
                          ))
                        }
                      </View>
                    </View>
                    <View style={styles.align}>
                      <TouchableOpacity style={{ width: Dimensions.get('window').width - 10, height: 50, backgroundColor: '#3cb256', justifyContent: 'center', alignItems: 'center' }}
                        onPress={this.cookOrder.bind(this, data)}>
                        <Display enable={this.state.actionLoader}>
                          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 20, padding: 10 }}>Start Cooking</Text>
                        </Display>
                        <Display enable={!this.state.actionLoader} style={{ padding: 10 }} >
                          <ActivityIndicator size="large" color="#fff" />
                        </Display>
                      </TouchableOpacity>
                    </View>
                  </View>

                </Display>

                <Display enable={data.OrderStatus == "Cooking" || data.OrderStatus == "Packed"}>
                  <View style={[styles.listcontainerNewOrder, styles.dir, styles.align, { paddingVertical: 0 }]}>
                    <View style={{ flex: 2, justifyContent: 'center', padding: 10, alignItems: 'center', flexDirection: 'row', backgroundColor: '#273E47', width: Dimensions.get('window').width - 10 }}>
                      <View style={{ flex: 1, flexDirection: 'row', padding: 10, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff', padding: 5, borderRadius: 20 }}>
                        <Image style={{ width: 30, height: 30 }} source={(data.OrderStatus == 'Cooking') ? require('../assets/COOKING.png') : require('../assets/packed.png')} />
                        <Text style={{ fontSize: 14, color: '#cd2121', paddingLeft: 5, fontWeight: 'bold', textAlign: 'center' }}>{data.OrderStatus}</Text>
                      </View>
                      <View style={{ flex: 2, alignItems: 'flex-end', justifyContent: 'flex-end', paddingRight: 10 }}>
                        <Text style={[styles.align, { fontSize: 20, fontWeight: 'bold', color: '#ebebeb' }]}>#{data.OrderId}</Text>
                      </View>
                    </View>
                    <View style={{ flex: 8, flexDirection: 'row', padding: 10, paddingVertical: 5 }}>
                      <View style={{ flex: 5, flexDirection: 'column' }}>
                        <Text style={{ fontSize: 18, color: '#666' }}>Items to prepare</Text>
                        {
                          data.OrderProducts.map((item, index) => (
                            <View key={index} style={{ borderBottomColor: '#ebebeb', borderBottomWidth: 2, paddingBottom: 5 }}>
                              <View style={{ flexDirection: 'row', width: '100%', justifyContent: 'space-between' }}>
                                <Text style={{ fontSize: 22, flex: 3 }}>{item.ProductName}{item.Variant != '' ? ' - ' + item.Variant : ""}</Text>
                                <Text style={{ fontSize: 20, fontWeight: '400', flex: 1, textAlign: 'right' }}>X {item.Qty}</Text>
                              </View>
                              <Display enable={item.CustomizationType != 'NONE'} style={{ flexDirection: 'row', justifyContent: 'flex-start', alignItems: 'flex-end' }}>
                                <Text style={{ fontStyle: 'italic' }}>with </Text>
                                <Text style={{ fontSize: 16, fontWeight: '400' }}>{item.Addons}</Text>
                              </Display>
                            </View>
                          ))
                        }
                      </View>
                    </View>
                    <View style={styles.align}>
                      <TouchableOpacity style={{ width: Dimensions.get('window').width - 10, height: 50, backgroundColor: '#3cb256', justifyContent: 'center', alignItems: 'center' }}
                        onPress={() => {
                          this.setState({ orderDetails: data, visibleModal: 7 })
                        }}
                      >
                        <Display enable={this.state.actionLoader}>
                          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 20, padding: 10 }}>{data.OrderStatus == "Packed" ? "Hand Over" : "View Details"}</Text>
                        </Display>
                        <Display enable={!this.state.actionLoader} style={{ padding: 10 }} >
                          <ActivityIndicator size="large" color="#fff" />
                        </Display>
                      </TouchableOpacity>
                    </View>
                  </View>
                </Display>
              </Display>
            ))
          }

        </ScrollView>
        <Modal isVisible={this.state.visibleModal === 7} style={styles.bottomModal} onBackButtonPress={() => this.setState({ visibleModal: null })}>
          {this.__renderOrderDetails()
          }
        </Modal>
      </View>
    );
  }
}