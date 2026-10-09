# Panchapakshi - Android app (Capacitor), Tamil only

The Tamil Panchapakshi web app in `www/` is already wrapped as a native Android project in `android/` (app id `com.panchapakshi.app`, with launcher icon). Everything runs on the phone: no server, no account.

NOTE: the APK itself has not been compiled yet. The project was generated and the data tests pass, but compiling needs the Android SDK, which was not available where this was prepared.

## Easiest: get the APK built for you (no Android Studio)
1. Create a new empty repository on github.com (e.g. `panchapakshi`).
2. Upload everything in this folder (including the hidden `.github` folder) to the `main` branch.
3. Open the repository's **Actions** tab -> **Build Android APK** -> wait about 5-8 minutes.
4. Open the finished run and download the **panchapakshi-debug-apk** artifact (a zip containing `app-debug.apk`).
5. Copy `app-debug.apk` to your phone and open it. Allow "install unknown apps" for your file manager/browser when asked.

The debug APK is for your own use. For the Play Store you need a signed release build (AAB) - see below.

## Or build locally (Node 22, JDK 21, Android Studio)
    npm install
    npm test
    npx cap sync android
    npx cap open android      # Run on a connected phone, or Build > Build APK(s)
Command line: `cd android && ./gradlew assembleDebug` -> `android/app/build/outputs/apk/debug/app-debug.apk`

## Play Store
Change `appId` in `capacitor.config.json` and in `android/app/build.gradle` (applicationId/namespace) before the first upload, then in Android Studio use Build > Generate Signed Bundle (AAB).

## iPhone
Needs a Mac with Xcode: `npm install @capacitor/ios && npx cap add ios && npx cap sync && npx cap open ios`.

## After editing the web app
Edit files in `www/`, then run `npx cap sync android` (the GitHub workflow does this automatically).

## Data and limits
Tables come from web texts listed in the app's "கணிப்பு முறை" tab; compare with your own guru/text and edit `TB`, `NW`, `NK` in `www/core.js` if they differ. Sub-periods (அந்தரம்) are not included because no verified durations were available. Sunrise/sunset: NOAA formula (about +/-1-2 min).
