import { Link, Stack, useLocalSearchParams, useSegments } from 'expo-router';
import { StyleSheet, Text, View, ScrollView } from 'react-native';

export default function NotFoundScreen() {
  const segments = useSegments();
  const params = useLocalSearchParams();
  
  // Формируем путь, по которому пытались перейти
  const attemptedPath = `/${segments.join('/')}`;
  const hasParams = Object.keys(params).length > 0;
  const paramsString = hasParams 
    ? '?' + Object.entries(params).map(([k, v]) => `${k}=${encodeURIComponent(String(v))}`).join('&')
    : '';
  const fullAttemptedPath = attemptedPath + paramsString;

  return (
    <>
      <Stack.Screen options={{ title: 'Экран не найден' }} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Экран не существует</Text>
        <Text style={styles.message}>
          Попытка перейти на экран, который не существует в приложении.
        </Text>
        
        <View style={styles.pathContainer}>
          <Text style={styles.pathLabel}>Попытка перехода по пути:</Text>
          <Text style={styles.pathValue} selectable>
            {fullAttemptedPath || '(путь не определен)'}
          </Text>
        </View>

        {hasParams && (
          <View style={styles.paramsContainer}>
            <Text style={styles.paramsLabel}>Параметры:</Text>
            <Text style={styles.paramsValue} selectable>
              {JSON.stringify(params, null, 2)}
            </Text>
          </View>
        )}

        <Link href="/(protected-tabs)" style={styles.link}>
          <Text style={styles.linkText}>Перейти на главный экран</Text>
        </Link>
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    marginBottom: 24,
    textAlign: 'center',
    color: '#666',
  },
  pathContainer: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  pathLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  pathValue: {
    fontSize: 14,
    fontFamily: 'monospace',
    color: '#d32f2f',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  paramsContainer: {
    width: '100%',
    backgroundColor: '#f5f5f5',
    padding: 16,
    borderRadius: 8,
    marginBottom: 24,
  },
  paramsLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
    color: '#333',
  },
  paramsValue: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#666',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
    paddingHorizontal: 24,
    backgroundColor: '#007AFF',
    borderRadius: 8,
  },
  linkText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
