import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { AnchorGreyIcon, ShipGradientIcon } from '@/src/shared/components/icons';
import Button from '@/src/shared/components/ui-kit/button';
import { ThemeColors, ThemeFonts, ThemeWeights, useTheme } from '@/src/shared/use-theme';
import { useAuthStore } from '@/src/modules/auth/stores/auth.store';
import { RegistrationData } from '@/src/shared/types/auth';
import { TopBar } from '@/src/shared/components/molecules/TopBar';

const RegistrationRoleScreen: React.FC = () => {
  const { colors, sizes, fonts, weights } = useTheme();
  const styles = createStyles({ colors, sizes, fonts, weights });
  const [selectedRole, setSelectedRole] = useState<'owner' | 'club_admin'>('owner');
  const { setRegistrationData, registrationData } = useAuthStore();

  const handleContinue = () => {
    if (selectedRole) {
      setRegistrationData({ ...registrationData, role: selectedRole } as RegistrationData);
      router.push('/(auth)/registration-profile' as any);
    }
  };

  const roles = [
    {
      id: 'owner' as const,
      title: 'Судовладелец',
      description: 'Хочу бронировать места в клубах',
      icon: ShipGradientIcon,
      active: selectedRole === 'owner',
    },
    {
      id: 'club_admin' as const,
      title: 'Свой яхт-клуб',
      description: 'Хочу продавать услуги',
      icon: AnchorGreyIcon,
      active: selectedRole === 'club_admin',
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      {/* Top bar */}
      <TopBar title="Регистрация" badge="1" maxBadge="3" />

      {/* Основной контент */}
      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.formContainer}>
          {/* Заголовок и описание */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>
              Вы судовладелец{'\n'}или у вас свой яхт-клуб?
            </Text>
            <Text style={styles.subtitle}>
              Расскажите, как вы планируете{'\n'}пользоваться сервисом
            </Text>
          </View>

          {/* Выбор роли */}
          <View style={styles.roleSelectionContainer}>
            {roles.map((role) => (
              <TouchableOpacity
                key={role.id}
                style={[
                  styles.roleOption,
                  role.active && styles.roleOptionActive
                ]}
                onPress={() => setSelectedRole(role.id)}
              >
                {/* Иконка роли */}
                <View style={[
                  styles.roleIconContainer,
                  role.active && styles.roleIconContainerActive
                ]}>
                  <role.icon
                    width={24}
                    height={24}

                  />
                </View>

                {/* Текст роли */}
                <View style={styles.roleContent}>
                  <Text style={[
                    styles.roleTitle,
                    role.active && styles.roleTitleActive
                  ]}>
                    {role.title}
                  </Text>
                  <Text style={[
                    styles.roleDescription,
                    role.active && styles.roleDescriptionActive
                  ]}>
                    {role.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Кнопка продолжить */}
        <Button
          type="primary"
          onPress={handleContinue}
          disabled={!selectedRole}
          containerStyle={styles.continueButton}
        >
          Продолжить
        </Button>
      </ScrollView>
    </SafeAreaView>
  );
};

const createStyles = ({
  colors,
  sizes,
  fonts,
  weights
}: {
  colors: ThemeColors;
  sizes: any;
  fonts: ThemeFonts;
  weights: ThemeWeights;
}) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 24,
  },
  formContainer: {
    gap: 24,
  },
  headerContainer: {
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontFamily: fonts.h2,
    fontWeight: weights.h2,
    fontSize: 20,
    lineHeight: 28,
    letterSpacing: -0.5,
    color: colors.black,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: fonts.text2,
    fontWeight: weights.text2,
    fontSize: 16,
    lineHeight: 24,
    letterSpacing: -0.5,
    color: colors.grey900,
    textAlign: 'center',
  },
  roleSelectionContainer: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: 8,
    shadowColor: colors.black,
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 50,
    elevation: 6,
    flexDirection: 'row',
    gap: 4,
  },
  roleOption: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    gap: 8,
    padding: 16,
    borderRadius: 16,
    backgroundColor: 'transparent',
    flex: 1,
  },
  roleOptionActive: {
    backgroundColor: colors.grey100,
  },
  roleIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    alignSelf: 'flex-start',
  },
  roleIconContainerActive: {
    borderRadius: 100,
    backgroundColor: colors.white,
  },
  roleContent: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    gap: 4,
    width: '100%',
  },
  roleTitle: {
    fontFamily: fonts.text3,
    fontWeight: weights.medium,
    fontSize: 14,
    lineHeight: 20,
    letterSpacing: 0,
    color: colors.grey500,
    textAlign: 'left',
  },
  roleTitleActive: {
    color: colors.black,
  },
  roleDescription: {
    fontFamily: fonts.text2,
    fontWeight: weights.text2,
    fontSize: 12,
    lineHeight: 16,
    color: colors.grey500,
    textAlign: 'left',
  },
  roleDescriptionActive: {
    color: colors.grey700,
  },
  continueButton: {
    borderRadius: 16,
    paddingVertical: 16,
  },
});

export default RegistrationRoleScreen;
