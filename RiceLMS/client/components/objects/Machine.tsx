import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet,TextInput } from 'react-native';

interface CustomMachineProps {
    title: string;
}

const Machine: React.FC<CustomMachineProps> = ({title}) => {
  const [expanded, setExpanded] = useState(false);
  const [time, setTime] = useState('');
  const handleSubmit = () => {
    const isValidInteger = /^\d+$/.test(time);
    if (!isValidInteger){
      alert("Please enter a valid minute time")
    }
    else{
      const enteredTime = parseInt(time, 10); // Convert input to an integer
      console.log(enteredTime);
    }
  };
  const toggleMachine = () => {
    setExpanded(!expanded);
  };
  const handleTimeChange = (text: string) => {
    setTime(text);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleMachine} style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>
      {expanded && (
        <View style={styles.content}>
        <TextInput
          style={styles.input}
          placeholder="Machine Runtime (mins)"
          placeholderTextColor="#999"
          value={time}
          onChangeText={handleTimeChange}
          keyboardType="numeric"
        />
      <TouchableOpacity onPress={handleSubmit} style={styles.button}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
      </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderColor: '#ccc',
    paddingLeft:5,
    paddingRight:5
  },
  header: {
    paddingVertical: 15,
    paddingHorizontal: 10,
    backgroundColor: '#f0f0f0',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal:80,
    paddingVertical: 10,
  },
  input: {
    marginTop: 10,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  button: {
    marginTop: 10,
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Machine;