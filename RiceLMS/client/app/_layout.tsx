import React from 'react'
import { Stack } from 'expo-router';
import { View, Button, Modal, Text } from 'react-native';
import { useAuth, AuthProvider } from '../components/objects/AuthContext';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import TabLayout from './(tabs)/_layout';

export default function AppContainer(){
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

const AppContent = () => {
  return (
    <AuthProvider>
      <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      </Stack>
    </AuthProvider>
  );
}
