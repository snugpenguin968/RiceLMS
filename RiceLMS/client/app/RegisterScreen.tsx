// RegisterScreen.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import { useAuth } from '../components/objects/AuthContext';

const RegisterScreen = () => {
return (
    <View>
        <Text>Register Screen</Text>
        <Button title="Register" onPress={() => {/* registration logic */}} />
    </View>
    );
};

export default RegisterScreen;