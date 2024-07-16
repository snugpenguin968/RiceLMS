import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet,TextInput } from 'react-native';
import {useAuth} from './AuthContext'
import axios from 'axios'
import * as SecureStore from 'expo-secure-store';
import CountdownTimer from './CountdownTimer';
import {computeRemainingTime, Machine as MachineType } from './MachineServices';
import { sendNotificationToUser } from './NotificationService';

interface CustomMachineProps {
  title: string;
  machineData: MachineType;
}

const Machine: React.FC<CustomMachineProps> = ({ title, machineData }) => {
  const [expanded, setExpanded] = useState(false);
  const [time, setTime] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [countdownActive, setCountdownActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout>();
  const {username}=useAuth();

  useEffect(() => {
    if (machineData && machineData.EndTime) {
      const remainingTime = computeRemainingTime(machineData.EndTime);
      setCountdown(Math.max(remainingTime, 0));  // Ensure countdown is never negative
      setCountdownActive(true);
    }
  }, [machineData]);


  const handleSubmit = async () => {
    const isValidInteger = /^\d+$/.test(time);
    if (!isValidInteger){
      alert("Please enter a valid minute time")
    }
    else{

       // Record the current time as the start time
      const token = await SecureStore.getItemAsync('refreshToken');
      if (!token) {
        alert('Authentication token is missing');
        return;
      }
      const startTime = new Date();
      
      // Calculate the end time by adding the duration to the start time
      const endTime = new Date(startTime.getTime() + parseInt(time,10) * 60000); // duration is in minutes, convert to milliseconds

      // Format the startTime and endTime to RFC3339 format
      const formattedStartTime = startTime.toISOString();  // This is the RFC3339 format
      const formattedEndTime = endTime.toISOString();  // This is the RFC3339 format

        // Prepare the payload
      const payload = {
        machineID:title,
        userID:username,
        startTime: formattedStartTime,
        endTime: formattedEndTime
      };

      try {
        // Send the POST request to /startMachine
        const response = await axios.post('https://mongrel-allowing-neatly.ngrok-free.app/startMachine', payload, {
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `${token}`,
          },
        });
      } catch (error) {
        console.error('Failed to start machine:', error);
        alert('Failed to start machine');
      }
      const enteredTime = parseInt(time, 10); // Convert input to an integer
      setCountdown(enteredTime * 60); // Convert minutes to seconds
      setCountdownActive(true);
      setTime(''); // Clear input field*/

    }
  };

  const handleComplete = async () => {
    handleUndo()
    const token = await SecureStore.getItemAsync('refreshToken');
    if (!token) {
      alert('Authentication token is missing');
      return;
    }
    
    const payload = {
      machineID: title,
      startTime: machineData.StartTime,
    };

    try {
      await axios.post('https://mongrel-allowing-neatly.ngrok-free.app/deleteMachine', payload, {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `${token}`,
        },
      });
    } catch (error) {
      console.error('Failed to delete machine:', error);
      alert('Failed to delete machine');
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
          {machineData.UserID === username ? (
            <TouchableOpacity onPress={handleComplete} style={styles.completeButton}>
              <Text style={styles.completeButtonText}>Complete</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
            style={styles.moveButton}
            onPress={() => sendNotificationToUser(machineData.UserID)}
          >
            <Text style={styles.moveButtonText}>Move</Text>
          </TouchableOpacity>
          )}
        </View>
      ) : (
        <View>
          <CountdownTimer countdown={countdown}></CountdownTimer>
          {machineData.UserID === username && (
            <TouchableOpacity onPress={handleComplete} style={styles.undoButton}>
              <Text style={styles.undoButtonText}>Undo</Text>
            </TouchableOpacity>
          )}
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
  moveButton: {
    marginTop: 10,
    backgroundColor: 'yellow',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  moveButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },
});

export default Machine;