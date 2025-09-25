import AsyncStorage from '@react-native-async-storage/async-storage';

export const setToken = async (token: string) => {
    await AsyncStorage.setItem('token', token);
}

export const getToken = async () => {
    return await AsyncStorage.getItem('token');
}   

export const removeToken = async () => {
    await AsyncStorage.removeItem('token');
}

export const setRefreshToken = async (refreshToken: string) => {
    await AsyncStorage.setItem('refreshToken', refreshToken);
}

export const getRefreshToken = async () => {
    return await AsyncStorage.getItem('refreshToken');
}

export const removeRefreshToken = async () => {
    await AsyncStorage.removeItem('refreshToken');
}