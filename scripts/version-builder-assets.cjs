/* Run before publishing builder changes. Content hashes invalidate stale assets. */
const fs = require('node:fs');
const path = require('node:path');
const {createHash} = require('node:crypto');
const root = path.resolve(__dirname, '..');
for (const app of ['.', 'apps/post', 'apps/pizza', 'apps/parfait', 'apps/sandwich', 'apps/avatar', '_dev/builder']) {
  const file = path.join(root, app, 'index.html');
  const html = fs.readFileSync(file, 'utf8');
  const updated = html.replace(/\b(src|href)="([^"?#]+\.(?:js|css|svg))(?:\?v=[^"#]+)?"/g, (match, attr, url) => {
    if (/^(?:[a-z]+:|\/\/)/i.test(url)) return match;
    const asset = path.resolve(path.dirname(file), url);
    const version = createHash('sha256').update(fs.readFileSync(asset)).digest('hex').slice(0, 12);
    return `${attr}="${url}?v=${version}"`;
  });
  if (updated !== html) fs.writeFileSync(file, updated);
  console.log(`${app}: asset versions synchronized`);
}
