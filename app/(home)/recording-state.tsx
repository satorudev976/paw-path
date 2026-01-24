import { useWalkRecording } from '@/hooks/use-walk-recording'
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { formatDistance, formatDuration } from '@/utils/formatters';

export function RecordingState() {
  const { stopRecording, distance, duration, currentSpeed } = useWalkRecording();
  const blink = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(blink, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(blink, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, []);


  const handleStopRecording = async () => {
    console.log('記録終了');
    stopRecording()
  };


  return (
    <View style={styles.container}>
      <ScrollView 
          style={styles.scrollContainer}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* 記録中バッジ */}
          <View style={styles.recordingBadge}>
            <View style={styles.recordingDot} />
            <Text style={styles.recordingText}>記録中</Text>
          </View>

          {/* 統計カード */}
          <View style={styles.statsGrid}>
            <View style={styles.statCardLarge}>
              <View style={styles.statIconContainer}>
                <Ionicons name="time-outline" size={28} color="#4A90E2" />
              </View>
              <Text style={styles.statLabel}>経過時間</Text>
              <Text style={styles.statValueLarge}>{formatDuration(duration)}</Text>
            </View>

            <View style={styles.statRow}>
              <View style={styles.statCardSmall}>
                <Ionicons name="trending-up-outline" size={24} color="#50C878" />
                <Text style={styles.statLabelSmall}>距離</Text>
                <Text style={styles.statValueSmall}>{formatDistance(distance)}</Text>
                <Text style={styles.statUnit}>km</Text>
              </View>

              {/* 平均ペース表示 */}
              <View style={styles.statCardSmall}>
                <Ionicons name="speedometer-outline" size={24} color="#9C27B0" />
                <Text style={styles.statLabelSmall}>平均ペース</Text>
                <Text style={styles.statValueSmall}>{currentSpeed.toFixed(1)}</Text>
                <Text style={styles.statUnit}>km/h</Text>
              </View>
            </View>
          </View>

          {/* 散歩終了ボタン */}
          <TouchableOpacity
            style={styles.stopButton}
            onPress={handleStopRecording}
            activeOpacity={0.8}
          >
            <Ionicons name="stop-circle" size={24} color="#FFFFFF" />
            <Text style={styles.stopButtonText}>散歩終了</Text>
          </TouchableOpacity>
        </ScrollView>
        {/* <Toast
        message={toast.message}
        type={toast.type}
        visible={toast.visible}
        onHide={hideToast}
      /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContainer: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 24,
    paddingBottom: 40, // タブバーとの余白確保
  },
  recordingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FFFFFF',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginBottom: 24,
    shadowColor: '#50C878',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 3,
  },
  recordingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#FF5252',
  },
  recordingText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  statsGrid: {
    width: '100%',
    gap: 16,
  },
  statCardLarge: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E3F2FD',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 14,
    color: '#666666',
    fontWeight: '600',
    marginBottom: 8,
  },
  statValueLarge: {
    fontSize: 36,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  statRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCardSmall: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  statLabelSmall: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '600',
    marginTop: 8,
    marginBottom: 4,
  },
  statValueSmall: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  statUnit: {
    fontSize: 12,
    color: '#999999',
    fontWeight: '500',
    marginTop: 2,
  },
  stopButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF5252',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    marginTop: 24,
    marginBottom: 20,
    shadowColor: '#FF5252',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  stopButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginLeft: 8,
  },
});
