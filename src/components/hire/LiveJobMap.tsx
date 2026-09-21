import React, { useEffect, useMemo, useState } from 'react';
import { ExternalLink, MapPin, Navigation, Radio, ShieldCheck } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { HireRequest } from '../../types';
import { db } from '../../lib/firebase';
import { calculateHaversineDistanceKm, formatDistanceBn } from '../../lib/geoDistance';
import { buildGoogleMapsNavigationUrl, isValidCoordinate, TrackedHireRequest } from '../../lib/liveTracking';

interface LiveJobMapProps {
  request: HireRequest;
  compact?: boolean;
}

interface Coordinates {
  latitude: number;
  longitude: number;
}

export const LiveJobMap: React.FC<LiveJobMapProps> = ({ request, compact = false }) => {
  const [liveRequest, setLiveRequest] = useState<TrackedHireRequest>(request as TrackedHireRequest);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      doc(db, 'serviceRequests', request.id),
      (snapshot) => {
        if (snapshot.exists()) {
          setLiveRequest({ ...(snapshot.data() as HireRequest), id: snapshot.id } as TrackedHireRequest);
        }
      },
      (error) => console.warn('Live job tracking listener failed:', error)
    );
    return unsubscribe;
  }, [request.id]);

  const workerLocation = liveRequest.tracking?.workerLocation;
  const customerLocation = (liveRequest as any).workLocation?.coordinates as Coordinates | undefined;
  const destinationAddress = String(
    (liveRequest as any).workLocation?.fullAddress ||
    [
      (liveRequest as any).workLocation?.areaRoad,
      (liveRequest as any).workLocation?.upazila,
      (liveRequest as any).workLocation?.district,
      (liveRequest as any).workLocation?.division,
      'Bangladesh',
    ].filter(Boolean).join(', ')
  );

  const hasWorkerLocation = isValidCoordinate(workerLocation?.latitude, workerLocation?.longitude);
  const hasCustomerLocation = isValidCoordinate(customerLocation?.latitude, customerLocation?.longitude);
  const hasDestination = destinationAddress.trim().length > 5;

  const fallbackDistance = useMemo(() => {
    if (!hasWorkerLocation || !hasCustomerLocation || !workerLocation || !customerLocation) return null;
    return calculateHaversineDistanceKm(
      workerLocation.latitude,
      workerLocation.longitude,
      customerLocation.latitude,
      customerLocation.longitude
    );
  }, [hasWorkerLocation, hasCustomerLocation, workerLocation, customerLocation]);

  const mapUrl = useMemo(() => {
    if (!hasWorkerLocation || !workerLocation) return null;

    const destination = hasCustomerLocation && customerLocation
      ? { latitude: customerLocation.latitude, longitude: customerLocation.longitude }
      : null;

    const lat = destination ? (workerLocation.latitude + destination.latitude) / 2 : workerLocation.latitude;
    const lon = destination ? (workerLocation.longitude + destination.longitude) / 2 : workerLocation.longitude;
    const latSpan = destination ? Math.max(Math.abs(workerLocation.latitude - destination.latitude) * 2.8, 0.01) : 0.03;
    const lonSpan = destination ? Math.max(Math.abs(workerLocation.longitude - destination.longitude) * 2.8, 0.01) : 0.03;

    const bbox = [
      lon - lonSpan,
      lat - latSpan,
      lon + lonSpan,
      lat + latSpan,
    ].map((value) => value.toFixed(6)).join(',');

    return `https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${workerLocation.latitude.toFixed(6)},${workerLocation.longitude.toFixed(6)}`;
  }, [
    hasWorkerLocation,
    hasCustomerLocation,
    workerLocation?.latitude,
    workerLocation?.longitude,
    customerLocation?.latitude,
    customerLocation?.longitude,
  ]);

  const navigationUrl =
    hasWorkerLocation && workerLocation && hasDestination
      ? buildGoogleMapsNavigationUrl(
          workerLocation,
          hasCustomerLocation && customerLocation ? customerLocation : destinationAddress
        )
      : null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-blue-600" />
            লাইভ লোকেশন
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">Worker-এর GPS অবস্থান • শুধু সংশ্লিষ্ট কাজের পক্ষগুলো দেখতে পারে</p>
        </div>
        {liveRequest.status === 'ON_THE_WAY' && (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
            <Radio className="w-3 h-3" /> LIVE
          </span>
        )}
      </div>

      <div className={compact ? 'h-56' : 'h-72'}>
        {mapUrl ? (
          <iframe
            title="Live worker location map"
            src={mapUrl}
            className="w-full h-full border-0"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        ) : (
          <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center text-center p-5">
            <MapPin className="w-8 h-8 text-slate-400 mb-2" />
            <p className="text-xs font-bold text-slate-700">Worker-এর live GPS location এখনো পাওয়া যায়নি</p>
            <p className="text-[11px] text-slate-500 mt-1 max-w-sm">
              Worker-এর GPS permission চালু থাকলে এখানে live location দেখা যাবে।
            </p>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="rounded-xl bg-slate-50 p-2">
          <span className="text-[10px] text-slate-500 block">সরাসরি দূরত্ব</span>
          <strong className="text-xs text-slate-900">{fallbackDistance !== null ? formatDistanceBn(fallbackDistance) : '—'}</strong>
        </div>
        <div className="rounded-xl bg-slate-50 p-2">
          <span className="text-[10px] text-slate-500 block">GPS নির্ভুলতা</span>
          <strong className="text-xs text-slate-900">
            {workerLocation?.accuracyMeters ? Math.round(workerLocation.accuracyMeters) + ' মিটার' : '—'}
          </strong>
        </div>
        <div className="rounded-xl bg-slate-50 p-2">
          <span className="text-[10px] text-slate-500 block">সর্বশেষ আপডেট</span>
          <strong className="text-xs text-slate-900">
            {workerLocation?.lastUpdated
              ? new Date(workerLocation.lastUpdated).toLocaleTimeString('bn-BD', {
                  hour: '2-digit',
                  minute: '2-digit',
                  second: '2-digit',
                })
              : '—'}
          </strong>
        </div>
        <div className="rounded-xl bg-slate-50 p-2 flex items-center justify-center">
          {navigationUrl ? (
            <a
              href={navigationUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-1.5 px-2 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Google Maps
            </a>
          ) : (
            <span className="text-[10px] text-slate-400 inline-flex items-center gap-1">
              <ShieldCheck className="w-3 h-3" /> অপেক্ষমান
            </span>
          )}
        </div>
      </div>

      {!hasCustomerLocation && hasWorkerLocation && (
        <div className="px-3 pb-3 text-[11px] text-amber-700">
          কাজের GPS coordinate না থাকায় এখন শুধু Worker-এর live location দেখানো হচ্ছে। ঠিকানা থাকলে navigation link ব্যবহার করা যাবে।
        </div>
      )}
    </section>
  );
};
