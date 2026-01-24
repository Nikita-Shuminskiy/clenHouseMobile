import * as Updates from "expo-updates";
import { useEffect, useState, useCallback } from "react";

type UseUpdateReturnType = {
  isUpdateAvailable: boolean;
  isDownloading: boolean;
  onCloseUpdateModal: () => void;
  onApplyUpdate: () => Promise<void>;
};

const useUpdate = (): UseUpdateReturnType => {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);

  const checkUpdate = useCallback(async () => {
    try {
      if (!Updates.isEnabled) {
        return;
      }

      const update = await Updates.checkForUpdateAsync();

      if (update.isAvailable) {
        setIsUpdateAvailable(true);
      }
    } catch (error) {
      console.error("[useUpdate] Error checking for updates:", error);
    }
  }, []);

  const onApplyUpdate = useCallback(async () => {
    try {
      if (!Updates.isEnabled) {
        return;
      }

      setIsDownloading(true);
      const result = await Updates.fetchUpdateAsync();

      if (result.isNew) {
        await Updates.reloadAsync();
      } else {
        setIsDownloading(false);
        setIsUpdateAvailable(false);
      }
    } catch (error) {
      console.error("[useUpdate] Error applying update:", error);
      setIsDownloading(false);
    }
  }, []);

  useEffect(() => {
    checkUpdate();

    const interval = setInterval(() => {
      checkUpdate();
    }, 5 * 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, [checkUpdate]);

  return {
    isUpdateAvailable,
    isDownloading,
    onCloseUpdateModal: () => {
      setIsUpdateAvailable(false);
    },
    onApplyUpdate,
  };
};

export default useUpdate;
