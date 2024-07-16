import React, { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import axios from 'axios';
import Constants from 'expo-constants';
import { useAuth } from './AuthContext';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: true,
  }),
});

const NotificationService = () => {
  const [expoPushToken, setExpoPushToken] = useState<Notifications.ExpoPushToken | null>(null);
  const [notification, setNotification] = useState<Notifications.Notification | null>(null);
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();
  const {username}=useAuth()

  useEffect(() => {
    registerForPushNotificationsAsync().then(token => {
      setExpoPushToken(token || null);
      // Send token to backend
      if (token) {
        axios.post('https://mongrel-allowing-neatly.ngrok-free.app/registerNotification', { 
          Token:token.data,
          UserID: username 
        },{
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .catch(error => console.error('Error registering token:', error));
      }
    });

    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      setNotification(notification);
    });

    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      console.log(response);
    });

    return () => {
      Notifications.removeNotificationSubscription(notificationListener.current);
      Notifications.removeNotificationSubscription(responseListener.current);
    };
  }, []);

  return (
    <View>
    </View>
  );
};

async function registerForPushNotificationsAsync() {
    try {
        let token;
        if (Platform.OS === 'android' || Platform.OS === 'ios') {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            console.log('Failed to get push token for push notification!');
            return;
          }
          // Include your projectId here
          const projectId =Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
          token = await Notifications.getExpoPushTokenAsync({
            projectId
          });
          console.log('Expo push token:', token);
        } else {
          console.log('Must use physical device for Push Notifications');
        }
    
        return token;
      } catch (error) {
        console.error('Error while registering for push notifications:', error);
      }
}

const sendNotificationToUser = async (userId:string|null) => {
  try {
    // Query the backend to get the token
    const response = await axios.post('https://mongrel-allowing-neatly.ngrok-free.app/getUserToken', { UserID: userId }, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const token = response.data.token;
    if (token) {
      // Send notification using the token
      const message = {
        to: token,
        title: 'Notification',
        body: 'Clothes Moved!',
      };

      await axios.post('https://exp.host/--/api/v2/push/send', message, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Notification sent successfully');
    } else {
      console.error('No token found for the user');
    }
  } catch (error) {
    console.error('Error sending notification:', error);
  }
};

export default NotificationService;
export {sendNotificationToUser}