"""Generate review-only Kokoro WAV/MP3 clips; never publish automatically."""
import argparse, json, os, subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parents[2]
os.environ.setdefault('HF_HOME',str(ROOT/'work/audio/model-cache'))
os.environ.setdefault('HF_HUB_DISABLE_TELEMETRY','1')
p=argparse.ArgumentParser()
p.add_argument('--ids',nargs='*',help='Clip ids; omit for the full catalogue')
p.add_argument('--batch',default='heart-070')
p.add_argument('--catalog',type=Path,default=ROOT/'assets/audio/catalog.json',help='Optional review-only catalog; does not modify the approved library')
p.add_argument('--lead-in', action='store_true', help='Generate Listen: before the target and trim at model word timestamps')
a=p.parse_args()
if Path(a.batch).name != a.batch: p.error('batch must be a directory name')
catalog=json.loads(a.catalog.read_text())
clips=[c for c in catalog['clips'] if not a.ids or c['id'] in a.ids]
if a.ids and set(a.ids)-{c['id'] for c in clips}: p.error('Unknown clip id')
if any(c.get('endBeforeWord') for c in clips) and not a.lead_in:
    p.error('Contextual question prefixes require --lead-in for word-timed extraction')
import numpy as np
import soundfile as sf
import imageio_ffmpeg
from kokoro import KPipeline
out=ROOT/'work/audio'/a.batch
out.mkdir(parents=True,exist_ok=True)
pipeline=KPipeline(lang_code='a',repo_id='hexgrad/Kokoro-82M',device='cpu')
import importlib.metadata
(out/'versions.json').write_text(json.dumps({name:importlib.metadata.version(name) for name in ['kokoro','misaki','torch','transformers','soundfile','imageio-ffmpeg']},indent=2)+'\n')
records=[]
(out/'generation-settings.json').write_text(json.dumps({'model':'hexgrad/Kokoro-82M','voice':catalog['voice'],'speed':catalog['speed'],'leadIn':a.lead_in,'sampleRate':catalog['sampleRate']},indent=2)+'\n')
for clip in clips:
    wav=out/(clip['id']+'.wav'); mp3=wav.with_suffix('.mp3')
    if wav.exists() or mp3.exists(): raise RuntimeError(f'Refusing to overwrite {wav}; choose a new --batch')
    prompt = ('Listen: ' if a.lead_in else '') + clip['prompt']
    results=list(pipeline(prompt,voice=catalog['voice'],speed=catalog['speed']))
    audio=np.concatenate([r.audio.numpy() for r in results])
    if not len(audio) or not np.isfinite(audio).all(): raise RuntimeError(f'Invalid audio: {clip["id"]}')
    trim_seconds = 0
    trim_end_seconds = None
    if a.lead_in:
        if len(results) != 1: raise RuntimeError('Lead-in must be generated with the target in one segment')
        tokens = results[0].tokens
        colon = next(i for i, token in enumerate(tokens) if ':' in token.text)
        target = next(token for token in tokens[colon+1:] if token.phonemes and token.start_ts is not None)
        # Keep a short safety margin before the first target consonant.
        trim_seconds = max(0, target.start_ts - .08)
        sf.write(out/(clip['id']+'-untrimmed.wav'),audio,catalog['sampleRate'],subtype='PCM_16')
        if clip.get('endBeforeWord'):
            boundary = next(token for token in tokens[colon+1:] if token.text.lower() == clip['endBeforeWord'].lower() and token.start_ts is not None)
            trim_end_seconds = boundary.start_ts - .015
            if trim_end_seconds <= trim_seconds: raise RuntimeError('Invalid prefix boundary')
        end_sample = round(trim_end_seconds*catalog['sampleRate']) if trim_end_seconds is not None else None
        audio=audio[round(trim_seconds*catalog['sampleRate']):end_sample]
    sf.write(wav,audio,catalog['sampleRate'],subtype='PCM_16')
    subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(),'-v','error','-i',str(wav),'-ac','1','-ar','24000','-codec:a','libmp3lame','-b:a','64k',str(mp3)],check=True)
    record={**clip,'generationPrompt':prompt,'trimSeconds':trim_seconds,'voice':catalog['voice'],'speed':catalog['speed'],'phonemes':[r.phonemes for r in results],'seconds':round(len(audio)/24000,3),'mp3Bytes':mp3.stat().st_size,'review':'pending'}
    if trim_end_seconds is not None: record['trimEndSeconds'] = trim_end_seconds
    records.append(record)
    (out/'manifest.json').write_text(json.dumps(records,indent=2)+'\n')
    print(f'{clip["id"]}: {record["seconds"]}s, {record["mp3Bytes"]} bytes',flush=True)
# A local, dependency-free audition sheet.
import html
cards=''.join(f'<article><h2>{html.escape(r["text"])}</h2><audio controls preload="none" src="{r["id"]}.mp3"></audio><p>{r["seconds"]} seconds</p></article>' for r in records)
(out/'review.html').write_text('<!doctype html><meta charset="utf-8"><title>Let’s EiGo! audio review</title><style>body{font:18px system-ui;background:#f8f6ed;color:#244438;max-width:760px;margin:40px auto;padding:20px}article{padding:12px 20px;background:white;border-radius:16px;margin:16px 0}h2{font-size:20px}audio{width:100%}</style><h1>Heart · 0.7×</h1><p>Review pronunciation, starting sounds, pace, and endings before publishing.</p>'+cards)
