import { useWalkRecording } from '@/contexts/walk-recording.context';
import { StyleSheet, View } from 'react-native';
import { IdleState } from '../(home)/idel-state';
import { RecordingState } from '../(home)/recording-state';

export default function HomeScreen() {
  const { isRecording } = useWalkRecording();

  return (
    <View style={styles.container}>
      {isRecording ? <RecordingState /> : <IdleState />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
});
