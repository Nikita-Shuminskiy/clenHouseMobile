import React, { useCallback, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { UserRole } from "@/src/shared/api/types/data-contracts";
// import { ArrowBackIcon } from "../../../shared/components/icons";
import { queryClient } from "@/src/shared/api/configs/query-client-config";
import { QueryKey } from "@/src/shared/api/constants/api-keys/query-key";
import { router } from "expo-router";
import { useGetMe } from "@/src/modules/auth/hooks/useGetMe";
import { removeToken, removeRefreshToken } from "@/src/shared/utils/token";
import { useOrders } from "@/src/modules/orders/hooks/useOrders";
import LogoutConfirmationModal from "@/src/shared/components/modals/LogoutConfirmationModal";

// UI Components - временно закомментировано
import { UserStats, ProfileSettings, VerificationStatus, QuickActions } from "./ui";

const ProfileScreen: React.FC = () => {
  const { data: user } = useGetMe();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  
  // Получаем статистику заказов пользователя - временно закомментировано
  const { data: ordersData } = useOrders({
    currierId: user?.id,
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
      await removeToken();
      await removeRefreshToken();
      queryClient.invalidateQueries({ queryKey: [QueryKey.GET_ME] });
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
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Профиль</Text>
      </View>

      {/* Основной контент */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Информация о пользователе */}
        <View style={styles.userInfoContainer}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.name?.charAt(0) || "П"}
              </Text>
            </View>
          </View>

          <View style={styles.userDetails}>
            <Text style={styles.userName}>{user?.name}</Text>
            <Text style={styles.userPhone}>{user?.phone}</Text>
            <Text style={styles.userRole}>
              {user?.role === UserRole.ADMIN
                ? "Администратор"
                : user?.role === UserRole.CUSTOMER
                ? "Пользователь"
                : "Курьер"}
            </Text>
          </View>
        </View>

        <ProfileSettings
          onPrivacy={handlePrivacy}
          onSupport={handleSupport}
        />
      </ScrollView>

      {/* Кнопка выхода - прижата к низу */}
      <View style={styles.logoutContainer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Выйти</Text>
        </TouchableOpacity>
      </View>

      {/* Модалка подтверждения выхода */}
      <LogoutConfirmationModal
        visible={logoutModalVisible}
        onClose={handleLogoutCancel}
        onConfirm={handleLogoutConfirm}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFCFE",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  header: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: "#1A1A1A",
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 50,
    elevation: 6,
  },
  title: {
    fontFamily: "Onest",
    fontWeight: "600",
    fontSize: 20,
    lineHeight: 28,
    color: "#1A1A1A",
  },
  userInfoContainer: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 24,
    padding: 16,
    borderRadius: 24,
    alignItems: "center",
    shadowColor: "#1A1A1A",
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 50,
    elevation: 6,
  },
  avatarContainer: {
    marginBottom: 10,
  },
  avatar: {
    width: 80,
    height: 80,
    backgroundColor: "#EAF0F6",
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: "Onest",
    fontWeight: "600",
    fontSize: 32,
    lineHeight: 40,
    color: "#5A6E8A",
  },
  userDetails: {
    alignItems: "center",
  },
  userName: {
    fontFamily: "Onest",
    fontWeight: "600",
    fontSize: 20,
    lineHeight: 28,
    color: "#1A1A1A",
    marginBottom: 4,
  },
  userEmail: {
    fontFamily: "Onest",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 24,
    color: "#5A6E8A",
    marginBottom: 6,
  },
  userPhone: {
    fontFamily: "Onest",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 24,
    color: "#5A6E8A",
    marginBottom: 4,
  },
  userRole: {
    fontFamily: "Onest",
    fontWeight: "500",
    fontSize: 14,
    lineHeight: 20,
    color: "#7D8EAA",
    backgroundColor: "#EFF3F8",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  menuContainer: {
    backgroundColor: "#FFFFFF",
    marginHorizontal: 16,
    marginTop: 24,
    borderRadius: 24,
    shadowColor: "#1A1A1A",
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 50,
    elevation: 6,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F3F3",
  },
  menuItemContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  menuIcon: {
    width: 24,
    height: 24,
    color: "#5A6E8A",
  },
  menuTitle: {
    fontFamily: "Onest",
    fontWeight: "500",
    fontSize: 16,
    lineHeight: 24,
    color: "#1A1A1A",
  },
  arrowIcon: {
    width: 16,
    height: 16,
    color: "#5A6E8A",
    transform: [{ rotate: "180deg" }],
  },
  logoutContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: "#FAFCFE",
  },
  logoutButton: {
    backgroundColor: "#FF3B30",
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
