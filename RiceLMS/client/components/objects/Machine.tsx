import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CustomMachineProps {
    title: string;
}

const Machine: React.FC<CustomMachineProps> = ({title}) => {
  const [expanded, setExpanded] = useState(false);

  const toggleMachine = () => {
    setExpanded(!expanded);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleMachine} style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>
      {expanded && (
        <View style={styles.content}>
          <Text>TBD</Text>
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
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
});

export default Machine;