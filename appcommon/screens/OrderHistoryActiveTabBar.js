import React from 'react';
import { StatusBar, YellowBox, Platform, RefreshControl, Vibration, Text, View, Image, TextInput, Button, Alert, ListView, TouchableOpacity, Dimensions, ScrollView, TouchableHighlight, Modal, ActivityIndicator, FlatList, Linking, ToastAndroid, BackHandler, AppState, AsyncStorage, DatePickerAndroid } from 'react-native';


class OrderHistoryActiveTabBar extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <View style={{ flex: 8 }}><Text style={{ fontSize: 20, padding: 10, marginLeft: -10, fontWeight: 'bold' }}>#{global.orderhistoryorderid}</Text></View>
        <View style={{ flex: 2 }}><Image source={require('../assets/call.png')} style={{ width: 20, height: 20, marginLeft: 20, marginTop: 15 }} /></View>
      </View>
    );
  }

}

export default OrderHistoryActiveTabBar;