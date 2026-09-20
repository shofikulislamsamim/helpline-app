import { useEffect, useRef } from 'react';
import { collection, doc, onSnapshot, query, updateDoc, where } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useAuth } from '../../context/AuthContext';
import { useHire } from '../../context/HireContext';
import { HireRequest } from '../../types';
import { createTrackingLocation, TrackedHireRequest } from '../../lib/liveTracking';

const UPDATE_MIN_INTERVAL_MS = 5000;
const UPDATE_MIN_DISTANCE_METERS = 15;

function distanceMeters(a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }) {
  const r = 6371000;
  const toRad = (v: number) => (v * Math.PI) / 180;
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.latitude)) * Math.cos(toRad(b.latitude)) * Math.sin(dLon / 2) ** 2;
  return 2 * r * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

export function LiveTrackingManager() {
  const { currentUser, userProfile } = useAuth();
  const { hireRequests } = useHire();
  const watchIds = useRef(new Map<string, number>());
  const lastSent = useRef(new Map<string, { at: number; latitude: number; longitude: number }>());

  useEffect(() => {
    if (!currentUser?.uid) return;

    const q = query(collection(db, 'serviceRequests'), where('workerId', '==', currentUser.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      snapshot.docChanges().forEach((change) => {
        const request = { ...(change.doc.data() as HireRequest), id: change.doc.id } as TrackedHireRequest;
        const existingWatch = watchIds.current.get(request.id);

        if (request.status === 'ON_THE_WAY' && existingWatch === undefined && navigator.geolocation) {
          const startedAt = request.tracking?.trackingStartedAt || new Date().toISOString();
          if (!request.tracking?.trackingStartedAt) {
            void updateDoc(doc(db, 'serviceRequests', request.id), {
              tracking: { ...(request.tracking || {}), trackingStartedAt: startedAt },
            }).catch(() => undefined);
          }

          const watchId = navigator.geolocation.watchPosition(
            (position) => {
              const location = createTrackingLocation(position);
              const nowMs = Date.now();
              const previous = lastSent.current.get(request.id);
              if (
                previous &&
                nowMs - previous.at < UPDATE_MIN_INTERVAL_MS &&
                distanceMeters(previous, location) < UPDATE_MIN_DISTANCE_METERS
              ) {
                return;
              }

              lastSent.current.set(request.id, {
                at: nowMs,
                latitude: location.latitude,
                longitude: location.longitude,
              });

              const tracking = {
                ...(request.tracking || {}),
                trackingStartedAt: startedAt,
                workerLocation: location,
              };

              void updateDoc(doc(db, 'serviceRequests', request.id), { tracking }).catch((error) => {
                console.warn('Live tracking update failed:', error);
              });

              if (userProfile?.userId === currentUser.uid) {
                // Keep the worker's own profile location fresh for proximity search.
                // Exact GPS remains protected by the private userProfiles collection.
                void updateDoc(doc(db, 'userProfiles', currentUser.uid), {
                  currentLocation: {
                    latitude: location.latitude,
                    longitude: location.longitude,
                    accuracyMeters: location.accuracyMeters,
                    lastUpdated: location.lastUpdated,
                    sharePermissionGranted: true,
                  },
                }).catch(() => undefined);
              }
            },
            (error) => {
              console.warn('Worker live location permission/error:', error);
            },
            { enableHighAccuracy: true, maximumAge: 5000, timeout: 15000 }
          );

          watchIds.current.set(request.id, watchId);
        }

        if (request.status !== 'ON_THE_WAY' && existingWatch !== undefined) {
          navigator.geolocation?.clearWatch(existingWatch);
          watchIds.current.delete(request.id);
          lastSent.current.delete(request.id);

          void updateDoc(doc(db, 'serviceRequests', request.id), {
            'tracking.trackingEndedAt': new Date().toISOString(),
          }).catch(() => undefined);
        }
      });
    }, (error) => {
      console.warn('Live tracking request listener failed:', error);
    });

    return () => {
      unsubscribe();
      watchIds.current.forEach((watchId) => navigator.geolocation?.clearWatch(watchId));
      watchIds.current.clear();
      lastSent.current.clear();
    };
  }, [currentUser?.uid, userProfile?.userId]);

  // Keep this component mounted even if HireContext has not refreshed yet.
  void hireRequests;
  return null;
}
