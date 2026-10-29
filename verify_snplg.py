#!/usr/bin/env python3
"""Structural verification; physical Supernote Manta testing still required."""
import sys,json
from pathlib import Path
from zipfile import ZipFile
if len(sys.argv)!=2: sys.exit('Usage: verify_snplg.py <file.snplg>')
p=Path(sys.argv[1]); assert p.suffix=='.snplg' and p.is_file() and p.stat().st_size>100_000, 'Not a compiled plugin'
with ZipFile(p) as z:
    assert z.testzip() is None,'Invalid archive'
    names=z.namelist()
    assert any(x.endswith('PluginConfig.json') for x in names),'PluginConfig missing'
    assert any(x.endswith('.npk') for x in names),'Native executable payload missing'
    assert any(x.endswith('plugin.bundle') for x in names),'JS plugin bundle missing'
    cfg=json.loads(z.read(next(x for x in names if x.endswith('PluginConfig.json'))))
    assert cfg['pluginKey']=='TheExpositor'
    assert cfg['pluginID']=='expsrm2026manta1'
    print('VALIDATED',p.name,p.stat().st_size, 'bytes', 'version',cfg.get('versionName'))
print('On-device installation, storage and lasso behavior: NOT YET VERIFIED.')
