import messaging from "@react-native-firebase/messaging";
import { Platform } from "react-native";
import { displayNotification } from "./utils";

/**
 * Единственная регистрация обработчика фоновых сообщений: он вызывается,
 * когда приложение свёрнуто или закрыто.
 *
 * Регистрация была в двух местах — здесь и в `useNotification`, — а рядом
 * вручную заводилась задача `ReactNativeFirebaseMessagingHeadlessTask`,
 * которую библиотека создаёт сама. Из-за этого одно сообщение показывалось
 * дважды, и курьер получал два одинаковых уведомления на заказ.
 */
if (Platform.OS !== "web") {
  messaging().setBackgroundMessageHandler(displayNotification);
}
