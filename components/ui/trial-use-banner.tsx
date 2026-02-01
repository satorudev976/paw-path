import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
  visible: boolean;
};

export function TrialUseBanner({ visible }: Props) {
  if (!visible) return null;

  return (
    <View style={styles.trialBanner}>
      <Ionicons name="time-outline" size={20} color="#E65100" />
      <Text style={styles.trialText}>現在は７日間のアプリお試し期間中です。</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  trialBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE0B2',
  },
  trialText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#E65100',
  },
});