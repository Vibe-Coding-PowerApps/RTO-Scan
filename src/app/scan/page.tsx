// ...existing code...
// This is the original ScanQRPage.tsx restored from backup
import React, { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import jsQR from 'jsqr';
import { IconCheck, IconX } from '@tabler/icons-react';
import { Card, CardHeader, CardTitle, CardContent } from '@/ui/card';
import { Button } from '@/ui/button';

export default function ScanQRPage() {
  const [isScanning, setIsScanning] = useState(true);
  const [scanResult, setScanResult] = useState<any>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // Track last action for each deskId
  const lastDeskActions = useRef<Record<string, 'sign-in' | 'sign-out'>>({});
  const location = useLocation();
  // Track the last active camera stream for cleanup
  const lastStreamRef = useRef<MediaStream | null>(null);

  const getTimeString = () => new Date().toLocaleTimeString();

  useEffect(() => {
    let stream: MediaStream | null = null;
    let animationId: number;
    let isMounted = true;

    const stopCamera = () => {
      if (lastStreamRef.current) {
        lastStreamRef.current.getTracks().forEach(track => track.stop());
        lastStreamRef.current = null;
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        stream = null;
      }
      cancelAnimationFrame(animationId);
    };

    const startCamera = async () => {
      if (!isScanning) return;
      setVideoReady(false);
      setLoadingTimeout(false);
      // Show a warning if camera takes too long
      const timeoutId = setTimeout(() => setLoadingTimeout(true), 2500);
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: { ideal: 'environment' },
            width: { ideal: 1280 },
            height: { ideal: 720 },
            frameRate: { ideal: 30, max: 60 },
            resizeMode: 'none',
            advanced: [{ focusMode: 'continuous' }]
          }
        });
        clearTimeout(timeoutId);
        if (!isMounted) {
          stream.getTracks().forEach(track => track.stop());
          return;
        }
        lastStreamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play();
            setVideoReady(true);
            scanLoop();
          };
        }
      } catch (err) {
        clearTimeout(timeoutId);
        setScanResult({ status: 'failed', message: 'Camera access denied or unavailable', deskId: '', action: '', });
        setIsScanning(false);
      }
    };

    const scanLoop = () => {
      if (!videoRef.current || !canvasRef.current || !isScanning) {
        return;
      }
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      if (video.readyState !== 4 || video.videoWidth === 0 || video.videoHeight === 0) {
        animationId = requestAnimationFrame(scanLoop);
        return;
      }
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      let code = null;
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        code = jsQR(imageData.data, imageData.width, imageData.height);
      } catch (e) {
        setScanResult({ status: 'failed', message: 'Error reading camera frame', deskId: '', action: '', });
        setIsScanning(false);
        return;
      }
      if (code && code.data) {
        const deskId = code.data;
        const lastAction = lastDeskActions.current[deskId];
        const nextAction = lastAction === 'sign-in' ? 'sign-out' : 'sign-in';
        lastDeskActions.current[deskId] = nextAction;
        setScanResult({
          status: 'success',
          message: `QR Code: ${deskId}`,
          deskId,
          action: nextAction,
        });
        setIsScanning(false);
        return;
      }
      animationId = requestAnimationFrame(scanLoop);
    };

    if (isScanning) startCamera();
    return () => {
      isMounted = false;
      stopCamera();
    };
    // eslint-disable-next-line
  }, [isScanning]);

  // Cleanup camera immediately on unmount or navigation away
  useEffect(() => {
    return () => {
      if (lastStreamRef.current) {
        lastStreamRef.current.getTracks().forEach(track => track.stop());
        lastStreamRef.current = null;
      }
      if (videoRef.current && videoRef.current.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
        tracks.forEach(track => track.stop());
        videoRef.current.srcObject = null;
      }
    };
  }, []);



  return (
    <div className="fixed inset-0 bg-background overflow-y-auto flex flex-col items-center w-full">
      {/* Top Header Bar */}
      <div className="w-full max-w-md flex items-center justify-between px-4 py-4 border-b border-border">
        <div className="w-12" />
        <div className="w-12 h-12 rounded-2xl bg-accent flex items-center justify-center shadow-md">
          <svg className="w-6 h-6 text-primary" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M8 6H6V8H8V6ZM3 5.25C3 4.00736 4.00736 3 5.25 3H8.75C9.99264 3 11 4.00736 11 5.25V8.75C11 9.99264 9.99264 11 8.75 11H5.25C4.00736 11 3 9.99264 3 8.75V5.25ZM5.25 4.5C4.83579 4.5 4.5 4.83579 4.5 5.25V8.75C4.5 9.16421 4.83579 9.5 5.25 9.5H8.75C9.16421 9.5 9.5 9.16421 9.5 8.75V5.25C9.5 4.83579 9.16421 4.5 8.75 4.5H5.25ZM6 16H8V18H6V16ZM3 15.25C3 14.0074 4.00736 13 5.25 13H8.75C9.99264 13 11 14.0074 11 15.25V18.75C11 19.9926 9.99264 21 8.75 21H5.25C4.00736 21 3 19.9926 3 18.75V15.25ZM5.25 14.5C4.83579 14.5 4.5 14.8358 4.5 15.25V18.75C4.5 19.1642 4.83579 19.5 5.25 19.5H8.75C9.16421 19.5 9.5 19.1642 9.5 18.75V15.25C9.5 14.8358 9.16421 14.5 8.75 14.5H5.25ZM18 6H16V8H18V6ZM15.25 3C14.0074 3 13 4.00736 13 5.25V8.75C13 9.99264 14.0074 11 15.25 11H18.75C19.9926 11 21 9.99264 21 8.75V5.25C21 4.00736 19.9926 3 18.75 3H15.25ZM14.5 5.25C14.5 4.83579 14.8358 4.5 15.25 4.5H18.75C19.1642 4.5 19.5 4.83579 19.5 5.25V8.75C19.5 9.16421 19.1642 9.5 18.75 9.5H15.25C14.8358 9.5 14.5 9.16421 14.5 8.75V5.25ZM13 13H15.75V15.75H13V13ZM18.25 15.75H15.75V18.25H13V21H15.75V18.25H18.25V21H21V18.25H18.25V15.75ZM18.25 15.75V13H21V15.75H18.25Z" fill="currentColor"/>
          </svg>
        </div>
      </div>

      {/* Main Content - Mobile Constrained */}
      <div className="w-full max-w-md flex-1 flex flex-col items-center justify-start px-4 py-8">
        {/* Title Section */}
        <div className="w-full text-left mb-8">
          <h1 className="text-3xl font-bold mb-2 text-foreground">
            Scan QR Code
          </h1>
          <p className="text-sm text-muted-foreground">
            Position the QR code within the frame
          </p>
        </div>

        {/* Scanner View */}
        {isScanning && (
          <div className="w-full aspect-square mb-12 overflow-hidden relative rounded-3xl bg-black shadow-2xl">
            {!videoReady && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 z-10">
                <span className="text-white text-lg animate-pulse">Loading camera…</span>
                {loadingTimeout && (
                  <span className="text-red-400 text-xs mt-2">Camera is taking longer than expected. Please check permissions or try refreshing.</span>
                )}
              </div>
            )}
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              autoPlay
              muted
              style={{ visibility: videoReady ? 'visible' : 'hidden' }}
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Top gradient overlay */}
            <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/60 to-transparent pointer-events-none" />

            {/* Bottom gradient overlay */}
            <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-black/80 to-transparent pointer-events-none" />

            {/* Scanning Frame */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="scanner-frame relative w-56 h-56 border-2 border-primary rounded-2xl" style={{
                boxShadow: '0 0 0 3000px rgba(0, 0, 0, 0.3)'
              }}>
                {/* Corner highlights */}
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-lg" />

                {/* Scanning line */}
                <div className="scanner-line absolute left-0 right-0 h-1 bg-gradient-to-b from-transparent via-primary to-transparent" />
              </div>
            </div>

            {/* Scanning text */}
            <div className="absolute top-1/3 left-0 right-0 text-center pointer-events-none">
              <p className="text-primary/80 text-sm font-semibold animate-pulse">Point at QR code</p>
            </div>
          </div>
        )}

        {/* Last Scan Result */}
        {scanResult && !isScanning && (
          <div className="w-full">
            <Card className="border-border">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  {scanResult.status === 'success' ? (
                    <>
                      <IconCheck className="w-4 h-4 text-green-600" />
                      <span className="text-green-600 font-semibold">Success</span>
                    </>
                  ) : scanResult.status === 'occupied' ? (
                    <>
                      <IconX className="w-4 h-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Occupied</span>
                    </>
                  ) : (
                    <>
                      <IconX className="w-4 h-4 text-destructive" />
                      <span className="text-destructive">Failed</span>
                    </>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Desk ID:</span>
                  <span className="font-semibold text-foreground">{scanResult.deskId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Time:</span>
                  <span className="font-semibold text-foreground">{getTimeString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Action:</span>
                  <span className={`font-semibold capitalize ${
                    scanResult.action === 'sign-in' 
                      ? 'text-green-600' 
                      : 'text-orange-600'
                  }`}>{scanResult.action}</span>
                </div>
                {scanResult.message && (
                  <div className="pt-2 border-t border-border">
                    <p className="text-foreground">{scanResult.message}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Show result message when not scanning */}
        {scanResult && !isScanning && (
          <div className="w-full mt-6">
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => {
                  setScanResult(null);
                  setIsScanning(true);
                }}
                variant="default"
                className="w-full h-11 text-sm font-semibold rounded-xl"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
