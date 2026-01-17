import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

type Props = {
  visible: boolean;
  onPressUpgrade: () => void;
};

export function ReadOnlyBanner({ visible, onPressUpgrade }: Props) {
  if (!visible) return null;

  return (
    <View style={styles.readOnlyBanner}>
      <Ionicons name="eye-outline" size={20} color="#FF9500" />
      <Text style={styles.readOnlyText}>閲覧専用モード</Text>
      <TouchableOpacity
        onPress={onPressUpgrade}
        style={styles.renewButton}
      >
        <Text style={styles.renewButtonText}>再開する</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  readOnlyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#FFE0B2',
  },
  readOnlyText: {
    flex: 1,
    fontSize: 14,
    fontWeight: '600',
    color: '#FF9500',
  },
  renewButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  renewButtonText: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
