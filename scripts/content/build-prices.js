#!/usr/bin/env node
/**
 * Lägger in priser enligt prislistan (beslutad september 2026) i overrides.js.
 *
 * Körs från repo-roten:  node scripts/content/build-prices.js [--in overrides.js] [--out overrides.js]
 *
 * Grundprinciper (från prislistan):
 *   - Priset avser verket, oinramat. Ett pris per format.
 *   - Skiss / liten studie (upp till ~20×30 cm)   1 200 kr
 *   - Litet verk (20×20 / 19×28 cm)                 2 200 kr
 *   - Kvartsark (28×38 cm)                          3 400 kr
 *   - Halvark (38×56 cm)                            5 400 kr
 *   - Helark (56×76 cm)                             9 500 kr
 *   Format utanför listan interpoleras log-linjärt på kr/cm²-kurvan och
 *   avrundas till närmaste 100 kr. Verk märkta "Ej till salu" får inget pris.
 *   Meritnivån (+30 %) sätts manuellt i Studio vid det tillfället, inte här.
 *
 * Skriver också engelsk prisetikett (SEK) i translations.en.gallery.artworkTextBySrc.
 * Rör inga andra fält. Verk som redan har ett pris lämnas orörda.
 */
const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const opt = (name, fallback) => {
  const i = args.indexOf(name);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};
const inPath = path.resolve(opt('--in', 'overrides.js'));
const outPath = path.resolve(opt('--out', 'overrides.js'));
const reportPath = path.resolve(opt('--report', 'scripts/content/PRISER-2026-09-09.md'));
const jsonPath = path.resolve(opt('--json', 'scripts/content/ola-portfolio-overrides-priser-2026-09-09.json'));

const raw = fs.readFileSync(inPath, 'utf8');
const start = raw.indexOf('{', raw.indexOf('window.PORTFOLIO_OVERRIDES'));
const end = raw.lastIndexOf('}');
const payload = JSON.parse(raw.slice(start, end + 1));

const NBSP = ' ';
const fmtKr = (n) => `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, NBSP)}${NBSP}kr`;
const fmtSek = (n) => `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, NBSP)}${NBSP}SEK`;

// Ankarpunkter (cm² → kr). Kurvan faller mjukt i kr/cm² med storleken.
const ANCHORS = [
  { area: 19 * 28, price: 2200, name: 'Litet verk' },
  { area: 28 * 38, price: 3400, name: 'Kvartsark' },
  { area: 38 * 56, price: 5400, name: 'Halvark' },
  { area: 56 * 76, price: 9500, name: 'Helark' }
];
const SKETCH_PRICE = 1200;
const SKETCH_MAX_AREA = 20 * 30 * 1.1; // "upp till ~20×30 cm" med lite marginal (A4 = 624)
const SMALL_MAX_AREA = 19 * 28 * 1.25; // 19×28, 20×20, A4 räknas som "litet verk"
const TINY_MAX_AREA = 350;             // 10×10, 15×15, 20×15 → skiss-/studienivå

const parseFormat = (format) => {
  if (typeof format !== 'string') return null;
  const f = format.trim().toLowerCase().replace(/\s+/g, ' ');
  if (!f) return null;
  if (/^a ?4$/.test(f)) return { w: 21, h: 29.7, note: 'A4' };
  if (/^a ?3$/.test(f)) return { w: 29.7, h: 42, note: 'A3' };
  const m = f.match(/(\d+(?:[.,]\d+)?)\s*[x×]\s*(\d+(?:[.,]\d+)?)/);
  if (!m) return null;
  return { w: parseFloat(m[1].replace(',', '.')), h: parseFloat(m[2].replace(',', '.')) };
};

const isStudy = (title) => /\b(förstudie|studie|skiss)\b/i.test(String(title || ''));

const interpolate = (area) => {
  if (area <= ANCHORS[0].area) return ANCHORS[0].price;
  const last = ANCHORS[ANCHORS.length - 1];
  if (area >= last.area) {
    // Större än helark: fortsätt kurvan med helarkets kr/cm² (sällsynt).
    return Math.round((area * (last.price / last.area)) / 100) * 100;
  }
  for (let i = 0; i < ANCHORS.length - 1; i += 1) {
    const a = ANCHORS[i];
    const b = ANCHORS[i + 1];
    if (area >= a.area && area <= b.area) {
      const ra = a.price / a.area;
      const rb = b.price / b.area;
      const t = Math.log(area / a.area) / Math.log(b.area / a.area);
      const rate = ra + (rb - ra) * t;
      return Math.round((area * rate) / 100) * 100;
    }
  }
  return null;
};

