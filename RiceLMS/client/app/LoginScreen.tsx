import React from 'react';
import { View, Text, TextInput,TouchableOpacity,StyleSheet } from 'react-native';
import { useAuth } from '../components/objects/AuthContext';
import { useState } from 'react';

const LoginScreen = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    if (username && password) {
      login(username, password);
    }
  };

  return (
    <View>
      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        placeholderTextColor="#999"
      />
      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#999"
      />
    <TouchableOpacity onPress={handleLogin} style={styles.login}>
      <Text style={styles.loginButtonText}>Login</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={() => {/* registration logic */}} style={styles.register}>
      <Text style={styles.registerButtonText}>Register</Text>
    </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  login:{
    width:150,
    marginTop: 10,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  loginButtonText:{
    color: 'white',
    fontWeight: 'bold',
  },
  register:{
    width:150,
    marginTop: 10,
    backgroundColor: 'blue',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  registerButtonText:{
    color: 'white',
    fontWeight: 'bold',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    padding: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 10,
  },
});