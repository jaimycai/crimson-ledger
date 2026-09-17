#!/bin/sh
# Xcode Cloud draait dit vlak na het klonen van de repo.
#
# In de repo staan geen www/ en geen ios/App/Pods/; die worden gegenereerd en
# staan daarom in .gitignore. Op een eigen Mac maakt `npm run ios` ze aan, maar
# de machine van Xcode Cloud begint met een kale kloon. Zonder dit script
# struikelt de build over Pods-App.release.xcconfig en zou een geslaagde build
# een app zonder spelbestanden opleveren.
set -e

echo "── Node ──────────────────────────────────────────────"
if ! command -v node > /dev/null 2>&1; then
  HOMEBREW_NO_AUTO_UPDATE=1 brew install node
fi
node --version

echo "── Webbestanden bouwen ───────────────────────────────"
cd "$CI_PRIMARY_REPOSITORY_PATH"
npm install --no-audit --no-fund
npm run build

echo "── CocoaPods ─────────────────────────────────────────"
if ! command -v pod > /dev/null 2>&1; then
  HOMEBREW_NO_AUTO_UPDATE=1 brew install cocoapods
fi

echo "── Capacitor synchroniseren ──────────────────────────"
npx cap sync ios

echo "── Pods installeren ──────────────────────────────────"
cd "$CI_PRIMARY_REPOSITORY_PATH/ios/App"
pod install

echo "── Klaar ─────────────────────────────────────────────"
ls -d Pods/Target\ Support\ Files/Pods-App > /dev/null && echo "Pods staan klaar"
ls -d App/public > /dev/null && echo "webbestanden staan klaar"
