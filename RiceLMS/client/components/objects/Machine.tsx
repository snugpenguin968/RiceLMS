import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet,TextInput } from 'react-native';

interface CustomMachineProps {
    title: string;
}

const Machine: React.FC<CustomMachineProps> = ({title}) => {
  const [expanded, setExpanded] = useState(false);
  const [time, setTime] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [countdownActive, setCountdownActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();
  const handleSubmit = () => {
    const isValidInteger = /^\d+$/.test(time);
    if (!isValidInteger){
      alert("Please enter a valid minute time")
    }
    else{
      const enteredTime = parseInt(time, 10); // Convert input to an integer
      setCountdown(enteredTime * 60); // Convert minutes to seconds
      setCountdownActive(true);
      setTime(''); // Clear input field
    }
  };
  const toggleMachine = () => {
    setExpanded(!expanded);
  };
  const handleTimeChange = (text: string) => {
    setTime(text);
  };
  const handleUndo = () => {
    clearInterval(intervalRef.current); // Clear the interval
    setCountdown(0);
    setCountdownActive(false);
  };

  useEffect(()=>{
    if(countdownActive && countdown>0){
      intervalRef.current = setInterval(() => {
        setCountdown(prevCountdown => prevCountdown - 1);
        if(countdown==0){
          clearInterval(intervalRef.current);
          setCountdownActive(false);
        }
      }, 1000);
    }
    return () => clearInterval(intervalRef.current);
  },[countdownActive,countdown])

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={toggleMachine} style={styles.header}>
        <Text style={styles.title}>{title}</Text>
      </TouchableOpacity>
      {expanded && (
        <View style={styles.content}>
        {!countdownActive ?(
        <View>
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
      ):(<View>
        {countdown === 0 ? (
          <View>
            <Text style={styles.countdownText}>
            {0}:{0}{0}
            </Text>
          <TouchableOpacity onPress={handleUndo} style={styles.completeButton}>
            <Text style={styles.completeButtonText}>Complete</Text>
          </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text style={styles.countdownText}>
              {Math.floor(countdown / 60)}:{countdown % 60 < 10 ? '0' : ''}
              {countdown % 60}
            </Text>
            <TouchableOpacity onPress={handleUndo} style={styles.undoButton}>
              <Text style={styles.undoButtonText}>Undo</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    )}
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
  countdownText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  undoButton: {
    marginTop: 10,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  undoButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  completeButton: {
    marginTop: 10,
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  completeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Machine;