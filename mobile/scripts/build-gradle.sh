#!/usr/bin/env bash
# build-gradle.sh
# Generates the native Android project with expo prebuild then assembles a
# release APK using Gradle.  The finished APK is copied to apk-output/.
#
# Usage (from mobile/):  npm run build:gradle
#               or:  bash scripts/build-gradle.sh [debug]
#
# Pass "debug" as the first argument to build a debug APK instead.

set -euo pipefail

VARIANT="${1:-release}"
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
MOBILE_DIR="$(cd "${SCRIPT_DIR}/.." && pwd)"
APK_OUTPUT_DIR="${MOBILE_DIR}/apk-output"

cd "${MOBILE_DIR}"

echo "▶ Running expo prebuild --platform android --clean …"
npx expo prebuild --platform android --clean

echo "▶ Building ${VARIANT} APK with Gradle …"
cd android

if [ "${VARIANT}" = "debug" ]; then
  ./gradlew assembleDebug
  APK_SRC="app/build/outputs/apk/debug/app-debug.apk"
  APK_DEST="${APK_OUTPUT_DIR}/astroapp-mvp-debug.apk"
else
  ./gradlew assembleRelease
  APK_SRC="app/build/outputs/apk/release/app-release.apk"
  APK_DEST="${APK_OUTPUT_DIR}/astroapp-mvp-release.apk"
fi

mkdir -p "${APK_OUTPUT_DIR}"
cp "${APK_SRC}" "${APK_DEST}"

echo "✅ APK ready: ${APK_DEST}"
