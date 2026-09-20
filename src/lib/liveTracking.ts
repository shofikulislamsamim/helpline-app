import { HireRequest } from '../types';

export interface HireTrackingLocation {
  latitude: number;
  longitude: number;
  accuracyMeters?: number;
  headingDegrees?: number | null;
  speedMps?: number | null;
  lastUpdated: string;
}

export interface HireTrackingData {
  workerLocation?: HireTrackingLocation;
  trackingStartedAt?: string;
  trackingEndedAt?: string;
}

export type TrackedHireRequest = HireRequest & { tracking?: HireTrackingData };

export function isValidCoordinate(latitude: unknown, longitude: unknown): latitude is number {
  return (
    typeof latitude === 'number' &&
    typeof longitude === 'number' &&
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    latitude >= -90 &&
    latitude <= 90 &&
    longitude >= -180 &&
    longitude <= 180
  );
}

export function createTrackingLocation(position: GeolocationPosition): HireTrackingLocation {
  return {
    latitude: position.coords.latitude,
    longitude: position.coords.longitude,
    accuracyMeters: Number.isFinite(position.coords.accuracy) ? position.coords.accuracy : undefined,
    headingDegrees: Number.isFinite(position.coords.heading ?? NaN) ? position.coords.heading : null,
    speedMps: Number.isFinite(position.coords.speed ?? NaN) ? position.coords.speed : null,
    lastUpdated: new Date().toISOString(),
  };
}

export function buildGoogleMapsNavigationUrl(
  origin: HireTrackingLocation,
  destination: { latitude: number; longitude: number }
): string {
  const originText = encodeURIComponent(origin.latitude + ',' + origin.longitude);
  const destinationText = encodeURIComponent(destination.latitude + ',' + destination.longitude);
  return `https://www.google.com/maps/dir/?api=1&origin=${originText}&destination=${destinationText}&travelmode=driving`;
}
