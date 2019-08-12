import { AsyncStorage, Vibration } from 'react-native';

import firebase from 'react-native-firebase';
import { RemoteMessage } from 'react-native-firebase';

const PATTERN = [1000, 2000, 2000]

AsyncStorage.getItem('lastNotification').then(data => {
    if (data) {
        console.log('last notification', JSON.parse(data));
        AsyncStorage.removeItem('lastNotification');
    }
})

export function registerHeadlessListener(message) {
    console.log("ListenerScreen registerHeadlessListener()", message);
    AsyncStorage.setItem('lastNotification', JSON.stringify(message));
}

export default async (RemoteMessage) => {
    console.log("ListenerScreen RemoteMessaging", RemoteMessage);
    Vibration.vibrate(PATTERN, true);
    this.notificationListener = firebase.notifications().onNotification(notification => {
        console.log("ListenerScreen notificationListener()", notification);
        notification.android.setChannelId(notification.data.channelId);
        console.log('onNotification: ', notification);
        firebase.notifications().displayNotification(notification);

    })
    return Promise.resolve();
}

// these callback will be triggered only when app is foreground or background
export function registerAppListener(navigation) {
    console.log("ListenerScreen registerAppListener()", navigation);

    const channel = new firebase.notifications.Android.Channel('BMF-Channel-Action', 'BMF-Channel-Action', firebase.notifications.Android.Importance.Max)
        .setDescription('BMF-Partner-Notifications')
        .enableVibration(true)
        .setVibrationPattern([1000, 2000, 2000])
        .setSound("plucky.mp3");
    firebase.notifications().android.createChannel(channel);
    
    const newChannel = new firebase.notifications.Android.Channel('BMF-Channel-Info', 'BMF-Channel-Info', firebase.notifications.Android.Importance.Max)
        .setDescription('BMF-Partner-Notifications')
        .enableVibration(true)
        .setSound("tone.mp3");
    firebase.notifications().android.createChannel(newChannel);

    this.notificationListener = firebase.notifications().onNotification(receivedNotification => {
        console.log("ListenerScreen notificationListener()", receivedNotification);
        console.log("Channel Id:", receivedNotification.data.channelId)
        var channelId = receivedNotification.data.channelId;
        console.log("Vibration Starts")
        if(channelId === "BMF-Channel-Action"){
            Vibration.vibrate(PATTERN, true);
            receivedNotification.android.setChannelId("BMF-Channel-Action");
            // console.log(receivedNotification.data.id)
            // console.log(receivedNotification.notificationId)
            // AsyncStorage.setItem(receivedNotification.data.id, receivedNotification.notificationId);
            // this.storeItem(receivedNotification.data.id, receivedNotification.notificationId);
        } else {
            receivedNotification.android.setChannelId("BMF-Channel-Info");
        }
        
        firebase.notifications().displayNotification(receivedNotification);
    })

    this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen) => {
        console.log("ListenerScreen notificationOpenedListener()", notificationOpen);
        const notif = notificationOpen.notification;

        // if (notif.data.targetScreen === 'signup') {
        //     setTimeout(() => {
        //         navigation.navigate('SignUp');
        //     }, 300)
        // }
        console.log("Vibration Stops")
        Vibration.cancel();
        firebase.notifications().removeDeliveredNotification(notif.notificationId)
    });

    this.onTokenRefreshListener = firebase.messaging().onTokenRefresh(token => {
        console.log("TOKEN (refreshUnsubscribe)", token);
    });

    this.messageListener = firebase.messaging().onMessage((message) => {
        console.log("ListenerScreen messageListener()", message);
        if (message.data && message.data.custom_notification) {
            let notification = new firebase.notifications.Notification();
            notification = notification.setNotificationId(new Date().valueOf().toString())
                .setTitle(message.title)
                .setBody(message.body)
                .setData(message.data)
            // .setSound("bell.mp3")
            notification.android.setChannelId("BMF-Channel-Action");
            firebase.notifications().displayNotification(notification);
        }
    });

}