const priceFor = (item) => {
  const dims = parseFormat(item.format);
  if (!dims) return { price: null, tier: 'saknar format', area: null };
  const area = Math.round(dims.w * dims.h);
  const near = (anchor) => Math.abs(area - anchor.area) / anchor.area <= 0.08;

  if (isStudy(item.title) && area <= SKETCH_MAX_AREA) return { price: SKETCH_PRICE, tier: 'Skiss / studie', area };
  if (area <= TINY_MAX_AREA) return { price: SKETCH_PRICE, tier: 'Skiss / liten studie (storlek)', area };
  if (area <= SMALL_MAX_AREA) return { price: ANCHORS[0].price, tier: 'Litet verk', area };
  const exact = ANCHORS.find(near);
  if (exact) return { price: exact.price, tier: exact.name, area };
  return { price: interpolate(area), tier: 'Interpolerat', area };
};

const artworks = payload.gallery.artworks;
const enMap = payload.translations.en.gallery.artworkTextBySrc;
const rows = [];
const flags = [];

artworks.forEach((item) => {
  const availability = typeof item.availability === 'string' ? item.availability.trim().toLowerCase() : '';
  const existing = typeof item.priceLabel === 'string' ? item.priceLabel.trim() : '';
  const { price, tier, area } = priceFor(item);
  let label = '';
  let labelEn = '';
  let action = '';

  if (availability === 'nfs' || availability === 'sold') {
    action = `lämnad (${availability})`;
  } else if (existing) {
    action = 'hade redan pris – orörd';
  } else if (price) {
    label = fmtKr(price);
    labelEn = fmtSek(price);
    item.priceLabel = label;
    if (!availability) item.availability = 'available';
    action = 'satt';
  } else {
    label = 'Pris på förfrågan';
    labelEn = 'Price on request';
    item.priceLabel = label;
    if (!availability) item.availability = 'available';
    action = 'INTERIM – format saknas';
    flags.push(`${item.title} (${item.slug}): format saknas → "Pris på förfrågan". Fyll i format i Studio och sätt pris.`);
  }

  if (labelEn) {
    if (!enMap[item.src] || typeof enMap[item.src] !== 'object') enMap[item.src] = {};
    enMap[item.src].priceLabel = labelEn;
  }

  if (tier === 'Interpolerat') flags.push(`${item.title} (${item.format}): utanför listan, interpolerat till ${label}.`);
  if (tier === 'Skiss / liten studie (storlek)') flags.push(`${item.title} (${item.format}): prissatt som skiss pga storlek → ${label}.`);
  if (/studie/i.test(item.title) && !tier.startsWith('Skiss')) flags.push(`${item.title} (${item.format}): "studie" i titeln men för stor för skissnivån → ${tier} ${label}.`);

  rows.push({ title: item.title, format: item.format || '—', area, tier, label: label || existing || '—', availability: item.availability || '', action });
});

// Skriv overrides.js i samma form som Studio-API:t (4 blanksteg, unicode oescapat).
const js = `// Live overrides för hela sajten.\n// Auto-genererad av Studio API.\nwindow.PORTFOLIO_OVERRIDES = ${JSON.stringify(payload, null, 4)};\n`;
fs.writeFileSync(outPath, js, 'utf8');
fs.writeFileSync(jsonPath, JSON.stringify(payload, null, 2) + '\n', 'utf8');

const md = [];
md.push('# Priser inlagda 2026-09-09');
md.push('');
md.push('Källa: prislista beslutad september 2026. Priset avser verket, oinramat.');
md.push('');
md.push('| # | Verk | Format | cm² | Nivå | Pris | Status | Åtgärd |');
md.push('|---|------|--------|-----|------|------|--------|--------|');
rows.forEach((r, i) => md.push(`| ${i + 1} | ${r.title} | ${r.format} | ${r.area ?? '—'} | ${r.tier} | ${r.label.replace(/ /g, ' ')} | ${r.availability || '—'} | ${r.action} |`));
md.push('');
md.push('## Att titta på');
md.push('');
flags.forEach((f) => md.push(`- ${f.replace(/ /g, ' ')}`));
fs.writeFileSync(reportPath, md.join('\n') + '\n', 'utf8');

const counts = rows.reduce((acc, r) => ((acc[r.action] = (acc[r.action] || 0) + 1), acc), {});
console.log('Klart.', JSON.stringify(counts));
console.log('Flaggor:', flags.length);
flags.forEach((f) => console.log(' -', f.replace(/ /g, ' ')));
