from PIL import Image,ImageDraw,ImageChops
from pathlib import Path
out=Path('apps/avatar/tracing-templates/long-bangs-v1');N=1254
src=Image.open('/Users/corinne/.codex/generated_images/01a14404-0ca3-79b0-b4c0-cb8bf460aa8c/exec-8f675ed8-eec5-4223-b492-fe496255139b.png').convert('RGBA').resize((N,N),Image.Resampling.LANCZOS)
colors=[(13,19,42),(81,54,42),(48,27,20),(143,104,81)];green=(0,255,0)
pal=Image.new('P',(1,1));pal.putpalette(sum(map(list,colors),[])+list(colors[0])*252)
hair=src.convert('RGB').quantize(palette=pal,dither=Image.Dither.NONE).convert('RGB');alpha=src.getchannel('A').point(lambda v:255 if v>=128 else 0)
# Place the cheek-adjacent interior behind the head; preserve long face-framing locks.
cut=Image.new('L',(N,N));d=ImageDraw.Draw(cut)
d.polygon([(326,760),(338,865),(368,945),(401,1000),(853,1000),(886,945),(916,865),(928,760)],fill=255)
frontmask=ImageChops.subtract(alpha,cut)
front=Image.new('RGB',(N,N),green);front.paste(hair,(0,0),frontmask)
back=Image.new('RGB',(N,N),green);bd=ImageDraw.Draw(back)
bd.polygon([(283,747),(970,747),(970,1012),(283,1012)],fill=colors[2])
# Edges of this hidden overlap sit under the front locks, ears, face and shoulders.
backmask=Image.new('L',(N,N));ImageDraw.Draw(backmask).rectangle((283,747,970,1012),fill=255)
back.save(out/'hair-back.bmp');front.save(out/'hair-front.bmp')
preview=Image.new('RGB',(1500,540),'white');pd=ImageDraw.Draw(preview)
for i,(name,file) in enumerate([('Classic','01-face-neck.png'),('Round','face-neck-round.png'),('Slim','face-neck-slim.png')]):
 base=Image.open(Path('apps/avatar/svg-assets')/file).convert('RGBA').resize((N,N),Image.Resampling.LANCZOS)
 print(name,base.getextrema()[3])
 bg=Image.new('RGB',(N,N),'white');bg.paste(back,(0,0),backmask)
 if base.getextrema()[3]==(255,255):
  bm=base.convert('RGB').convert('L').point(lambda v:0 if v>250 else 255)
 else: bm=base.getchannel('A')
 bg.paste(base.convert('RGB'),(0,0),bm);bg.paste(front,(0,0),frontmask)
 preview.paste(bg.resize((500,500)),(i*500,30));pd.text((i*500+220,10),name,fill='black')
preview.save(out/'placement-preview.png')
for f in ['hair-front.bmp','hair-back.bmp']:
 im=Image.open(out/f);print(f,im.size,len(im.getcolors()))
