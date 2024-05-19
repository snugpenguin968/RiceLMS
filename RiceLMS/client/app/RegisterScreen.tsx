// RegisterScreen.tsx
import React from 'react';
import { View, Text, Button,StyleSheet,TouchableOpacity } from 'react-native';
import { useAuth } from '../components/objects/AuthContext';

const RegisterScreen = () => {
return (
    <TouchableOpacity onPress={() => {/* registration logic */}} style={styles.register}>
        <Text style={styles.registerButtonText}>Register</Text>
    </TouchableOpacity>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    register:{
      width:100,
      marginTop: 10,
      backgroundColor: 'blue',
      padding: 10,
      borderRadius: 5,
      alignItems: 'center',
    },
    registerButtonText:{
      color: 'white',
      fontWeight: 'bold',
    }
  });