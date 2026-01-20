import { useUser } from '@/hooks/use-user';
import { StyleSheet, View } from 'react-native';
import OwnwerSettingsScreen from '../(settings)/owner';
import FamilySettingsScreen from '../(settings)/family';

export default function HomeScreen() {
  const { user } = useUser();

  return (
    <View style={styles.container}>
      {user?.role === 'owner' ? <OwnwerSettingsScreen /> : <FamilySettingsScreen />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
});
