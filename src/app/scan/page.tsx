
// This file is now deprecated. All logic has been split into route-based pages.
export default function ScanPage() {
  return <div>ScanPage is deprecated. Use the new route-based pages.</div>;
}

  // Reset pagination when floor changes to prevent screen jump
  useEffect(() => {
    setFloorPaginationPage(1)
  }, [selectedFloor])

  // Calculate dynamic desksPerPage based on screen size
  useEffect(() => {
    const calculateDesksPerPage = () => {
      const viewportHeight = window.innerHeight
      const viewportWidth = window.innerWidth
      
      // PowerApps screen sizes: 600x768 (mobile), 900x768 (iPad), 1200x768 (desktop), 1366x768 (default)
      // All have 768px height, so we need to be conservative to fit everything
      
      // Fixed elements that must always be visible
      const headerHeight = 60
      const titleHeight = 60
      const statsHeight = 240 // 4 stat cards in 2x2 grid
      const legendHeight = 50
      const paginationHeight = 70 // pagination + spacing
      const navBarHeight = 64 // bottom nav
      const contentPadding = 40
      
      const fixedHeight = headerHeight + titleHeight + statsHeight + legendHeight + paginationHeight + navBarHeight + contentPadding
      const availableHeight = viewportHeight - fixedHeight
      
      // Show 3 rows (9 desks) on all screen sizes for consistency
      const desksCalculated = 9
      
      if (desksCalculated !== desksPerPage) {
        setDesksPerPage(desksCalculated)
        setFloorPaginationPage(1)
      }
    }

    const timer = setTimeout(calculateDesksPerPage, 100)
    
    window.addEventListener('resize', calculateDesksPerPage)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('resize', calculateDesksPerPage)
    }
  }, [])

  // Initialize camera - only starts when scanning is explicitly enabled
  useEffect(() => {
    let stream: MediaStream | null = null

    const startCamera = async () => {
      if (!isScanning) {
        console.log('Scanning not active, camera will not start')
        return
      }

// This file is now deprecated. All logic has been split into route-based pages.
export default function ScanPage() {
  return <div>ScanPage is deprecated. Use the new route-based pages.</div>;
}
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
          <div className="w-full">
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => {
                  setScanResult(null)
                  setIsScanning(true)
                }}
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
              (currentPage === 'scan' && !showHome) ? 'text-primary' : 'text-muted-foreground hover:text-primary'
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
              setCurrentPaginationPage(1)
            }}
            className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary transition-colors flex-1">
            <svg className="w-6 h-6" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M13.8711 3.19492C13.2669 3.0671 12.6409 3 12 3C11.3591 3 10.7331 3.0671 10.1289 3.19492C9.72365 3.28065 9.46463 3.67866 9.55035 4.08391C9.63608 4.48915 10.0341 4.74817 10.4393 4.66245C10.9421 4.55609 11.4641 4.5 12 4.5C12.5359 4.5 13.0579 4.55609 13.5607 4.66245C13.9659 4.74817 14.3639 4.48915 14.4496 4.08391C14.5354 3.67866 14.2764 3.28065 13.8711 3.19492ZM8.13488 4.67106C7.90897 4.32388 7.44438 4.22558 7.0972 4.4515C6.7098 4.70359 6.34305 4.98467 6 5.29169V4.25C6 3.83579 5.66421 3.5 5.25 3.5C4.83579 3.5 4.5 3.83579 4.5 4.25V7.25C4.5 7.66421 4.83579 8 5.25 8H8.25C8.66421 8 9 7.66421 9 7.25C9 6.83579 8.66421 6.5 8.25 6.5H6.90093C7.21525 6.20844 7.55458 5.94349 7.91532 5.70874C8.2625 5.48283 8.3608 5.01824 8.13488 4.67106ZM4.5 12V11.25C4.5 10.8358 4.16421 10.5 3.75 10.5C3.33579 10.5 3 10.8358 3 11.25V12C3 12.6409 3.0671 13.2669 3.19492 13.8711C3.28065 14.2764 3.67866 14.5354 4.08391 14.4496C4.48915 14.3639 4.74817 13.9659 4.66245 13.5607C4.55609 13.0579 4.5 12.5359 4.5 12ZM15.8651 4.67106C15.6392 5.01824 15.7375 5.48283 16.0847 5.70874C16.9652 6.28175 17.7182 7.03476 18.2913 7.91532C18.5172 8.2625 18.9818 8.3608 19.3289 8.13488C19.6761 7.90897 19.7744 7.44438 19.5485 7.0972C18.8614 6.04123 17.9588 5.13864 16.9028 4.4515C16.5556 4.22558 16.091 4.32388 15.8651 4.67106ZM19.3376 10.4393C19.2518 10.0341 19.5108 9.63608 19.9161 9.55035C20.3213 9.46463 20.7193 9.72365 20.8051 10.1289C20.9329 10.7331 21 11.3591 21 12C21 12.6409 20.9329 13.2669 20.8051 13.8711C20.7193 14.2764 20.3213 14.5354 19.9161 14.4496C19.5108 14.3639 19.2518 13.9659 19.3376 13.5607C19.4439 13.0579 19.5 12.5359 19.5 12C19.5 11.4641 19.4439 10.9421 19.3376 10.4393ZM4.67106 15.8651C4.32388 16.091 4.22558 16.5556 4.4515 16.9028C5.13864 17.9588 6.04123 18.8614 7.0972 19.5485C7.44438 19.7744 7.90897 19.6761 8.13488 19.3289C8.3608 18.9818 8.2625 18.5172 7.91532 18.2913C7.03476 17.7182 6.28175 16.9652 5.70874 16.0847C5.48283 15.7375 5.01824 15.6392 4.67106 15.8651ZM18.2913 16.0847C18.5172 15.7375 18.9818 15.6392 19.3289 15.8651C19.6761 16.091 19.7744 16.5556 19.5485 16.9028C18.8614 17.9588 17.9588 18.8614 16.9028 19.5485C16.5556 19.7744 16.091 19.6761 15.8651 19.3289C15.6392 18.9818 15.7375 18.5172 16.0847 18.2913C16.9652 17.7182 17.7182 16.9652 18.2913 16.0847ZM14.4496 19.9161C14.3639 19.5108 13.9659 19.2518 13.5607 19.3376C13.0579 19.4439 12.5359 19.5 12 19.5C11.4641 19.5 10.9421 19.4439 10.4393 19.3376C10.0341 19.2518 9.63608 19.5108 9.55035 19.9161C9.46463 20.3213 9.72365 20.7193 10.1289 20.8051C10.7331 20.9329 11.3591 21 12 21C12.6409 21 13.2669 20.9329 13.8711 20.8051C14.2764 20.7193 14.5354 20.3213 14.4496 19.9161Z" fill="currentColor"/>
            </svg>
            <span className="text-xs font-medium">History</span>
          </button>

          {/* FloorMap */}
          <button 
            onClick={() => {
              setCurrentPage('floormap')
              setIsScanning(false)
            }}
            className={`flex flex-col items-center gap-1 transition-colors flex-1 ${
              (currentPage === 'floormap' && !showHome) ? 'text-primary' : 'text-muted-foreground hover:text-primary'
            }`}
          >
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
        <div className="fixed inset-0 bg-background flex flex-col items-center w-full overflow-hidden">
          {/* Top Header Bar */}
          <div className="w-full max-w-md flex items-center justify-center px-4 py-4 border-b border-border bg-background">
            <div className="text-lg font-bold">
              <span className="text-foreground">History</span>
            </div>
          </div>

          {/* Scrollable Content Area with Fixed Pagination */}
          <div className="w-full max-w-md flex-1 px-4 py-8 flex flex-col items-center justify-between pb-20">
            <div className="w-full flex-1 flex flex-col items-start justify-start">
              <div className="w-full flex items-start justify-between mb-6">
                <div>
                  <h1 className="text-3xl font-bold mb-2 text-foreground">Your Scans</h1>
                  <p className="text-sm text-muted-foreground">Track your office attendance</p>
                </div>
                <Select value={selectedMonth} onValueChange={(value) => {
                  setSelectedMonth(value)
                  setCurrentPaginationPage(1)
                }}>
                  <SelectTrigger className="w-40 h-10 border-border bg-card text-foreground focus:ring-primary">
                    <SelectValue placeholder="Select month" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border" sideOffset={4} align="end">
                    <SelectItem value="all" className="text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer">All Time</SelectItem>
                    <SelectItem value="feb-2026" className="text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer">February 2026</SelectItem>
                    <SelectItem value="jan-2026" className="text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer">January 2026</SelectItem>
                    <SelectItem value="dec-2025" className="text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer">December 2025</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {/* Dummy History Items */}
              <div className="w-full space-y-3 flex-1">
                {[
                  { date: 'Today', month: 'feb-2026', desk: 'D-145', floor: '3', signIn: '09:15 AM', signOut: '05:30 PM', status: 'success' },
                  { date: 'Yesterday', month: 'feb-2026', desk: 'D-142', floor: '2', signIn: '08:45 AM', signOut: '04:45 PM', status: 'success' },
                  { date: 'Feb 3', month: 'feb-2026', desk: 'D-150', floor: '4', signIn: '10:20 AM', signOut: '06:15 PM', status: 'success' },
                  { date: 'Feb 2', month: 'feb-2026', desk: 'D-145', floor: '3', signIn: '09:00 AM', signOut: '05:00 PM', status: 'success' },
                  { date: 'Feb 1', month: 'feb-2026', desk: 'D-148', floor: '2', signIn: '08:30 AM', signOut: '05:45 PM', status: 'success' },
                  { date: 'Jan 31', month: 'jan-2026', desk: 'D-143', floor: '3', signIn: '09:30 AM', signOut: '05:15 PM', status: 'success' },
                  { date: 'Jan 30', month: 'jan-2026', desk: 'D-144', floor: '2', signIn: '08:50 AM', signOut: '04:50 PM', status: 'success' },
                  { date: 'Jan 29', month: 'jan-2026', desk: 'D-149', floor: '4', signIn: '10:00 AM', signOut: '06:00 PM', status: 'success' },
                  { date: 'Jan 28', month: 'jan-2026', desk: 'D-146', floor: '3', signIn: '09:20 AM', signOut: '05:40 PM', status: 'success' },
                  { date: 'Jan 27', month: 'jan-2026', desk: 'D-147', floor: '2', signIn: '08:30 AM', signOut: '05:00 PM', status: 'success' },
                  { date: 'Dec 22', month: 'dec-2025', desk: 'D-145', floor: '3', signIn: '09:00 AM', signOut: '04:30 PM', status: 'success' },
                  { date: 'Dec 21', month: 'dec-2025', desk: 'D-141', floor: '2', signIn: '09:45 AM', signOut: '05:30 PM', status: 'success' },
                  { date: 'Dec 20', month: 'dec-2025', desk: 'D-150', floor: '4', signIn: '10:15 AM', signOut: '06:00 PM', status: 'success' },
                ]
                  .filter(item => selectedMonth === 'all' || item.month === selectedMonth)
                  .slice((currentPaginationPage - 1) * itemsPerPage, currentPaginationPage * itemsPerPage)
                  .map((item, index) => (
                  <div key={index} className="bg-card rounded-xl p-4 shadow-sm border border-border hover:border-primary transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-foreground">{item.date}</span>
                      <span className="text-xs font-medium text-accent-foreground bg-accent px-2 py-1 rounded-full">Completed</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-foreground">Desk {item.desk.split('-')[1]} • Floor {item.floor}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex gap-4">
                          <div>
                            <span className="font-semibold text-foreground">In:</span> {item.signIn}
                          </div>
                          <div>
                            <span className="font-semibold text-foreground">Out:</span> {item.signOut}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Fixed Pagination Controls at Bottom */}
            {(() => {
              const allData = [
                { date: 'Today', month: 'feb-2026', desk: 'D-145', floor: '3', signIn: '09:15 AM', signOut: '05:30 PM', status: 'success' },
                { date: 'Yesterday', month: 'feb-2026', desk: 'D-142', floor: '2', signIn: '08:45 AM', signOut: '04:45 PM', status: 'success' },
                { date: 'Feb 3', month: 'feb-2026', desk: 'D-150', floor: '4', signIn: '10:20 AM', signOut: '06:15 PM', status: 'success' },
                { date: 'Feb 2', month: 'feb-2026', desk: 'D-145', floor: '3', signIn: '09:00 AM', signOut: '05:00 PM', status: 'success' },
                { date: 'Feb 1', month: 'feb-2026', desk: 'D-148', floor: '2', signIn: '08:30 AM', signOut: '05:45 PM', status: 'success' },
                { date: 'Jan 31', month: 'jan-2026', desk: 'D-143', floor: '3', signIn: '09:30 AM', signOut: '05:15 PM', status: 'success' },
                { date: 'Jan 30', month: 'jan-2026', desk: 'D-144', floor: '2', signIn: '08:50 AM', signOut: '04:50 PM', status: 'success' },
                { date: 'Jan 29', month: 'jan-2026', desk: 'D-149', floor: '4', signIn: '10:00 AM', signOut: '06:00 PM', status: 'success' },
                { date: 'Jan 28', month: 'jan-2026', desk: 'D-146', floor: '3', signIn: '09:20 AM', signOut: '05:40 PM', status: 'success' },
                { date: 'Jan 27', month: 'jan-2026', desk: 'D-147', floor: '2', signIn: '08:30 AM', signOut: '05:00 PM', status: 'success' },
                { date: 'Dec 22', month: 'dec-2025', desk: 'D-145', floor: '3', signIn: '09:00 AM', signOut: '04:30 PM', status: 'success' },
                { date: 'Dec 21', month: 'dec-2025', desk: 'D-141', floor: '2', signIn: '09:45 AM', signOut: '05:30 PM', status: 'success' },
                { date: 'Dec 20', month: 'dec-2025', desk: 'D-150', floor: '4', signIn: '10:15 AM', signOut: '06:00 PM', status: 'success' },
              ]
              const filteredData = allData.filter(item => selectedMonth === 'all' || item.month === selectedMonth)
              const totalPages = Math.ceil(filteredData.length / itemsPerPage)
              
              return (
                <div className="w-full flex flex-wrap items-center justify-center gap-2 mt-4 pt-4 border-t border-border px-2">
                  <Button
                    onClick={() => setCurrentPaginationPage(Math.max(1, currentPaginationPage - 1))}
                    variant="outline"
                    className="px-2 sm:px-3 py-1 sm:py-2 h-7 sm:h-8 text-xs whitespace-nowrap"
                    disabled={currentPaginationPage === 1}
                  >
                    ← Prev
                  </Button>
                  <div className="flex items-center gap-1 flex-wrap justify-center">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        onClick={() => setCurrentPaginationPage(page)}
                        className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg transition-colors text-xs font-medium flex items-center justify-center ${
                          currentPaginationPage === page
                            ? 'bg-primary text-primary-foreground'
                            : 'text-foreground hover:bg-card border border-border'
                        }`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
                  <Button
                    onClick={() => setCurrentPaginationPage(Math.min(totalPages, currentPaginationPage + 1))}
                    variant="outline"
                    className="px-2 sm:px-3 py-1 sm:py-2 h-7 sm:h-8 text-xs whitespace-nowrap"
                    disabled={currentPaginationPage === totalPages}
                  >
                    Next →
                  </Button>
                </div>
              )
            })()}
          </div>
        </div>
      )}

      {/* Floor Map Screen */}
      {!showHome && currentPage === 'floormap' && (
        <div className="fixed inset-0 bg-background flex flex-col items-center w-full overflow-hidden">
          {/* Top Header Bar */}
          <div className="w-full max-w-md flex items-center justify-center px-4 py-4 border-b border-border bg-background">
            <div className="text-lg font-bold">
              <span className="text-foreground">Floor Map</span>
            </div>
          </div>

          {/* Content Area - No Scroll */}
          <div className="w-full max-w-md flex-1 px-4 py-6 flex flex-col items-center justify-between pb-20">
            <div className="w-full flex-1 flex flex-col items-center justify-start">
              {/* Header with Floor Selector */}
              <div className="w-full flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-2xl font-bold mb-1 text-foreground">Floor Map</h1>
                  <p className="text-xs text-muted-foreground">View desk availability</p>
                </div>
                <Select value={selectedFloor} onValueChange={(value) => {
                  setSelectedFloor(value)
                  setFloorPaginationPage(1)
                }}>
                  <SelectTrigger className="w-32 h-9 border-border bg-card text-foreground focus:ring-primary text-sm">
                    <SelectValue placeholder="Select floor" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border" sideOffset={4} align="end">
                    <SelectItem value="1" className="text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer">Floor 1</SelectItem>
                    <SelectItem value="2" className="text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer">Floor 2</SelectItem>
                    <SelectItem value="3" className="text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer">Floor 3</SelectItem>
                    <SelectItem value="4" className="text-foreground hover:bg-accent hover:text-accent-foreground cursor-pointer">Floor 4</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Statistics Cards */}
              <div className="w-full grid grid-cols-2 gap-4 mb-8">
                {/* Total Desks */}
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-2">Total Desks</p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-4xl font-bold text-foreground">66</span>
                    <span className="text-xs text-foreground bg-muted px-2 py-1 rounded-full">↗ +8.2%</span>
                  </div>
                  <p className="text-xs text-foreground mb-1">Desk availability increased</p>
                  <p className="text-xs text-muted-foreground">Available on floor</p>
                </div>

                {/* Occupied */}
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-2">Occupied</p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-4xl font-bold text-foreground">49</span>
                    <span className="text-xs text-foreground bg-muted px-2 py-1 rounded-full">↙ -5.1%</span>
                  </div>
                  <p className="text-xs text-foreground mb-1">Moderate desk utilization</p>
                  <p className="text-xs text-muted-foreground">Desks in use</p>
                </div>

                {/* Available */}
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-2">Available</p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-4xl font-bold text-foreground">17</span>
                    <span className="text-xs text-foreground bg-muted px-2 py-1 rounded-full">↗ +12.5%</span>
                  </div>
                  <p className="text-xs text-foreground mb-1">Strong desk availability</p>
                  <p className="text-xs text-muted-foreground">Ready to use</p>
                </div>

                {/* Occupancy Rate */}
                <div className="bg-card border border-border rounded-lg p-4">
                  <p className="text-xs text-muted-foreground mb-2">Occupancy Rate</p>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-4xl font-bold text-foreground">74%</span>
                    <span className="text-xs text-foreground bg-muted px-2 py-1 rounded-full">↗ +3.8%</span>
                  </div>
                  <p className="text-xs text-foreground mb-1">Steady utilization growth</p>
                  <p className="text-xs text-muted-foreground">Floor utilization</p>
                </div>
              </div>

              {/* Desk Grid */}
              <div className="w-full">
                <div className="grid grid-cols-3 gap-2 mb-4">
                  {(() => {
                    const floors: Record<string, Array<{id: string; occupied: boolean}>> = {
                      '1': Array.from({ length: 114 }, (_, i) => ({
                        id: `D-${101 + i}`,
                        occupied: [5, 12, 19, 28, 35, 44, 52, 61, 69, 78, 85, 94, 105].includes(i)
                      })),
                      '2': Array.from({ length: 114 }, (_, i) => ({
                        id: `D-${201 + i}`,
                        occupied: [3, 11, 18, 27, 34, 42, 51, 60, 67, 76, 83, 92, 103].includes(i)
                      })),
                      '3': Array.from({ length: 114 }, (_, i) => ({
                        id: `D-${301 + i}`,
                        occupied: [4, 13, 21, 29, 36, 45, 53, 62, 70, 79, 86, 95, 106].includes(i)
                      })),
                      '4': Array.from({ length: 114 }, (_, i) => ({
                        id: `D-${401 + i}`,
                        occupied: [6, 14, 22, 30, 37, 46, 54, 63, 71, 80, 87, 96, 108].includes(i)
                      })),
                    }

                    const allDesks = floors[selectedFloor] || []
                    const totalPages = Math.ceil(allDesks.length / desksPerPage)
                    const startIdx = (floorPaginationPage - 1) * desksPerPage
                    const paginatedDesks = allDesks.slice(startIdx, startIdx + desksPerPage)

                    return paginatedDesks.map((desk) => (
                      <div
                        key={desk.id}
                        className={`flex flex-col items-center justify-center gap-1 p-2 rounded-lg border-2 transition-all cursor-pointer ${
                          desk.occupied
                            ? 'bg-destructive/15 border-destructive text-destructive hover:bg-destructive/25'
                            : 'bg-accent/15 border-accent text-accent-foreground hover:bg-accent/25'
                        }`}
                      >
                        <span className="text-xs font-semibold">{desk.id.split('-')[1]}</span>
                        <span className={`text-xs ${desk.occupied ? 'text-destructive' : 'text-accent'}`}>
                          {desk.occupied ? '●' : '◯'}
                        </span>
                      </div>
                    ))
                  })()}
                </div>
              </div>
            </div>

            {/* Legend and Pagination - Always Visible */}
            <div className="w-full border-t border-border pt-4">
              {/* Legend */}
              <div className="w-full flex items-center justify-center gap-6 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-accent border border-accent"></div>
                  <span className="text-xs text-foreground">Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-destructive border border-destructive"></div>
                  <span className="text-xs text-foreground">Occupied</span>
                </div>
              </div>

              {/* Pagination */}
              {(() => {
                const floors: Record<string, Array<{id: string; occupied: boolean}>> = {
                  '1': Array(18).fill(null).map((_, i) => ({ id: `D-${101 + i}`, occupied: i % 3 === 1 })),
                  '2': Array(16).fill(null).map((_, i) => ({ id: `D-${201 + i}`, occupied: i % 3 === 1 })),
                  '3': Array(20).fill(null).map((_, i) => ({ id: `D-${301 + i}`, occupied: i % 3 === 1 })),
                  '4': Array(18).fill(null).map((_, i) => ({ id: `D-${401 + i}`, occupied: i % 3 === 1 })),
                }
                const totalDesks = floors[selectedFloor]?.length || 0
                const totalPages = Math.ceil(totalDesks / desksPerPage)

                return (
                  <div className="w-full flex flex-wrap items-center justify-center gap-2 px-2">
                    <Button
                      onClick={() => setFloorPaginationPage(Math.max(1, floorPaginationPage - 1))}
                      variant="outline"
                      className="px-2 sm:px-3 py-1 sm:py-2 h-7 sm:h-8 text-xs whitespace-nowrap"
                      disabled={floorPaginationPage === 1}
                    >
                      ← Prev
                    </Button>
                    <div className="flex items-center gap-1 flex-wrap justify-center">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                        <button
                          key={page}
                          onClick={() => setFloorPaginationPage(page)}
                          className={`w-6 h-6 sm:w-7 sm:h-7 rounded-lg transition-colors text-xs font-medium flex items-center justify-center ${
                            floorPaginationPage === page
                              ? 'bg-primary text-primary-foreground'
                              : 'text-foreground hover:bg-card border border-border'
                          }`}
                        >
                          {page}
                        </button>
                      ))}
                    </div>
                    <Button
                      onClick={() => setFloorPaginationPage(Math.min(totalPages, floorPaginationPage + 1))}
                      variant="outline"
                      className="px-2 sm:px-3 py-1 sm:py-2 h-7 sm:h-8 text-xs whitespace-nowrap"
                      disabled={floorPaginationPage === totalPages}
                    >
                      Next →
                    </Button>
                  </div>
                )
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Schedules Screen */}
      {!showHome && currentPage === 'schedules' && (
        <div className="fixed inset-0 bg-background flex flex-col items-center w-full overflow-hidden">
          {/* Top Header Bar */}
          <div className="w-full max-w-md flex items-center justify-center px-4 py-4 border-b border-border bg-background">
            <div className="text-lg font-bold">
              <span className="text-foreground">Work Schedule</span>
            </div>
          </div>

          {/* Content Area */}
          <div className="w-full max-w-md flex-1 px-4 py-6 flex flex-col items-center justify-start pb-20 overflow-y-auto">
            <div className="w-full">
              <h1 className="text-3xl font-bold mb-2 text-foreground">Select Your Days</h1>
              <p className="text-sm text-muted-foreground mb-6">Tap days to select when you'll be in office</p>

              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6 gap-3">
                <button
                  onClick={() => setCurrentCalendarMonth(new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() - 1, 1))}
                  className="flex-shrink-0 h-10 w-10 p-2 rounded-lg border border-border bg-card hover:bg-accent text-foreground transition-colors flex items-center justify-center"
                  aria-label="Previous month"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="text-center flex-1">
                  <p className="text-lg font-semibold text-foreground">
                    {currentCalendarMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
                <button
                  onClick={() => setCurrentCalendarMonth(new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() + 1, 1))}
                  className="flex-shrink-0 h-10 w-10 p-2 rounded-lg border border-border bg-card hover:bg-accent text-foreground transition-colors flex items-center justify-center"
                  aria-label="Next month"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              {/* Calendar Grid */}
              <div 
                className="bg-card border border-border rounded-lg p-4 mb-6 space-y-3 select-none"
                onTouchStart={(e) => {
                  const touch = e.touches[0];
                  setDragStartX(touch.clientX);
                  setDragStartY(touch.clientY);
                  
                  // Find the button element that was touched
                  let element: HTMLElement | null = e.target as HTMLElement;
                  while (element && element.tagName !== 'BUTTON') {
                    element = element.parentElement;
                  }
                  
                  const dateAttr = element?.getAttribute('data-date');
                  if (dateAttr && element?.tagName === 'BUTTON') {
                    setDragStartDate(dateAttr);
                    setDraggedDates([]);
                  }
                }}
                onTouchMove={(e) => {
                  if (!dragStartDate) return;
                  
                  const touch = e.touches[0];
                  const moveDistance = Math.sqrt(
                    Math.pow(touch.clientX - dragStartX, 2) + 
                    Math.pow(touch.clientY - dragStartY, 2)
                  );
                  
                  // Only start dragging if finger moved more than 15px
                  if (moveDistance < 15) return;
                  
                  setIsDraggingDates(true);
                  
                  // Find the button element under the touch point
                  let element: HTMLElement | null = document.elementFromPoint(touch.clientX, touch.clientY) as HTMLElement;
                  while (element && element.tagName !== 'BUTTON') {
                    element = element.parentElement;
                  }
                  
                  const dateAttr = element?.getAttribute('data-date');
                  
                  if (dateAttr && dragStartDate) {
                    // Parse dates properly from YYYY-MM-DD format
                    const parseDate = (dateStr: string) => {
                      const [year, month, day] = dateStr.split('-').map(Number);
                      return new Date(year, month - 1, day);
                    };
                    
                    const startDate = parseDate(dragStartDate);
                    const currentDate = parseDate(dateAttr);
                    
                    const datesInRange = [];
                    const minDate = startDate <= currentDate ? startDate : currentDate;
                    const maxDate = startDate <= currentDate ? currentDate : startDate;
                    
                    for (let d = new Date(minDate); d <= maxDate; d.setDate(d.getDate() + 1)) {
                      const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
                      datesInRange.push(dateStr);
                    }
                    
                    setDraggedDates(datesInRange);
                  }
                }}
                onTouchEnd={() => {
                  if (isDraggingDates && draggedDates.length > 0) {
                    setSelectedDays(prev => {
                      const updated = new Set(prev);
                      draggedDates.forEach(date => {
                        if (updated.has(date)) {
                          updated.delete(date);
                        } else {
                          updated.add(date);
                        }
                      });
                      return Array.from(updated);
                    });
                  }
                  setIsDraggingDates(false);
                  setDragStartDate(null);
                  setDraggedDates([]);
                }}
              >
                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-1 border-b border-border pb-3">
                  {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map((day) => (
                    <div key={day} className="text-center text-xs font-semibold text-muted-foreground py-2">
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="grid grid-cols-7 gap-1">
                  {(() => {
                    const year = currentCalendarMonth.getFullYear();
                    const month = currentCalendarMonth.getMonth();
                    
                    // Get first day of month and number of days
                    const firstDay = new Date(year, month, 1).getDay();
                    const daysInMonth = new Date(year, month + 1, 0).getDate();
                    const daysInPrevMonth = new Date(year, month, 0).getDate();
                    
                    const days = [];
                    
                    // Previous month's days
                    for (let i = firstDay - 1; i >= 0; i--) {
                      days.push({
                        date: new Date(year, month - 1, daysInPrevMonth - i),
                        isCurrentMonth: false,
                        dateString: `${year}-${String(month).padStart(2, '0')}-${String(daysInPrevMonth - i).padStart(2, '0')}`
                      });
                    }
                    
                    // Current month's days
                    for (let i = 1; i <= daysInMonth; i++) {
                      days.push({
                        date: new Date(year, month, i),
                        isCurrentMonth: true,
                        dateString: `${year}-${String(month + 1).padStart(2, '0')}-${String(i).padStart(2, '0')}`
                      });
                    }
                    
                    // Next month's days
                    const remainingDays = 42 - days.length; // 6 rows * 7 columns
                    for (let i = 1; i <= remainingDays; i++) {
                      days.push({
                        date: new Date(year, month + 1, i),
                        isCurrentMonth: false,
                        dateString: `${year}-${String(month + 2).padStart(2, '0')}-${String(i).padStart(2, '0')}`
                      });
                    }
                    
                    const today = new Date();
                    const todayString = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;
                    
                    return days.map((day) => (
                      <button
                        key={`${month}-${day.dateString}`}
                        data-date={day.dateString}
                        onMouseDown={() => {
                          // Reset drag on mouse down
                          if (isDraggingDates) {
                            setIsDraggingDates(false);
                            setDragStartDate(null);
                            setDraggedDates([]);
                          }
                        }}
                        onClick={() => {
                          // Only allow clicks if we're not in a drag operation
                          if (!day.isCurrentMonth || isDraggingDates) return;
                          setSelectedDays(prev =>
                            prev.includes(day.dateString)
                              ? prev.filter(d => d !== day.dateString)
                              : [...prev, day.dateString]
                          );
                        }}
                        disabled={!day.isCurrentMonth}
                        className={`aspect-square p-1 rounded text-xs font-semibold transition-all flex items-center justify-center ${
                          !day.isCurrentMonth
                            ? 'text-muted-foreground/30 cursor-not-allowed'
                            : selectedDays.includes(day.dateString) || draggedDates.includes(day.dateString)
                            ? 'bg-primary text-primary-foreground font-bold shadow-sm'
                            : day.dateString === todayString
                            ? 'text-foreground border-2 border-primary ring-1 ring-primary/30 hover:bg-accent/50 cursor-pointer'
                            : 'text-foreground hover:bg-accent/50 border border-transparent hover:border-primary/30 cursor-pointer'
                        }`}
                      >
                        {day.date.getDate()}
                      </button>
                    ));
                  })()}
                </div>
              </div>


            </div>
          </div>
        </div>
      )}

      {/* Bottom Navigation Bar - Only on non-home screens */}
      {!showHome && (
        <div className="fixed bottom-0 left-0 right-0 w-full max-w-md mx-auto border-t border-border bg-background">
          <div className="flex items-center justify-around h-16 px-4">
            {/* Home */}
            <button
              onClick={() => {
                setShowHome(true)
                setIsScanning(false)
              }}
              className="flex flex-col items-center gap-1 p-2 rounded-lg transition-colors text-muted-foreground hover:text-primary"
            >
              <svg className="w-5 h-5" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M10.5495 2.53189C11.3874 1.82531 12.6126 1.82531 13.4505 2.5319L20.2005 8.224C20.7074 8.65152 21 9.2809 21 9.94406V19.7468C21 20.7133 20.2165 21.4968 19.25 21.4968H15.75C14.7835 21.4968 14 20.7133 14 19.7468V14.2468C14 14.1088 13.8881 13.9968 13.75 13.9968H10.25C10.1119 13.9968 9.99999 14.1088 9.99999 14.2468V19.7468C9.99999 20.7133 9.2165 21.4968 8.25 21.4968H4.75C3.7835 21.4968 3 20.7133 3 19.7468V9.94406C3 9.2809 3.29255 8.65152 3.79952 8.224L10.5495 2.53189ZM12.4835 3.6786C12.2042 3.44307 11.7958 3.44307 11.5165 3.6786L4.76651 9.37071C4.59752 9.51321 4.5 9.72301 4.5 9.94406V19.7468C4.5 19.8849 4.61193 19.9968 4.75 19.9968H8.25C8.38807 19.9968 8.49999 19.8849 8.49999 19.7468V14.2468C8.49999 13.2803 9.2835 12.4968 10.25 12.4968H13.75C14.7165 12.4968 15.5 13.2803 15.5 14.2468V19.7468C15.5 19.8849 15.6119 19.9968 15.75 19.9968H19.25C19.3881 19.9968 19.5 19.8849 19.5 19.7468V9.94406C19.5 9.72301 19.4025 9.51321 19.2335 9.37071L12.4835 3.6786Z" fill="currentColor"/>
              </svg>
              <span className="text-xs font-medium">Home</span>
            </button>

            {/* Scan QR */}
            <button
              onClick={() => {
                setCurrentPage('scan')
                setIsScanning(true)
              }}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                currentPage === 'scan'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <svg className="w-5 h-5" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8 6H6V8H8V6ZM3 5.25C3 4.00736 4.00736 3 5.25 3H8.75C9.99264 3 11 4.00736 11 5.25V8.75C11 9.99264 9.99264 11 8.75 11H5.25C4.00736 11 3 9.99264 3 8.75V5.25ZM5.25 4.5C4.83579 4.5 4.5 4.83579 4.5 5.25V8.75C4.5 9.16421 4.83579 9.5 5.25 9.5H8.75C9.16421 9.5 9.5 9.16421 9.5 8.75V5.25C9.5 4.83579 9.16421 4.5 8.75 4.5H5.25ZM6 16H8V18H6V16ZM3 15.25C3 14.0074 4.00736 13 5.25 13H8.75C9.99264 13 11 14.0074 11 15.25V18.75C11 19.9926 9.99264 21 8.75 21H5.25C4.00736 21 3 19.9926 3 18.75V15.25ZM5.25 14.5C4.83579 14.5 4.5 14.8358 4.5 15.25V18.75C4.5 19.1642 4.83579 19.5 5.25 19.5H8.75C9.16421 19.5 9.5 19.1642 9.5 18.75V15.25C9.5 14.8358 9.16421 14.5 8.75 14.5H5.25ZM18 6H16V8H18V6ZM15.25 3C14.0074 3 13 4.00736 13 5.25V8.75C13 9.99264 14.0074 11 15.25 11H18.75C19.9926 11 21 9.99264 21 8.75V5.25C21 4.00736 19.9926 3 18.75 3H15.25ZM14.5 5.25C14.5 4.83579 14.8358 4.5 15.25 4.5H18.75C19.1642 4.5 19.5 4.83579 19.5 5.25V8.75C19.5 9.16421 19.1642 9.5 18.75 9.5H15.25C14.8358 9.5 14.5 9.16421 14.5 8.75V5.25ZM13 13H15.75V15.75H13V13ZM18.25 15.75H15.75V18.25H13V21H15.75V18.25H18.25V21H21V18.25H18.25V15.75ZM18.25 15.75V13H21V15.75H18.25Z" fill="currentColor"/>
              </svg>
              <span className="text-xs font-medium">Scan QR</span>
            </button>

            {/* History */}
            <button
              onClick={() => {
                setCurrentPage('history')
                setIsScanning(false)
                setCurrentPaginationPage(1)
              }}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                currentPage === 'history'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <svg className="w-5 h-5" width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.8711 3.19492C13.2669 3.0671 12.6409 3 12 3C11.3591 3 10.7331 3.0671 10.1289 3.19492C9.72365 3.28065 9.46463 3.67866 9.55035 4.08391C9.63608 4.48915 10.0341 4.74817 10.4393 4.66245C10.9421 4.55609 11.4641 4.5 12 4.5C12.5359 4.5 13.0579 4.55609 13.5607 4.66245C13.9659 4.74817 14.3639 4.48915 14.4496 4.08391C14.5354 3.67866 14.2764 3.28065 13.8711 3.19492ZM8.13488 4.67106C7.90897 4.32388 7.44438 4.22558 7.0972 4.4515C6.7098 4.70359 6.34305 4.98467 6 5.29169V4.25C6 3.83579 5.66421 3.5 5.25 3.5C4.83579 3.5 4.5 3.83579 4.5 4.25V7.25C4.5 7.66421 4.83579 8 5.25 8H8.25C8.66421 8 9 7.66421 9 7.25C9 6.83579 8.66421 6.5 8.25 6.5H6.90093C7.21525 6.20844 7.55458 5.94349 7.91532 5.70874C8.2625 5.48283 8.3608 5.01824 8.13488 4.67106ZM4.5 12V11.25C4.5 10.8358 4.16421 10.5 3.75 10.5C3.33579 10.5 3 10.8358 3 11.25V12C3 12.6409 3.0671 13.2669 3.19492 13.8711C3.28065 14.2764 3.67866 14.5354 4.08391 14.4496C4.48915 14.3639 4.74817 13.9659 4.66245 13.5607C4.55609 13.0579 4.5 12.5359 4.5 12ZM15.8651 4.67106C15.6392 5.01824 15.7375 5.48283 16.0847 5.70874C16.9652 6.28175 17.7182 7.03476 18.2913 7.91532C18.5172 8.2625 18.9818 8.3608 19.3289 8.13488C19.6761 7.90897 19.7744 7.44438 19.5485 7.0972C18.8614 6.04123 17.9588 5.13864 16.9028 4.4515C16.5556 4.22558 16.091 4.32388 15.8651 4.67106ZM19.3376 10.4393C19.2518 10.0341 19.5108 9.63608 19.9161 9.55035C20.3213 9.46463 20.7193 9.72365 20.8051 10.1289C20.9329 10.7331 21 11.3591 21 12C21 12.6409 20.9329 13.2669 20.8051 13.8711C20.7193 14.2764 20.3213 14.5354 19.9161 14.4496C19.5108 14.3639 19.2518 13.9659 19.3376 13.5607C19.4439 13.0579 19.5 12.5359 19.5 12C19.5 11.4641 19.4439 10.9421 19.3376 10.4393ZM4.67106 15.8651C4.32388 16.091 4.22558 16.5556 4.4515 16.9028C5.13864 17.9588 6.04123 18.8614 7.0972 19.5485C7.44438 19.7744 7.90897 19.6761 8.13488 19.3289C8.3608 18.9818 8.2625 18.5172 7.91532 18.2913C7.03476 17.7182 6.28175 16.9652 5.70874 16.0847C5.48283 15.7375 5.01824 15.6392 4.67106 15.8651ZM18.2913 16.0847C18.5172 15.7375 18.9818 15.6392 19.3289 15.8651C19.6761 16.091 19.7744 16.5556 19.5485 16.9028C18.8614 17.9588 17.9588 18.8614 16.9028 19.5485C16.5556 19.7744 16.091 19.6761 15.8651 19.3289C15.6392 18.9818 15.7375 18.5172 16.0847 18.2913C16.9652 17.7182 17.7182 16.9652 18.2913 16.0847ZM14.4496 19.9161C14.3639 19.5108 13.9659 19.2518 13.5607 19.3376C13.0579 19.4439 12.5359 19.5 12 19.5C11.4641 19.5 10.9421 19.4439 10.4393 19.3376C10.0341 19.2518 9.63608 19.5108 9.55035 19.9161C9.46463 20.3213 9.72365 20.7193 10.1289 20.8051C10.7331 20.9329 11.3591 21 12 21C12.6409 21 13.2669 20.9329 13.8711 20.8051C14.2764 20.7193 14.5354 20.3213 14.4496 19.9161Z" fill="currentColor"/>
              </svg>
              <span className="text-xs font-medium">History</span>
            </button>

            {/* Floor Map */}
            <button
              onClick={() => {
                setCurrentPage('floormap')
                setIsScanning(false)
              }}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                currentPage === 'floormap'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="9" y1="3" x2="9" y2="21" />
                <line x1="15" y1="3" x2="15" y2="21" />
                <line x1="3" y1="9" x2="21" y2="9" />
                <line x1="3" y1="15" x2="21" y2="15" />
              </svg>
              <span className="text-xs font-medium">Floor Map</span>
            </button>

            {/* Schedules */}
            <button
              onClick={() => {
                setCurrentPage('schedules')
                setIsScanning(false)
              }}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg transition-colors ${
                currentPage === 'schedules'
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-primary'
              }`}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
              </svg>
              <span className="text-xs font-medium">Schedule</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
