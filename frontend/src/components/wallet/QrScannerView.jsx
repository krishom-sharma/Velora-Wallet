import { useEffect, useRef, useState } from "react";

export const QrScannerView = ({ onScan }) => {
  const videoRef = useRef(null);
  const frameRef = useRef(null);
  const streamRef = useRef(null);
  const [status, setStatus] = useState("Requesting camera access...");

  useEffect(() => {
    let mounted = true;
    let detector;

    const setup = async () => {
      if (!("BarcodeDetector" in window)) {
        setStatus("Camera scanning is not supported here. Paste a QR payload manually.");
        return;
      }

      detector = new window.BarcodeDetector({
        formats: ["qr_code"]
      });

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" } }
        });

        if (!mounted) return;
        streamRef.current = stream;
        setStatus("Point the camera at a Velora QR code.");

        const video = videoRef.current;
        video.srcObject = stream;
        await video.play();

        const tick = async () => {
          if (!mounted || !videoRef.current) return;
          try {
            const barcodes = await detector.detect(videoRef.current);
            if (barcodes[0]?.rawValue) {
              onScan(barcodes[0].rawValue);
              setStatus("QR detected. Review the payload below.");
            }
          } catch (_error) {
            setStatus("Scanning...");
          }
          frameRef.current = window.requestAnimationFrame(tick);
        };

        frameRef.current = window.requestAnimationFrame(tick);
      } catch (_error) {
        setStatus("Camera permission denied. Paste a QR payload manually.");
      }
    };

    setup();

    return () => {
      mounted = false;
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      streamRef.current?.getTracks().forEach((track) => track.stop());
    };
  }, [onScan]);

  return (
    <div className="relative overflow-hidden rounded-[28px] border border-border/80 bg-slate-950">
      <video ref={videoRef} muted playsInline className="h-[320px] w-full object-cover" />
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-44 w-44 rounded-[32px] border border-white/70 shadow-[0_0_0_9999px_rgba(15,23,42,0.35)]" />
      </div>
      <p className="absolute inset-x-4 bottom-4 rounded-2xl bg-slate-950/70 px-4 py-2 text-center text-sm text-white backdrop-blur-xl">
        {status}
      </p>
    </div>
  );
};
