# Mobile QR Scan App - Cleanup Guide

## What Was Removed

The following pages and components are no longer needed for a mobile scan-only app:

### Pages to Remove:
- `src/app/dashboard/` - Dashboard with charts and statistics
- `src/app/workplace-utilization/` - Workplace utilization analytics
- `src/app/schedules/` - Schedule management
- `src/app/team/` - Team member management
- `src/app/resources/library/` - Resource library
- `src/app/reserve-space/` - Desk reservation system

### Components to Remove (if not used elsewhere):
- `src/components/app-sidebar.tsx` - Sidebar navigation (no longer needed for mobile)
- `src/components/site-header.tsx` - Header with navigation menu
- `src/components/nav-main.tsx` - Main navigation
- `src/components/nav-secondary.tsx` - Secondary navigation
- `src/components/nav-documents.tsx` - Document navigation
- `src/components/nav-user.tsx` - User profile navigation
- `src/components/data-table*.tsx` - All data table components
- `src/components/chart-*.tsx` - All chart components
- `src/components/bulk-upload-dialog.tsx` - Bulk upload dialog
- `src/components/add-team-dialog.tsx` - Team management dialog
- `src/components/floor-map-*.tsx` - Floor map visualizations
- `src/components/floor-map-interactive.tsx` - Interactive floor maps
- `src/components/section-cards.tsx` - Section cards layout
- `src/components/date-picker-calendar.tsx` - Calendar date picker

### Dependencies to Remove:
- `@dnd-kit/*` - Drag and drop library
- `@react-three/fiber` - 3D rendering
- `@react-three/drei` - 3D helpers
- `three` - 3D engine
- `recharts` - Charts library
- `@tanstack/react-table` - Data table
- `date-fns` - Date utilities
- `react-day-picker` - Date picker
- `lucide-react` - Icon library
- `vaul` - Drawer library
- `@radix-ui/react-popover` - Popover (not needed)
- `@radix-ui/react-dropdown-menu` - Dropdown (not needed)
- `@radix-ui/react-select` - Select (not needed)
- `@radix-ui/react-tooltip` - Tooltip (not needed)
- `@radix-ui/react-tabs` - Tabs (not needed)
- `@radix-ui/react-toggle` - Toggle (not needed)
- `@radix-ui/react-toggle-group` - Toggle group (not needed)
- `@radix-ui/react-separator` - Separator (not needed)
- `@radix-ui/react-avatar` - Avatar (not needed)
- `@radix-ui/react-checkbox` - Checkbox (not needed)
- `@radix-ui/react-dropdown-menu` - Dropdown menu (not needed)

## What Was Kept

### Core Features:
- QR code scanning with `jsQR` library
- Sign In / Sign Out functionality
- Attendance tracking and display
- Mobile-responsive UI
- Portrait orientation support
- Dark theme support

### UI Components Kept (Minimal):
- `src/ui/button.tsx` - Button component
- `src/ui/card.tsx` - Card component
- `src/ui/dialog.tsx` - Dialog (optional for future notifications)
- `src/ui/alert-dialog.tsx` - Alert dialog (optional)
- `src/ui/sonner.tsx` - Toast notifications

### Styling:
- Tailwind CSS with mobile-first approach
- Dark mode support with next-themes

### Entry Points:
- `src/main.tsx` - App entry point
- `src/App.tsx` - Simplified routing
- `src/app/scan/page.tsx` - Main scan page

## Next Steps

1. Run `npm install` to install the updated dependencies
2. Run `npm run dev` to test the mobile app
3. Build with `npm run build` for production

## Mobile App Features

- **Portrait orientation**: Optimized for vertical phone use
- **Full-screen camera**: Uses entire screen for QR code scanning
- **Quick actions**: Sign In/Out buttons at top
- **Instant feedback**: Success/failure notifications with desk info
- **Manual fallback**: Can paste QR codes manually if camera fails
- **Responsive**: Works on phones, tablets, and web browsers
- **Dark mode**: Easy on the eyes in bright/dim lighting
