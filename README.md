# Quantum Calculator - Android Mobile App

A unique Android calculator app built with Ionic/Angular and Capacitor, featuring a 4-step workflow with cloud synchronization via Supabase.

## Features

### 🎥 Tab 1: Thinking Face Camera
- Prompt: "Give us your best thinking face!"
- Capture a photo using device camera
- Save photo locally for later use
- Clear and retake photos as needed

### 🧮 Tab 2: Calculator
- Full calculator interface with digits 0-9
- Operations: +, -, *, /
- Clear button for fresh start
- Expression display before calculation
- Results are processed through the loading screen

### ⏳ Tab 3: Loading Bar (Processing)
- Shows thinking face photo if captured
- Animated progress bar (30-60 seconds)
- Rotating motivational messages
- Automatic navigation to results

### 📊 Tab 4: Results & History
- Display latest calculation result
- Result includes ±1% random inaccuracy
- Full calculation history (local + cloud)
- Modal view for browsing all calculations
- Clear history option
- Quick navigation buttons to Camera and Calculator
- Fallback message when no calculations exist

## Architecture

### Services
- **StorageService**: Manages image storage, calculation history, and Supabase sync
- **CalculatorService**: Handles expression parsing and calculation logic

### Tabs Navigation
- Bottom navigation shows: Camera | Calculator | Result
- Tab 3 (Loading) is modal - triggered after calculation, not directly accessible

### Data Storage
- **Local**: IndexedDB and localStorage for offline support
- **Cloud**: Supabase PostgreSQL database for global history

## Prerequisites

- Node.js 16+ and npm
- Android SDK (for building APK)
- A Supabase account (free tier available)

## Installation

1. Clone repository
2. Install dependencies:
   ```bash
   npm install
   ```

## Development

### Run Development Server
```bash
ionic serve
```
Opens at `http://localhost:8101`

### Build npm Production
```bash
npm run build
```

### Build Android APK
```bash
ionic build
npx cap sync android
```

### Set up Emulator

1. Start emulator
```bash
    cd ~\AppData\Local\Android\Sdk\emulator\

    .\emulator.exe -list-avds

    .\emulator.exe -avd {Emulator_Name}
```

2. Deploy app on emulator
```bash
    npx cap run android
```
    Select emulator

## How to use

**Tab 1 - Camera:**
1. Click "Take Photo" button
2. Take Picture
3. Photo displays in the card
4. Click "Go to Calculator"

**Tab 2 - Calculator:**
1. Click digit buttons to build expression (e.g., "5+3")
2. See expression update in display card
3. Click "=" to calculate
4. App auto-navigates to loading screen

**Tab 3 - Loading Bar:**
1. Shows your photo (if taken)
2. Progress bar animates for 30-60 seconds
3. Messages rotate: "Processing...", "Analyzing...", etc.
4. Auto-navigates to results when complete

**Tab 4 - Results:**
1. Shows your calculation result
2. Result includes ±1% inaccuracy
3. Click "View History" for all previous calculations
4. Click "New Calculation" or "Take Photo" to continue

## License

MIT
