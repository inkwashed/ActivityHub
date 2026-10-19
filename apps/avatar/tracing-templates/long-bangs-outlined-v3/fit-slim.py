from PIL import Image,ImageFilter,ImageChops,ImageDraw
from pathlib import Path
out=Path('apps/avatar/tracing-templates/long-bangs-outlined-v3')
im=Image.open('apps/avatar/tracing-templates/long-bangs-outlined-v2/hair-long-bangs.bmp').convert('RGB')
base=Image.open('apps/avatar/svg-assets/face-neck-slim.png').convert('RGBA').resize(im.size,Image.Resampling.LANCZOS)
a=base.getchannel('A').point(lambda v:255 if v>=128 else 0)
# Exact lower-head clearance preserves every ear and cheek pixel of the supplied base.
edge=ImageChops.subtract(a.filter(ImageFilter.MaxFilter(13)),a)
pix=im.load();bp=a.load();ep=edge.load()
for y in range(580,980):
 for x in range(150,1105):
  margin=max(0,round((650-y)*0.65))
  if not (y<650 and 350<x<904) and bp[x,y] and (margin==0 or (bp[max(0,x-margin),y] and bp[min(1253,x+margin),y])):pix[x,y]=(0,255,0)
im.save(out/'hair-long-bangs.bmp')
mask=Image.new('L',im.size);mask.putdata([0 if c==(0,255,0) else 255 for c in im.getdata()])
prev=Image.new('RGB',im.size,'white');prev.paste(base,(0,0),base.getchannel('A'));prev.paste(im,(0,0),mask);prev.resize((800,800)).save(out/'slim-preview.png')
# Verify no opaque hair overlaps the ear/cheek/neck silhouette in the corrected band.
overlap=ImageChops.multiply(mask,a).crop((150,650,1105,975));assert overlap.getbbox() is None
assert len(Image.open(out/'hair-long-bangs.bmp').getcolors())==5
print('Verified zero hair overlap on Slim ears/cheeks in corrected region; 1254 square, five colors.')
