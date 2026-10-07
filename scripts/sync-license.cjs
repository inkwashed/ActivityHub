// LICENSE.txt is authoritative; embed it for offline/file:// compatibility.
const fs = require('fs');
const path = require('path');
const root = path.join(__dirname, '..');
const escape = text => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;');
const file = path.join(root, 'index.html');
const page = fs.readFileSync(file, 'utf8');
const updated = page.replace(/(?<=<!-- license:start -->)[\s\S]*?(?=<!-- license:end -->)/, () => escape(fs.readFileSync(path.join(root, 'LICENSE.txt'), 'utf8')));
fs.writeFileSync(file, updated);
