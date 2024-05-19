import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth } from '../components/objects/AuthContext';

const LoginScreen = () => {
  const { login } = useAuth();

  return (
    <View>
      <Text>Login Screen</Text>
      <Button title="Login" onPress={login} />
    </View>
  );
};

export default LoginScreen;