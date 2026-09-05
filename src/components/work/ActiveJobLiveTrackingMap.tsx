import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { 
  Navigation, 
  MapPin, 
  Clock, 
  Compass, 
  Radio, 
  AlertCircle, 
  CheckCircle2, 
  WifiOff, 
  LocateFixed, 
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { HireRequest, LiveTrackingData } from '../../types';
import { useRealtimeJobTracking } from '../../hooks/useRealtimeJobTracking';
import { isPhysicalJob } from '../../lib/trackingUtils';

interface ActiveJobLiveTrackingMapProps {
  request: HireRequest;
  perspective: 'worker' | 'customer';
  isWorkerOnline: boolean;
  onUpdateTracking?: (data: LiveTrackingData) => Promise<void> | void;
  onToggleOnline?: () => void;
  compact?: boolean;
}

export const ActiveJobLiveTrackingMap: React.FC<ActiveJobLiveTrackingMapProps> = ({
  request,
  perspective,
  isWorkerOnline,
  onUpdateTracking,
  onToggleOnline,
  compact = false,
}) => {
  const isPhysical = isPhysicalJob(request);
  const isJobActive = request.status === 'ON_THE_WAY' || request.status === 'ACCEPTED' || request.status === 'WORK_STARTED';
  const isCompleted = request.status === 'WORK_COMPLETED';
  const isCancelled = request.status === 'CANCELLED' || request.status === 'REJECTED';

  const {
    customerLocation,
    trackingData,
    gpsError,
    isGpsActive,
    isCalculatingRoute,
  } = useRealtimeJobTracking({
    request,
    isWorkerPerspective: perspective === 'worker',
    isWorkerOnline,
    onUpdateTracking,
  });

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const workerMarkerRef = useRef<L.Marker | null>(null);
  const customerMarkerRef = useRef<L.Marker | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const routeBorderPolylineRef = useRef<L.Polyline | null>(null);

  const [mapReady, setMapReady] = useState(false);
  const [autoFollow, setAutoFollow] = useState(true);

  // Digital Job constraint (Rules 11 & 12)
  if (!isPhysical) {
    return (
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-center gap-3">
        <span className="p-2 rounded-xl bg-blue-100 text-blue-700 font-bold">💻</span>
        <div>
          <p className="font-bold text-slate-800">ডিজিটাল ফ্রিল্যান্সিং কাজ (রিমোট)</p>
          <p className="text-[11px] text-slate-500">এই কাজের জন্য GPS বা ম্যাপ ট্র্যাকিং প্রযোজ্য নয়। সকল ফাইল ও অগ্রগতি চ্যাট ও ওয়ার্ক স্লিপে পরিচালিত হবে।</p>
        </div>
      </div>
    );
  }

  // Job finished or cancelled (Rule 9)
  if (isCompleted || isCancelled) {
    return (
      <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          {isCompleted ? (
            <>
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>কাজটি সফলভাবে সম্পন্ন হয়েছে — লাইভ ট্র্যাকিং সমাপ্ত।</span>
            </>
          ) : (
            <>
              <AlertCircle className="w-4 h-4 text-slate-500" />
              <span>কাজটি বাতিল করা হয়েছে — লাইভ ট্র্যাকিং বন্ধ।</span>
            </>
          )}
        </div>
      </div>
    );
  }

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Default center
    const defaultCenter: [number, number] = trackingData
      ? [trackingData.workerLatitude, trackingData.workerLongitude]
      : [customerLocation.lat, customerLocation.lng];

    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 14,
      zoomControl: false,
      attributionControl: false,
    });

    // Clean Google Maps styled vector tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 19,
      subdomains: 'abcd',
    }).addTo(map);

    L.control.zoom({ position: 'bottomright' }).addTo(map);

    mapInstanceRef.current = map;
    setMapReady(true);

    return () => {
      map.remove();
      mapInstanceRef.current = null;
      workerMarkerRef.current = null;
      customerMarkerRef.current = null;
      routePolylineRef.current = null;
      routeBorderPolylineRef.current = null;
    };
  }, [customerLocation.lat, customerLocation.lng]);

  // Update Customer Marker
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    const customerIcon = L.divIcon({
      className: 'customer-destination-pin',
      html: `
        <div style="display: flex; flex-direction: column; align-items: center; cursor: pointer;">
          <div style="background: #ea4335; color: white; width: 34px; height: 34px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(234,67,53,0.4); border: 2.5px solid white;">
            <div style="transform: rotate(45deg); font-size: 14px;">🏠</div>
          </div>
          <div style="background: white; color: #1e293b; font-size: 10px; font-weight: 800; padding: 2px 6px; border-radius: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.15); margin-top: 2px; white-space: nowrap; border: 1px solid #e2e8f0;">
            কাস্টমার
          </div>
        </div>
      `,
      iconSize: [40, 50],
      iconAnchor: [20, 48],
    });

    if (customerMarkerRef.current) {
      customerMarkerRef.current.setLatLng([customerLocation.lat, customerLocation.lng]);
    } else {
      customerMarkerRef.current = L.marker([customerLocation.lat, customerLocation.lng], {
        icon: customerIcon,
      }).addTo(map);
      customerMarkerRef.current.bindPopup(
        `<div style="font-family: sans-serif; font-size: 12px;"><b>কাস্টমারের ঠিকানা</b><br/>${request.workLocation?.fullAddress || ''}</div>`
      );
    }
  }, [mapReady, customerLocation, request.workLocation?.fullAddress]);

  // Update Worker Marker & Route (Rules 1, 3, 6, 7, 8, 10)
  useEffect(() => {
    if (!mapReady || !mapInstanceRef.current) return;
    const map = mapInstanceRef.current;

    // Rule 10: If worker is offline, hide worker live location from customer
    const shouldHideWorkerLocation = perspective === 'customer' && (!isWorkerOnline || !trackingData?.isWorkerOnline);

    if (shouldHideWorkerLocation || !trackingData) {
      if (workerMarkerRef.current) {
        map.removeLayer(workerMarkerRef.current);
        workerMarkerRef.current = null;
      }
      if (routePolylineRef.current) {
        map.removeLayer(routePolylineRef.current);
        routePolylineRef.current = null;
      }
      if (routeBorderPolylineRef.current) {
        map.removeLayer(routeBorderPolylineRef.current);
        routeBorderPolylineRef.current = null;
      }
      return;
    }

    const workerPos: [number, number] = [trackingData.workerLatitude, trackingData.workerLongitude];
    const heading = trackingData.workerHeading || 0;

    // Custom Google Maps style Moving Worker Marker
    const workerIcon = L.divIcon({
      className: 'moving-worker-marker',
      html: `
        <div style="position: relative; width: 44px; height: 44px; display: flex; align-items: center; justify-content: center;">
          <!-- Pulsing Radar Halo -->
          <div style="position: absolute; inset: 0; border-radius: 9999px; background: rgba(26, 115, 232, 0.25); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
          <!-- Vehicle Disc with Heading Rotation -->
          <div style="width: 36px; height: 36px; border-radius: 9999px; background: #1a73e8; color: white; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(26,115,232,0.5); border: 2.5px solid white; z-index: 10; transform: rotate(${heading}deg); transition: transform 0.4s ease-out;">
            <svg style="width: 20px; height: 20px; fill: white;" viewBox="0 0 24 24">
              <path d="M12 2L4.5 20.29l.71.71L12 18l6.79 3 .71-.71z"/>
            </svg>
          </div>
          <!-- Worker Live Indicator Pin -->
          <span style="position: absolute; bottom: -2px; right: -2px; width: 12px; height: 12px; border-radius: 50%; background: #22c55e; border: 2px solid white; z-index: 20;"></span>
        </div>
      `,
      iconSize: [44, 44],
      iconAnchor: [22, 22],
    });

    if (workerMarkerRef.current) {
      workerMarkerRef.current.setLatLng(workerPos);
      workerMarkerRef.current.setIcon(workerIcon);
    } else {
      workerMarkerRef.current = L.marker(workerPos, { icon: workerIcon, zIndexOffset: 1000 }).addTo(map);
      workerMarkerRef.current.bindPopup(
        `<div style="font-family: sans-serif; font-size: 12px;"><b>কর্মী: ${request.workerName}</b><br/>${request.status === 'ON_THE_WAY' ? 'রওনা দিয়েছেন' : 'কাজ করছেন'}</div>`
      );
    }

    // Google Maps-Style Road Route Polyline (Bold Blue with dark-blue casing)
    if (trackingData.routeGeometry && trackingData.routeGeometry.length > 0) {
      const roadPath = trackingData.routeGeometry;

      // Outer casing line
      if (routeBorderPolylineRef.current) {
        routeBorderPolylineRef.current.setLatLngs(roadPath);
      } else {
        routeBorderPolylineRef.current = L.polyline(roadPath, {
          color: '#1558b0',
          weight: 8,
          opacity: 0.5,
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(map);
      }

      // Inner vibrant blue navigation route
      if (routePolylineRef.current) {
        routePolylineRef.current.setLatLngs(roadPath);
      } else {
        routePolylineRef.current = L.polyline(roadPath, {
          color: '#1a73e8',
          weight: 5,
          opacity: 0.95,
          lineCap: 'round',
          lineJoin: 'round',
        }).addTo(map);
      }
    }

    // Auto fit bounds or center on worker
    if (autoFollow) {
      const bounds = L.latLngBounds([
        workerPos,
        [customerLocation.lat, customerLocation.lng],
      ]);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 16 });
    }
  }, [
    mapReady,
    trackingData,
    customerLocation,
    perspective,
    isWorkerOnline,
    autoFollow,
    request.workerName,
    request.status,
  ]);

  // Fallback simulator for desktop testing (when device GPS is static)
  const handleSimulateStep = () => {
    if (!trackingData || !trackingData.routeGeometry || trackingData.routeGeometry.length < 2) return;
    const path = trackingData.routeGeometry;
    // Advance worker 10% closer to customer along the actual road path
    const nextIndex = Math.min(path.length - 1, Math.max(1, Math.floor(path.length * 0.2)));
    const nextCoord = path[nextIndex];
    if (nextCoord) {
      const remainingPath = path.slice(nextIndex);
      const remainingDistance = Math.max(100, (trackingData.roadDistanceMeters || 1000) * 0.8);
      const remainingEta = Math.max(1, Math.round((trackingData.etaMinutes || 10) * 0.8));

      const updated: LiveTrackingData = {
        ...trackingData,
        workerLatitude: nextCoord[0],
        workerLongitude: nextCoord[1],
        routeGeometry: remainingPath,
        roadDistanceMeters: Math.round(remainingDistance),
        roadDistanceText: remainingDistance < 1000 ? `${Math.round(remainingDistance)} মিটার` : `${(remainingDistance / 1000).toFixed(1)} কি.মি.`,
        etaMinutes: remainingEta,
        etaText: `${remainingEta} মিনিট`,
        lastUpdated: new Date().toISOString(),
      };
      if (onUpdateTracking) {
        onUpdateTracking(updated);
      }
    }
  };

  return (
    <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-700 shadow-md flex flex-col">
      {/* Header Bar: Navigation Status, ETA & Distance Badges */}
      <div className="p-3 bg-slate-900 text-white flex flex-wrap items-center justify-between gap-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center">
            <Navigation className="w-4 h-4 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold">
                {request.status === 'ON_THE_WAY' ? 'কর্মী রওনা হয়েছেন (Live Tracking)' : 'কাজের লাইভ ম্যাপ ট্র্যাকিং'}
              </span>
              <span className="flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                <Radio className="w-2.5 h-2.5 animate-ping" />
                <span>Live GPS</span>
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              গন্তব্য: {request.workLocation?.fullAddress}
            </p>
          </div>
        </div>

        {/* Real Road Distance & ETA Floating Badges (Rules 4 & 5) */}
        <div className="flex items-center gap-2">
          {trackingData?.etaText && (
            <div className="bg-emerald-600/90 text-white px-3 py-1.5 rounded-xl border border-emerald-400/40 text-center shadow-xs">
              <span className="text-[9px] uppercase tracking-wider block font-medium opacity-80">আনুমানিক পৌঁছাবেন (ETA)</span>
              <span className="text-xs font-black font-mono flex items-center justify-center gap-1">
                <Clock className="w-3 h-3" />
                <span>{trackingData.etaText}</span>
              </span>
            </div>
          )}

          {trackingData?.roadDistanceText && (
            <div className="bg-blue-600/90 text-white px-3 py-1.5 rounded-xl border border-blue-400/40 text-center shadow-xs">
              <span className="text-[9px] uppercase tracking-wider block font-medium opacity-80">সড়ক দূরত্ব (Road)</span>
              <span className="text-xs font-black font-mono flex items-center justify-center gap-1">
                <Compass className="w-3 h-3" />
                <span>{trackingData.roadDistanceText}</span>
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Offline Alert Banner (Rule 10) */}
      {(!isWorkerOnline || (perspective === 'customer' && !trackingData?.isWorkerOnline)) && (
        <div className="p-3 bg-amber-500/15 border-b border-amber-500/30 text-amber-200 text-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <WifiOff className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              {perspective === 'worker'
                ? 'আপনি বর্তমানে অফলাইনে আছেন। লাইভ লোকেশন সম্প্রচার করতে অনলাইনে যান।'
                : 'কর্মী বর্তমানে অফলাইনে আছেন। সংযোগ পুনঃস্থাপিত হলে লাইভ লোকেশন প্রদর্শিত হবে।'}
            </span>
          </div>
          {perspective === 'worker' && onToggleOnline && (
            <button
              type="button"
              onClick={onToggleOnline}
              className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-900 font-bold text-[11px] hover:bg-amber-400 transition cursor-pointer shrink-0"
            >
              অনলাইনে যান
            </button>
          )}
        </div>
      )}

      {/* GPS Error Notification (if permission denied or unavailable) */}
      {gpsError && perspective === 'worker' && (
        <div className="p-2.5 bg-rose-950/80 border-b border-rose-800 text-rose-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{gpsError}</span>
        </div>
      )}

      {/* Leaflet Map Interactive Viewport */}
      <div className="relative w-full" style={{ height: compact ? '260px' : '340px' }}>
        <div ref={mapContainerRef} className="w-full h-full z-0" />

        {/* Calculating Route Spinner */}
        {isCalculatingRoute && (
          <div className="absolute top-3 left-3 z-10 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] px-2.5 py-1 rounded-full border border-slate-700 flex items-center gap-1.5 shadow-md">
            <div className="w-2.5 h-2.5 border-2 border-blue-400 border-t-transparent rounded-full animate-spin" />
            <span>সড়ক রুট আপডেট হচ্ছে...</span>
          </div>
        )}

        {/* Map Control Buttons: Re-center & Auto-follow toggle */}
        <div className="absolute bottom-3 left-3 z-10 flex items-center gap-1.5 bg-slate-900/85 backdrop-blur-xs p-1 rounded-xl border border-slate-700 shadow-md">
          <button
            type="button"
            onClick={() => {
              setAutoFollow(true);
              if (mapInstanceRef.current && trackingData) {
                const bounds = L.latLngBounds([
                  [trackingData.workerLatitude, trackingData.workerLongitude],
                  [customerLocation.lat, customerLocation.lng],
                ]);
                mapInstanceRef.current.fitBounds(bounds, { padding: [40, 40] });
              }
            }}
            className={`p-1.5 rounded-lg text-xs font-semibold flex items-center gap-1 transition ${
              autoFollow ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-800'
            }`}
            title="উভয় লোকেশন ফোকাস করুন"
          >
            <LocateFixed className="w-3.5 h-3.5" />
            <span className="text-[10px]">ফিট রুট</span>
          </button>

          {/* Quick Step Simulation for testing road progression */}
          {perspective === 'worker' && trackingData?.routeGeometry && trackingData.routeGeometry.length > 2 && (
            <button
              type="button"
              onClick={handleSimulateStep}
              className="p-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800 flex items-center gap-1 transition"
              title="টেস্ট লোকেশন ড্রাইভ"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[10px]">টেস্ট মুভ</span>
            </button>
          )}
        </div>

        {/* External Google Maps App Link for Turn-by-Turn Navigation */}
        <a
          href={`https://www.google.com/maps/dir/?api=1&origin=${trackingData?.workerLatitude || ''},${trackingData?.workerLongitude || ''}&destination=${customerLocation.lat},${customerLocation.lng}&travelmode=driving`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-3 right-12 z-10 bg-white hover:bg-slate-100 text-slate-800 px-2.5 py-1.5 rounded-xl text-[11px] font-bold shadow-md flex items-center gap-1 border border-slate-200 transition"
        >
          <span>গুগল ম্যাপে খুলুন</span>
          <ExternalLink className="w-3 h-3 text-slate-500" />
        </a>
      </div>

      {/* Footer Details: Real-time update timestamp & status */}
      <div className="px-4 py-2 bg-slate-950 text-slate-400 text-[11px] flex flex-wrap items-center justify-between gap-2 border-t border-slate-800">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>
            {perspective === 'worker'
              ? 'আপনার ডিভাইস GPS থেকে অবস্থান সরাসরি গ্রাহকের কাছে পৌঁছাচ্ছে।'
              : 'কর্মীর রিয়েল-টাইম লাইভ অবস্থান প্রদর্শিত হচ্ছে।'}
          </span>
        </div>
        {trackingData?.lastUpdated && (
          <span className="font-mono text-[10px] text-slate-500">
            আপডেট: {new Date(trackingData.lastUpdated).toLocaleTimeString('bn-BD')}
          </span>
        )}
      </div>
    </div>
  );
};
