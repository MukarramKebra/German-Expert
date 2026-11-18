// Merge every keyword copied from the old alamdar-auto.com Rank Math boxes
// (scripts/data/old-seo-keywords.txt) into the <meta name="keywords"> tag of
// index.html, keeping what is already there first. Nothing is filtered out
// (owner's instruction 2026-11-19). Case-insensitive de-duplication only.
//   node scripts/merge-old-keywords.js --dry-run   # report, write nothing
//   node scripts/merge-old-keywords.js             # write index.html + merged list
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const rawFile = path.join(__dirname, 'data', 'old-seo-keywords.txt');
const outFile = path.join(__dirname, 'data', 'seo-keywords-merged.txt');
const indexFile = path.join(root, 'index.html');
const dry = process.argv.includes('--dry-run');

const html = fs.readFileSync(indexFile, 'utf8');
const tagRe = /(<meta name="keywords" content=")([^"]*)(")/;
const m = html.match(tagRe);
if (!m) throw new Error('keywords meta tag not found in index.html');

const unesc = s => s.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
const esc = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const clean = s => s.replace(/\s+/g, ' ').trim();

const seen = new Set();
const out = [];
function add(k) {
  k = clean(k);
  if (!k || k === '(empty)') return;
  const key = k.toLowerCase();
  if (seen.has(key)) return;
  seen.add(key);
  out.push(k);
}

const existing = unesc(m[2]).split(',');
existing.forEach(add);
const existingCount = out.length;

const raw = fs.readFileSync(rawFile, 'utf8').split('\n').filter(l => l && !l.startsWith('###'));
raw.forEach(line => line.split(/[#|،]/).forEach(add));

console.log('existing keywords:', existingCount);
console.log('after merge:      ', out.length, '(+' + (out.length - existingCount) + ')');
const joined = out.join(', ');
console.log('tag length:       ', joined.length, 'chars');

if (dry) { console.log('--dry-run: nothing written'); process.exit(0); }
fs.writeFileSync(outFile, joined, 'utf8');
fs.writeFileSync(indexFile, html.replace(tagRe, (_, a, _b, c) => a + esc(joined) + c), 'utf8');
console.log('wrote', path.relative(root, indexFile), 'and', path.relative(root, outFile));
