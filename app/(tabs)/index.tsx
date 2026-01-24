import { useWalkRecording } from '@/hooks/use-walk-recording';
import { StyleSheet, View } from 'react-native';
import { IdleState } from '../(home)/idel-state';
import { RecordingState } from '../(home)/recording-state';
import Toast from '@/components/ui/toast';
import { useToast } from '@/hooks/toast';

export default function HomeScreen() {
  const { state } = useWalkRecording();
  const { toast, showToast, hideToast } = useToast();

  return (
    <View style={styles.container}>
      {state === 'idle' ? (
        <IdleState showToast={showToast} />
      ) : (
        <RecordingState showToast={showToast} />
      )}
      
      {/* ← Toastをここに配置 */}
      <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={hideToast}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
});
