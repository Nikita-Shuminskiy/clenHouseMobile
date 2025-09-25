import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';



const FavoritesScreen: React.FC = () => {
  const handleBack = () => {
    console.log('Назад');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <View style={styles.backIcon} />
          </TouchableOpacity>
          
          <Text style={styles.title}>Избранное</Text>
        </View>

        <View style={styles.content}>
          <View style={styles.emptyState}>
            <View style={styles.heartIcon} />
            <Text style={styles.emptyTitle}>Нет избранных клубов</Text>
            <Text style={styles.emptyDescription}>
              Добавляйте клубы в избранное, чтобы быстро находить их
            </Text>
          </View>
        </View>
      </ScrollView> */}
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
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#1A1A1A',
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
    color: '#1A1A1A',
  },
  title: {
    fontFamily: 'Onest',
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 28,
    color: '#1A1A1A',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  heartIcon: {
    width: 64,
    height: 64,
    color: '#E1E5EA',
    marginBottom: 24,
  },
  emptyTitle: {
    fontFamily: 'Onest',
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 28,
    color: '#1A1A1A',
    marginBottom: 12,
    textAlign: 'center',
  },
  emptyDescription: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
    color: '#5A6E8A',
    textAlign: 'center',
    paddingHorizontal: 32,
  },
});

export default FavoritesScreen;

