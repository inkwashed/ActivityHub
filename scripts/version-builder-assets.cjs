/* Run before publishing builder changes. Content hashes invalidate stale assets. */
const fs = require('node:fs');
const path = require('node:path');
const {createHash} = require('node:crypto');
const root = path.resolve(__dirname, '..');
const defaults = ['.', 'apps/post', 'apps/pizza', 'apps/parfait', 'apps/sandwich', 'apps/avatar', '_dev/builder', 'apps/class-supplies', 'apps/mytown', 'myblog/NH1-5', 'myblog/NH6-5', 'myblog/NH2-4', 'myblog/journal', 'docs/style-guide.html'];
const check = process.argv.includes('--check');
const requested = process.argv.slice(2).filter(arg => arg !== '--check');
for (const app of requested.length ? requested : defaults) {
  if (!defaults.includes(app)) throw new Error(`Unknown app: ${app}`);
  const file = path.join(root, app.endsWith('.html') ? app : path.join(app, 'index.html'));
  const html = fs.readFileSync(file, 'utf8');
  const updated = html.replace(/\b(src|href)="([^"?#]+\.(?:js|css|svg))(?:\?v=[^"#]+)?"/g, (match, attr, url) => {
    if (/^(?:[a-z]+:|\/\/)/i.test(url)) return match;
    const asset = path.resolve(path.dirname(file), url);
    const version = createHash('sha256').update(fs.readFileSync(asset)).digest('hex').slice(0, 12);
    return `${attr}="${url}?v=${version}"`;
  });
  if (updated !== html) {
    if (check) { console.error(`${app}: stale asset versions`); process.exitCode = 1; }
    else fs.writeFileSync(file, updated);
  }
  if (!check) console.log(`${app}: asset versions synchronized`);
}
