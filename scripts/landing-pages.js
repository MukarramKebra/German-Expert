/*
 * landing-pages.js — static SEO landing pages for Alamdar Auto (Kuwait).
 * ---------------------------------------------------------------------------
 * Required by generate-product-pages.js, which passes in the live catalog and
 * writes whatever this returns. Pure functions, no I/O, no dependencies.
 *
 *   make/<make>.html            one per car make        ("BMW spare parts in Kuwait")
 *   make/<make>-<model>.html    one per model           ("BMW 3 Series spare parts in Kuwait")
 *   category/<slug>.html        one per part category   ("Brake parts in Kuwait")
 *
 * The make -> model -> generation data is the old alamdar-auto.com category
 * tree (scripts/data/vehicle-tree.json). The pages carry real, visible copy,
 * a FAQPage + BreadcrumbList + CollectionPage JSON-LD, internal links in every
 * direction and any in-catalog products that fit the make, so they are useful
 * landing pages rather than empty shells.
 * ---------------------------------------------------------------------------
 */
'use strict';

const TREE = require('./data/vehicle-tree.json');

const CATEGORIES = [
  { slug: 'engine', label: 'Engine parts', ar: 'قطع المحرك', groups: [],
    items: ['V belts', 'Timing belts', 'Fuel injectors', 'Fuel pumps', 'Engine mountings', 'Gaskets and seals'],
    blurb: 'Belts, injectors, mountings, gaskets and the other wear items that keep a German engine running properly.' },
  { slug: 'brakes', label: 'Brake parts', ar: 'قطع الفرامل', groups: ['Brake system'],
    items: [], blurb: 'Brake pads, discs and related parts for Mercedes-Benz, BMW, Audi, Volkswagen, Porsche and Range Rover.' },
  { slug: 'suspension', label: 'Suspension parts', ar: 'قطع نظام التعليق', groups: [],
    items: ['Shock absorbers', 'Control arms', 'Tie rods', 'Rubber mounts and bushes', 'Stabiliser links'],
    blurb: 'Shock absorbers, control arms, tie rods and rubber mounts for a quiet, stable ride.' },
  { slug: 'filters', label: 'Filters', ar: 'الفلاتر', groups: [],
    items: ['Oil filters', 'Air filters', 'Fuel filters', 'AC / cabin filters'],
    blurb: 'Oil, air, fuel and cabin filters for routine servicing.' },
  { slug: 'electrical', label: 'Electrical parts', ar: 'الكهرباء', groups: ['Electrical system', 'Heating and ventilation'],
    items: [], blurb: 'Alternators, spark plugs, ignition coils, blower motors and other electrical parts.' },
  { slug: 'cooling', label: 'Cooling and A/C parts', ar: 'قطع التبريد والتكييف', groups: ['Engine cooling system', 'Air conditioning (A/C)'],
    items: [], blurb: 'Radiators, water pumps, thermostats, expansion tanks and A/C parts — important for Kuwait summers.' },
  { slug: 'oils-fluids', label: 'Oils and fluids', ar: 'الزيوت والسوائل', groups: [],
    items: ['Engine oil', 'Coolant / antifreeze', 'Brake fluid', 'Gear and transmission oil'],
    blurb: 'Engine oils, coolant and other fluids for servicing your car.' },
  { slug: 'transmission', label: 'Transmission parts', ar: 'قطع ناقل الحركة', groups: [],
    items: ['Gear mountings', 'Clutch parts', 'Gearbox seals'],
    blurb: 'Gearbox mountings, clutch parts and seals.' },
  { slug: 'exhaust', label: 'Exhaust parts', ar: 'قطع العادم', groups: ['Exhaust system'],
    items: [], blurb: 'Exhaust pipes and fittings.' },
  { slug: 'body-lights', label: 'Body parts and lighting', ar: 'قطع الهيكل والإضاءة', groups: ['Body components', 'Lighting and signaling'],
    items: ['Wipers'], blurb: 'Bumpers, grilles, mirrors, headlights, tail lamps and other body and lighting parts.' },
  { slug: 'accessories', label: 'Accessories', ar: 'الإكسسوارات', groups: ['Exterior', 'Interior'],
    items: [], blurb: 'Floor mats, roof racks, mud flaps, running boards and other accessories.' }
];

