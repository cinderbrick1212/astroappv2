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

# Allow callers to skip expo prebuild when the android/ project has already
# been generated (e.g. the CI workflow runs it before setup-java for caching).
if [ "${SKIP_PREBUILD:-false}" != "true" ]; then
  echo "▶ Running expo prebuild --platform android --clean …"
  npx expo prebuild --platform android --clean
fi

echo "▶ Building ${VARIANT} APK with Gradle …"
cd android

if [ "${VARIANT}" = "debug" ]; then
  ./gradlew assembleDebug --build-cache --parallel
  APK_SRC="app/build/outputs/apk/debug/app-debug.apk"
  APK_DEST="${APK_OUTPUT_DIR}/astroapp-mvp-debug.apk"
else
  ./gradlew assembleRelease --build-cache --parallel
  APK_SRC="app/build/outputs/apk/release/app-release.apk"
  APK_DEST="${APK_OUTPUT_DIR}/astroapp-mvp-release.apk"
fi

mkdir -p "${APK_OUTPUT_DIR}"
cp "${APK_SRC}" "${APK_DEST}"

echo "✅ APK ready: ${APK_DEST}"
