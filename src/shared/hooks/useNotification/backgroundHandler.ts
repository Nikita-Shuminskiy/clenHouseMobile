import messaging from "@react-native-firebase/messaging";
import { AppRegistry } from "react-native";
import { displayNotification } from "./utils";

// Регистрация background message handler для Firebase
// Этот handler вызывается когда приложение в background или killed
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  await displayNotification(remoteMessage);
});

// Регистрация headless task для React Native Firebase
// Это нужно для обработки уведомлений в killed состоянии на Android
// Важно: этот task должен быть зарегистрирован до того, как приложение закроется
AppRegistry.registerHeadlessTask(
  "ReactNativeFirebaseMessagingHeadlessTask",
  () => async (remoteMessage: any) => {
    await displayNotification(remoteMessage);
    return Promise.resolve();
  }
);
