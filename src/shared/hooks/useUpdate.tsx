import * as Updates from "expo-updates";
import { useEffect, useState } from "react";

type UseUpdateReturnType = {
  isUpdate: boolean;
  onCloseUpdateModal: () => void;
};

const useUpdate = (): UseUpdateReturnType => {
  const [isUpdate, setIsUpdate] = useState(false);

  const checkUpdate = async () => {
    try {
      // Проверяем, что Updates доступен (не работает в dev режиме)
      if (!Updates.isEnabled) {
        return;
      }

      // Проверяем наличие обновлений
      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        setIsUpdate(true);

        // Загружаем обновление в фоне
        const result = await Updates.fetchUpdateAsync();

        if (result.isNew) {
          // Перезагружаем приложение с новым обновлением
          await Updates.reloadAsync();
        }
      }
    } catch (error) {
      // Игнорируем ошибки проверки обновлений
    }
  };

  useEffect(() => {
    // Проверяем обновления при монтировании компонента
    checkUpdate();

    // Периодическая проверка обновлений каждые 5 минут
    const interval = setInterval(() => {
      checkUpdate();
    }, 5 * 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return {
    isUpdate,
    onCloseUpdateModal: () => setIsUpdate(false),
  };
};

export default useUpdate;
