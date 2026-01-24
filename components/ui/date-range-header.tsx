import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { formatDate } from '@/utils/date';

interface DateRangeHeaderProps {
  startDate: Date;
  endDate: Date;
  onPrevious: () => void;
  onNext: () => void;
}

export default function DateRangeHeader({
  startDate,
  endDate,
  onPrevious,
  onNext,
}: DateRangeHeaderProps) {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={onPrevious} style={styles.navButton}>
        <Text style={styles.navButtonText}>◀</Text>
      </TouchableOpacity>
      <Text style={styles.headerText}>
        {formatDate(startDate)} - {formatDate(endDate)}
      </Text>
      <TouchableOpacity onPress={onNext} style={styles.navButton}>
        <Text style={styles.navButtonText}>▶</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  navButton: {
    padding: 8,
  },
  navButtonText: {
    fontSize: 24,
    color: '#4A90E2',
  },
  headerText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333333',
  },
});