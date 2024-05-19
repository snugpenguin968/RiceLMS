import React from 'react';
import { View, Text, Button,TouchableOpacity,StyleSheet } from 'react-native';
import { useAuth } from '../components/objects/AuthContext';

const LoginScreen = () => {
  const { login } = useAuth();

  return (
    <TouchableOpacity onPress={login} style={styles.login}>
      <Text style={styles.loginButtonText}>Login</Text>
    </TouchableOpacity>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  login:{
    width:100,
    marginTop: 10,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  loginButtonText:{
    color: 'white',
    fontWeight: 'bold',
  }
});