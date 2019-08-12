import React from 'react';
import * as styles from '../CSS/StyleProps.js';
import { StatusBar, YellowBox, Platform, RefreshControl, Vibration, Text, View, Image, TextInput, Button, Alert, ListView, TouchableOpacity, Dimensions, ScrollView, TouchableHighlight, Modal, ActivityIndicator, FlatList, Linking, ToastAndroid, BackHandler, AppState, AsyncStorage, DatePickerAndroid } from 'react-native';



class SignUpScreen extends React.Component {
  render() {
    return (
      <View style={[styles.container, styles.align]}>
        <View style={[styles.block1, styles.align]}>
          <Image source={require('../assets/smalllogo-white.png')} style={{ width: 100, height: 100 }} />
          <Text style={styles.heading}>Welcome to bringmyfood.in</Text>
        </View>
        <View style={styles.block2}>
          <View style={styles.block3}>
            <TextInput placeholder="Business Name" style={styles.input} />
            <TextInput placeholder="Enter email id" style={styles.input} />
            <TextInput placeholder="Enter phone number" style={styles.input} />
            <TextInput placeholder="GST Number" style={styles.input} />
            <TextInput placeholder="Registration Number" style={styles.input} />
            <TextInput placeholder="Enter address" style={styles.input} />
            <Button color="#CD2121" title='SignUp' onPress={() => { Alert.alert("Details submitted \nThank you."); }}></Button>
          </View>
        </View>
      </View>
    );
  }
}

export default SignUpScreen;