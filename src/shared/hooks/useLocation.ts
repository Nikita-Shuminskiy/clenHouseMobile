import { useState, useEffect, useCallback, useRef } from 'react';
import * as Location from 'expo-location';
import {
  requestLocationPermission,
  checkLocationPermission,
} from '../utils/location-permission';

export interface UserLocation {
  latitude: number;
  longitude: number;
  timestamp: number;
}

interface UseLocationReturn {
  location: UserLocation | null;
  isLoading: boolean;
  error: string | null;
  getCurrentLocation: () => Promise<void>;
  hasPermission: boolean;
}

export function useLocation(
  requestPermissionOnMount: boolean = false,
  watchLocation: boolean = true,
  updateInterval: number = 30000
): UseLocationReturn {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasPermission, setHasPermission] = useState(false);
  const watchSubscriptionRef = useRef<Location.LocationSubscription | null>(null);
  const initialLocationFetchedRef = useRef(false);
  const lastUpdateRef = useRef<number>(0);

  const getCurrentLocation = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      let hasPerm = await checkLocationPermission();
      
      if (!hasPerm) {
        hasPerm = await requestLocationPermission();
        setHasPermission(hasPerm);
      }

      if (!hasPerm) {
        setError('Разрешение на геолокацию не предоставлено');
        return;
      }

      const currentLocation = await Location.getCurrentPositionAsync({});

      const userLocation: UserLocation = {
        latitude: currentLocation.coords.latitude,
        longitude: currentLocation.coords.longitude,
        timestamp: currentLocation.timestamp,
      };

      setLocation(userLocation);
    } catch (err: any) {
      setError(err?.message || 'Не удалось получить локацию пользователя');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    checkLocationPermission().then(setHasPermission);
  }, []);

  useEffect(() => {
    if (requestPermissionOnMount) {
      requestLocationPermission().then(granted => {
        setHasPermission(granted);
        if (granted) getCurrentLocation();
      });
    }
  }, [requestPermissionOnMount, getCurrentLocation]);

  useEffect(() => {
    if (!watchLocation || !hasPermission) {
      watchSubscriptionRef.current?.remove();
      watchSubscriptionRef.current = null;
      if (!hasPermission) initialLocationFetchedRef.current = false;
      return;
    }

    let isMounted = true;

    const startWatching = async () => {
      if (!isMounted) return;

      try {
        if (!initialLocationFetchedRef.current) {
          await getCurrentLocation();
          initialLocationFetchedRef.current = true;
        }

        if (!isMounted) return;

        watchSubscriptionRef.current = await Location.watchPositionAsync(
          {
            accuracy: Location.Accuracy.Balanced,
            timeInterval: updateInterval,
            distanceInterval: 50,
          },
          (newLocation) => {
            if (!isMounted) return;
            
            const now = Date.now();
            if (now - lastUpdateRef.current > 1000) {
              lastUpdateRef.current = now;
              setLocation({
                latitude: newLocation.coords.latitude,
                longitude: newLocation.coords.longitude,
                timestamp: newLocation.timestamp,
              });
            }
          }
        );
      } catch (err) {
        console.error('Ошибка при отслеживании локации:', err);
      }
    };

    startWatching();

    return () => {
      isMounted = false;
      watchSubscriptionRef.current?.remove();
      watchSubscriptionRef.current = null;
    };
  }, [watchLocation, hasPermission, updateInterval, getCurrentLocation]);

  return { location, isLoading, error, getCurrentLocation, hasPermission };
}