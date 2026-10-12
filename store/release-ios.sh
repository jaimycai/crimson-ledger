#!/bin/zsh
# Builds the iOS app and uploads it to App Store Connect, without an Xcode login.
#   store/release-ios.sh            build www/, sync iOS, archive, sign and upload
#   store/release-ios.sh --local    the same, but export the .ipa to a folder instead of uploading
# Signing: the Apple Distribution certificate in the login keychain (made 12-10-2026 through the API; its key is in
# ~/.crimson/signing) and the profile "Crimson Ledger App Store" (store/build/ExportOptions-manual.plist).
# Authentication: the App Store Connect API key from ~/.appstoreconnect. xcodebuild reads it with CryptoKit, which
# rejects the original .p8 (it has an extra line after the END marker), so it uses the clean copy in ~/.crimson/signing.
# Nothing secret is in this file: the repository is public.
set -euo pipefail
cd "$(dirname "$0")/.."
KID=$(grep KEY_ID ~/.appstoreconnect/config.txt | cut -d= -f2 | tr -d ' ')
ISS=$(grep ISSUER_ID ~/.appstoreconnect/config.txt | cut -d= -f2 | tr -d ' ')
KEY=~/.crimson/signing/AuthKey_clean.p8
AUTH=(-allowProvisioningUpdates -authenticationKeyPath "$KEY" -authenticationKeyID "$KID" -authenticationKeyIssuerID "$ISS")
OUT=${TMPDIR:-/tmp}/crimson-release
rm -rf "$OUT"; mkdir -p "$OUT"
OPTS=store/build/ExportOptions-manual.plist
if [[ "${1:-}" == "--local" ]]; then sed 's#<string>upload</string>#<string>export</string>#' "$OPTS" > "$OUT/ExportOptions.plist"; OPTS="$OUT/ExportOptions.plist"; fi

node build-www.js
npx cap sync ios
VERSION=$(grep -m1 'MARKETING_VERSION' ios/App/App.xcodeproj/project.pbxproj | tr -dc '0-9.')
BUILD=$(grep -m1 'CURRENT_PROJECT_VERSION' ios/App/App.xcodeproj/project.pbxproj | tr -dc '0-9')
echo "archive $VERSION ($BUILD)"
xcodebuild -workspace ios/App/App.xcworkspace -scheme App -configuration Release -destination 'generic/platform=iOS' \
  -archivePath "$OUT/App.xcarchive" archive "${AUTH[@]}" > "$OUT/archive.log" 2>&1 || { grep -E 'error:' "$OUT/archive.log" | head; exit 1; }
echo "archive ok"
xcodebuild -exportArchive -archivePath "$OUT/App.xcarchive" -exportOptionsPlist "$OPTS" -exportPath "$OUT/export" "${AUTH[@]}" \
  > "$OUT/export.log" 2>&1 || { grep -E 'error' "$OUT/export.log" | head; exit 1; }
grep -E 'EXPORT SUCCEEDED|Upload succeeded|Uploaded' "$OUT/export.log" | tail -2
echo "done: $VERSION ($BUILD); log in $OUT"
