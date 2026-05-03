import { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';

// Fibonacci sphere: places N*2 points uniformly on the globe then pairs them into arcs
function buildArcs(count: number) {
  const golden = (1 + Math.sqrt(5)) / 2;
  const pts = Array.from({ length: count * 2 }, (_, i) => {
    const theta = Math.acos(1 - (2 * i + 1) / (count * 2));
    const phi   = (2 * Math.PI * i) / golden;
    return {
      lat: 90 - theta * (180 / Math.PI),
      lng: ((phi * 180) / Math.PI) % 360 - 180,
    };
  });
  return Array.from({ length: count }, (_, i) => ({
    startLat: pts[i].lat,
    startLng: pts[i].lng,
    endLat:   pts[i + count].lat,
    endLng:   pts[i + count].lng,
  }));
}

const FLIGHTS = buildArcs(20);

export const GlobeScene = () => {
  const globeRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setSize({ w: entry.contentRect.width, h: entry.contentRect.height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const globe = globeRef.current;
    if (!globe || size.w === 0) return;
    const ctrl = globe.controls();
    ctrl.autoRotate = true;
    ctrl.autoRotateSpeed = 0.6;
    ctrl.enableZoom = false;
    ctrl.enablePan = false;
    globe.pointOfView({ altitude: 1.9 });
  }, [size]);

  return (
    <div ref={containerRef} className="w-full h-full">
      {size.w > 0 && (
        <Globe
          ref={globeRef}
          width={size.w}
          height={size.h}
          globeImageUrl="/earth.jpg"
          backgroundImageUrl="/night-sky.png"
          showAtmosphere
          atmosphereColor="#7dd3fc"
          atmosphereAltitude={0.22}
          arcsData={FLIGHTS}
          arcColor={() => '#38bdf8'}
          arcAltitude={0.4}
          arcStroke={0.7}
          arcDashLength={0.28}
          arcDashGap={0.12}
          arcDashAnimateTime={1800}
        />
      )}
    </div>
  );
};
