#!/usr/bin/env bash
set -euo pipefail

manifest="android/app/src/main/AndroidManifest.xml"
icon_source="android-assets/ic_meddz.xml"
icon_target="android/app/src/main/res/drawable/ic_meddz.xml"

test -f "$manifest" || { echo "Android manifest not found: $manifest" >&2; exit 1; }
test -f "$icon_source" || { echo "MED DZ launcher icon not found: $icon_source" >&2; exit 1; }

mkdir -p "$(dirname "$icon_target")"
cp "$icon_source" "$icon_target"

python3 - <<'PY'
from pathlib import Path

manifest = Path("android/app/src/main/AndroidManifest.xml")
content = manifest.read_text(encoding="utf-8")
icon_ref = 'android:icon="@mipmap/ic_launcher"'
round_ref = 'android:roundIcon="@mipmap/ic_launcher_round"'

if icon_ref not in content:
    raise SystemExit("Expected Capacitor launcher icon reference was not found; refusing to silently skip branding.")

content = content.replace(icon_ref, 'android:icon="@drawable/ic_meddz"')
if round_ref in content:
    content = content.replace(round_ref, 'android:roundIcon="@drawable/ic_meddz"')

manifest.write_text(content, encoding="utf-8")
print("MED DZ medical coat + stethoscope launcher icon installed.")
PY
