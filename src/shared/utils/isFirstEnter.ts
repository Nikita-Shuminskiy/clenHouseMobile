import AsyncStorage from '@react-native-async-storage/async-storage';

export const setStorageIsFirstEnter = async (isFirstEnter: boolean) => {
    await AsyncStorage.setItem('isFirstEnter', isFirstEnter.toString());
}

export const getStorageIsFirstEnter = async () => {
    const isFirstEnter = await AsyncStorage.getItem('isFirstEnter');

    if (isFirstEnter === null) {
        return true;
    }
    return isFirstEnter;
}   
