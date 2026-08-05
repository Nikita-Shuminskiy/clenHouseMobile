import React, { useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { UserRole } from "@/src/shared/api/types/data-contracts";
// import { ArrowBackIcon } from "../../../shared/components/icons";
import { queryClient } from "@/src/shared/api/configs/query-client-config";
import { router } from "expo-router";
import { useGetMe } from "@/src/modules/auth/hooks/useGetMe";
import { removeToken, removeRefreshToken } from "@/src/shared/utils/token";
import { setManualLogoutInProgress } from "@/src/shared/api/configs/config";
import { useOrderByLocation } from "@/src/modules/orders/hooks/useOrders";
import LogoutConfirmationModal from "@/src/shared/components/modals/LogoutConfirmationModal";
import { useTheme } from "@/src/shared/use-theme";

// UI Components - временно закомментировано
import { UserStats, ProfileSettings, VerificationStatus, QuickActions } from "./ui";

const ProfileScreen: React.FC = () => {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const { data: user } = useGetMe();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  
  // Получаем статистику заказов пользователя - временно закомментировано
  const { data: ordersData } = useOrderByLocation({
    currierId: user?.id,
  }, {
    enabled: !!user?.id,
  });

  // Вычисляем статистику - временно закомментировано
  const totalOrders = ordersData?.orders?.length || 0;
  const completedOrders = ordersData?.orders?.filter(order => order.status === 'done').length || 0;
  const rating = 4.8; // Можно добавить реальный рейтинг из API

  const handleBack = () => {
    router.back();
  };

  const handleLogout = () => {
    setLogoutModalVisible(true);
  };

  const handleLogoutConfirm = async () => {
    setLogoutModalVisible(false);
    try {
      setManualLogoutInProgress(true);
      await queryClient.cancelQueries();
      queryClient.clear();
      await removeToken();
      await removeRefreshToken();
      router.replace("/(auth)");
    } catch (error) {
      console.error("Ошибка выхода:", error);
    }
  };

  const handleLogoutCancel = () => {
    setLogoutModalVisible(false);
  };

  // const handleEditProfile = useCallback(() => {
  //   Alert.alert('Редактирование профиля', 'Функция в разработке');
  // }, []);

  // const handleChangePassword = useCallback(() => {
  //   Alert.alert('Смена пароля', 'Функция в разработке');
  // }, []);

  // const handleNotifications = useCallback(() => {
  //   Alert.alert('Уведомления', 'Функция в разработке');
  // }, []);

  const handlePrivacy = useCallback(() => {
    router.push('/(protected)/privacy');
  }, []);

  const handleSupport = useCallback(() => {
    router.push('/(protected)/support');
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: colors.white, paddingBottom: insets.bottom }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.white, paddingTop: insets.top + 16 }]}>
        <Text style={[styles.title, { color: colors.textPrimary }]}>Профиль</Text>
      </View>

      {/* Основной контент */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Информация о пользователе */}
        <View style={[styles.userInfoContainer, { backgroundColor: colors.white }]}>
          <View style={styles.avatarContainer}>
            <View style={[styles.avatar, { backgroundColor: colors.surfaceInfo }]}>
              <Text style={[styles.avatarText, { color: colors.textSecondary }]}>
                {user?.name?.charAt(0) || "П"}
              </Text>
            </View>
          </View>

          <View style={styles.userDetails}>
            <Text style={[styles.userName, { color: colors.textPrimary }]}>{user?.name}</Text>
            <Text style={[styles.userPhone, { color: colors.textSecondary }]}>{user?.phone}</Text>
            <Text style={[styles.userRole, { color: colors.textPlaceholder, backgroundColor: colors.surfaceInfo }]}>
              {user?.roles?.includes(UserRole.ADMIN)
                ? "Администратор"
                : user?.roles?.includes(UserRole.CUSTOMER)
                ? "Пользователь"
                : user?.roles?.includes(UserRole.CURRIER)
                ? "Курьер"
                : "Нет ролей"}
            </Text>
          </View>
        </View>

        <ProfileSettings
          onPrivacy={handlePrivacy}
          onSupport={handleSupport}
        />
      </ScrollView>

      {/* Кнопка выхода - прижата к низу */}
      <View style={[styles.logoutContainer, { backgroundColor: colors.white }]}>
        <TouchableOpacity style={[styles.logoutButton, { backgroundColor: colors.destructive }]} onPress={handleLogout}>
          <Text style={styles.logoutText}>Выйти</Text>
        </TouchableOpacity>
      </View>

      {/* Модалка подтверждения выхода */}
      <LogoutConfirmationModal
        visible={logoutModalVisible}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#1A1A1A",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 50,
    elevation: 6,
  },
  title: {
    fontFamily: "Onest",
    fontWeight: "600",
    fontSize: 20,
    lineHeight: 28,
  },
  userInfoContainer: {
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    borderRadius: 24,
    alignItems: "center",
    shadowColor: "#1A1A1A",
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.12,
    shadowRadius: 50,
    elevation: 6,
  },
  avatarContainer: {
    marginBottom: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: "Onest",
    fontWeight: "600",
    fontSize: 32,
    lineHeight: 40,
  },
  userDetails: {
    alignItems: "center",
  },
  userName: {
    fontFamily: "Onest",
    fontWeight: "600",
    fontSize: 20,
    lineHeight: 28,
    marginBottom: 4,
  },
  userPhone: {
    fontFamily: "Onest",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 4,
  },
  userRole: {
    fontFamily: "Onest",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  logoutContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  logoutButton: {
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  logoutText: {
    fontFamily: "Onest",
    fontWeight: "600",
    fontSize: 16,
    lineHeight: 24,
    color: "#FFFFFF",
  },
});

export default ProfileScreen;
