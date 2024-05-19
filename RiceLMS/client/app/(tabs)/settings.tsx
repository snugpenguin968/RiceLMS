import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAuth } from '../../components/objects/AuthContext';

export default function Settings() {
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={logout} style={styles.logout}>
            <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  logout:{
    width:100,
    marginTop: 10,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  logoutButtonText:{
    color: 'white',
    fontWeight: 'bold',
  }
});