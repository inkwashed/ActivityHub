"""Trim quiet boundaries of published mono MP3s; preserve originals and an audit report."""
import hashlib,json,re,subprocess
from pathlib import Path
import numpy as np
import soundfile as sf
import imageio_ffmpeg
ROOT=Path(__file__).resolve().parents[2]
OUT=ROOT/'work/audio/boundary-trim-2026-10-23'
OUT.mkdir(parents=True,exist_ok=True)
manifest_path=ROOT/'assets/audio/manifest.json'
manifest=json.loads(manifest_path.read_text())
by_id={x['id']:x for x in manifest}
library_path=ROOT/'assets/audio/library.js'
library=library_path.read_text()
report=[]
for path in sorted((ROOT/'assets/audio/en-US/heart-070').glob('*.mp3')):
 original=OUT/path.name
 if original.exists(): raise RuntimeError(f'Backup already exists: {original}; refusing a second lossy pass')
 original.write_bytes(path.read_bytes())
 x,sr=sf.read(path)
 if x.ndim!=1: raise RuntimeError(f'Expected mono: {path}')
 # -66 dB peak threshold, more conservative than the sentence player's -60 dB.
 active=np.flatnonzero(np.abs(x)>=.0005)
 if not len(active): raise RuntimeError(f'No audible signal: {path}')
 start=max(0,int(active[0])-round(sr*.035))
 end=min(len(x),int(active[-1])+1+round(sr*.05))
 # Avoid re-encoding for negligible changes.
 changed=(start+len(x)-end)/sr>=.05
 record={'id':path.stem,'originalSeconds':len(x)/sr,'startRemovedSeconds':start/sr if changed else 0,'endRemovedSeconds':(len(x)-end)/sr if changed else 0,'changed':changed,'originalSha256':hashlib.sha256(path.read_bytes()).hexdigest()}
 if changed:
  wav=OUT/(path.stem+'.wav')
  sf.write(wav,x[start:end],sr,subtype='PCM_16')
  subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(),'-v','error','-y','-i',str(wav),'-ar','24000','-ac','1','-codec:a','libmp3lame','-b:a','64k',str(path)],check=True)
  decoded,rate=sf.read(path)
  if abs(len(decoded)/rate-(end-start)/sr)>.06: raise RuntimeError('Unexpected duration')
  digest=hashlib.sha256(path.read_bytes()).hexdigest()
  item=by_id[path.stem]
  item['boundaryTrim']={**record,'thresholdAmplitude':.0005,'leadingMarginSeconds':.035,'trailingMarginSeconds':.05,'backupBatch':OUT.name,'review':'Automated boundary audit; listening review pending'}
  item.update(seconds=round(len(decoded)/rate,3),mp3Bytes=path.stat().st_size,sha256=digest)
  library=re.sub(r'('+re.escape('en-US/heart-070/'+path.name)+r'\?v=)[a-f0-9]+',lambda m:m[1]+digest[:12],library)
 report.append(record)
manifest_path.write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
library_path.write_text(library)
(OUT/'audit.json').write_text(json.dumps(report,indent=2)+'\n')
rows=''.join(f'<tr><td>{r["id"]}</td><td>{r["startRemovedSeconds"]:.3f}s / {r["endRemovedSeconds"]:.3f}s</td><td><audio controls preload="none" src="{r["id"]}.mp3"></audio></td><td><audio controls preload="none" src="../../../assets/audio/en-US/heart-070/{r["id"]}.mp3"></audio></td></tr>' for r in report if r['changed'])
(OUT/'review.html').write_text('<!doctype html><meta charset="utf-8"><title>Audio boundary review</title><style>body{font:16px system-ui;margin:24px}td,th{padding:10px;text-align:left}tr:nth-child(even){background:#eee}</style><h1>Audio boundary review</h1><p>Original files are preserved. Compare beginnings and endings, especially quiet consonants.</p><table><tr><th>Clip</th><th>Removed start / end</th><th>Original</th><th>Trimmed</th></tr>'+rows+'</table>')
print(json.dumps({'audited':len(report),'trimmed':sum(r['changed'] for r in report),'secondsRemoved':round(sum(r['startRemovedSeconds']+r['endRemovedSeconds'] for r in report),2),'review':str(OUT/'review.html')}))
