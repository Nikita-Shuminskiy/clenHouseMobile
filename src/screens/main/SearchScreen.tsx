import React, { useState } from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Input from '@components/ui-kit/input';
import { ArrowBackIcon, SearchIcon } from '../../shared/components/icons';

const SearchScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = () => {
    console.log('Поиск:', searchQuery);
  };

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
            <ArrowBackIcon style={styles.backIcon} />
          </TouchableOpacity>
          
          <Text style={styles.title}>Поиск</Text>
        </View>

        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Input
              type="base"
              state="default"
              placeholder="Поиск клубов, причалов..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              containerStyle={styles.searchInput}
            />
            <TouchableOpacity onPress={handleSearch} style={styles.searchButton}>
              <SearchIcon style={styles.searchIcon} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.resultsContainer}>
          <Text style={styles.sectionTitle}>Результаты поиска</Text>
          <Text style={styles.noResultsText}>
            Введите запрос для поиска клубов и причалов
          </Text>
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
  searchContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 16,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  searchInput: {
    flex: 1,
    marginBottom: 0,
  },
  searchButton: {
    backgroundColor: '#5A6E8A',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchIcon: {
    width: 20,
    height: 20,
    color: '#FFFFFF',
  },
  resultsContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionTitle: {
    fontFamily: 'Onest',
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 28,
    color: '#1A1A1A',
    marginBottom: 16,
  },
  noResultsText: {
    fontFamily: 'Onest',
    fontWeight: '400',
    fontSize: 16,
    lineHeight: 24,
    color: '#5A6E8A',
    textAlign: 'center',
    paddingTop: 40,
  },
});

export default SearchScreen;
