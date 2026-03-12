import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AppState, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import {
  NotificationIcon,
  PrivacyIcon,
  SupportIcon,
} from "@/src/shared/components/icons";
import {
  ensurePushTokenRegistered,
  getPushNotificationStatus,
} from "@/src/shared/hooks/useNotification/utils";

interface ProfileSettingsProps {
  onEditProfile?: () => void;
  onChangePassword?: () => void;
  onNotifications?: () => void;
  onPrivacy?: () => void;
  onSupport?: () => void;
}

const ProfileSettings: React.FC<ProfileSettingsProps> = ({
  onEditProfile,
  onChangePassword,
  onNotifications,
  onPrivacy,
  onSupport,
}) => {
  const [isPushEnabled, setIsPushEnabled] = useState<boolean | null>(null);
  const [isLoadingPushStatus, setIsLoadingPushStatus] = useState(false);

  const syncPushStatus = useCallback(async () => {
    const enabled = await getPushNotificationStatus();
    setIsPushEnabled(enabled);
  }, []);

  useEffect(() => {
    syncPushStatus();
  }, [syncPushStatus]);

  useEffect(() => {
    const appStateSubscription = AppState.addEventListener("change", (nextState) => {
      if (nextState === "active") {
        syncPushStatus();
      }
    });

    return () => {
      appStateSubscription.remove();
    };
  }, [syncPushStatus]);

  const handleNotificationsPress = useCallback(async () => {
    if (onNotifications) {
      onNotifications();
      return;
    }

    if (isLoadingPushStatus || isPushEnabled) {
      return;
    }

    setIsLoadingPushStatus(true);
    try {
      await ensurePushTokenRegistered();
      await syncPushStatus();
    } finally {
      setIsLoadingPushStatus(false);
    }
  }, [isLoadingPushStatus, isPushEnabled, onNotifications, syncPushStatus]);

  const notificationSubtitle = useMemo(() => {
    if (isLoadingPushStatus) {
      return "Запрашиваем разрешение...";
    }
    if (isPushEnabled === null) {
      return "Проверяем статус push-уведомлений";
    }
    return isPushEnabled
      ? "Push-уведомления включены"
      : "Push-уведомления выключены";
  }, [isLoadingPushStatus, isPushEnabled]);

  const settingsItems = [
    // {
    //   icon: '✏️',
    //   title: 'Редактировать профиль',
    //   subtitle: 'Изменить имя, телефон, email',
    //   onPress: onEditProfile,
    // },
    // {
    //   icon: '🔒',
    //   title: 'Изменить пароль',
    //   subtitle: 'Обновить пароль для безопасности',
    //   onPress: onChangePassword,
    // },
    {
      icon: <NotificationIcon width={20} height={20} color="#FF5E00" />,
      title: "Уведомления",
      subtitle: notificationSubtitle,
      onPress: handleNotificationsPress,
    },
    {
      icon: <PrivacyIcon width={20} height={20} color="#FF5E00" />,
      title: "Конфиденциальность",
      subtitle: "Управление данными",
      onPress: onPrivacy,
    },
    {
      icon: <SupportIcon width={20} height={20} color="#FF5E00" />,
      title: "Поддержка",
      subtitle: "Связаться с нами",
      onPress: onSupport,
    },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Настройки</Text>
      <View style={styles.settingsList}>
        {settingsItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.settingItem,
              index === settingsItems.length - 1 && styles.lastItem,
            ]}
            onPress={item.onPress}
            disabled={isLoadingPushStatus && item.title === "Уведомления"}
            activeOpacity={0.7}
          >
            <View style={styles.settingContent}>
              <View style={styles.settingIcon}>{item.icon}</View>
              <View style={styles.settingText}>
                <Text style={styles.settingTitle}>{item.title}</Text>
                <Text style={styles.settingSubtitle}>{item.subtitle}</Text>
              </View>
            </View>
            <Text style={styles.arrow}>›</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginTop: 16,
    borderRadius: 20,
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  title: {
    fontFamily: 'Onest',
    fontWeight: '600',
    fontSize: 18,
    lineHeight: 24,
    color: '#1A1A1A',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  settingsList: {
    paddingHorizontal: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F3F3',
  },
  lastItem: {
    borderBottomWidth: 0,
  },
  settingContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    marginRight: 16,
  },
  settingText: {
    flex: 1,
  },
  settingTitle: {
    fontFamily: 'Onest',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
    color: '#1A1A1A',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: '#5A6E8A',
  },
  arrow: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 20,
    color: '#5A6E8A',
  },
});

export default ProfileSettings;
