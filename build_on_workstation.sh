#!/usr/bin/env bash
set -euo pipefail
HERE="$(cd "$(dirname "$0")" && pwd)"
BASE="${1:-$HERE/../the-expositor-native-build}"
mkdir -p "$BASE"
cd "$BASE"
if [ -e TheExpositor ]; then echo 'Build destination already exists. Choose an empty directory.' >&2; exit 1; fi
command -v node >/dev/null || { echo 'Node.js is required' >&2; exit 1; }
command -v java >/dev/null || { echo 'JDK 21 is required' >&2; exit 1; }
if [ -z "${ANDROID_HOME:-}" ] && [ -z "${ANDROID_SDK_ROOT:-}" ]; then echo 'Set ANDROID_HOME or ANDROID_SDK_ROOT' >&2; exit 1; fi
npx --yes @react-native-community/cli@18.0.0 init TheExpositor --template @supernote-plugin/sn-plugin-template --version 0.79.2
cd TheExpositor
rm -f App.tsx
cp "$HERE/index.js" "$HERE/App.js" "$HERE/app.json" "$HERE/PluginConfig.json" .
mkdir -p src assets
cp "$HERE"/src/*.js src/
cp "$HERE/assets/icon.png" assets/icon.png
node - <<'JS'
const fs=require('fs');
const p=JSON.parse(fs.readFileSync('package.json','utf8'));
p.name='the-expositor';p.version='1.0.0';
p.dependencies={...p.dependencies,react:'19.0.0','react-native':'0.79.2','sn-plugin-lib':'0.2.3','@react-native-async-storage/async-storage':'2.2.0'};
fs.writeFileSync('package.json',JSON.stringify(p,null,2)+'\n');
JS
npm install --no-audit --no-fund
# Supernote's build template excludes the entire @react-native* namespace
# from native-module detection. That accidentally skips @react-native-async-storage.
# Narrow the exclusion to @react-native/ (official modules only).
python3 - <<'PY'
from pathlib import Path
p=Path('buildPlugin.sh')
s=p.read_text()
old='[[ "$lower" == @react-native* ]] && return 0'
new='[[ "$lower" == @react-native/* ]] && return 0'
if old not in s:
    raise SystemExit('Supernote build script has changed; inspect native module scan before proceeding.')
p.write_text(s.replace(old,new,1))
print('Native module scanner patched to include @react-native-async-storage.')
PY
chmod +x buildPlugin.sh android/gradlew
rm -rf build/generated build/outputs
./buildPlugin.sh
./buildPlugin.sh
shopt -s nullglob
files=(build/outputs/*.snplg)
if (( ${#files[@]} == 0 )); then echo 'ERROR: No compiled installer' >&2; exit 1; fi
for f in "${files[@]}"; do
  python3 "$HERE/verify_snplg.py" "$f"
  echo "INSTALLER: $PWD/$f"
done
