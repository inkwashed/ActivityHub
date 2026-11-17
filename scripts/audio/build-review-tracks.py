"""Compile pending clips into ordinary MP3 review tracks and timestamp notes."""
import argparse, json, subprocess, tempfile
from pathlib import Path
import numpy as np
import soundfile as sf
import imageio_ffmpeg
p=argparse.ArgumentParser();p.add_argument('folder',type=Path);args=p.parse_args();folder=args.folder.resolve()
records=json.loads((folder/'manifest.json').read_text());rate=24000;gap=np.zeros(round(rate*.65),dtype=np.float32)
notes=['PENDING AUDIO REVIEW — Heart 0.7x','Each track plays individual draft recordings, separated by 0.65 seconds.','Timestamps are approximate; report the clip ID if anything sounds wrong.','These recordings have not been enabled in student apps.','']
for app,title,filename in [('my-town','My Town','my-town-review.mp3'),('paper-craft','Shape Builder','shape-builder-review.mp3')]:
 selected=[r for r in records if app in r['apps']];chunks=[np.zeros(round(rate*.3),dtype=np.float32)];elapsed=.3;notes += [title+' — '+filename,'']
 for i,r in enumerate(selected,1):
  audio,sr=sf.read(folder/(r['id']+'.mp3'),dtype='float32');assert sr==rate and audio.ndim==1
  timestamp=f'{int(elapsed//60):02d}:{elapsed%60:04.1f}'
  notes.append(f'{timestamp}  {i:02d}. {r["text"]}  [{r["id"]}]');chunks.extend([audio,gap]);elapsed+=len(audio)/rate+.65
 with tempfile.TemporaryDirectory(prefix='audio-review-') as temp:
  wav=Path(temp)/'track.wav';sf.write(wav,np.concatenate(chunks),rate,subtype='PCM_16')
  subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(),'-v','error','-y','-i',str(wav),'-ac','1','-ar',str(rate),'-codec:a','libmp3lame','-b:a','64k','-metadata','title='+title+' — pending audio review','-metadata',"artist=Let's EiGo!",str(folder/filename)],check=True)
 notes += [''];print(f'{filename}: {len(selected)} clips, {elapsed/60:.1f} minutes')
(folder/'audio-review-timestamps.txt').write_text('\n'.join(notes)+'\n')
