import { useState, useEffect, useRef, useCallback } from 'react';
import { HireRequest, LiveTrackingData } from '../types';
import {
  isPhysicalJob,
  resolveCustomerLocation,
  fetchRealRoadRoute,
  calculateBearing,
} from '../lib/trackingUtils';

interface UseRealtimeJobTrackingOptions {
  request: HireRequest;
  isWorkerPerspective: boolean;
  isWorkerOnline: boolean;
  onUpdateTracking?: (data: LiveTrackingData) => Promise<void> | void;
}

export function useRealtimeJobTracking({
  request,
  isWorkerPerspective,
  isWorkerOnline,
  onUpdateTracking,
}: UseRealtimeJobTrackingOptions) {
  const isPhysical = isPhysicalJob(request);
  const isJobActive = request.status === 'ON_THE_WAY' || request.status === 'ACCEPTED' || request.status === 'WORK_STARTED';
  const isTrackingAllowed = isPhysical && isJobActive && (request.status !== 'WORK_COMPLETED' && request.status !== 'CANCELLED');

  const customerLocation = resolveCustomerLocation(request.workLocation);

  const [trackingData, setTrackingData] = useState<LiveTrackingData | null>(() => {
    if (request.tracking) return request.tracking;
    return null;
  });

  const [gpsError, setGpsError] = useState<string | null>(null);
  const [isGpsActive, setIsGpsActive] = useState<boolean>(false);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState<boolean>(false);

  const watchIdRef = useRef<number | null>(null);
  const lastCoordsRef = useRef<{ lat: number; lng: number } | null>(null);
  const lastRouteFetchTimeRef = useRef<number>(0);

  // Stop GPS watcher cleanly
  const stopGpsWatcher = useCallback(() => {
    if (watchIdRef.current !== null && 'geolocation' in navigator) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
      setIsGpsActive(false);
    }
  }, []);

  // Update route and dispatch tracking payload
  const handleLocationUpdate = useCallback(
    async (coords: { lat: number; lng: number; heading?: number | null; speed?: number | null; accuracy?: number }) => {
      // Avoid spamming routing API if worker moved less than 10 meters and within 4 seconds
      const now = Date.now();
      const lastCoords = lastCoordsRef.current;
      let shouldRecalculateRoute = false;

      if (!lastCoords) {
        shouldRecalculateRoute = true;
      } else {
        const timeDiff = now - lastRouteFetchTimeRef.current;
        const latDiff = Math.abs(coords.lat - lastCoords.lat);
        const lngDiff = Math.abs(coords.lng - lastCoords.lng);
        // ~10m delta or 15 seconds elapsed
        if (latDiff > 0.0001 || lngDiff > 0.0001 || timeDiff > 15000) {
          shouldRecalculateRoute = true;
        }
      }

      let routeResult = trackingData?.routeGeometry
        ? {
            distanceMeters: trackingData.roadDistanceMeters || 0,
            durationSeconds: (trackingData.etaMinutes || 0) * 60,
            geometry: trackingData.routeGeometry,
            distanceTextBn: trackingData.roadDistanceText || '',
            etaTextBn: trackingData.etaText || '',
          }
        : null;

      if (shouldRecalculateRoute || !routeResult) {
        setIsCalculatingRoute(true);
        try {
          const fetched = await fetchRealRoadRoute(
            { lat: coords.lat, lng: coords.lng },
            customerLocation
          );
          routeResult = fetched;
          lastRouteFetchTimeRef.current = now;
        } catch (err) {
          console.warn('Road route computation warning:', err);
        } finally {
          setIsCalculatingRoute(false);
        }
      }

      // Calculate heading if not provided by device hardware
      let heading = coords.heading;
      if (heading === undefined || heading === null || isNaN(heading)) {
        if (lastCoords) {
          heading = calculateBearing(lastCoords, { lat: coords.lat, lng: coords.lng });
        } else {
          heading = calculateBearing({ lat: coords.lat, lng: coords.lng }, customerLocation);
        }
      }

      lastCoordsRef.current = { lat: coords.lat, lng: coords.lng };

      const newTracking: LiveTrackingData = {
        isActive: true,
        workerLatitude: coords.lat,
        workerLongitude: coords.lng,
        workerHeading: heading,
        workerSpeed: coords.speed,
        workerAccuracy: coords.accuracy,
        customerLatitude: customerLocation.lat,
        customerLongitude: customerLocation.lng,
        roadDistanceMeters: routeResult?.distanceMeters,
        roadDistanceText: routeResult?.distanceTextBn,
        etaMinutes: routeResult ? Math.max(1, Math.round(routeResult.durationSeconds / 60)) : undefined,
        etaText: routeResult?.etaTextBn,
        lastUpdated: new Date().toISOString(),
        isWorkerOnline: isWorkerOnline,
        routeGeometry: routeResult?.geometry,
        statusMessage: request.status === 'ON_THE_WAY' ? 'কর্মী গন্তব্যের দিকে রওনা দিয়েছেন' : 'কাজ চলমান',
      };

      setTrackingData(newTracking);
      if (onUpdateTracking) {
        onUpdateTracking(newTracking);
      }
    },
    [customerLocation, isWorkerOnline, onUpdateTracking, request.status, trackingData]
  );

  // Watch position when worker is active & online
  useEffect(() => {
    // Rule 9: Stop tracking immediately when COMPLETED or CANCELLED
    if (!isTrackingAllowed) {
      stopGpsWatcher();
      return;
    }

    // Rule 11 & 12: Digital jobs have no GPS/Tracking
    if (!isPhysical) {
      stopGpsWatcher();
      return;
    }

    // Rule 10: If worker is offline, do NOT broadcast live location
    if (isWorkerPerspective && !isWorkerOnline) {
      stopGpsWatcher();
      return;
    }

    // Only worker device captures real GPS
    if (isWorkerPerspective && 'geolocation' in navigator) {
      setIsGpsActive(true);
      setGpsError(null);

      // Initial single shot for quick responsiveness
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          handleLocationUpdate({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            heading: pos.coords.heading,
            speed: pos.coords.speed,
            accuracy: pos.coords.accuracy,
          });
        },
        (err) => {
          console.warn('Initial GPS query note:', err.message);
          setGpsError('GPS সিগন্যাল খুঁজতে সমস্যা হচ্ছে। আপনার ডিভাইসের লোকেশন সার্ভিস চালু আছে কি না পরীক্ষা করুন।');
        },
        { enableHighAccuracy: true, timeout: 12000, maximumAge: 10000 }
      );

      // Continuous GPS watcher
      const id = navigator.geolocation.watchPosition(
        (pos) => {
          setGpsError(null);
          handleLocationUpdate({
            lat: pos.coords.latitude,
            lng: pos.coords.longitude,
            heading: pos.coords.heading,
            speed: pos.coords.speed,
            accuracy: pos.coords.accuracy,
          });
        },
        (err) => {
          console.warn('GPS watcher notice:', err.message);
          if (err.code === 1) {
            setGpsError('লোকেশন পারমিশন দেওয়া হয়নি। ব্রাউজার সেটিংসে লোকেশন অ্যাক্সেস অনুমোদন করুন।');
          } else if (err.code === 2) {
            setGpsError('ডিভাইস GPS সিগন্যাল পাওয়া যাচ্ছে না। অনুগ্রহ করে খোলা আকাশের নিচে বা নেটওয়ার্ক চেক করুন।');
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 4000,
        }
      );

      watchIdRef.current = id;
    }

    return () => {
      stopGpsWatcher();
    };
  }, [
    isTrackingAllowed,
    isPhysical,
    isWorkerPerspective,
    isWorkerOnline,
    handleLocationUpdate,
    stopGpsWatcher,
  ]);

  // Keep trackingData in sync with request.tracking when customer is viewing
  useEffect(() => {
    if (!isWorkerPerspective && request.tracking) {
      setTrackingData(request.tracking);
    }
  }, [isWorkerPerspective, request.tracking]);

  return {
    isPhysical,
    isTrackingAllowed,
    customerLocation,
    trackingData,
    gpsError,
    isGpsActive,
    isCalculatingRoute,
    stopGpsWatcher,
  };
}
