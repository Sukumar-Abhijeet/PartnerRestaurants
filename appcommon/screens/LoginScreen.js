import React from 'react';
import Display from 'react-native-display';
import { Bubbles } from 'react-native-loader';
// import { Permissions, Notifications, Audio, Constants } from 'expo';
import {
  Text, View, Image, TextInput, Button, Alert, Keyboard, TouchableOpacity,
  Dimensions, ScrollView, TouchableHighlight, Modal, ActivityIndicator, FlatList,
  Linking, ToastAndroid, BackHandler, AppState, AsyncStorage, DatePickerAndroid
} from 'react-native';
import * as styles from '../CSS/StyleProps.js';
import Icon from 'react-native-vector-icons/FontAwesome';
import Global from '../Urls/Global';
import firebase from 'react-native-firebase';
import {AutoGrowingTextInput} from 'react-native-autogrow-textinput';
const BASEPATH = Global.BASE_PATH;

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = { mobile: '', password: '' };
    this.state = {
      loginscreen: true,
      loader: false,
      show: false,
      networkerror: false,
      promptmessage: '',
      change: 0,
      fcmToken: '',
    }
  }
  async retrieveItem(key) {
    console.log("LoginScreen retrieveItem() key: ", key);
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
    console.log("LoginScreen storeItem() key: ", key);
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
    console.log("LoginScreen removeItem() key: ", key);
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
      this.getToken();
    } else {
      this.requestPermission();
    }
  }

  getToken = async () => {

    fcmToken = await firebase.messaging().getToken();
    if (fcmToken) {
      this.storeItem("fcmToken", fcmToken);
    }
    this.state.fcmToken = fcmToken;
  }

  requestPermission = async () => {
    try {
      await firebase.messaging().requestPermission();
      this.getToken();
    }
    catch (e) {
      console.log('permission rejected');
    }
  }

  toast() {
    ToastAndroid.show('Welcome to BringMyFood.', ToastAndroid.LONG);
  }


  checkExistingToken() {
    console.log("LoginScreen checkExistingToken()");
    this.retrieveItem('fcmToken').then((Token) => {
      if (Token != null) {
        console.log("Async fcmToken : ", Token);
        this.setState({ fcmToken: Token });
        // this.removeItem("fcmToken");
      }
      else {
        console.log("No Token generated");
        this.checkPermissions();
      }
    }).catch((error) => {
      console.log('Promise is rejected with error: ' + error);
    });
  }

  componentDidMount() {
    this.checkExistingToken();
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  _keyboardDidShow = (event) => {
    console.log("LoginScreen _keyboardDidShow() :");
    const keyboardHeight = event.endCoordinates.height;
    // this.ScrollView.scrollToEnd({ animated: true });
    console.log("KeyboardHeight : ", keyboardHeight)
    this.setState({ change: keyboardHeight })
  }
  _keyboardDidHide = () => {
    console.log("LoginScreen _keyboardDidHide() :");
    this.setState({ change: 0 })
  }
  changeVal() {
    this.setState({ loader: false });
    if ((this.state.mobile == '' && this.state.password == '') || (this.state.mobile == null && this.state.password == null)) {
      ToastAndroid.show('Empty fields.', ToastAndroid.LONG);
      this.setState({ loader: false });
    }
    else if (this.state.mobile == '' || this.state.mobile == null) {
      ToastAndroid.show('Please Enter Mobile Number or E-mail id.', ToastAndroid.LONG);
      this.setState({ loader: false });
    }
    else if (this.state.password == '' || this.state.password == null) {
      ToastAndroid.show('Please Enter Password.', ToastAndroid.LONG);
      this.setState({ loader: false });
    }
    else {
      this.setState({ loader: true });
      let formValue = JSON.stringify({
        'username': this.state.mobile,
        'password': this.state.password,
        'token': this.state.fcmToken
      });
      if (this.state.fcmToken == "")
        console.log("NO TOKEN GENERATED");
      console.log("formvalue: ", formValue);
      fetch(BASEPATH + Global.RESTAURANT_LOGIN_URL, {
        method: "POST",
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: formValue
      })
        .then((response) => response.json())
        .then((responseData) => {
          console.log(responseData);
          this.setState({ loader: true });
          if (responseData.Success == 'Y') {
            if (responseData.Message == 'Login Successful') {
              ToastAndroid.show('Welcome to BringMyFood', ToastAndroid.SHORT);
              this.storeItem('RestaurantData', responseData.Restaurant);
              this.props.navigation.navigate('Tabs');
            }
          }
          else {
            ToastAndroid.show('Invalid Credential..', ToastAndroid.SHORT);
          }
          this.setState({ loader: false });
        }).catch((error) => {
          console.log(error)
          console.log("Promise rejected with error")
        });
    }
  }
  render() {
    return (
      <ScrollView contentContainerStyle={[styles.layer1, { marginTop: -this.state.change }]}
        ref={ref => this.ScrollView = ref}
        keyboardShouldPersistTaps={'always'}
      >
        <Display enable={!this.state.networkRequest} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ justifyContent: 'center', alignItems: 'center', paddingTop: 80, flex: 5 }}>
            <Image source={require('../assets/BMF-logo.png')} style={styles.logo} />
            {/* <Text style={styles.bmftext}>BringMyFood RUNNER</Text> */}
            <Display
              enable={this.state.promptstatus}
              enterDuration={500}
              exitDuration={250}
              exit="fadeOutLeft"
              enter="fadeInLeft"
            >
              <Text style={styles.promptmessage}>
                {this.state.promptmessage}
              </Text>
            </Display>
          </View>
          <View style={styles.loginCard}>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderBottomColor: '#0000e5', borderBottomWidth: 1, paddingBottom: 0 }}>
              <Icon name="user" size={16} color="#0000e5" />
              <AutoGrowingTextInput placeholder=" Enter Phone Number " style={styles.phn_num}
                returnKeyType="next"
                keyboardType="phone-pad"
                maxLength={10}
                //autoFocus={true}
                onChangeText={(mobile) => this.setState({ mobile })}
                onSubmitEditing={() => { this.passInput.focus(); }}
                underlineColorAndroid='transparent'
              />
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', borderBottomColor: '#0000e5', borderBottomWidth: 1, marginTop: 0, paddingBottom: 0 }}>
              <Icon name="key" size={16} color="#0000e5" />
              <AutoGrowingTextInput placeholder="Password" style={styles.pass}
                returnKeyType="go"
                secureTextEntry={true}
                ref={component => this.passInput = component}
                onChangeText={(password) => this.setState({ password })}
                underlineColorAndroid='transparent'
                onSubmitEditing={() => { this.changeVal(); }}
              />
            </View>
          </View>

          <View style={{ flex: 2, flexDirection: 'row', marginTop: 10 }}>
            <View style={{ flexDirection: 'row', flex: 1, paddingLeft: 15, alignItems: 'center', justifyContent: 'flex-start', }}>
              <View style={{ borderWidth: 1, borderRadius: 10, width: 20, height: 20, borderColor: '#0000e5', justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ backgroundColor: '#0000e5', borderRadius: 7, width: 15, height: 15, }}></View>
              </View>
              <Text style={{ marginLeft: 6, color: '#5c5c5c', fontWeight: '600', width: 100, fontSize: 17 }}>Remember me</Text>
            </View>
            <View style={{ flex: 1, alignItems: 'flex-end', justifyContent: 'center', }}>
              <TouchableOpacity onPress={() => { this.changeVal() }} style={{ padding: 20, backgroundColor: '#0000e5', borderTopLeftRadius: 50, borderBottomLeftRadius: 50, width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                <Display enable={this.state.loader} style={{ height: 'auto', justifyContent: 'center' }}>
                  <ActivityIndicator size="large" color="#fff" />
                </Display>
                <Display enable={!this.state.loader} style={{ height: 'auto', justifyContent: 'center' }}>
                  <Text style={{ color: '#fff', fontWeight: '500', marginLeft: 15, fontSize: 20 }}>LOGIN</Text>
                </Display>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' }}>
            <Text style={{ fontSize: 12, color: '#bcb8b8' }}>Made in </Text>
            <Icon name={'heart'} color={'#cd2121'} size={12} />
            <Text style={{ fontSize: 12, color: '#bcb8b8' }}> with Food!..</Text>
          </View>
        </Display>
        <Display enable={this.state.networkerror} style={styles.networkRequest}>
          <Image source={require("../assets/networkerror.png")} resizeMode={"center"} style={{ width: 200, height: 200 }} />
          <Text style={{ marginTop: 3, fontSize: 12, color: '#a39f9f' }}>It seems to be a network error!</Text>
          <TouchableOpacity style={{ backgroundColor: '#000', width: '100%', paddingHorizontal: 15, paddingVertical: 6, borderRadius: 4, marginTop: 5 }} onPress={() => this.setState({ networkerror: true })}>
            <Text style={{ color: '#fff', fontSize: 16, fontWeight: '400', }}>Retry</Text>
          </TouchableOpacity>
        </Display>
      </ScrollView >
    );
  }
}

export default LoginScreen;