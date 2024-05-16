import { View, Text, StyleSheet,ScrollView} from 'react-native';
import Machine from '../../components/objects/Machine';
import { dryerData } from '@/components';
export default function Tab() {
  return (
    <ScrollView style={styles.container}>
      <View style={{paddingBottom:100}}>
      {dryerData.map((dryer,idx)=>(
        <Machine key={idx} title={dryer.title}></Machine>
      ))}
      </View>
    </ScrollView>
  );
}

const styles=StyleSheet.create({
  container:{
    flexGrow: 1,
    paddingTop:20,
  }
})