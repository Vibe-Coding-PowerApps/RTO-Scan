'use client'

import { useState, useRef, useEffect } from 'react'
import { Button } from '@/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/ui/card'
import { IconQrcode, IconCheck, IconX, IconSettings, IconArrowLeft } from '@tabler/icons-react'
import { AuditHistoryTable } from '@/components/audit-history-table'

interface ScanResult {
  deskId: string
  timestamp: string
  action: 'sign-in' | 'sign-out'
  employeeId: string
  status: 'success' | 'error' | 'occupied'
  message?: string
}

export default function ScanPage() {
  const [isScanning, setIsScanning] = useState(false)
  const [scanResult, setScanResult] = useState<ScanResult | null>(null)
  const [userDesks, setUserDesks] = useState<Record<string, boolean>>({}) // Track which desks user is signed into
  const [jsQRAvailable, setJsQRAvailable] = useState(false)
  const [showHome, setShowHome] = useState(true)
  const [currentPage, setCurrentPage] = useState<'scan' | 'history'>('scan')
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const scanningRef = useRef(false)
  const jsQRRef = useRef<any>(null)

  // Load jsQR dynamically
  useEffect(() => {
    const loadJsQR = async () => {
      try {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
        const jsqr = (await import('jsqr' as unknown as string)).default
        jsQRRef.current = jsqr
        setJsQRAvailable(true)
      } catch (e) {
        console.warn('jsQR not available, using manual QR input only')
      }
    }
    loadJsQR()
  }, [])

  // Initialize camera - only starts when scanning is explicitly enabled
  useEffect(() => {
    let stream: MediaStream | null = null

    const startCamera = async () => {
      if (!isScanning) {
        console.log('Scanning not active, camera will not start')
        return
      }

      console.log('Starting camera...')

      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        })

        console.log('✅ Camera stream obtained')

        if (videoRef.current && stream) {
          videoRef.current.srcObject = stream
          await videoRef.current.play()
          console.log('✅ Video playing')
        }
      } catch (error) {
        console.error('❌ Error accessing camera:', error)
        alert('Unable to access camera. Please check permissions.')
        setIsScanning(false)
        
        // Stop any partial stream
        if (stream) {
          stream.getTracks().forEach((track) => track.stop())
        }
      }
    }

    if (isScanning) {
      startCamera()
    }

    return () => {
      // Cleanup: Always stop camera when component unmounts or scanning stops
      if (videoRef.current?.srcObject) {
        const tracks = (videoRef.current.srcObject as MediaStream).getTracks()
        tracks.forEach((track) => {
          track.stop()
          console.log('✅ Camera track stopped')
        })
        videoRef.current.srcObject = null
      }
      
      // Also stop any stream reference
      if (stream) {
        stream.getTracks().forEach((track) => {
          if (track.readyState === 'live') {
            track.stop()
            console.log('✅ Stream track stopped in cleanup')
          }
        })
      }
    }
  }, [isScanning])

  // Scan QR codes
  useEffect(() => {
    if (!isScanning || !videoRef.current || !canvasRef.current || !jsQRAvailable || !jsQRRef.current) {
      console.log('Scan conditions not met:', { isScanning, video: !!videoRef.current, canvas: !!canvasRef.current, jsQRAvailable, jsQR: !!jsQRRef.current })
      return
    }

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { willReadFrequently: true })
    if (!ctx) {
      console.error('Could not get canvas context')
      return
    }

    scanningRef.current = true
    let frameCount = 0

    const scanInterval = setInterval(() => {
      if (!scanningRef.current || !jsQRRef.current) return

      try {
        if (videoRef.current && videoRef.current.readyState === videoRef.current.HAVE_ENOUGH_DATA) {
          canvas.width = videoRef.current.videoWidth
          canvas.height = videoRef.current.videoHeight

          ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height)
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
          const code = jsQRRef.current(imageData.data, imageData.width, imageData.height, {
            inversionAttempts: 'dontInvert',
          })

          frameCount++
          if (frameCount % 10 === 0) {
            console.log(`Scanned ${frameCount} frames, QR code found:`, !!code)
          }

          if (code) {
            console.log('✅ QR Code detected!', code.data)
            scanningRef.current = false
            setIsScanning(false)
            processQRCode(code.data)
          }
        }
      } catch (error) {
        console.error('Scanning error:', error)
      }
    }, 300)

    return () => {
      scanningRef.current = false
      clearInterval(scanInterval)
    }
  }, [isScanning, jsQRAvailable])

  const processQRCode = (qrCode: string) => {
    // Parse QR code (format: deskId or deskId:deskLocation)
    const trimmedCode = qrCode.trim()
    console.log('QR Code scanned:', trimmedCode)
    
    if (!trimmedCode) {
      console.warn('Empty QR code received')
      setScanResult({
        deskId: '',
        timestamp: new Date().toISOString(),
        action: 'sign-in',
        employeeId: 'unknown',
        status: 'error',
        message: 'Invalid QR code - no data found',
      })
      return
    }
    
    const [deskId] = trimmedCode.split(':')
    const cleanDeskId = deskId?.trim()
    
    if (!cleanDeskId) {
      console.warn('No desk ID in QR code:', trimmedCode)
      setScanResult({
        deskId: '',
        timestamp: new Date().toISOString(),
        action: 'sign-in',
        employeeId: 'unknown',
        status: 'error',
        message: 'Invalid QR code - no desk ID found',
      })
      return
    }

    console.log('Processing desk ID:', cleanDeskId)

    // Determine if user is already signed into this desk
    const isSignedIn = userDesks[cleanDeskId] || false
    
    if (isSignedIn) {
      // Sign out - free up the desk
      setUserDesks((prev) => {
        const updated = { ...prev }
        delete updated[cleanDeskId]
        return updated
      })
      
      setScanResult({
        deskId: cleanDeskId,
        timestamp: new Date().toISOString(),
        action: 'sign-out',
        employeeId: 'current-user',
        status: 'success',
        message: 'Successfully signed out',
      })
    } else {
      // Check if desk is occupied (randomly for demo, in production check backend)
      const deskOccupied = Math.random() < 0.1 // 10% chance desk is occupied
      
      if (deskOccupied) {
        setScanResult({
          deskId: cleanDeskId,
          timestamp: new Date().toISOString(),
          action: 'sign-in',
          employeeId: 'unknown',
          status: 'occupied',
          message: 'This desk is currently occupied',
        })
      } else {
        // Sign in - claim the desk
        setUserDesks((prev) => ({
          ...prev,
          [cleanDeskId]: true,
        }))
        
        setScanResult({
          deskId: cleanDeskId,
          timestamp: new Date().toISOString(),
          action: 'sign-in',
          employeeId: 'current-user',
          status: 'success',
          message: 'Successfully signed in',
        })
      }
    }
  }

  const toggleScanning = () => {
    setIsScanning(!isScanning)
    setScanResult(null)
  }

  const getTimeString = () => {
    if (!scanResult) return ''
    return new Date(scanResult.timestamp).toLocaleTimeString()
  }

  return (
    <div className="h-screen">
      {/* Home/Landing Screen */}
      {showHome && (
        <div className="fixed inset-0 bg-background overflow-y-auto flex flex-col items-center justify-center w-full h-full relative">
          {/* Skip Button */}
          <div className="fixed top-6 right-6 z-10">
            <button 
              onClick={() => {
                setShowHome(false)
                setIsScanning(true)
              }}
              className="text-foreground font-semibold hover:text-primary transition-colors"
            >
              Skip
            </button>
          </div>

          {/* Content Container */}
          <div className="w-full h-full max-w-md flex flex-col items-center justify-center px-6 py-8 space-y-8 relative z-10">
            {/* Text Section */}
            <div className="w-full text-left space-y-4">
              <h1 className="text-5xl font-bold text-foreground">
                Return to<br />Office
              </h1>
              <p className="text-base text-muted-foreground leading-relaxed">
                Scan the QR code to sign in and find available desks in real time.
              </p>
            </div>

            {/* Next Button with Progress Indicator */}
            <Button
              onClick={() => {
                setShowHome(false)
                setIsScanning(true)
              }}
              className="w-full rounded-full py-4 px-6 font-semibold flex items-center justify-between group"
              size="lg"
            >
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-primary-foreground" />
                <div className="w-6 h-2 rounded-full bg-primary-foreground" />
                <div className="w-2 h-2 rounded-full bg-primary-foreground" />
              </div>
              <span>Next</span>
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="5" y1="12" x2="19" y2="12" />
                <polyline points="12 5 19 12 12 19" />
              </svg>
            </Button>
          </div>
        </div>
      )}

      {/* Main Scan Screen */}
      {!showHome && currentPage === 'scan' && (
      <div className="fixed inset-0 bg-background overflow-y-auto flex flex-col items-center w-full">
      {/* Top Header Bar */}
      <div className="w-full max-w-md flex items-center justify-between px-4 py-4 border-b border-border">
        <div className="text-xl font-bold">
          <span className="text-foreground">RTO</span><span className="text-primary">Scan</span>
        </div>
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
          <h1 className="text-4xl sm:text-5xl font-bold mb-2">
            <span className="text-primary">Scan</span>
            <span className="text-foreground"> QR Code</span>
          </h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Position the QR code within the frame
          </p>
        </div>

        {/* Scanner View */}
        {isScanning && (
          <div className="w-full aspect-square mb-12 overflow-hidden relative rounded-3xl bg-black shadow-2xl">
            <video
              ref={videoRef}
              className="w-full h-full object-cover"
              playsInline
              autoPlay
              muted
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
                    <IconCheck className="w-4 h-4 text-accent-foreground" />
                    <span className="text-accent-foreground">Success</span>
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
                <span className="font-semibold text-foreground capitalize">{scanResult.action}</span>
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
          <div className="w-full">
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => setScanResult(null)}
                variant="ghost"
                className="w-full h-11 text-sm font-semibold rounded-xl"
              >
                Close
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 flex justify-center bg-card/95 backdrop-blur-sm border-t border-border">
        <div className="w-full max-w-md flex items-center justify-around px-2 py-3 gap-2">
          {/* Home */}
          <button 
            onClick={() => {
              setShowHome(true)
              setIsScanning(false)
            }}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors flex-1">
            <svg className="w-6 h-6" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.5495 2.53189C11.3874 1.82531 12.6126 1.82531 13.4505 2.5319L20.2005 8.224C20.7074 8.65152 21 9.2809 21 9.94406V19.7468C21 20.7133 20.2165 21.4968 19.25 21.4968H15.75C14.7835 21.4968 14 20.7133 14 19.7468V14.2468C14 14.1088 13.8881 13.9968 13.75 13.9968H10.25C10.1119 13.9968 9.99999 14.1088 9.99999 14.2468V19.7468C9.99999 20.7133 9.2165 21.4968 8.25 21.4968H4.75C3.7835 21.4968 3 20.7133 3 19.7468V9.94406C3 9.2809 3.29255 8.65152 3.79952 8.224L10.5495 2.53189ZM12.4835 3.6786C12.2042 3.44307 11.7958 3.44307 11.5165 3.6786L4.76651 9.37071C4.59752 9.51321 4.5 9.72301 4.5 9.94406V19.7468C4.5 19.8849 4.61193 19.9968 4.75 19.9968H8.25C8.38807 19.9968 8.49999 19.8849 8.49999 19.7468V14.2468C8.49999 13.2803 9.2835 12.4968 10.25 12.4968H13.75C14.7165 12.4968 15.5 13.2803 15.5 14.2468V19.7468C15.5 19.8849 15.6119 19.9968 15.75 19.9968H19.25C19.3881 19.9968 19.5 19.8849 19.5 19.7468V9.94406C19.5 9.72301 19.4025 9.51321 19.2335 9.37071L12.4835 3.6786Z" fill="currentColor"/>
            </svg>
            <span className="text-xs font-medium">Home</span>
          </button>

          {/* Scan QR */}
          <button 
            onClick={() => setIsScanning(!isScanning)}
            className={`flex flex-col items-center gap-1 transition-colors flex-1 ${
              isScanning ? 'text-primary' : 'text-muted-foreground hover:text-primary'
            }`}
          >
            <svg className="w-6 h-6" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8 6H6V8H8V6ZM3 5.25C3 4.00736 4.00736 3 5.25 3H8.75C9.99264 3 11 4.00736 11 5.25V8.75C11 9.99264 9.99264 11 8.75 11H5.25C4.00736 11 3 9.99264 3 8.75V5.25ZM5.25 4.5C4.83579 4.5 4.5 4.83579 4.5 5.25V8.75C4.5 9.16421 4.83579 9.5 5.25 9.5H8.75C9.16421 9.5 9.5 9.16421 9.5 8.75V5.25C9.5 4.83579 9.16421 4.5 8.75 4.5H5.25ZM6 16H8V18H6V16ZM3 15.25C3 14.0074 4.00736 13 5.25 13H8.75C9.99264 13 11 14.0074 11 15.25V18.75C11 19.9926 9.99264 21 8.75 21H5.25C4.00736 21 3 19.9926 3 18.75V15.25ZM5.25 14.5C4.83579 14.5 4.5 14.8358 4.5 15.25V18.75C4.5 19.1642 4.83579 19.5 5.25 19.5H8.75C9.16421 19.5 9.5 19.1642 9.5 18.75V15.25C9.5 14.8358 9.16421 14.5 8.75 14.5H5.25ZM18 6H16V8H18V6ZM15.25 3C14.0074 3 13 4.00736 13 5.25V8.75C13 9.99264 14.0074 11 15.25 11H18.75C19.9926 11 21 9.99264 21 8.75V5.25C21 4.00736 19.9926 3 18.75 3H15.25ZM14.5 5.25C14.5 4.83579 14.8358 4.5 15.25 4.5H18.75C19.1642 4.5 19.5 4.83579 19.5 5.25V8.75C19.5 9.16421 19.1642 9.5 18.75 9.5H15.25C14.8358 9.5 14.5 9.16421 14.5 8.75V5.25ZM13 13H15.75V15.75H13V13ZM18.25 15.75H15.75V18.25H13V21H15.75V18.25H18.25V21H21V18.25H18.25V15.75ZM18.25 15.75V13H21V15.75H18.25Z" fill="currentColor"/>
            </svg>
            <span className="text-xs font-medium">Scan QR</span>
          </button>

          {/* History */}
          <button 
            onClick={() => {
              setCurrentPage('history')
              setIsScanning(false)
            }}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors flex-1">
            <svg className="w-6 h-6" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.8711 3.19492C13.2669 3.0671 12.6409 3 12 3C11.3591 3 10.7331 3.0671 10.1289 3.19492C9.72365 3.28065 9.46463 3.67866 9.55035 4.08391C9.63608 4.48915 10.0341 4.74817 10.4393 4.66245C10.9421 4.55609 11.4641 4.5 12 4.5C12.5359 4.5 13.0579 4.55609 13.5607 4.66245C13.9659 4.74817 14.3639 4.48915 14.4496 4.08391C14.5354 3.67866 14.2764 3.28065 13.8711 3.19492ZM8.13488 4.67106C7.90897 4.32388 7.44438 4.22558 7.0972 4.4515C6.7098 4.70359 6.34305 4.98467 6 5.29169V4.25C6 3.83579 5.66421 3.5 5.25 3.5C4.83579 3.5 4.5 3.83579 4.5 4.25V7.25C4.5 7.66421 4.83579 8 5.25 8H8.25C8.66421 8 9 7.66421 9 7.25C9 6.83579 8.66421 6.5 8.25 6.5H6.90093C7.21525 6.20844 7.55458 5.94349 7.91532 5.70874C8.2625 5.48283 8.3608 5.01824 8.13488 4.67106ZM4.5 12V11.25C4.5 10.8358 4.16421 10.5 3.75 10.5C3.33579 10.5 3 10.8358 3 11.25V12C3 12.6409 3.0671 13.2669 3.19492 13.8711C3.28065 14.2764 3.67866 14.5354 4.08391 14.4496C4.48915 14.3639 4.74817 13.9659 4.66245 13.5607C4.55609 13.0579 4.5 12.5359 4.5 12ZM15.8651 4.67106C15.6392 5.01824 15.7375 5.48283 16.0847 5.70874C16.9652 6.28175 17.7182 7.03476 18.2913 7.91532C18.5172 8.2625 18.9818 8.3608 19.3289 8.13488C19.6761 7.90897 19.7744 7.44438 19.5485 7.0972C18.8614 6.04123 17.9588 5.13864 16.9028 4.4515C16.5556 4.22558 16.091 4.32388 15.8651 4.67106ZM19.3376 10.4393C19.2518 10.0341 19.5108 9.63608 19.9161 9.55035C20.3213 9.46463 20.7193 9.72365 20.8051 10.1289C20.9329 10.7331 21 11.3591 21 12C21 12.6409 20.9329 13.2669 20.8051 13.8711C20.7193 14.2764 20.3213 14.5354 19.9161 14.4496C19.5108 14.3639 19.2518 13.9659 19.3376 13.5607C19.4439 13.0579 19.5 12.5359 19.5 12C19.5 11.4641 19.4439 10.9421 19.3376 10.4393ZM4.67106 15.8651C4.32388 16.091 4.22558 16.5556 4.4515 16.9028C5.13864 17.9588 6.04123 18.8614 7.0972 19.5485C7.44438 19.7744 7.90897 19.6761 8.13488 19.3289C8.3608 18.9818 8.2625 18.5172 7.91532 18.2913C7.03476 17.7182 6.28175 16.9652 5.70874 16.0847C5.48283 15.7375 5.01824 15.6392 4.67106 15.8651ZM18.2913 16.0847C18.5172 15.7375 18.9818 15.6392 19.3289 15.8651C19.6761 16.091 19.7744 16.5556 19.5485 16.9028C18.8614 17.9588 17.9588 18.8614 16.9028 19.5485C16.5556 19.7744 16.091 19.6761 15.8651 19.3289C15.6392 18.9818 15.7375 18.5172 16.0847 18.2913C16.9652 17.7182 17.7182 16.9652 18.2913 16.0847ZM14.4496 19.9161C14.3639 19.5108 13.9659 19.2518 13.5607 19.3376C13.0579 19.4439 12.5359 19.5 12 19.5C11.4641 19.5 10.9421 19.4439 10.4393 19.3376C10.0341 19.2518 9.63608 19.5108 9.55035 19.9161C9.46463 20.3213 9.72365 20.7193 10.1289 20.8051C10.7331 20.9329 11.3591 21 12 21C12.6409 21 13.2669 20.9329 13.8711 20.8051C14.2764 20.7193 14.5354 20.3213 14.4496 19.9161Z" fill="currentColor"/>
            </svg>
            <span className="text-xs font-medium">History</span>
          </button>

          {/* FloorMap */}
          <button className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors flex-1">
            <svg className="w-6 h-6" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M9.20337 3.9993L9.25042 3.99805L9.29617 3.99926C9.31861 4.00055 9.34109 4.00288 9.36355 4.00628L9.37963 4.01009C9.46504 4.02381 9.54992 4.05432 9.63082 4.10224L9.68268 4.13578L14.753 7.70105L19.82 4.13913C20.2878 3.81034 20.9215 4.10586 20.9944 4.6482L21.0014 4.75269V15.3852C21.0014 15.5945 20.914 15.7926 20.7632 15.9334L20.6827 15.9988L15.1827 19.8652C14.9158 20.0528 14.5948 20.0371 14.3549 19.8883L9.25002 16.297L4.18035 19.8618C3.71263 20.1906 3.07889 19.8951 3.00595 19.3527L2.99902 19.2483V8.61572C2.99902 8.4064 3.08638 8.20832 3.23714 8.06755L3.3177 8.00216L8.8177 4.13578C8.8817 4.09079 8.94882 4.05749 9.01717 4.03491L9.13964 4.0069L9.20337 3.9993ZM19.5014 6.1967L15.5014 9.00861V17.8076L19.5014 14.9957V6.1967ZM8.49902 6.19335L4.49902 9.00526V17.8042L8.49902 14.9923V6.19335ZM10.0014 6.19335V14.9923L14.0014 17.8042V9.00526L10.0014 6.19335Z" fill="currentColor"/>
            </svg>
            <span className="text-xs font-medium">FloorMap</span>
          </button>
        </div>
      </div>
      </div>
      )}

      {/* Audit History Screen */}
      {!showHome && currentPage === 'history' && (
        <div className="fixed inset-0 bg-background overflow-y-auto flex flex-col items-center w-full">
          {/* Top Header Bar */}
          <div className="w-full max-w-md flex items-center justify-between px-4 py-4 border-b border-border">
            <button 
              onClick={() => {
                setCurrentPage('scan')
                setIsScanning(false)
              }}
              className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
            >
              <IconArrowLeft className="w-5 h-5" />
              <span className="font-semibold">Back</span>
            </button>
            <div className="text-lg font-bold">
              <span className="text-foreground">Scan</span><span className="text-primary">History</span>
            </div>
            <div className="w-8" />
          </div>

          {/* Main Content */}
          <div className="w-full max-w-md flex-1 flex flex-col items-center justify-start px-4 py-8">
            <h1 className="text-3xl font-bold mb-2 text-foreground">Your Scans</h1>
            <p className="text-sm text-muted-foreground mb-6">Track your office attendance</p>
            
            {/* Dummy History Items */}
            <div className="w-full space-y-3">
              {[
                { date: 'Today', desk: 'D-145', time: '09:15 AM', status: 'success' },
                { date: 'Yesterday', desk: 'D-142', time: '08:45 AM', status: 'success' },
                { date: 'Feb 3', desk: 'D-150', time: '10:20 AM', status: 'success' },
                { date: 'Feb 2', desk: 'D-145', time: '09:00 AM', status: 'success' },
                { date: 'Feb 1', desk: 'D-148', time: '08:30 AM', status: 'success' },
              ].map((item, index) => (
                <div key={index} className="bg-card rounded-xl p-4 shadow-sm border border-border hover:border-primary transition-colors">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-semibold text-foreground">{item.date}</span>
                    <span className="text-xs font-medium text-accent-foreground bg-accent px-2 py-1 rounded-full">Checked in</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-card-foreground">Desk {item.desk.split('-')[1]}</p>
                      <p className="text-xs text-muted-foreground">{item.time}</p>
                    </div>
                    <div className="text-xl text-primary">↵</div>
                  </div>
                </div>
              ))}
            </div>

            {/* View More Button */}
            <Button className="w-full mt-6 rounded-full py-3 px-6 font-semibold">
              View All Scans
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
