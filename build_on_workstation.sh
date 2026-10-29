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
cp "$HERE/index.js" "$HERE/App.js" "$HERE/app.json" "$HERE/PluginConfig.json" .
mkdir -p src assets
cp "$HERE"/src/*.js src/
cp "$HERE/assets/icon.png" assets/icon.png
node - <<'JS'
const fs=require('fs');
const p=JSON.parse(fs.readFileSync('package.json','utf8'));
p.name='the-expositor';p.version='0.6.0';
p.dependencies={...p.dependencies,react:'19.0.0','react-native':'0.79.2','sn-plugin-lib':'0.2.3','@react-native-async-storage/async-storage':'2.2.0'};
fs.writeFileSync('package.json',JSON.stringify(p,null,2)+'\n');
JS
npm install --no-audit --no-fund
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
