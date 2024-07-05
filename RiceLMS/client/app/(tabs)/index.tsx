import React, { useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import Machine from '../../components/objects/Machine';
import { fetchActiveMachines, Machine as MachineType } from '../../components/objects/MachineServices'; 
import { washerData } from '@/components';
import { useAuth } from '@/components/objects/AuthContext';

const Tab: React.FC = () => {
  const [activeMachines, setActiveMachines] = useState<MachineType[]>([]);
  const {username}=useAuth();

  const fetchMachines = async () => {
    try {
      const activeMachines = await fetchActiveMachines();
      const allMachinesData = washerData.map(machine => {
        const activeMachine = activeMachines.find(m => m.MachineID === machine.title);
        return activeMachine || { MachineID: machine.title, UserID:username , StartTime: '', EndTime: '' }; // Default state for inactive machines
      });
      console.log(activeMachines)
      console.log(username)
      setActiveMachines(allMachinesData)
      
    } catch (error) {
      console.error('Failed to fetch active machines:', error);
    }
  };

  useEffect(() => {
    fetchMachines();
  }, []); 

  return (
    <ScrollView style={styles.container}>
      <View style={{ paddingBottom: 20 }}>
        {activeMachines.map((machine) => (
          <Machine key={machine.MachineID} title={machine.MachineID} machineData={machine} />
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingTop: 20,
  },
});

export default Tab;