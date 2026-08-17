# NADMO AI

Offline-first personal finance app designed for Android via Capacitor.

## Features
- Expense / income with editable categories and wallets
- Automatic wallet balance correction on create/edit/delete
- Wallet-to-wallet transfers excluded from income/expense reports
- Dashboard with real totals and charts
- History search and filters
- Local natural-language NADMO AI transaction draft parser
- CSV / JSON export, database backup and restore
- Data stored locally in IndexedDB by default

## Run locally
```bash
npm install
npm run serve
```

## Build Android
```bash
npm install
npx cap add android
npx cap sync android
cd android
./gradlew assembleDebug
```
Debug APK will be under `android/app/build/outputs/apk/debug/app-debug.apk`.

For release builds, configure Android signing in Gradle/Android Studio.
