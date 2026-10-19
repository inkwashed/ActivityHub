from PIL import Image, ImageFilter, ImageDraw
from pathlib import Path
out=Path('/Users/corinne/Documents/GitHub/ActivityHub/apps/avatar/tracing-templates/short-center-part-v2')
src=Image.open('/Users/corinne/.codex/generated_images/01a14404-0ca3-79b0-b4c0-cb8bf460aa8c/exec-7104ea51-222f-4699-a672-c20562b68042.png').convert('RGBA')
colors=[(16,24,45),(101,70,52),(64,44,36),(166,117,83),(255,255,255)]
pal=Image.new('P',(1,1));pal.putpalette(sum(map(list,colors),[])+[255,255,255]*251)
mask=src.getchannel('A').point(lambda v:255 if v>=128 else 0)
box=mask.getbbox()
rgb=src.convert('RGB').filter(ImageFilter.MedianFilter(3))
q=rgb.quantize(palette=pal,dither=Image.Dither.NONE).filter(ImageFilter.ModeFilter(3))
# Smooth each color region and remove narrow noisy protrusions before island cleanup.
for index in range(4):
 region=q.point(lambda v:255 if v==index else 0).convert('L')
 region=region.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(3))
 region=region.filter(ImageFilter.GaussianBlur(0.8)).point(lambda v:255 if v>=128 else 0)
 q.paste(index,(0,0,q.width,q.height),region)
# Remove tiny isolated color islands at native resolution; preserve larger intentional locks.
w,h=q.size; data=bytearray(q.tobytes()); seen=bytearray(w*h); removed=0
for start in range(w*h):
 if seen[start]: continue
 color=data[start];seen[start]=1;stack=[start];comp=[];border={}
 while stack:
  p=stack.pop();comp.append(p);x=p%w
  for n in ((p-1 if x else -1),(p+1 if x<w-1 else -1),p-w,p+w):
   if n<0 or n>=w*h:continue
   if data[n]==color:
    if not seen[n]:seen[n]=1;stack.append(n)
   else:border[data[n]]=border.get(data[n],0)+1
 if len(comp)<1000 and border:
  replacement=max(border,key=border.get)
  for p in comp:data[p]=replacement
  removed+=1
q=Image.frombytes('P',(w,h),bytes(data));q.putpalette(pal.getpalette())
bounds=(366,89,2771,1784);target=(2405,1695)
# Enlarge cleaned regions, smooth boundaries, then restore the fixed palette without dithering.
hair=q.crop(box).convert('RGB').resize(target,Image.Resampling.LANCZOS).filter(ImageFilter.GaussianBlur(1.2)).quantize(palette=pal,dither=Image.Dither.NONE).convert('RGB')
alpha=mask.crop(box).resize(target,Image.Resampling.NEAREST)
canvas=Image.new('RGB',(3185,3185),'white');canvas.paste(hair,bounds[:2],alpha)
path=out/'hair-short-center-part.bmp';canvas.save(path)
final=Image.open(path).convert('RGB')
assert final.size==(3185,3185) and set(c for _,c in final.getcolors())==set(colors)
fullmask=Image.new('L',final.size);fullmask.paste(alpha,bounds[:2])
preview=Image.new('RGB',(1500,540),'white');draw=ImageDraw.Draw(preview)
for i,(name,file) in enumerate([('Classic','01-face-neck.png'),('Round','face-neck-round.png'),('Slim','face-neck-slim.png')]):
 base=Image.open(Path('/Users/corinne/Documents/GitHub/ActivityHub/apps/avatar/svg-assets')/file).convert('RGB');base.paste(final,(0,0),fullmask)
 preview.paste(base.resize((500,500)),(i*500,30));draw.text((i*500+225,10),name,fill='black')
preview.save(out/'placement-preview.png')
# Compare the final BMPs directly, without smoothing the detail crops.
old=Image.open(out.parent/'short-center-part-v1/hair-short-center-part.bmp')
regions=[(600,1260,950,1785),(2090,1060,2440,1585),(2300,1260,2650,1785)]
sheet=Image.new('RGB',(1050,1090),'white');d=ImageDraw.Draw(sheet)
for i,region in enumerate(regions):
 sheet.paste(old.crop(region),(350*i,20));sheet.paste(final.crop(region),(350*i,565))
d.text((10,3),'Previous BMP - original pixels',fill='black');d.text((10,548),'Cleaned BMP - original pixels',fill='black')
sheet.save(out/'detail-check.png')
print('Removed small color islands:',removed,'; BMP verified:',final.size,len(final.getcolors()),'colors including white')
