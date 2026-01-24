import { useWalkRecording } from '@/hooks/use-walk-recording';
import { StyleSheet, View } from 'react-native';
import { IdleState } from '../(home)/idel-state';
import { RecordingState } from '../(home)/recording-state';

export default function HomeScreen() {
  const { state } = useWalkRecording();

  return (
    <View style={styles.container}>
      {state === 'idle' ? <IdleState /> :<RecordingState /> }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
});
