import { ReadOnlyBanner } from '@/components/ui/read-only-banner';
import { useWalkRecording } from '@/hooks/use-walk-recording';
import { useAppAccess } from '@/hooks/use-app-access';
import { Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Animated, Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useLocationPermission } from '@/hooks/location-permission';

interface IdleStateProps {
  showToast: (message: string, type: 'success' | 'error' | 'info') => void;
}

export default function IdleState({ showToast }: IdleStateProps) {
  const { readonly } = useAppAccess();
  const { startRecording } = useWalkRecording();
  const router = useRouter();
  const { canGps } = useLocationPermission();

  const glowAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  // グローアニメーション
  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: false,
        }),
        Animated.timing(glowAnim, {
          toValue: 0,
          duration: 2000,
          useNativeDriver: false,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, []);

  // ボタン scale
  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleStartRecording = async () => {
    if (!canGps) {
      Alert.alert(
        '権限が必要です',
        '散歩ルートを記録するために位置情報の権限を許可してください',
        [{ text: 'OK' }]
      );
      return;
    }

    console.log('記録開始');
    // マイクロインタラクション
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 0.92,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 3,
        useNativeDriver: true,
      }),
    ]).start();
    try {
      await startRecording();
      showToast('記録を開始しました', 'success');
    } catch (error) {
      showToast('位置情報の取得に失敗しました', 'error');
    }
  };


  const glowColor = glowAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['rgba(255,200,120,0.3)', 'rgba(255,200,120,0.6)'],
  });

  return (
    <View style={styles.container}>
      {/* 閲覧専用モードバナー */}
      <ReadOnlyBanner
        visible={readonly}
        onPressUpgrade={() => router.push('/')}
      />
      
      <View style={styles.centerContent}>
        {/* アプリアイコン + グロー効果 */}
        <Animated.View style={[styles.pawGlow, { backgroundColor: glowColor }]} />
        <View style={styles.pawContainer}>
          <Image
            source={require('@/assets/images/icon.png')}
            style={styles.appIcon}
            contentFit="contain"
          />
        </View>

        <Text style={styles.title}>ぱうぱす</Text>
        <Text style={styles.subtitle}>家族みんなで、愛犬の足跡を残そう</Text>

        <Animated.View style={{ transform: [{ scale: scaleAnim }] }}>
          <TouchableOpacity 
            style={[
              styles.startButton,
              readonly && styles.startButtonDisabled
            ]}
            onPress={handleStartRecording}
            activeOpacity={0.8}
            disabled={readonly}
          >
            <View style={styles.buttonContent}>
              <Ionicons name="play-circle-outline" size={32} color="#FFFFFF" />
              <Text style={styles.buttonText}>散歩を開始する</Text>
            </View>
          </TouchableOpacity>
        </Animated.View>

        <View style={styles.hintContainer}>
          <Ionicons name="information-circle-outline" size={20} color="#999999" />
          <Text style={styles.hintText}>位置情報を記録して家族と共有します</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#F8F9FA',
    },
    centerContent: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
    },
    pawContainer: {
      position: 'relative',
      width: 160,
      height: 160,
      marginBottom: 32,
    },
    pawGlow: {
      position: 'absolute',
      width: 200,
      height: 200,
      borderRadius: 100,
      alignSelf: 'center',
      marginTop: -20,
    },
    appIcon: {
      width: 160,
      height: 160,
      borderRadius: 80,
    },
    title: {
      fontSize: 36,
      fontWeight: '700',
      color: '#1A1A1A',
      marginBottom: 8,
      letterSpacing: -0.5,
    },
    subtitle: {
      fontSize: 16,
      color: '#666666',
      marginBottom: 48,
    },
    startButton: {
      backgroundColor: '#50C878',
      borderRadius: 28,
      shadowColor: '#50C878',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.3,
      shadowRadius: 16,
      elevation: 8,
    },
    startButtonDisabled: {
      backgroundColor: '#CCCCCC',
      shadowOpacity: 0.1,
    },
    buttonContent: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingVertical: 20,
      paddingHorizontal: 36,
    },
    buttonText: {
      color: '#FFFFFF',
      fontSize: 18,
      fontWeight: '700',
      letterSpacing: 0.3,
    },
    hintContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 32,
      paddingHorizontal: 24,
      paddingVertical: 12,
      backgroundColor: '#F0F0F0',
      borderRadius: 20,
    },
    hintText: {
      fontSize: 13,
      color: '#999999',
    },
    
});