const GROUP = (name) => TREE.partGroups.find((g) => g.name === name);
const catItems = (c) => c.items.concat(...c.groups.map((n) => (GROUP(n) || { items: [] }).items));

module.exports = function buildLandingPages(ctx) {
  const { SITE_BASE, products, wa, esc, clip, slugify } = ctx;
  const pages = [];
  const waLink = (text) => 'https://wa.me/' + wa + '?text=' + encodeURIComponent(text);
  const jsonld = (o) => JSON.stringify(o);
  const makes = TREE.makes;
  const makeUrl = (m) => SITE_BASE + 'make/' + m.slug + '.html';
  const modelSlug = (m, md) => m.slug + '-' + slugify(md.name);
  const modelUrl = (m, md) => SITE_BASE + 'make/' + modelSlug(m, md) + '.html';
  const catUrl = (c) => SITE_BASE + 'category/' + c.slug + '.html';

  const fitsMake = (p, m) => (p.makes || []).indexOf(m.fitSlug || m.slug) !== -1;
  const productList = (list, heading) => {
    if (!list.length) return '';
    return `<section class="blk"><h2>${esc(heading)}</h2><ul class="plist">${list.slice(0, 24).map((p) =>
      `<li><a href="../product/${esc(p.slug)}.html">${esc(p.name)}</a><span>${esc(p.sku)}</span></li>`).join('')}</ul></section>`;
  };

  function shell(o) {
    const crumbs = o.crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c[0], item: c[1] }));
    const faq = {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: o.faq.map((f) => ({ '@type': 'Question', name: f[0], acceptedAnswer: { '@type': 'Answer', text: f[1] } }))
    };
    const coll = { '@context': 'https://schema.org', '@type': 'CollectionPage', name: o.h1, description: o.desc, url: o.url, inLanguage: 'en',
      isPartOf: { '@type': 'WebSite', name: 'Alamdar Auto Spare Parts Co. Kuwait', url: SITE_BASE },
      about: { '@type': 'AutoPartsStore', name: 'Alamdar Auto Spare Parts Co. Kuwait', telephone: '+965 9911 5215',
        address: { '@type': 'PostalAddress', streetAddress: 'Shuwaikh Industrial Area', addressLocality: 'Kuwait', postalCode: '42415', addressCountry: 'KW' } } };
    const bc = { '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbs };
    return `<!DOCTYPE html>
<html lang="en" dir="ltr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <title>${esc(o.title)}</title>
  <meta name="description" content="${esc(o.desc)}" />
  <meta name="keywords" content="${esc(o.keywords)}" />
  <link rel="canonical" href="${esc(o.url)}" />
  <meta name="robots" content="index, follow" />
  <meta name="geo.region" content="KW" />
  <meta name="geo.placename" content="Shuwaikh Industrial Area, Kuwait" />
  <meta property="og:type" content="website" />
  <meta property="og:site_name" content="Alamdar Auto Spare Parts Co. Kuwait" />
  <meta property="og:title" content="${esc(o.title)}" />
  <meta property="og:description" content="${esc(o.desc)}" />
  <meta property="og:url" content="${esc(o.url)}" />
  <meta property="og:image" content="${SITE_BASE}og-image.jpg" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${esc(o.title)}" />
  <meta name="twitter:description" content="${esc(o.desc)}" />
  <meta name="twitter:image" content="${SITE_BASE}og-image.jpg" />
  <link rel="icon" href="../favicon.png" sizes="any" />
  <link rel="apple-touch-icon" href="../apple-touch-icon.png" />
  <script type="application/ld+json">${jsonld(coll)}</script>
  <script type="application/ld+json">${jsonld(bc)}</script>
  <script type="application/ld+json">${jsonld(faq)}</script>
  <style>
    :root{--red:#c1121f;--ink:#1a1a1a;--mut:#6b7280;--line:#e5e7eb}
    body{margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;color:var(--ink);background:#f6f7f9;line-height:1.65}
    .hd{display:flex;align-items:center;gap:12px;padding:12px 20px;background:#16191f;border-bottom:3px solid var(--red)}
    .hd a{display:flex;align-items:center;gap:10px;color:#fff;text-decoration:none;font-weight:800;letter-spacing:1px;font-size:15px}
    .hd img{height:40px;width:40px;border-radius:50%}
    main{max-width:960px;margin:0 auto;padding:22px 20px 40px}
    .crumb{font-size:13px;color:var(--mut);margin:0 0 16px}.crumb a{color:var(--mut);text-decoration:none}
    h1{font-size:28px;line-height:1.25;margin:0 0 6px}
    .ar{font-size:18px;color:var(--mut);margin:0 0 14px}
    h2{font-size:20px;margin:0 0 10px}
    .blk{background:#fff;border:1px solid var(--line);border-radius:14px;padding:20px;margin:16px 0}
    .lead{font-size:16px;color:#374151;margin:0 0 14px}
    .chips{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:8px}
    .chips li a,.chips li span{display:inline-block;font-size:14px;color:#1f2937;background:#f3f4f6;border:1px solid var(--line);border-radius:8px;padding:6px 12px;text-decoration:none}
    .chips li a:hover{border-color:var(--red);color:var(--red)}
    .plist{list-style:none;margin:0;padding:0}.plist li{display:flex;justify-content:space-between;gap:12px;padding:8px 0;border-bottom:1px solid #f0f0f0}
    .plist a{color:var(--ink);font-weight:600;text-decoration:none}.plist span{color:var(--mut);font-size:13px}
    .btn{display:inline-block;background:var(--red);color:#fff;text-decoration:none;font-weight:700;padding:12px 20px;border-radius:10px;margin:4px 8px 4px 0}
    .btn.alt{background:#16191f}
    details{border-top:1px solid var(--line);padding:10px 0}summary{cursor:pointer;font-weight:700}
    footer{max-width:960px;margin:0 auto;padding:20px;color:var(--mut);font-size:13px}
    @media(max-width:640px){h1{font-size:23px}}
  </style>
</head>
<body>
  <header class="hd"><a href="../"><img src="../logo.jpg" alt="" width="40" height="40" /> ALAMDAR AUTO</a></header>
  <main>
    <nav class="crumb">${o.crumbs.map((c, i) => i === o.crumbs.length - 1 ? esc(c[0]) : `<a href="${esc(c[1])}">${esc(c[0])}</a>`).join(' &rsaquo; ')}</nav>
    <h1>${esc(o.h1)}</h1>
    <p class="ar" lang="ar" dir="rtl">${esc(o.ar)}</p>
    <div class="blk"><p class="lead">${o.lead}</p>
      <a class="btn" href="${esc(waLink(o.waText))}">Ask on WhatsApp</a><a class="btn alt" href="tel:+${wa}">Call +965 9911 5215</a></div>
${o.body}
    <section class="blk"><h2>Common questions</h2>
${o.faq.map((f) => `      <details><summary>${esc(f[0])}</summary><p>${esc(f[1])}</p></details>`).join('\n')}
    </section>
  </main>
  <footer><strong>Alamdar Auto Spare Parts Co. Kuwait</strong> — authorized auto spare parts distributor, Shuwaikh Industrial Area, Kuwait 42415.
    Tel +965 2482 7072 · WhatsApp +965 9911 5215 · info@alamdar-auto.com</footer>
</body>
</html>
`;
  }

  const home = ['Home', SITE_BASE];
  const catLinks = (rel) => CATEGORIES.map((c) => `<li><a href="${rel}category/${c.slug}.html">${esc(c.label)}</a></li>`).join('');
  const faqCommon = (what) => [
    ['How do I make sure I get the right part for my ' + what + '?',
      'Send us your chassis (VIN) number or a photo of the old part on WhatsApp at +965 9911 5215 and we will match the exact part number for your ' + what + ' before you buy.'],
    ['Where can I buy ' + what + ' spare parts in Kuwait?',
      'Alamdar Auto Spare Parts Co. is in Shuwaikh Industrial Area, Kuwait. You can visit us, call +965 2482 7072, or message us on WhatsApp.'],
    ['Do you deliver across Kuwait?', 'Yes — message us on WhatsApp with your area and we will confirm the delivery time.'],
    ['Do you sell genuine parts?', 'We are an authorized distributor of auto spare parts in Kuwait, supplying genuine and OEM-quality parts. Tell us which you prefer and we will quote accordingly.']
  ];

  // ── make pages + model pages ──────────────────────────────────────────────
  for (const m of makes) {
    const fit = products.filter((p) => fitsMake(p, m));
    const modelList = m.models.length
      ? `<section class="blk"><h2>${esc(m.label)} models we supply parts for</h2><ul class="chips">${m.models.map((md) =>
          `<li><a href="${modelSlug(m, md)}.html">${esc(m.label + ' ' + md.name)}</a></li>`).join('')}</ul></section>`
      : '';
    const trucks = m.trucks ? ' We also stock Mercedes truck and commercial vehicle parts.' : '';
    const kwEn = [`${m.label} spare parts Kuwait`, `${m.short} auto parts Kuwait`, `${m.label} genuine parts Kuwait`, `${m.short} parts Shuwaikh`,
      `${m.label} service parts Kuwait`, 'auto spare parts Kuwait', 'Alamdar Auto Spare Parts Kuwait'];
    pages.push({
      rel: 'make/' + m.slug + '.html', priority: '0.8', changefreq: 'weekly',
      html: shell({
        url: makeUrl(m),
        title: clip(`${m.label} Spare Parts in Kuwait | Alamdar Auto Shuwaikh`, 65),
        desc: clip(`Genuine ${m.label} spare parts in Kuwait from Alamdar Auto Spare Parts Co., Shuwaikh Industrial Area — brakes, engine, suspension, cooling, electrical and more.`, 158),
        keywords: kwEn.concat([`قطع غيار ${m.ar} الكويت`, `${m.ar} قطع غيار السيارات الكويت`, 'علمدار قطع غيار السيارات الكويت']).join(', '),
        h1: `${m.label} Spare Parts in Kuwait`,
        ar: `قطع غيار ${m.ar} في الكويت — علمدار لقطع غيار السيارات`,
        lead: `Alamdar Auto Spare Parts Co. supplies ${esc(m.label)} spare parts from Shuwaikh Industrial Area, Kuwait — service items such as filters and brake pads, and engine, suspension, cooling and electrical parts.${esc(trucks)} Tell us your model and chassis number and we will find the right part.`,
        waText: `Hi, I need parts for my ${m.label}`,
        crumbs: [home, [m.label + ' parts', makeUrl(m)]],
        faq: faqCommon(m.label),
        body: modelList +
          productList(fit, `${m.label} parts in our catalogue`) +
          `<section class="blk"><h2>Browse by part type</h2><ul class="chips">${catLinks('../')}</ul></section>`
      })
    });

    for (const md of m.models) {
      const full = m.label + ' ' + md.name;
      const gens = md.gens.length
        ? `<section class="blk"><h2>${esc(full)} generations</h2><p>We can supply parts for these ${esc(full)} versions:</p><ul class="chips">${md.gens.map((g) => `<li><span>${esc(g)}</span></li>`).join('')}</ul></section>`
        : '';
      const sib = m.models.filter((x) => x !== md);
      const siblings = sib.length
        ? `<section class="blk"><h2>Other ${esc(m.label)} models</h2><ul class="chips">${sib.map((x) => `<li><a href="${modelSlug(m, x)}.html">${esc(x.name)}</a></li>`).join('')}</ul></section>`
        : '';
      pages.push({
        rel: 'make/' + modelSlug(m, md) + '.html', priority: '0.7', changefreq: 'weekly',
        html: shell({
          url: modelUrl(m, md),
          title: clip(`${full} Spare Parts in Kuwait | Alamdar Auto`, 65),
          desc: clip(`${full} spare parts in Kuwait${md.gens.length ? ' (' + md.gens.slice(0, 3).join(', ') + (md.gens.length > 3 ? ' and more' : '') + ')' : ''} — Alamdar Auto Spare Parts Co., Shuwaikh Industrial Area.`, 158),
          keywords: [`${full} parts Kuwait`, `${full} spare parts Kuwait`, `${m.short} ${md.name} auto parts Kuwait`, `${m.label} parts Shuwaikh`, 'auto spare parts Kuwait']
            .concat(md.gens.slice(0, 4).map((g) => `${full} ${g.replace(/\s*\(.*$/, '')} parts Kuwait`)).concat([`قطع غيار ${m.ar} الكويت`]).join(', '),
          h1: `${full} Spare Parts in Kuwait`,
          ar: `قطع غيار ${m.ar} ${md.name} في الكويت`,
          lead: `Looking for ${esc(full)} spare parts in Kuwait? Alamdar Auto Spare Parts Co. in Shuwaikh Industrial Area supplies brake, engine, suspension, cooling, electrical and service parts for the ${esc(full)}. Send us your chassis (VIN) number on WhatsApp and we will match the exact part.`,
          waText: `Hi, I need parts for my ${full}`,
          crumbs: [home, [m.label + ' parts', makeUrl(m)], [md.name, modelUrl(m, md)]],
          faq: faqCommon(full),
          body: gens + productList(fit, `${m.label} parts in our catalogue`) + siblings +
            `<section class="blk"><h2>Parts for the ${esc(full)} by type</h2><ul class="chips">${catLinks('../')}</ul></section>`
        })
      });
    }
  }

  // ── category pages ────────────────────────────────────────────────────────
  for (const c of CATEGORIES) {
    const items = catItems(c);
    const list = products.filter((p) => p.category === c.slug);
    pages.push({
      rel: 'category/' + c.slug + '.html', priority: '0.7', changefreq: 'weekly',
      html: shell({
        url: catUrl(c),
        title: clip(`${c.label} in Kuwait | Alamdar Auto Spare Parts`, 65),
        desc: clip(`${c.label} for German and European cars in Kuwait — ${c.blurb}`, 158),
        keywords: [`${c.label} Kuwait`, `${c.label.toLowerCase()} for German cars Kuwait`, 'European auto parts Kuwait', 'auto spare parts Kuwait', 'Shuwaikh industrial area'].concat(items.slice(0, 6).map((i) => `${i} Kuwait`)).concat([`${c.ar} الكويت`]).join(', '),
        h1: `${c.label} in Kuwait`,
        ar: `${c.ar} في الكويت — علمدار لقطع غيار السيارات`,
        lead: esc(c.blurb) + ' Available from Alamdar Auto Spare Parts Co., Shuwaikh Industrial Area, Kuwait — send us your car and chassis number and we will find the right part.',
        waText: `Hi, I need ${c.label.toLowerCase()} for my car`,
        crumbs: [home, [c.label, catUrl(c)]],
        faq: faqCommon('car'),
        body: (items.length ? `<section class="blk"><h2>What we supply</h2><ul class="chips">${items.map((i) => `<li><span>${esc(i)}</span></li>`).join('')}</ul></section>` : '') +
          productList(list, `${c.label} in our catalogue`) +
          `<section class="blk"><h2>Shop by car make</h2><ul class="chips">${makes.map((m) => `<li><a href="../make/${m.slug}.html">${esc(m.label)}</a></li>`).join('')}</ul></section>`
      })
    });
  }
  return pages;
};
module.exports.CATEGORIES = CATEGORIES;
module.exports.MAKES = TREE.makes;
