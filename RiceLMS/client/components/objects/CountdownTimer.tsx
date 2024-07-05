import React from 'react';
import {Text, StyleSheet } from 'react-native';
 // Countdown timer component
 const CountdownTimer = ({ countdown }: { countdown: number }) => {
    
    return (
        <Text style={styles.countdownText}>
        {Math.floor(countdown / 60)}:{countdown % 60 < 10 ? '0' : ''}
        {countdown % 60}
      </Text>
    );
  };

  const styles=StyleSheet.create({
    countdownText: {
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
      }
})
  
export default CountdownTimer