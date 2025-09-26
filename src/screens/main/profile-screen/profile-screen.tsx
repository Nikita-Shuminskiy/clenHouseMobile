import React, { useCallback } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { UserRole } from "@/src/shared/api/types/data-contracts";
import { ArrowBackIcon } from "../../../shared/components/icons";
import { queryClient } from "@/src/shared/api/configs/query-client-config";
import { QueryKey } from "@/src/shared/api/constants/api-keys/query-key";
import { router } from "expo-router";
import { useGetMe } from "@/src/modules/auth/hooks/useGetMe";
import { removeToken, removeRefreshToken } from "@/src/shared/utils/token";
import { useOrders } from "@/src/modules/orders/hooks/useOrders";

// UI Components
import { UserStats, ProfileSettings, VerificationStatus, QuickActions } from "./ui";

const ProfileScreen: React.FC = () => {
  const { data: user } = useGetMe();
  
  // Получаем статистику заказов пользователя
  const { data: ordersData } = useOrders({
    currierId: user?.id,
  });

  // Вычисляем статистику
  const totalOrders = ordersData?.orders?.length || 0;
  const completedOrders = ordersData?.orders?.filter(order => order.status === 'done').length || 0;
  const rating = 4.8; // Можно добавить реальный рейтинг из API

  const handleBack = () => {
    console.log("Назад");
  };

  const handleLogout = async () => {
    Alert.alert(
      'Выход',
      'Вы уверены, что хотите выйти из аккаунта?',
      [
        { text: 'Отмена', style: 'cancel' },
        { 
          text: 'Выйти', 
          style: 'destructive',
          onPress: async () => {
            try {
              await removeToken();
              await removeRefreshToken();
              queryClient.invalidateQueries({ queryKey: [QueryKey.GET_ME] });
              router.replace("/(auth)");
            } catch (error) {
              console.error("Ошибка выхода:", error);
            }
          }
        }
      ]
    );
  };

  // Обработчики для настроек
  const handleEditProfile = useCallback(() => {
    Alert.alert('Редактирование профиля', 'Функция в разработке');
  }, []);

  const handleChangePassword = useCallback(() => {
    Alert.alert('Смена пароля', 'Функция в разработке');
  }, []);

  const handleNotifications = useCallback(() => {
    Alert.alert('Уведомления', 'Функция в разработке');
  }, []);

  const handlePrivacy = useCallback(() => {
    Alert.alert('Конфиденциальность', 'Функция в разработке');
  }, []);

  const handleSupport = useCallback(() => {
    Alert.alert('Поддержка', 'Функция в разработке');
  }, []);

  // Обработчики для верификации
  const handleVerifyPhone = useCallback(() => {
    Alert.alert('Верификация телефона', 'Функция в разработке');
  }, []);

  const handleVerifyEmail = useCallback(() => {
    Alert.alert('Верификация email', 'Функция в разработке');
  }, []);

  // Обработчики для быстрых действий
  const handleViewOrders = useCallback(() => {
    router.push('/(protected-tabs)/orders');
  }, []);

  const handleCreateOrder = useCallback(() => {
    Alert.alert('Создание заказа', 'Функция в разработке');
  }, []);

  const handleViewHistory = useCallback(() => {
    Alert.alert('История', 'Функция в разработке');
  }, []);

  const handleInviteFriends = useCallback(() => {
    Alert.alert('Пригласить друзей', 'Функция в разработке');
  }, []);

  console.log(user, "user?.createdAt");
  
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <ArrowBackIcon style={styles.backIcon} />
          </TouchableOpacity>

          <Text style={styles.title}>Профиль</Text>
        </View>

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
            <Text style={styles.userEmail}>{user?.email}</Text>
            <Text style={styles.userRole}>
              {user?.role === UserRole.ADMIN
                ? "Администратор"
                : user?.role === UserRole.CUSTOMER
                ? "Пользователь"
                : "Курьер"}
            </Text>
          </View>
        </View>

        {/* Статистика пользователя */}
        <UserStats
          totalOrders={totalOrders}
          completedOrders={completedOrders}
          rating={rating}
          joinDate={user?.createdAt?.toString()}
        />

        {/* Статус верификации */}
        <VerificationStatus
          isPhoneVerified={user?.isPhoneVerified}
          isEmailVerified={user?.isEmailVerified}
          phone={user?.phone}
          email={user?.email}
          onVerifyPhone={handleVerifyPhone}
          onVerifyEmail={handleVerifyEmail}
        />

        {/* Быстрые действия */}
        <QuickActions
          onViewOrders={handleViewOrders}
          onCreateOrder={handleCreateOrder}
          onViewHistory={handleViewHistory}
          onInviteFriends={handleInviteFriends}
        />

        {/* Настройки профиля */}
        <ProfileSettings
          onEditProfile={handleEditProfile}
          onChangePassword={handleChangePassword}
          onNotifications={handleNotifications}
          onPrivacy={handlePrivacy}
          onSupport={handleSupport}
        />

        {/* Кнопка выхода */}
        <View style={styles.logoutContainer}>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Выйти</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FAFCFE",
  },
  scrollContent: {
    paddingBottom: 34,
  },
  header: {
    backgroundColor: "#FFFFFF",
    flexDirection: "row",
    alignItems: "center",
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
  backButton: {
    padding: 10,
    marginRight: 16,
  },
  backIcon: {
    width: 24,
    height: 24,
    color: "#1A1A1A",
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
    padding: 24,
    borderRadius: 24,
    alignItems: "center",
    shadowColor: "#1A1A1A",
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 50,
    elevation: 6,
  },
  avatarContainer: {
    marginBottom: 16,
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
    marginBottom: 8,
  },
  userEmail: {
    fontFamily: "Onest",
    fontWeight: "400",
    fontSize: 16,
    lineHeight: 24,
    color: "#5A6E8A",
    marginBottom: 8,
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
    marginTop: 24,
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
