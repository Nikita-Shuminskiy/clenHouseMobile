import AsyncStorage from '@react-native-async-storage/async-storage';

export type SavedAuthMethod = 'email' | 'phone';

export interface SavedAuthCredentials {
  method: SavedAuthMethod;
  login: string;
  password: string;
  updatedAt: number;
}

const STORAGE_KEY = 'saved_auth_credentials_v1';

export const getSavedAuthCredentials =
  async (): Promise<SavedAuthCredentials | null> => {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return null;
      }

      const parsed = JSON.parse(raw) as Partial<SavedAuthCredentials>;
      if (
        !parsed ||
        (parsed.method !== 'email' && parsed.method !== 'phone') ||
        typeof parsed.login !== 'string' ||
        typeof parsed.password !== 'string'
      ) {
        return null;
      }

      return {
        method: parsed.method,
        login: parsed.login,
        password: parsed.password,
        updatedAt:
          typeof parsed.updatedAt === 'number' ? parsed.updatedAt : Date.now(),
      };
    } catch {
      return null;
    }
  };

export const saveSavedAuthCredentials = async (
  value: Omit<SavedAuthCredentials, 'updatedAt'> & { updatedAt?: number },
): Promise<void> => {
  const payload: SavedAuthCredentials = {
    method: value.method,
    login: value.login.trim(),
    password: value.password,
    updatedAt: value.updatedAt ?? Date.now(),
  };

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
};
