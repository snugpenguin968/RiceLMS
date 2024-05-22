import React from 'react'
import { Stack } from 'expo-router';
import { View, Button, Modal, Text,StyleSheet } from 'react-native';
import { useAuth, AuthProvider } from '../components/objects/AuthContext';
import LoginScreen from './LoginScreen';

const AuthScreens = () => (
  <View style={styles.container}>
    <Text style={styles.titleText}>
      Rice Laundry Management System
    </Text>
    <View>
      <LoginScreen />
    </View>
  </View>
);

const AppContent = () => (
  <Stack>
    <Stack.Screen name="(tabs)" options={{ headerShown: false }}/>
  </Stack>
);

const AppLayout = () => {
  const { isLoggedIn } = useAuth();
  return isLoggedIn ? <AppContent /> : <AuthScreens />;
};

export default function App() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  );
}


const styles = StyleSheet.create({
  titleText:{
    fontSize: 20,
    fontWeight: 'bold',
  },
  container: {
    flex: 1,
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
});