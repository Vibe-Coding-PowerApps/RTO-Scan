# RTO Scan - Developer Reference Card

## 🎯 Quick Commands

```bash
# Start development
npm run dev                    # localhost:5177

# Build for production
npm run build                 # Outputs to dist/

# Check for TypeScript errors
npm run build                 # Includes type checking

# Lint code
npm lint                      # Check code style

# Preview production build
npm run preview               # Test production build locally
```

## 📱 Main Screen UI

```
┌─────────────────────────────┐
│  Return to Office           │ Header
│  Scan desk QR code...       │
├─────────────────────────────┤
│  [Sign In] [Sign Out]       │ Action buttons
├─────────────────────────────┤
│                             │
│      📷 CAMERA VIEW         │ Scanner view
│                             │ (if scanning)
│  [Paste QR code here]       │
│                             │
├─────────────────────────────┤
│ ✓ SUCCESS                   │ Result (if scanned)
│ Desk ID: DESK-001           │
│ Time: 2:45 PM               │
│ Action: Sign In             │
├─────────────────────────────┤
│  [Scan Another Desk]        │ Action button
└─────────────────────────────┘
```

## 🔄 State Flow

```
Component State:
├── isScanning: true/false
├── scanResult: {deskId, timestamp, action, status} | null
├── attendanceStatus: 'in' | 'out' | null
└── jsQRAvailable: true/false

Effects Run When:
├── isScanning changes → Start/stop camera
├── isScanning OR jsQRAvailable changes → QR detection
└── Component mounts → Load jsQR library
```

## 🎨 Key CSS Classes

```css
/* Main container */
min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50
dark:from-slate-900 dark:to-slate-800

/* Button sizing */
h-12 (48px minimum for mobile touch)

/* Card results */
border-green-200 dark:border-green-800 (success)
border-red-200 dark:border-red-800 (failure)

/* Camera overlay */
absolute inset-0 flex items-center justify-center
w-64 h-64 border-2 border-blue-400

/* Grid layout */
flex flex-col gap-3 (vertical stack)
flex-1 (expand to fill space)
```

## 🔧 Key Functions

### `startCamera()`
- Requests camera permissions
- Sets video stream source
- Handles permission errors

### `scanQRCodes()` (effect)
- Runs every 300ms
- Captures video frame
- Detects QR codes with jsQR
- Calls `processQRCode()` on detection

### `processQRCode(qrCode: string)`
- Parses desk ID from QR data
- Creates ScanResult object
- **TODO**: Call backend API here
- Updates UI with result

### `handleManualScan()`
- Triggered on text input change
- Parses manual QR code entry
- Calls `processQRCode()`

## 📤 API Integration Template

```typescript
// In processQRCode() function
const processQRCode = async (qrCode: string) => {
  const [deskId] = qrCode.split(':')
  
  if (!deskId) {
    setScanResult({ /* error */ })
    return
  }

  // Call your API here
  try {
    const response = await fetch('/api/attendance/record', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        deskId,
        action: attendanceStatus,
        employeeId: getCurrentUserId(), // From auth
        timestamp: new Date().toISOString(),
      }),
    })

    const data = await response.json()
    
    const result = {
      deskId,
      timestamp: new Date().toISOString(),
      action: attendanceStatus === 'in' ? 'sign-in' : 'sign-out',
      employeeId: getCurrentUserId(),
      status: response.ok ? 'success' : 'error',
    }
    
    setScanResult(result)
  } catch (error) {
    console.error('API error:', error)
    // Show error to user
  }
}
```

## 🎯 QR Code Format

**Expected QR Content**:
```
DESK-001
or
DESK-001:Floor2-Window
or
any-unique-desk-identifier
```

**Parsing**:
```typescript
const [deskId] = qrCode.split(':')
// Returns: "DESK-001"
```

## 📊 Data Structures

```typescript
interface ScanResult {
  deskId: string           // "DESK-001"
  timestamp: string        // ISO 8601: "2024-02-04T14:30:00Z"
  action: 'sign-in' | 'sign-out'
  employeeId: string       // "emp-123"
  status: 'success' | 'error'
}

// Type aliases
type AttendanceStatus = 'in' | 'out' | null
```

## 🎨 Color Scheme

### Light Mode
```
Background: white (#fff)
Foreground: dark gray (#1a1a1a)
Primary: black (#000)
Success: green (#16a34a)
Error: red (#dc2626)
```

### Dark Mode
```
Background: slate-900 (#0f172a)
Foreground: white (#fff)
Primary: white (#fff)
Success: green (#4ade80)
Error: red (#f87171)
```

## 📱 Responsive Breakpoints

```
Mobile: 320px - 640px (default)
Tablet: 768px - 1024px (same layout)
Desktop: 1024px+ (same layout)

Portrait: Always (locked)
Landscape: Not supported (design)
```

## 🔐 Browser Permissions Required

```
- Camera access (getUserMedia)
- Microphone not needed
- Location not needed
- Storage: localStorage optional
```

## ⚡ Performance Tips

### Do's ✅
- Compress QR codes before scanning
- Use good lighting
- Keep QR codes visible
- Test on actual mobile device
- Use HTTPS in production

### Don'ts ❌
- Don't zoom in too much
- Don't move camera too fast
- Don't use low-quality QR codes
- Don't disable hardware acceleration
- Don't forget error handling

## 🐛 Debug Tips

```javascript
// In console (F12)

// Check if camera working
navigator.mediaDevices.getUserMedia

// Test QR detection
jsQR(imageData.data, width, height)

// Monitor state
console.log({ isScanning, scanResult, attendanceStatus })

// Check refs
videoRef.current
canvasRef.current
jsQRRef.current
```

## 📦 File Paths Reference

| Purpose | Path |
|---------|------|
| Main app | `src/App.tsx` |
| Scan page | `src/app/scan/page.tsx` |
| Styles | `src/styles/globals.css` |
| UI components | `src/ui/*.tsx` |
| Config | `tailwind.config.ts` |
| Build output | `dist/` |
| Dependencies | `node_modules/` |

## 🚀 Deployment Checklist

- [ ] Update API endpoint URL
- [ ] Add user authentication
- [ ] Test on mobile device
- [ ] Verify camera permissions
- [ ] Check error messages
- [ ] Enable HTTPS
- [ ] Test dark mode
- [ ] Run `npm run build`
- [ ] Test production build
- [ ] Deploy to server
- [ ] Test on real device
- [ ] Monitor error logs

## 📞 Important Notes

1. **jsQR Library**: Loaded dynamically, gracefully degrades if not available
2. **Camera Access**: Requires HTTPS in production
3. **Mobile Safari**: Works but needs "Add to Home Screen" for full-screen
4. **API Endpoint**: Currently simulated, needs backend integration
5. **Authentication**: Must be added before production use

## 🔗 Related Files to Know

```
Main entry point:
  src/main.tsx
  
App routing:
  src/App.tsx
  
Main UI file:
  src/app/scan/page.tsx
  
Documentation:
  README_MOBILE.md
  QUICK_START.md
  ARCHITECTURE.md
  
Config files:
  package.json
  tsconfig.json
  tailwind.config.ts
  vite.config.ts
  index.html
```

---

**Print this card and keep it handy!** 📋
