import { View, Text, StyleSheet,ScrollView} from 'react-native';
import Machine from '../../components/objects/Machine';
import { washerData } from '@/components';
export default function Tab() {
  return (
    <ScrollView style={styles.container}>
      <View style={{paddingBottom:20}}>
      {washerData.map((washer,idx)=>(
        <Machine key={idx} title={washer.title}></Machine>
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