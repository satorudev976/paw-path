import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface ErrorViewProps {
  type?: 'network' | 'permission' | 'empty' | 'unknown';
  title?: string;
  message?: string;
  icon?: keyof typeof Ionicons.glyphMap;
  onRetry?: () => void;
  onAction?: () => void;
  actionText?: string;
}

export default function ErrorView({
  type = 'unknown',
  title,
  message,
  icon,
  onRetry,
  onAction,
  actionText = '再試行',
}: ErrorViewProps) {
  // デフォルトのメッセージ
  const defaultMessages = {
    network: {
      icon: 'cloud-offline-outline',
      title: 'インターネット接続エラー',
      message: 'Wi-Fiまたはモバイルデータの接続を確認してください',
    },
    permission: {
      icon: 'lock-closed-outline',
      title: '権限が必要です',
      message: '位置情報へのアクセスを許可してください',
    },
    empty: {
      icon: 'file-tray-outline',
      title: 'データがありません',
      message: 'まだ記録がありません',
    },
    unknown: {
      icon: 'alert-circle-outline',
      title: 'エラーが発生しました',
      message: '問題が発生しました。もう一度お試しください',
    },
  };

  const config = defaultMessages[type];
  const displayIcon = icon || config.icon;
  const displayTitle = title || config.title;
  const displayMessage = message || config.message;

  return (
    <View style={styles.container}>
      <Ionicons name={displayIcon as any} size={64} color="#CCCCCC" />
      <Text style={styles.title}>{displayTitle}</Text>
      <Text style={styles.message}>{displayMessage}</Text>

      {(onRetry || onAction) && (
        <View style={styles.buttonContainer}>
          {onRetry && (
            <TouchableOpacity style={styles.retryButton} onPress={onRetry}>
              <Text style={styles.retryButtonText}>{actionText}</Text>
            </TouchableOpacity>
          )}
          {onAction && (
            <TouchableOpacity style={styles.actionButton} onPress={onAction}>
              <Text style={styles.actionButtonText}>設定を開く</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
    backgroundColor: '#F5F5F5',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333333',
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 24,
  },
  buttonContainer: {
    width: '100%',
    maxWidth: 300,
  },
  retryButton: {
    backgroundColor: '#4A90E2',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  actionButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#4A90E2',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '600',
  },
});