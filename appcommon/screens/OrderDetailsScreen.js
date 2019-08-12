import React from 'react';

import Display from 'react-native-display';

import * as styles from '../CSS/StyleProps.js';
import { StatusBar, YellowBox, Platform, RefreshControl, Vibration,
Text, View, Image, TextInput, Button, Alert, TouchableOpacity, Dimensions,
ScrollView, TouchableHighlight, Modal, ActivityIndicator, FlatList, Linking,
ToastAndroid, BackHandler, AppState, AsyncStorage, DatePickerAndroid } from 'react-native';
import Global from '../Urls/Global';

const BASEPATH = Global.BASE_PATH;


class OrderDetailsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
      orderid: this.props.navigation.getParam("OrderId"),
      OrderTotal: this.props.navigation.getParam("OrderTotal"),
      show: true,
      deliveryPerson: 'No runner assigned',
      deliveryPersonPhone: 'Helpline: 8339000801',
      processing: false,
    }
  }
  componentDidMount() {
    global.orderdetailsorderid = this.state.orderid;
    fetch(BASEPATH + Global.GET_ORDER_DETAILS, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'restaurant-id': global.id,
        'order-id': this.state.orderid
      })
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.Success == 'Y') {
          console.log(responseJson);
          this.setState({ dataSource: responseJson.Data });
          this.setState({ show: false });
          if (responseJson.EmployeeName != null) {
            this.setState({ deliveryPerson: responseJson.EmployeeName, deliveryPersonPhone: responseJson.EmployeePhone })
          }
        }
        else {
          console.log('Not Success');
        }
      })
  }
  render() {
    return (
      <View style={{ flexDirection: 'column', flex: 1 }}>
        <View style={{ height: 40, paddingLeft: 10, justifyContent: 'center' }}>
          <Text style={{ fontSize: 15, color: '#555' }}>Order Details</Text>
        </View>
        <View style={{ flex: 4, backgroundColor: 'white' }}>
          <Display enable={this.state.show} style={{ justifyContent: 'center' }}>
            <ActivityIndicator size="large" color="#CD2121" />
          </Display>
          <ScrollView style={styles.scrollViewStyle}>
            {this.state.dataSource.map((data, index) => (
                    <Display enable={!this.state.show} key={ index }>
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
              <Image source={require('../assets//bmf-business-logo.png')} style={{ width: Dimensions.get('window').width - 150, height: 60 }} />
            </View>
          </ScrollView>
        </View>
        <View style={styles.boxShadow} style={{ backgroundColor: 'white', flexDirection: 'column', height: 100, width: Dimensions.get('window').width - 10, margin: 6 }}>
          <View style={{ flex: 8, flexDirection: 'column', borderTopColor: 'black', borderTopWidth: 1, padding: 5 }}>
            <View style={{ justifyContent: 'flex-start' }}>
              <Text style={{ fontSize: 15, fontWeight: "bold" }}>Special Instructions : </Text>
            </View>
            <ScrollView>
              <Text style={{ fontSize: 12, color: '#555' }}>
                No Instructions from Customer..
              </Text>
            </ScrollView>
          </View>
          <View style={{ flex: 2, flexDirection: 'row', borderTopColor: 'black', borderTopWidth: 1, padding: 10 }}>
            <View style={{ flex: 7, alignItems: 'flex-start', justifyContent: 'center' }}>
              <Text style={{ fontSize: 15, fontWeight: "bold", color: '#555' }}>Total amount :</Text>
            </View>
            <View style={{ flex: 3, alignItems: 'flex-end', justifyContent: 'center' }}>
              <Text style={{ fontSize: 15, fontWeight: "bold" }}>₹ {this.state.OrderTotal}/-</Text>
            </View>
          </View>
        </View>
        <View style={{ justifyContent: 'center', padding: 10 }}>
          <Text style={{ fontSize: 15, fontWeight: "bold" }}>Delivery Person Assigned :</Text>
        </View>
        <View style={{ flex: 1, backgroundColor: 'white', width: Dimensions.get('window').width - 12, margin: 5, shadowColor: '#000', shadowOffset: { width: 10, height: 10 }, shadowOpacity: 0.2, shadowRadius: 4, elevation: 2, }}>
          <View style={{ flex: 1, flexDirection: 'row' }}>
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingRight: 10 }}>
              <Image source={require('../assets/deliveryman.png')} style={{ width: 50, height: 50 }} />
            </View>
            <View style={{ flex: 2, flexDirection: 'column', paddingLeft: 0 }}>
              <View style={{ flex: 1, alignItems: 'flex-start', justifyContent: 'center' }}>
                <Text style={{ fontSize: 20, fontWeight: "bold", color: '#555' }}>{this.state.deliveryPerson}</Text>
                <Text style={{ fontSize: 15, fontWeight: 'bold', color: '#555' }}>{this.state.deliveryPersonPhone}</Text>
              </View>

            </View>
            <View style={{ flexDirection: 'column', paddingLeft: 0, paddingVertical: 5, height: 100, alignItems: 'center', justifyContent: 'center' }}>
              <View style={styles.align}>
                <Text style={{ fontSize: 12, fontWeight: "bold", color: '#555' }}>Cooking Time</Text>
              </View>
              <View style={{ alignItems: 'center', justifyContent: 'center', backgroundColor: '#000', borderRadius: 20, padding: 5 }}>
                <Text style={{ fontSize: 14, fontWeight: "bold", color: '#fff' }}>{this.props.navigation.getParam('TimeLeft')} Minutes </Text>
              </View>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={() => {
          this.setState({ processing: true });
          fetch("https://www.bringmyfood.in/data/reactapp/restaurant/restaurant-order-action.php", {
            method: "POST",
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              'rest-id': global.id,
              'order-id': this.state.orderid,
            })
          })
            .then((response) => response.json())
            .then((responseJson) => {
              if (responseJson.Success == 'Y') {
                this.setState({ processing: false });
                ToastAndroid.show(responseJson.Message, ToastAndroid.LONG);
                this.props.navigation.navigate('Tabs');
              }
              else {
                ob = new OrderScreen();
                ob._onRefresh();
                this.setState({ processing: false });
                ToastAndroid.show('Something went wrong. Please try again.', ToastAndroid.LONG);
                this.props.navigation.navigate('Tabs');
              }
            })
        }}>

          <View style={{ justifyContent: 'center', alignItems: 'center', backgroundColor: '#3cb256', margin: 6, borderRadius: 50, width: Dimensions.get('window').width - 10, padding: 10 }}>
            <Display enable={this.state.processing}>
              <ActivityIndicator size="small" color="#fff" />
            </Display>
            <Display enable={!this.state.processing}>
              <Text style={{ color: 'white', fontSize: 20, fontWeight: "bold" }}>Prepared</Text>
            </Display>
          </View>

        </TouchableOpacity>
      </View>
    );
  }
}

export default OrderDetailsScreen;