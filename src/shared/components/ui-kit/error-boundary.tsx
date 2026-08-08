import React, { Component, ErrorInfo, ReactNode } from 'react';
import { Alert, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HARVEST_COLORS } from '../../harvest-theme';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', {
      error: error.message,
      stack: error.stack,
      componentStack: errorInfo.componentStack,
    });

    this.setState({
      error,
      errorInfo,
    });
  }

  handleRestart = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined });
  };

  handleReportError = () => {
    const { error, errorInfo } = this.state;
    
    Alert.alert(
      'Сообщить об ошибке',
      `Ошибка: ${error?.message}\n\nКомпонент: ${errorInfo?.componentStack}`,
      [
        { text: 'Отмена', style: 'cancel' },
        {
          text: 'Отправить',
          onPress: () => {
            console.error('User reported error:', { error, errorInfo });
            Alert.alert('Спасибо!', 'Отчет отправлен разработчикам.');
          },
        },
      ]
    );
  };

  render() {
    const IS_DEV = process.env.NODE_ENV === 'development';
    
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <SafeAreaView style={styles.container}>
          <ScrollView contentContainerStyle={styles.content}>
            <Text style={styles.title}>Что-то пошло не так</Text>
            
            {/* Показываем название ошибки всегда */}
            {this.state.error && (
              <View style={styles.errorContainer}>
                <Text style={styles.errorTitle}>Ошибка:</Text>
                <Text style={styles.errorMessage}>{this.state.error.message}</Text>
              </View>
            )}
            
            <Text style={styles.message}>
              Произошла непредвиденная ошибка. Попробуйте перезапустить приложение.
            </Text>
            
            {IS_DEV && this.state.error && (
              <View style={styles.debugContainer}>
                <Text style={styles.debugTitle}>Debug информация:</Text>
                <Text style={styles.debugText}>{this.state.error.stack}</Text>
                {this.state.errorInfo && (
                  <Text style={styles.debugText}>
                    {this.state.errorInfo.componentStack}
                  </Text>
                )}
              </View>
            )}

            <View style={styles.buttonContainer}>
              <TouchableOpacity style={styles.button} onPress={this.handleRestart}>
                <Text style={styles.buttonText}>Перезапустить</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={[styles.button, styles.reportButton]} 
                onPress={this.handleReportError}
              >
                <Text style={[styles.buttonText, styles.reportButtonText]}>
                  Сообщить об ошибке
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: HARVEST_COLORS.canvas,
  },
  content: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: HARVEST_COLORS.ink,
    marginBottom: 16,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: HARVEST_COLORS.dangerSoft,
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: HARVEST_COLORS.danger,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: HARVEST_COLORS.danger,
    marginBottom: 4,
  },
  errorMessage: {
    fontSize: 14,
    color: HARVEST_COLORS.danger,
    fontFamily: 'monospace',
  },
  message: {
    fontSize: 16,
    color: HARVEST_COLORS.stone,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  debugContainer: {
    backgroundColor: HARVEST_COLORS.paper,
    padding: 16,
    borderRadius: 16,
    marginBottom: 32,
    width: '100%',
  },
  debugTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: HARVEST_COLORS.ink,
    marginBottom: 8,
  },
  debugText: {
    fontSize: 12,
    color: HARVEST_COLORS.stone,
    fontFamily: 'monospace',
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  button: {
    backgroundColor: HARVEST_COLORS.flame,
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: HARVEST_COLORS.paper,
    fontSize: 16,
    fontWeight: '600',
  },
  reportButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: HARVEST_COLORS.flame,
  },
  reportButtonText: {
    color: HARVEST_COLORS.flame,
  },
});

// Хук для функциональных компонентов
export function useErrorHandler() {
  const [error, setError] = React.useState<Error | null>(null);

  React.useEffect(() => {
    if (error) {
      console.error('Unhandled error in component:', error);
    }
  }, [error]);

  return setError;
}
