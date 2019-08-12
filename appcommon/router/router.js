import React from 'react';
import { createStackNavigator, createAppContainer, TabNavigator, createBottomTabNavigator } from 'react-navigation';
import CheckLoginScreen from '../screens/CheckLoginScreen';
import LoginScreen from '../screens/LoginScreen';
import OrderScreen from '../screens/OrderScreen';
import HistoryScreen from '../screens/HistoryScreen';
import ProfileScreen from '../screens/ProfileScreen';
import SignUpScreen from '../screens/SignUpScreen';
import OrderDetailsScreen from '../screens/OrderDetailsScreen';
import OrderHistoryScreen from '../screens/OrderHistoryScreen';
import OrderDetailsActiveTabBar from '../screens/OrderDetailsActiveTabBar';
import TabIcon from '../screens/TabIcon';
import DishesScreen from '../screens/DishesScreen';

const TabNav = createBottomTabNavigator({
    Order: {
        screen: OrderScreen,
        navigationOptions: {
            animationEnabled: true,
            swipeEnabled: true,
            tabBarLabel: 'Orders',
            tabBarIcon: ({ focused, tintColor }) => (
                <TabIcon
                    iconDefault='ios-analytics-outline'
                    iconFocused='ios-analytics'
                    focused={focused}
                    tintColor={tintColor}
                />
            )
        }
    },
    Dishes: {
        screen: DishesScreen,
        navigationOptions: {
            animationEnabled: true,
            swipeEnabled: true,
            title: 'Dishes',
            tabBarIcon: ({ focused, tintColor }) => (
                <TabIcon
                    iconDefault='ios-restaurant-outline'
                    iconFocused='ios-restaurant'
                    focused={focused}
                    tintColor={tintColor}
                />
            )
        }
    },

    History: {
        screen: HistoryScreen,
        navigationOptions: {
            animationEnabled: true,
            swipeEnabled: true,
            title: 'History',
            tabBarIcon: ({ focused, tintColor }) => (
                <TabIcon
                    iconDefault='ios-notifications-outline'
                    iconFocused='ios-clipboard'
                    focused={focused}
                    tintColor={tintColor}
                />
            )
        }
    },
    Profile: {
        screen: ProfileScreen, navigationOptions: {
            animationEnabled: true,
            swipeEnabled: true,
            title: 'Profile',
            tabBarIcon: ({ focused, tintColor }) => (
                <TabIcon
                    iconDefault='ios-contact-outline'
                    iconFocused='ios-contact'
                    focused={focused}
                    tintColor={tintColor}
                    onPress={() => {
                        ToastAndroid.show('Delivered Orders to BringMyFood.', ToastAndroid.LONG)
                    }}
                />
            )
        }
    },
},
    {
        tabBarPosition: 'bottom',
        swipeEnabled: true,
        tabBarOptions:
        {
            style: {
                backgroundColor: '#fff',
            },
            labelStyle: {
                fontSize: 10,
            },
            indicatorStyle: {
                backgroundColor: '#fff',
            },
            animationEnabled: true,
            showIcon: true,
            showLabel: true,
            activeTintColor: '#cd2121',
            inactiveTintColor: '#555',
            activeBackgroundColor: 'white',
        }
    });

export const RootStack = createStackNavigator(
    {
        CheckLogin: {
            screen: CheckLoginScreen,
            navigationOptions: { header: null }
        },
        Login: {
            screen: LoginScreen,
            navigationOptions: { header: null }
        },
        SignUp: {
            screen: SignUpScreen,
            navigationOptions: { header: null }
        },
        OrderDetails: {
            screen: OrderDetailsScreen,
            navigationOptions: {
                headerStyle:
                    { backgroundColor: '#fbfbfb', },
                headerTitle: OrderDetailsActiveTabBar
            }
        },
        OrderHistory: {
            screen: OrderHistoryScreen,
            navigationOptions: {
                header:null
            }
        },
        Tabs: {
            screen: TabNav,
            navigationOptions: {
                header:null
            }
        }
    },
    {
        initialRouteName: 'CheckLogin',
    }
);

const Menu = createAppContainer(RootStack);

export default Menu;
