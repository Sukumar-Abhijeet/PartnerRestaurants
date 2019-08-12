import React from 'react';
import { StatusBar, YellowBox, Platform, RefreshControl, Vibration, Text, View, Image, TextInput, Button, Alert, ListView, TouchableOpacity, Dimensions, ScrollView, TouchableHighlight, Modal, ActivityIndicator, FlatList, Linking, ToastAndroid, BackHandler, AppState, AsyncStorage, Switch } from 'react-native';
import * as styles from '../CSS/StyleProps.js';
import Display from 'react-native-display';
import Global from '../Urls/Global';

const BASEPATH = Global.BASE_PATH;
class DishesScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            switch1Value: true,
            dishesList: [],
            restaurantId: '',
            ifnotLoggedIn: true,
            restaurantServingStatus: '',
            restaurantName: '',
            loader: true,
            networkerror:false
        }
    }
    getRestaurantData = () => {
        console.log("DisheshScreen getRestaurantData()");
        this.retrieveItem('RestaurantData').then((restaurant) => {
            if (restaurant == null) {
                this.setState({ ifnotLoggedIn: true });
            }
            else if (restaurant != null) {
                this.setState({ ifnotLoggedIn: false, restaurantName: restaurant.RestaurantName, restaurantId: restaurant.RestaurantId, restaurantServingStatus: restaurant.RestaurantServingStatus });
                this.fetchDishesList();
            }
        }).catch((error) => {
            console.log('Promise is rejected with error: ' + error);
        });
    }
    async retrieveItem(key) {
        console.log("DishesScreen retrieveItem() key: ", key);
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


    fetchDishesList = () => {
        this.setState({ loader: true , networkerror:true});
        const formData = JSON.stringify({
            'restaurant_id': this.state.restaurantId,
        })
        fetch(BASEPATH + Global.FETCH_DISHES_LIST, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: formData
        })
            .then((response) => response.json()).then((responseData) => {
                console.log("Response", responseData);
                this.setState({ dishesList: responseData.Data, loader: false ,networkerror:false });
            }).catch((error) => {

                console.log("Error Fetching Dishes: ", error);
                ToastAndroid.show("We could not find an active internet connection.", ToastAndroid.SHORT);
                this.setState({ loader: false, networkerror: true });
              });
    }
    changeDishStatus = (item) => {
        console.log("changeDishStatus() ", item);

        let status = '';
        if (item.RestStatus == 'ACTIVE') {
            status = "INACTIVE";
        }
        else {
            status = "ACTIVE";
        }

        const formData = JSON.stringify({
            'restaurant_id': item.RestaurantId,
            'product_id': item.ProductId,
            'product_status': status
        })
        console.log(formData);
        let arr = this.state.dishesList;
        let idx = arr.indexOf(item);
        console.log("Idx ", idx);
        if (idx > -1) {
            arr[idx].RestStatus = status;
            this.setState({ dishesList: arr, loader: false });
        }
        fetch(BASEPATH + Global.CHANGE_DISH_STATUS_URL, {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: formData
        })
            .then((response) => response.json())
            .then((responseData) => {
                console.log("Response", responseData);
                if (responseData.Success == 'Y') {
                    ToastAndroid.show("Item is " + status, ToastAndroid.SHORT);
                }
                else {
                    ToastAndroid.show(responseData.Message, ToastAndroid.SHORT);
                    if (status == "ACTIVE") {
                        arr[idx].RestStatus = "INACTIVE";
                    }
                    else {
                        arr[idx].RestStatus = "ACTIVE";
                    }

                    this.setState({ dishesList: arr, loader: false });
                }

            });
    }
    componentWillMount() {
        // this.fetchAsync();
        this.getRestaurantData();
    }
    render() {
        return (
            <View opacity={this.state.unresponsive ? .5 : 1} style={[styles.mainContainer]}>
                <View style={styles.header}>
                    <Text style={{ color: '#cd2121', fontSize: 18, fontWeight: "bold", marginRight: 5 }}>Currently Selling Dishes</Text>
                </View>
                <Display enable={!this.state.loader}>
                    <ScrollView showsVerticalScrollIndicator={false}>
                        {this.state.dishesList.map((item, index) => (
                            <Display enable={!this.state.loader} style={{ height: 60 }} key={index}>
                                <View style={[styles.listcontainer, styles.align, styles.boxShadow]}>
                                    <View style={styles.splitcontainer1}>
                                        <Display enable={true} style={{ justifyContent: 'center' }}>
                                            <View style={{ borderColor: item.ProductVeganType == "NON-VEG" ? '#cd2121' : '#008000', width: 20, height: 20, borderWidth: 1, justifyContent: 'center', alignItems: 'center' }}>
                                                <View style={{ backgroundColor: item.ProductVeganType == "NON-VEG" ? '#cd2121' : '#008000', borderRadius: 10, width: 15, height: 15 }} ></View>
                                            </View>
                                        </Display>
                                    </View>
                                    <View style={{ flexDirection: 'row', flex: 9, padding: 5, justifyContent: 'center', alignItems: 'center' }}>
                                        <View style={{ flex: 5, padding: 3, paddingLeft: 0 }}>

                                            <Text style={styles.fontColorSize}>{item.ProductName}</Text>
                                        </View>
                                        <View style={{ flex: 2, padding: 3 }}>

                                            <Text style={styles.fontColorSize}>₹ {item.RestPrice}</Text>
                                        </View>
                                        <View style={{ flex: 3, padding: 3 }}>
                                            <Switch
                                                onValueChange={this.changeDishStatus.bind(this, item)}
                                                value={item.RestStatus == 'ACTIVE'} />
                                            <Text style={{ fontSize: 12, color: '#9b9595' }}>
                                                Item
                                        {item.RestStatus == 'ACTIVE' ? " Available" : " Unavailable"}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </Display>
                        ))}
                    </ScrollView>
                </Display>
                <Display enable={this.state.loader} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <ActivityIndicator color='#cd2121' size='large' />
                </Display>
                <Display enable={!this.state.loader && this.state.networkerror} style={{ height: Dimensions.get('window').height - 100, justifyContent: 'center', alignItems: 'center' }}>
                    <Image style={{ width: 100, height: 100, padding: 0, alignSelf: 'center' }} source={require('../assets/networkerror.png')} />
                    <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', color: '#5b5959' }}>Network Error!</Text>
                    <Text style={{ fontSize: 15, color: '#5b5959' }}>Server Disconnected , Unable to fetch orders.</Text>
                    <TouchableOpacity style={{ width: "70%", backgroundColor: "#333", padding: 10, justifyContent: 'center', alignItems: 'center', borderRadius: 6 }} onPress={this.fetchDishesList}>
                        <Text style={{ color: '#fff', fontSize: 14, fontWeight: '300' }}>Retry</Text>
                    </TouchableOpacity>
                </Display>
            </View>

        );
    }
}


export default DishesScreen;