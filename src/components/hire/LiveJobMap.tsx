import React, { useEffect, useMemo, useRef, useState } from 'react';
import { ExternalLink, Loader2, MapPin, Navigation, Radio, ShieldCheck } from 'lucide-react';
import { doc, onSnapshot } from 'firebase/firestore';
import { HireRequest } from '../../types';
import { db } from '../../lib/firebase';
import { calculateHaversineDistanceKm, formatDistanceBn } from '../../lib/geoDistance';
import { buildGoogleMapsNavigationUrl, getGoogleMapsApiKey, isValidCoordinate, TrackedHireRequest } from '../../lib/liveTracking';
import { loadGoogleMaps } from '../../lib/googleMapsLoader';

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
  const [mapError, setMapError] = useState<string | null>(null);
  const [routeSummary, setRouteSummary] = useState<{ distanceMeters?: number; durationMillis?: number } | null>(null);
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<any>(null);
  const workerMarker = useRef<any>(null);
  const customerMarker = useRef<any>(null);
  const routePolylines = useRef<any[]>([]);
  const lastRouteRefresh = useRef<{ at: number; latitude: number; longitude: number } | null>(null);

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
  const apiConfigured = Boolean(getGoogleMapsApiKey());

  const fallbackDistance = useMemo(() => {
    if (!hasWorkerLocation || !hasCustomerLocation || !workerLocation || !customerLocation) return null;
    return calculateHaversineDistanceKm(
      workerLocation.latitude,
      workerLocation.longitude,
      customerLocation.latitude,
      customerLocation.longitude
    );
  }, [hasWorkerLocation, hasCustomerLocation, workerLocation, customerLocation]);

  useEffect(() => {
    if (!mapRef.current || !apiConfigured || !hasWorkerLocation || (!hasCustomerLocation && !hasDestination)) return;

    let cancelled = false;

    const renderMap = async () => {
      try {
        const google = await loadGoogleMaps();
        if (cancelled || !mapRef.current) return;

        const [{ Map }, { AdvancedMarkerElement }, { Route }] = await Promise.all([
          google.maps.importLibrary('maps') as Promise<any>,
          google.maps.importLibrary('marker') as Promise<any>,
          google.maps.importLibrary('routes') as Promise<any>,
        ]);

        if (cancelled || !mapRef.current) return;

        const worker = { lat: workerLocation!.latitude, lng: workerLocation!.longitude };
        const customer = hasCustomerLocation && customerLocation
          ? { lat: customerLocation.latitude, lng: customerLocation.longitude }
          : null;

        if (!mapInstance.current) {
          mapInstance.current = new Map(mapRef.current, {
            center: worker,
            zoom: 13,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: true,
            mapId: 'DEMO_MAP_ID',
          });
        }

        const map = mapInstance.current;

        if (!workerMarker.current) {
          workerMarker.current = new AdvancedMarkerElement({
            map,
            position: worker,
            title: 'Worker live location',
          });
        } else {
          workerMarker.current.position = worker;
        }

        if (customer) {
          if (!customerMarker.current) {
            customerMarker.current = new AdvancedMarkerElement({
              map,
              position: customer,
              title: 'Job location',
            });
          } else {
            customerMarker.current.position = customer;
          }
        }

        const previousRoute = lastRouteRefresh.current;
        const routeMovedEnough = !previousRoute ||
          Date.now() - previousRoute.at >= 30000 ||
          calculateHaversineDistanceKm(
            previousRoute.latitude,
            previousRoute.longitude,
            worker.latitude,
            worker.longitude
          ) >= 0.1;

        if (!routeMovedEnough) return;

        lastRouteRefresh.current = {
          at: Date.now(),
          latitude: worker.lat,
          longitude: worker.lng,
        };

        routePolylines.current.forEach((polyline) => polyline.setMap(null));
        routePolylines.current = [];

        const result = await Route.computeRoutes({
          origin: worker,
          destination: customer || destinationAddress,
          travelMode: 'DRIVING',
          fields: ['path', 'distanceMeters', 'durationMillis', 'viewport'],
        });

        if (cancelled) return;

        const route = result.routes?.[0];
        if (!route) {
          setMapError('রুট পাওয়া যায়নি।');
          return;
        }

        routePolylines.current = route.createPolylines();
        routePolylines.current.forEach((polyline: any) => polyline.setMap(map));
        setRouteSummary({
          distanceMeters: route.distanceMeters,
          durationMillis: route.durationMillis,
        });

        if (route.viewport) map.fitBounds(route.viewport);
        setMapError(null);
      } catch (error) {
        console.warn('Google Maps route error:', error);
        if (!cancelled) setMapError('Google Maps চালু করা যায়নি। API key বা Maps/Routes API সেটআপ পরীক্ষা করুন।');
      }
    };

    void renderMap();

    return () => {
      cancelled = true;
    };
  }, [
    apiConfigured,
    hasWorkerLocation,
    hasCustomerLocation,
    workerLocation?.latitude,
    workerLocation?.longitude,
    customerLocation?.latitude,
    customerLocation?.longitude,
    destinationAddress,
  ]);

  const navigationUrl =
    hasWorkerLocation && workerLocation && hasDestination
      ? buildGoogleMapsNavigationUrl(workerLocation, hasCustomerLocation && customerLocation ? customerLocation : destinationAddress)
      : null;

  return (
    <section className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-200 flex items-center justify-between gap-3">
        <div>
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Navigation className="w-4 h-4 text-blue-600" />
            লাইভ লোকেশন ও রুট
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">Worker ↔ কাজের স্থান • শুধু সংশ্লিষ্ট কাজের পক্ষগুলো দেখতে পারে</p>
        </div>
        {liveRequest.status === 'ON_THE_WAY' && (
          <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold">
            <Radio className="w-3 h-3" /> LIVE
          </span>
        )}
      </div>

      <div className={compact ? 'h-56' : 'h-72'}>
        {apiConfigured && hasWorkerLocation && (hasCustomerLocation || hasDestination) ? (
          <div ref={mapRef} className="w-full h-full" />
        ) : (
          <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-center text-center p-5">
            <MapPin className="w-8 h-8 text-slate-400 mb-2" />
            <p className="text-xs font-bold text-slate-700">
              {!apiConfigured
                ? 'Google Maps API এখনো সংযুক্ত করা হয়নি'
                : !hasWorkerLocation
                  ? 'Worker-এর live GPS location এখনো পাওয়া যায়নি'
                  : 'কাজের location-এর GPS coordinate এখনো নেই'}
            </p>
            <p className="text-[11px] text-slate-500 mt-1 max-w-sm">
              {liveRequest.status === 'ON_THE_WAY'
                ? 'Worker-এর GPS permission চালু থাকলে এখানে live location ও route দেখা যাবে।'
                : 'Worker রওনা দিলে live tracking চালু হবে।'}
            </p>
          </div>
        )}
      </div>

      <div className="p-3 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="rounded-xl bg-slate-50 p-2">
          <span className="text-[10px] text-slate-500 block">সরাসরি দূরত্ব</span>
          <strong className="text-xs text-slate-900">
            {fallbackDistance !== null ? formatDistanceBn(fallbackDistance) : '—'}
          </strong>
        </div>
        <div className="rounded-xl bg-slate-50 p-2">
          <span className="text-[10px] text-slate-500 block">রাস্তার দূরত্ব</span>
          <strong className="text-xs text-slate-900">
            {routeSummary?.distanceMeters ? formatDistanceBn(routeSummary.distanceMeters / 1000) : '—'}
          </strong>
        </div>
        <div className="rounded-xl bg-slate-50 p-2">
          <span className="text-[10px] text-slate-500 block">আনুমানিক সময়</span>
          <strong className="text-xs text-slate-900">
            {routeSummary?.durationMillis ? Math.max(1, Math.round(routeSummary.durationMillis / 60000)) + ' মিনিট' : '—'}
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

      {mapError && (
        <div className="px-3 pb-3 text-[11px] text-amber-700 flex items-center gap-1.5">
          <Navigation className="w-3.5 h-3.5" /> {mapError}
        </div>
      )}

      {apiConfigured && !hasWorkerLocation && (
        <div className="px-3 pb-3 text-[11px] text-slate-500 flex items-center gap-1.5">
          <Loader2 className="w-3.5 h-3.5 animate-spin" /> Worker-এর live GPS আসার অপেক্ষায়…
        </div>
      )}
    </section>
  );
};
