import { router } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';


import { useAuthStore } from '@/src/modules/auth/stores/auth.store';


const HomeScreen: React.FC = () => {
  const { user } = useAuthStore();

  const handleSearch = () => {
    router.push('/search' as any);
  };

  const handleFavorites = () => {
    router.push('/favorites' as any);
  };

  const handleProfile = () => {
    router.push('/profile' as any);
  };

  const handleNotifications = () => {
    console.log('Уведомления');
  };

  const handleCityChange = () => {
    console.log('Смена города');
  };

  const handleClubPress = (clubId: string) => {
    console.log('Клуб:', clubId);
  };

  const handleBooking = () => {
    console.log('Бронирование');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.userInfo}>
              <Text style={styles.greeting}>Привет, {user?.name || 'Гость'}!</Text>
              <Text style={styles.subtitle}>Найди свой идеальный причал</Text>
            </View>
            
            <View style={styles.headerActions}>
              <TouchableOpacity onPress={handleNotifications} style={styles.iconButton}>
                <View style={styles.headerIcon} />
              </TouchableOpacity>
              
              <TouchableOpacity onPress={handleProfile} style={styles.iconButton}>
                <View style={styles.headerIcon} />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity onPress={handleSearch} style={styles.searchContainer}>
            <View style={styles.searchInput}>
              <View style={styles.searchIcon} />
              <Text style={styles.searchPlaceholder}>Поиск клубов, причалов...</Text>
            </View>
          </TouchableOpacity>

          <View style={styles.cityContainer}>
            <TouchableOpacity onPress={handleCityChange} style={styles.cityButton}>
              <View style={styles.cityIcon} />
              <Text style={styles.cityText}>Москва</Text>
              <View style={styles.cityArrow} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.mainContent}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Популярные клубы</Text>
              <TouchableOpacity onPress={handleSearch}>
                <Text style={styles.seeAllText}>Все</Text>
              </TouchableOpacity>
            </View>

            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.clubsContainer}
            >
              <TouchableOpacity 
                style={styles.clubCard}
                onPress={() => handleClubPress('club1')}
              >
                <View style={styles.clubImage}>
                  <Text style={styles.clubImageText}>Яхт-клуб &quot;Морской&quot;</Text>
                </View>
                <View style={styles.clubInfo}>
                  <Text style={styles.clubName}>Яхт-клуб &quot;Морской&quot;</Text>
                  <Text style={styles.clubLocation}>Москва, Химки</Text>
                  <View style={styles.clubRating}>
                    <Text style={styles.ratingText}>4.8</Text>
                    <Text style={styles.ratingLabel}>рейтинг</Text>
                  </View>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.clubCard}
                onPress={() => handleClubPress('club2')}
              >
                <View style={styles.clubImage}>
                  <Text style={styles.clubImageText}>Порт &quot;Северный&quot;</Text>
                </View>
                <View style={styles.clubInfo}>
                  <Text style={styles.clubName}>Порт &quot;Северный&quot;</Text>
                  <Text style={styles.clubLocation}>Москва, Строгино</Text>
                  <View style={styles.clubRating}>
                    <Text style={styles.ratingText}>4.6</Text>
                    <Text style={styles.ratingLabel}>рейтинг</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </ScrollView>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Быстрые действия</Text>
            
            <View style={styles.quickActions}>
              <TouchableOpacity style={styles.quickAction} onPress={handleBooking}>
                <View style={styles.quickActionIcon}>
                  <View style={styles.actionIcon} />
                </View>
                <Text style={styles.quickActionText}>Бронирование</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickAction} onPress={handleFavorites}>
                <View style={styles.quickActionIcon}>
                  <View style={styles.actionIcon} />
                </View>
                <Text style={styles.quickActionText}>Избранное</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.quickAction} onPress={handleSearch}>
                <View style={styles.quickActionIcon}>
                  <View style={styles.actionIcon} />
                </View>
                <Text style={styles.quickActionText}>Поиск</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
      */}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FAFCFE',
  },
  scrollContent: {
    paddingBottom: 34,
  },
  header: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 6, height: 6 },
    shadowOpacity: 0.05,
    shadowRadius: 50,
    elevation: 6,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 24,
  },
  userInfo: {
    flex: 1,
  },
  greeting: {
    fontFamily: 'Onest',
    fontWeight: '600',
    fontSize: 24,
    lineHeight: 32,
    color: '#1A1A1A',
    marginBottom: 4,
  },
  subtitle: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
    color: '#5A6E8A',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  iconButton: {
    padding: 8,
  },
  headerIcon: {
    width: 24,
    height: 24,
    color: '#1A1A1A',
  },
  searchContainer: {
    marginBottom: 20,
  },
  searchInput: {
    backgroundColor: '#F3F3F3',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchIcon: {
    width: 20,
    height: 20,
    color: '#5A6E8A',
  },
  searchPlaceholder: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
    color: '#7D8EAA',
    flex: 1,
  },
  cityContainer: {
    alignItems: 'flex-start',
  },
  cityButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#EFF3F8',
    borderRadius: 12,
  },
  cityIcon: {
    width: 16,
    height: 16,
    color: '#5A6E8A',
  },
  cityText: {
    fontFamily: 'Onest',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
    color: '#5A6E8A',
  },
  cityArrow: {
    width: 16,
    height: 16,
    color: '#5A6E8A',
    transform: [{ rotate: '90deg' }],
  },
  mainContent: {
    paddingHorizontal: 16,
    paddingTop: 24,
    gap: 32,
  },
  section: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitle: {
    fontFamily: 'Onest',
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 28,
    color: '#1A1A1A',
  },
  seeAllText: {
    fontFamily: 'Onest',
    fontWeight: '500',
    fontSize: 16,
    lineHeight: 24,
    color: '#5A6E8A',
  },
  clubsContainer: {
    gap: 16,
    paddingRight: 16,
  },
  clubCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    width: 280,
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 30,
    elevation: 4,
  },
  clubImage: {
    height: 160,
    backgroundColor: '#EAF0F6',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  clubImageText: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: '#5A6E8A',
    textAlign: 'center',
    paddingHorizontal: 16,
  },
  clubInfo: {
    padding: 16,
    gap: 8,
  },
  clubName: {
    fontFamily: 'Onest',
    fontWeight: '600',
    fontSize: 16,
    lineHeight: 24,
    color: '#1A1A1A',
  },
  clubLocation: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 14,
    lineHeight: 20,
    color: '#5A6E8A',
  },
  clubRating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  ratingText: {
    fontFamily: 'Onest',
    fontWeight: '600',
    fontSize: 14,
    lineHeight: 20,
    color: '#1A1A1A',
  },
  ratingLabel: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 12,
    lineHeight: 16,
    color: '#7D8EAA',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  quickAction: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#1A1A1A',
    shadowOffset: { width: 4, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 30,
    elevation: 4,
  },
  quickActionIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#EFF3F8',
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionIcon: {
    width: 24,
    height: 24,
    color: '#5A6E8A',
  },
  quickActionText: {
    fontFamily: 'Onest',
    fontWeight: '500',
    fontSize: 14,
    lineHeight: 20,
    color: '#1A1A1A',
    textAlign: 'center',
  },
});

export default HomeScreen;
