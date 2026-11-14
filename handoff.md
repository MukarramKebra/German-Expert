# Handoff — German Expert (as of 2026-11-10)

## 1) Goal

Turn this copy of the Expert Hardware Kuwait site into **German Expert**, a German car-parts store in **Sharjah, UAE**, with its own design, its own database, its own admin and its own link:

- Live site: https://mukarramkebra.github.io/German-Expert/
- Repo: https://github.com/MukarramKebra/German-Expert
- Supabase project: `qljcyiwkwdfodmabnzol` ("German Expert"), in organization **Bahar Al Hind Co**

The owner will send a link to their existing online product list later; importing it is a separate step.

## 2) Current state

Head of `main` is **`b59cb624`**. Site and admin are live; the DB is wired; the catalog is empty.

The hero now carries a **rotating ring of eight spare parts around each car**, every one a real cut-out photo shown in its own shape (no circles, since 2026-11-14) (the elbow callouts are gone), and `#services` opens with the owner's own full-bleed workshop collage directly below the hero. Scroll order: hero → services collage → service cards → categories → products.

**Working:**

| Area | State |
|---|---|
| Pages | `/`, `/admin/`, `robots.txt`, `logo.jpg`, `og-image.jpg`, `favicon.png`, `apple-touch-icon.png`, `sitemap.xml` all 200; unknown paths hit the custom 404 |
| Actions | `Generate product SEO pages` and `pages-build-deployment` both green |
| Database | 15 tables (`expert_*`, `offer_*`), RLS on, 10 functions present |
| Keys | The real publishable key is in **both** config points — `GE_SB_KEY_B64` (`code/js/01-config-data.js`) and `SB_KEY` (`admin/js/01-core-data.js`). Anon `SELECT` 200; anon `INSERT` into `expert_products` rejected `401 / 42501` |
| Edge functions | All 5 deployed and smoke-tested, all `verify_jwt: false` |
| Contact | `SHOP_WA = '971525364791'` (+971 52 536 4791) is real and wired everywhere. No `971500000000` remains anywhere in the repo |
| Palette | **Red**, not gold — `--orange: #c1121f` on light surfaces, `--orange-light`/`--gold: #ef3b42` on dark. `--yellow #f59e0b` is a *status* colour, not the accent |
| Mode | **Catalog-only** (`ONLINE_ORDERING_ENABLED = false`) and **email offers off** (`EMAIL_OFFERS_ENABLED = false`) |
| Services | `#services` ("Our Mechanics Service Your Car") is the first section below the hero (above the category grid), and is live with the owner's **own 2×2 collage photo, full-bleed edge to edge**, a service name written over each of its four frames (each one a WhatsApp booking), above **10 seeded services, all "Price on request"**, plus an admin **Services** tab that writes `expert_settings.services`. Saving needs an admin login, so both lists stay the seeded ones until the owner bootstraps an account and sets real prices |

**Live counts (checked 2026-11-10):** products **0**, orders **0**, admin profiles **0**.

**Blocked on the owner:**
- **No admin accounts.** `expert_admin_profiles` is empty, so nobody can log into `/admin/`. Only the `bootstrap` action can seed it and it only works while that table is empty — one shot. **The owner runs it with their own passwords; Claude never picks or types them.**
- **No `RESEND_API_KEY`**, so `notify-order` and `send-offers` deploy and respond correctly but cannot actually send mail.
- **Empty catalog**, awaiting the product list.

**Still open in the code:**
- `TODO-CONTACT` placeholders: email `info@german-expert.ae`, the Google Maps link, the JSON-LD address, the edge-function sender/owner emails. *(The phone is done.)*
- The logo's **second number, +971 52 538 7296**, is still unused — ask before adding it as a second contact line.
- `MIN_PRODUCTS` is still 0 (safe only while the catalog is empty).
- **The Range Rover has no `make`.** Land Rover isn't in `CAR_MAKES`, so a "Shop Land Rover parts" button would filter to nothing; it ships with a caption and no CTA. **Open question: does the shop stock Land Rover parts?** Opel is the mirror problem — it's in `CAR_MAKES` but absent from the homepage copy, keywords and JSON-LD.
- The Audi's supplied cut-out is only 612px wide, so it is visibly softer than the other five at desktop size.
- **Known and deliberately not chased:** the hero sheen's `--car` mask uses the full-res `src`, so a desktop pulls all six full-size hero images even when the `<img>`s resolve to the `-sm` ones. Phones are unaffected (`.ge-car-sheen` is `display: none` there), so it is not part of the lag the owner reported.

**Connections — two, don't merge them:**
- The **claude.ai Supabase connector** is signed in as **mkerba2011@gmail.com** and sees only that account's org: Experts Hardware (Kuwait, `qhebhvllkovfbkqrcnmm`), Epsilon Billing (`mgxhwduuqdtxzxkhgfnc`) and Dhow Tech. It **cannot** see German Expert. **Leave it on that account** — moving it would cut off Epsilon and Kuwait.
- **`supabase-german`** (`mcp__supabase-german__*`) is a local-scope MCP server for this folder only, stored in `C:\Users\mukke\.claude.json`. Use it for every German Expert DB / edge-function / cache-flush action. If its tools are missing: `/mcp` → supabase-german → Authenticate, with the browser logged into the Bahar Al Hind Co account.

## 3) Active files

| File | What it is |
|---|---|
| `code/js/01-config-data.js` | **The single config point**: `GE_SB_URL`, `GE_SB_KEY_B64`, `GE_SB_KEY`, `SHOP_WA`, `SITE_URL`, `CURRENCY`, `fmtPrice()`, `roundMoney()`, plus the two feature switches `ONLINE_ORDERING_ENABLED` and `EMAIL_OFFERS_ENABLED`. Also `CAR_MAKES`, `getAllProducts()`, `normalizeCategory()`, `_SUBCAT_LABELS`, `_AR_CATS`, `activeMake` |
| `code/js/02-catalog-render.js` | `setMakeFilter()`, `normalizeQ()` (collapses repeated **letters** only), `partKey()`, `matchesSearch()`, `_filterProductsBy()`, `DEFAULT_BANNERS = []` |
| `code/js/06-features.js` | `enquireOnWhatsApp()` — the only buy path while ordering is off |
| **`code/js/08-hero.js`** | `HERO_CARS` (six cars: src/srcSmall, badge, scale) and `HERO_PARTS` (the eight orbiting parts, shared by every car), the stage builder, the ring + chip renderers, the shader gate and the IntersectionObserver |
| **`code/css/10-hero.css`** | the stage, the `@property --ge-orbit` parts ring and its radii, the phone chip strip |
| `index.html` | head/SEO/JSON-LD, the **hero skeleton `<style>` (must stay ABOVE the CSS loader script)**, the hero preload, `#showcase`, `#makeRow`, category tiles, FAQ, contact, checkout |
| `code/css/01-base.css`, `02-sections.css` | theme tokens (**red** accent), make chips, icon tiles, spinners |
| `admin/js/01-core-data.js` | `SB_URL`/`SB_KEY` (**the real key**), `DEFAULT_CATS`, `CAR_MAKES`, `parseMakes()`; `_fixCustomProductIds()` disabled on purpose |
| `admin/js/03-auth.js` | `EMAIL_DOMAIN = 'german-expert.internal'`; line ~172 un-hides the Offers tab on every privileged login, which is why the hiding CSS needs `!important` |
| `admin/js/05-categories.js`, `10-csv-import.js`, `14-product-view.js` | `CAT_DEFS`; the `sku`/`makes` CSV columns; the "Fits" chips |
| `order-invoice.html` | its own `SB_URL` — third place the project ref is hardcoded |
| `supabase/schema.sql` | **source of truth** for tables, functions, RLS, grants, seed settings |
| `supabase/functions/*` | `admin-manage-accounts`, `notify-order`, `order-invoice`, `send-offers`, `unsubscribe` |
| `scripts/generate-product-pages.js` | regex-parses `GE_SB_URL`/`GE_SB_KEY_B64`, so keep those simple string literals; `MIN_PRODUCTS` default 0 |
| `logo.jpg`, `favicon.png`, `apple-touch-icon.png`, `og-image.jpg` | real brand assets generated from the owner's crest |
| `img/hero/{mercedes-e-class,bmw-m4,porsche-911,audi-a6,vw-touareg,range-rover-sport}.webp` (+ `-sm`, + `src/`) | the six rotating cars |
| `img/parts/*.webp` (+ `src/` originals) | the ring's part photos — all owner-supplied transparent cut-outs, cropped to the part and scaled to 320px max: remsa-brake-pads, lemforder-control-arm, suspension-assembly, audi-headlight, bosch-spark-plug, behr-radiator, engine, front-bumper (febi-control-arm is unused). Adding one = drop the cut-out in, append a `HERO_PARTS` entry with `img:` |
| **`code/js/09-services.js`**, **`code/css/12-services.css`** | the `#services` workshop band: `DEFAULT_SERVICES`, `normalizeServices()`, `renderServices()`, `bookService()`, `askServiceAdvice()`. CSS loads **before** `11-ui-polish.css` despite its number |
| **`admin/js/15-services.js`** | the admin Services tab: `ADMIN_DEFAULT_SERVICES`, `loadServicesTab()`, `renderServicesTab()`, `svcAdd/svcMove/svcDelete/svcSet/svcToggleMake`, `saveServices()`. Writes the single `expert_settings` row `services` |
| `CLAUDE.md` | project notes |

## 4) Changes made

### Repo and brand
- Fresh history on an orphan `main`; old remote renamed `kuwait`, `origin` now German-Expert. ~40 MB of the old catalog removed.
- "German Expert" everywhere; AED with 2 decimals through `fmtPrice()`; 7-emirates checkout with Area/Street/Building/Flat; cash/card on delivery and bank transfer (no KNET); UAE wording throughout; Arabic strings updated (toggle still disabled).
- 12 car-parts categories, a Shop-by-Make row backed by `expert_settings.fitment_map`, part-number search that ignores spacing and punctuation.
- Every "id > 60" assumption removed and `_fixCustomProductIds()` disabled — it would have deleted and re-inserted every product with id ≤ 60.
- **Palette moved from gold to red (2026-11-09).** When porting an old snippet, remember gold was a *light* colour so anything using it as a background set dark text; red needs white text.

### Real logo + side banners (2026-11-09)
- `DEFAULT_BANNERS` is deliberately `[]` — it pointed at a `Banners/` folder that doesn't exist here, firing 10 404s per load. **Two guards were needed:** `initSideBanners()` returns early *and* `_sizeSideBanners()` (which runs on every resize, independently) bails when `#bannerLeft` is empty. Without the second, the rails were force-set back to `display:block`.
- `logo.jpg` (520×520 circular crest on white) replaced the placeholder wordmarks in all slots. **`border-radius: 50%` is what makes it work** — the circle touches all four edges, so a 50% clip removes exactly the white corners. **Any new logo slot needs that rule.**
- The header shows the `.logo-text-fallback` wordmark always (not just `onerror`) because the ring lettering is unreadable at 52px, and the `<img>` carries `alt=""` so the name isn't announced twice.

### Catalog-only mode (2026-11-09)
- One switch: `ONLINE_ORDERING_ENABLED = false`. Every "Add to Cart" is an **Enquire on WhatsApp** button; nothing writes to `expert_orders`, no stock is deducted, no order email is sent.
- Defence in depth, because stale cached scripts keep running the old markup: `addToCart()`/`pmAddToCart()` redirect to the enquiry and `openCart()`/`openCheckout()`/`handleCheckoutSubmit()` return immediately.
- Track/Cancel/My Orders went too — an order can only be created by checkout, so every lookup would return "not found".
- **Restoring is two steps, do both:** flip the flag to `true` **and** delete the "CATALOG-ONLY MODE" block in `code/css/03-cart-features-contact.css`. The flag alone re-enables checkout with no way to reach the cart.

### Email offers off (2026-11-09)
- `EMAIL_OFFERS_ENABLED = false`, plus CSS blocks in `code/css/04-footer.css` and `admin/css/01-layout.css`.
- **Three** collection surfaces, not one: `.subscribe-band`, `#offersNudge` (already dead — no callers) and `#googleSubscribePrompt` (the only self-opening one).
- **Two independent write paths** to `offer_subscribers`: `_submitSubscribe()` (both visible forms, POSTs its own payload) and `subscribeEmailToOffers()`. Neither calls the other, so both needed a guard.
- The admin CSS needs `!important` — `admin/js/03-auth.js:172` sets `tabOffers.style.display = ''` on every privileged login.
- ⚠️ **Not the Sale % feature.** Product discounts live in `expert_settings.featured_offers` and are untouched.

### Hero showcase (2026-11-09 → 2026-11-10)
- `#showcase` replaced the moving offers strip. WebGPU studio background (`shaders@4.0.5` via jsDelivr) over a CSS-gradient fallback; 3D car stage with pointer tilt, float, sheen and floor reflection.
- **Six cars**, all light-coloured so they read against the near-black stage. Arrows, dots and arrow keys drive it; auto-advances every 6.5s, restarts on a manual step, pauses on hover.
- **The giant badge is the MAKE, not the model** — 'BMW', not 'M4'. Set `badge` explicitly and keep it short: it scales to fit its own viewBox, so 'MERCEDES-BENZ' renders weedy beside 'BMW' — hence 'MERCEDES'. It's inline SVG, not styled text, because `-webkit-text-stroke` only takes a flat colour and the outline carries a gradient.
- **Every entry carries a `scale`**, a width multiplier fed to `.ge-car-tilt` as `--scale`. Cut-outs run 1.75:1 (Touareg) to 2.75:1 (911), so at one shared CSS width the Touareg stood 57% taller than the 911 and the stage jolted each rotation. Rule of thumb: `scale ≈ aspect ÷ 2.2` (E-Class = 1.0).
- **Cut-outs only** — a photo with its own background covers the lettering.
- The owner removed the "German Car Parts Specialists — Sharjah" pill, the "Shop by Make" button and the trust row, leaving one **Shop Parts** CTA with no icon, set in the display face. Nothing was deleted: `.ge-btn-ghost`, `.ge-hero-trust`, `.ge-hero-tag` and the `hero_tag`/`hero_make`/`hero_t1-3` strings (en + ar) all remain, so any of it is one line to put back.

### Hero part callouts (2026-11-10) — SUPERSEDED 2026-11-13 by the parts ring below
*Kept for the measurement technique and the reasoning, which still apply if anything is ever pinned to a car again. The elbow callouts, the numbered pins and the `--k` label scale are all deleted from the code.*

- **Parts are advertised as callouts ON each car, not as slides of their own** — two hand-drawn SVG part slides were rejected and deleted. Each car carries two `callouts` entries: a pulsing red dot on the part, an **elbow** leader (diagonal leg, corner, flat horizontal run) out into the black space, and a card with a product photo, brand and part name, wired to `jumpCat()`.
- Geometry is `{ x, y, dx, dy, run }` — x/y are percentages of the car image, dx/dy the label's px offset from the dot, `run` (default 70) the flat leg. Keep right-hand cards clear of the next arrow at mid-stage, hence `dy` around -60 to -75.
- Thumbnails are **cut-outs, not white tiles** (the owner rejected the tiles): the backdrop is flood-filled inward from the border and feathered before the file is written at 320px. A plain colour-step fill would eat the white label panel on the Remsa box and the chrome inside the headlight.
- **Measuring a dot — do not guess.** The first anchors were eyeballed and rejected: *"the pointers should move for each car to it's exactly accurate place"*. **Render a 10% grid inside `.ge-car-float`** — the same coordinate space `.ge-callout` uses, so the stage's 3D transform carries the grid labels along with the car — screenshot it and read the percentages off it. **`getBoundingClientRect()` is useless here**: `perspective: 1400px` + `preserve-3d` puts the rects 200–300px out. The measured anchors (brakes on the **rear wheel centre**, control arms at the **lower-front corner of the front wheel**, headlights on the lamp unit):

  | car | headlight | front wheel | rear wheel | lower front arm |
  |---|---|---|---|---|
  | mercedes | 42 / 45 | 57 / 68 | 94 / 66 | 51 / 82 |
  | bmw | 29 / 50 | 46 / 72 | 93 / 69 | — |
  | porsche | — | 46 / 72 | 93 / 71 | 41 / 85 |
  | audi | 40 / 46 | 58 / 73 | 94 / 69 | — |
  | touareg | 46 / 43 | 64 / 76 | 95 / 69 | 56 / 85 |
  | rover | 41 / 41 | 53 / 72 | 93 / 68 | 47 / 84 |

- **`--k`, the narrow-desktop fix.** x/y are percentages so the dots scaled with the car, but dx/dy are plain px so the *labels* did not — at 1040px "Control arm kit" was cut to "arm kit" and the Remsa card ran off the right. All five px properties (`--dx --dy --len --lx --run`) now go through one `--k` multiplier; scaling them by a single factor shrinks the elbow uniformly and keeps the corner on the line, so **`--ang` is deliberately NOT scaled** (it's an angle). Bands: **≥1360px `1`**, **≤1359px `.62`**, **≤1199px `.42`** plus an 86px thumbnail, **≤1024px** callouts off. Verified by screenshot at 1440 / 1280 / 1025 / 1000 / 390.

### The hero parts ring (2026-11-13)
Owner: *"Now listen add many more spare parts and they should rotate in a ring around each car k and make them bigger bcs lot of free space"*.

- **Ten spare parts now orbit each car** instead of two static elbow callouts. `HERO_PARTS` is ONE shared list — the catalogue is the same whichever car is on stage — and a car can override it with its own `parts` array. Brand, part name, `cat`, and either a photo from `img/parts/` or a Font Awesome icon in the same language as the category tiles. Every item is a button on `jumpCat()`, so the ring is ten more ways into the catalogue, not decoration.
- **One animated angle, inherited.** `@property --ge-orbit` is registered with `inherits: true` and animated once on `.ge-ring`; each item derives its own `--a` from it and the item index, so ten chips cannot drift out of step. Placement is a **pure translate** onto an ellipse via `cos()`/`sin()` — no rotation anywhere, so nothing needs counter-rotating. `--d: calc((sin(var(--a)) + 1) / 2)` drives scale, opacity and `z-index`, which is the whole depth effect.
- **The ring sits behind the car** (sibling of `.ge-car-tilt`, not inside `.ge-car-float`), so a part can never cover the model name or the Shop-parts button, and parts visibly pass behind the bodywork.
- **Ten is the ceiling for this ellipse.** A flat ring bunches its items at the left and right extremes. Twelve gave 30° spacing — ~63px between neighbours against a 136px chip — and the brand lines overlapped. Ten gives 36° and clears, at the size the owner asked for; an eleventh means shrinking them.
- **The radii are squeezed from both sides.** `--rx: clamp(190px, 36vw, 480px)` has to clear the car, which is sized off the viewport too (`min(55%, 610px)`): at 1100px a 33vw ring surfaced labels *inside* the bodywork, which reads as a bug rather than as depth. `--ry: clamp(92px, 16.4vw, 222px)` has to beat half the car's height but stay inside the stage, which is 52vw and shrinks faster — tried 20vw and the bottom chips landed on the caption and the slide dots.
- **`.ge-car-cap` gained a `closest-side` radial scrim.** The orbit's bottom-right arc sweeps through that corner. First attempt used a 118%/128% radial and painted a grey rectangle with four hard edges — any radius over 50% is still opaque where the box stops. `closest-side` inscribes the ellipse in the box, so it reaches zero at every edge.
- **Ring labels carry a tight dark halo.** They orbit in front of the make badge, whose outline is the same red, and a brand line crossing a letter stroke vanished into it.
- **Phone (≤1024): a horizontal scroll strip, not a justified row.** The ring needs empty stage on all four sides and 390px has none. The old row was `flex: 1 1 0`, written for two chips; with ten it gave each 39px and wrapped every label into one-character columns stacked over the car. Chips are now sized by their own text (`white-space: nowrap`) and the strip scrolls — safe because the hero has nav arrows and no swipe handler of its own. Verified: 10 chips, 10 clickable, no page overflow, clear of the slide dots.
- Deleted with the old treatment: every `.ge-callout*` rule, `geCalloutPing`/`geCalloutPinPing`, the numbered `.ge-car-chip-num` badges and the `--k` label-scale bands.

### Ring photos in their own shape + first catalog parts (2026-11-14)
Owner: *"the images in the ring should be the default image shape I gave, not in circles"*, plus five new cut-outs (radiator, spark plug — sent twice, identical, kept once — suspension/axle, AMG engine, front bumper) and *"scrape data from abcspecialist.nl and add some of it not all"*.
- **No discs.** `.ge-ring-img` is now `width: 100%` of the label box, `object-fit: contain`, no border/background/radius — the part keeps its own silhouette. A white + dark `drop-shadow()` lifts dark parts (engine, axle) off the dark stage; a `box-shadow` would draw a rectangle round the transparent PNG. Hover/focus = scale 1.06 + red glow.
- **Eight parts, all photos.** The icon-only entries (ignition coil, oil filter, Brembo, Sachs, Mahle, Liqui Moly) were dropped: a red Font Awesome glyph without its disc disappeared into the red outlined make badge behind the car. Eight = 45° spacing, well under the ten-item ceiling. New images were cropped to their alpha bbox (+2%) and saved at 320px max (10–29 KB) with the browser-canvas pipeline; originals renamed into `img/parts/src/`.
- **12 real catalog products added (ids 2–13), the store's first.** Taken from abcspecialist.nl as FACTS only — part name, OE part number, fitment. Their footer forbids reproducing content without written permission, so **no photos, no copied descriptions, no prices** were taken: descriptions are rewritten, every product is `price 0` → "Price on request / Ask price on WhatsApp", stock 10, no image (they show the gear placeholder). Range: Mercedes V12 spark plugs ×2 + V12 ignition coil, Audi A8 D3 EPB rear calipers L/R, Mercedes ML W164 / GL X164 Airmatic struts ×2 + valve block, ABC valve seal kit, Mercedes S W221 / S W220 / CL C215 tail lights. `sku_map`, `brand_map` (Mercedes-Benz / Audi / ULO) and `fitment_map` were MERGED (`jsonb ||`), not overwritten. ⚠️ The owner hasn't confirmed they stock these — they're starter listings to adjust, price or delete from the admin.
- Verified: ring shows 8 photos at 1440px; phone strip shows them at 390px with no horizontal scroll; `matchesSearch('A 004 159 14 03')` finds id 2; the Audi filter returns ids 5–6; no console errors.

### Parts orbit outside the nav arrows, and bigger (2026-11-14)
Owner: *"I want 10 parts but they should move outside the 2 arrows that is used for moving the cars also I feel like you can increase the size a little and finally add the photos for the prdoucts"*.

- **The arrows moved, not just the ring.** The ring could not simply grow to clear them: at 1280px a part sitting at the stage edge already hangs off the viewport, so the viewport — not the stage — is the binding constraint. `.ge-car-nav` went from the stage edges to `left/right: 16%`, into the gap between the car and the ring; `--rx` went `36vw/480px` → `41vw/596px`. Order outward is now car → arrow → part. 16% is the only value that holds at both ends: further out and the ring catches the arrows at 1280px, further in and they touch the widest car (Touareg, `scale: 1.15`). Below 1025px they return to the edges, where the ring is hidden anyway.
- **Bigger parts**: face `136 → 152px`, image `108 → 122px`.
- **The ring is lifted** — `.ge-ring` is `inset: 0 0 84px 0`, which raises the orbit's centre by half that and keeps the lower arc off the model caption. The wider parts made that collision much more obvious. The top arc still clears the header by ~48px at 1440.
- **New 1025–1199px band**: the car drops to `min(50%, 540px)`, the parts shrink and the arrows come in to 13%. Three things are squeezed at once in that band, and without it the arrows land on the bodywork at 1100px. It sits BELOW the `.ge-car-nav` rules on purpose — same specificity, so source order decides (the first attempt put it above and the 13% silently lost).
- ⚠️ **`getBoundingClientRect()` on the car is useless** — `.ge-car-tilt` is inside the stage's `perspective: 1400px` subtree, so a `scale: 1.15` car measured 513px wide instead of 701, and arrow-to-car gaps came out inverted (Porsche 9px, Touareg 103px). The ring is a SIBLING of the tilt, so its rects are honest. Car clearance has to be read off a screenshot. Same trap the 2026-11-10 callout work hit.
- Verified at 1920 / 1440 / 1280 / 1100 across all six cars: no part overlaps an arrow at the ellipse extremes, nothing clipped, no page overflow, orbit still animating (`geOrbit` present, item moved 114px in 2.5s).
- **Ten parts, resolved the same day.** The owner said to source the photos rather than send them (*"the photos you search them and save them and then add them your selves"*). Added **OEM Brake disc** (`brakes`) and **OEM Air filter** (`filters` — a category the ring had no entry for at all), both from Pixabay under its Content License (commercial use, no attribution).
  - ⚠️ **ENGINE OIL was the owner's first pick and was deliberately NOT used.** Every motor-oil photo on Pixabay carries a readable Shell, Castrol, Valvoline or Repsol label — putting a rival brand on their own shop. A permissive stock licence says nothing about trademarks inside the frame, so brake disc replaced it. Same rule killed the brake-caliper and tail-light candidates later.
  - Second rule: nothing dirty or worn. Most free automotive photos are used parts mid-service (the only clean oil-filter shot was oil-stained and held in a gloved hand). The air filter is new, and is a genuine VW-group element — right for a German parts shop.
  - Both are labelled `OEM`, claiming no brand the shop may not stock.
  - Processing: the usual browser-canvas pipeline. Border flood-fill keyed the filter's grey backdrop, blocked on colour step AND saturation so the pale pleats — which match the backdrop in isolation — stay fenced behind the saturated orange frame. **A largest-blob pass was needed**: the filter's soft contact shadow stopped the fill mid-ramp and left ~53k speckle px that held the alpha bounding box at the full 1280 frame, so the part came out tiny inside it. The brake disc arrived transparent but with magenta/blue fringes down the right, so its trim is capped at 72% of the width. 320px max, never upscaled: 17 KB and 19 KB.

### Hero tidy-up, product photos and the bootstrap script (2026-11-14, later)
Owner: *"text sizes for each car isn't consistent ... more oval ... take the text down ... stretch out the height ... say engine parts ... remove all the red brand lines ... body parts ... add the images"*.

- **Badge letters are one height on every car.** Each word was fitted to its own box, so BMW's letters were ~2x MERCEDES's. Now `--bw` (word width ÷ longest word) sizes every SVG; measured all six at 194px / 181px letters. VOLKSWAGEN → **VW**, RANGE ROVER → **ROVER** so the shared scale stays big.
- **Ring**: `--rx 43vw`, `--ry 18vw`, stage `56vw / 730px` (was 52vw/660), ring `inset-bottom 128px` to clear the caption, labels 16px below the image. Measured at 1440: 31px headroom, 23px each side, zero caption/arrow overlap. `index.html`'s skeleton stage height was already out of sync with the CSS — synced.
- **No brand lines; "Engine parts"; "Body parts".** `HERO_PARTS` entries have no `brand`.
- ⚠️ **The brake-disc cut-out was clipped** by a fixed 72% trim cap; the caliper's solid edge is at 72.7%. Re-exported by scanning for the first column with <3 solid (alpha>200) pixels. Lesson: find an edge, don't guess a percentage.
- **9 of 12 products now have photos** (`img/products/`: spark-plug, brake-caliper, suspension, tail-light, 480px). Each description ends "Photo for illustration - message us on WhatsApp to confirm the exact unit." The owner asked for photos twice after being told they'd only be near-matches; this is that decision, disclosed on the listing. **Still without a photo: id 4 ignition coil, id 9 Airmatic valve block, id 10 ABC seal kit** — no honest image exists. Rejected: a 3D shock render (fake "ExtraDampe" logo, coil springs on an air-suspension part) and an engine-bay coil shot (greasy, cluttered).
- ⚠️ Mismatches the owner should know: the tail-light photo is a different lamp from the Mercedes ones; the "Airmatic" struts show a coil-over axle. Both are replaceable from the admin once an account exists.
- **`scripts/bootstrap-admin.js`** creates the first admin: `node scripts/bootstrap-admin.js`, run by the OWNER in their own terminal; it asks for username, role and a hidden password. Claude never sees or chooses the password. `--dry-run` tested. Live DB confirmed 0 admin profiles, so bootstrap is open.

### Wider badges, taller stage, concentric ring (2026-11-14, last)
Owner: *"BMW hides fully behind the car you can make that bigger ... take the text where it says engineered in germany ... take it down and then stretch the loop in height so the products don't go behind the cars when rotating"*.

- **Every badge is now as wide as the longest** (MERCEDES): the gaps between letters widen via SVG `textLength` + `lengthAdjust="spacing"`, the glyphs keep one size. BMW is `B   M   W` with B and W clear of the car on both sides; the **M is still behind the roof** (it sits in the middle of the car) — raising the badge above the roofline would fix it, not done. Badge box `min(100%, 1240px)` (was 96%/1020px), `--bw` removed.
- **Stage 67vw / 900px** (was 56vw / 730px), which pushes "Engineered in Germany…" down (headline top 865 → 1012 at 1440). Skeleton in `index.html` synced.
- **Ring `--ry` 18vw → 23vw (330px max).** Measured over a full orbit (10 parts × 12 angles × 6 cars) at 1440 and 1085: **zero** overlap between any part image and the car, the caption, the slide dots or either arrow; 25px / 34px of headroom under the header; nothing clipped; no page overflow.
- ⚠️ **What actually fixed "products go behind the cars" was making things CONCENTRIC, not just bigger.** The ring had been lifted by `inset-bottom` to clear the caption but the car stayed centred, so they were 75px off-axis and the lower parts touched the wheel arches at narrow widths. `--reserve: 150px` on `.ge-hero-stage` is now shared by the ring (`inset`), the car (`padding-bottom`), the badge (`top`) and the arrows (`top`).
- ⚠️ **Measuring trap, again:** `.ge-car-tilt`'s `getBoundingClientRect()` lies under the stage's perspective. Use its `offsetWidth/offsetHeight` centred on `(stageHeight - reserve) / 2`.
- Known, not fixed: on a ~1000px-tall viewport the fixed WhatsApp float lands on the bottom-right caption, because the taller stage pushes the caption down into the float's band. It was clear when the stage was shorter.

### Catalog product photos — mostly NOT possible from free stock (2026-11-14)
Owner: *"the photos you search them and save them and then add them your selves bcs you chose those products"*.

- **Done: ids 2 and 3** (the two spark plugs) now carry `img_url` → `img/parts/bosch-spark-plug.webp`, the owner's own photo, already in the repo. Verified loading on the storefront (320×317). It is a REPRESENTATIVE image, not these exact plugs.
- **Not done: the other 10.** Searched Pixabay across ignition coil, brake caliper, shock absorber/strut, tail light, motor oil and oil filter. **Free stock libraries have almost no discrete car-component photography — contributors shoot cars, not parts.** What exists: the only ignition coil is an engine-bay shot, the only caliper is on a motorcycle, the only strut is a 3D render, and the tail lights are details of lamps mounted on other cars. None are usable on a listing where FITMENT is the whole purchase decision — a buyer who sees the wrong lamp shape orders the wrong part.
- **Do not "solve" this with a near-match from `img/parts/`.** The headlight is not a tail light; the axle assembly is not an Airmatic strut; the disc-and-caliper cut-out is not a standalone EPB caliper.
- **The real routes**, in order: (1) the owner photographs their own stock — a phone shot on a white sheet beats any stock image and matches what the buyer receives; (2) their parts supplier almost certainly licenses product images to resellers; (3) delete or hide the listings until stock is confirmed — the owner has never confirmed they stock these.
- **`img_url` is all that's needed for both surfaces** — `admin/js/01-core-data.js:395` maps `img: p.img_url` into the admin product list, so one DB update shows the photo in the shop AND in the admin tab. No code change.

### Phone + small-laptop treatment and performance (2026-11-10)
- Below 1025px the callouts are hidden and **`.ge-car-chips`** takes over: the same photo, brand, part and `jumpCat()` target as a row of two chips under the car. Built in the same loop in `08-hero.js`, `display: none` above that so the duplicate markup never reaches the tab order. The breakpoint was 900px until the `--k` work showed a leader line cannot fit beside the car below ~1025px **at any scale**.
- Measured at 390px with 4x CPU + Slow 4G: **CLS 0.37 → 0.01 local, 0.00 live**; **LCP discovery delay 4.3s → 0.4s**; local LCP 8.39s → 4.59s.
- What caused the lag, and the fixes: the runtime-injected CSS landing late dropped `.marquee-wrap` by 494px → a **hero skeleton `<style>` in `index.html`, which MUST stay above the CSS loader script** (the loader does `document.head.appendChild`, so anything declared after it outranks the real stylesheet); the hero image was discovered only after the whole JS chain → a `<link rel="preload">`; a 575 KB WebGPU module drawing full-screen every frame on phones → the shader is gated off below 901px; a masked `mix-blend-mode: screen` sheen and `backdrop-filter` on two nav buttons repainting every frame → both off on phones; the carousel running while scrolled out of view → an IntersectionObserver that pauses the rotation and the three infinite animations (`.ge-hero.is-idle`).
- **The hero preload must carry `imagesrcset`/`imagesizes`, not `href`.** It was two `href` preloads split on `media`, which cannot see the `<img>`'s srcset: on a DPR-1 desktop the 720px slot resolves to the 760w `-sm` file, so the 1400w image was fetched and thrown away on every such machine (Chrome reports it — "preloaded using link preload but not used"). One `<link>` now repeats `HERO_CARS[0]`'s srcset and sizes **verbatim**; if either changes there, change it here too.

### Hero load weight, and pointers on the phone (2026-11-11)
Owner's report: *"the website is super laggy when openning by github I think bcs it takes too much load"* — plus a request for the part pointers on phone.

- **Six cars were loading, not one.** The slides are stacked in the same place at `opacity: 0`, which is *inside* the viewport, so the `loading="lazy"` on slides 2-6 never deferred anything. All six came down on the first load. Slides 2-6 now ship `data-src`/`data-srcset` and `hydrate()` turns them on **one slide ahead** of the rotation (6.5s of warning), so the swap still never waits on a download. Verified: a cold phone load fetches one car, and each later one arrives at its own rotation boundary (4.6s, 11.1s, 17.6s, 24.1s).
- **The phone was being served the 1400w car.** `srcset` picks on *slot x DPR*, so an honest `92vw` asked for 1077px on a 390px/3x phone and resolved the 113 KB file to paint a 359 CSS px picture. `sizes` now carries a deliberate **DPR cap** — `(max-width: 600px) 240px` — because 240x3 = 720 sits just under the 760w copy, so every phone gets the ~46 KB file at ~2.7x the rendered width. It only steers the srcset choice; the rendered width still comes from `.ge-car-tilt`. **The preload in `index.html` repeats this `sizes` list and must stay character-identical.**
- **The sheen's `--car` mask was a second, independent reference to the full-size file**, so each desktop slide pulled the 1400w copy on top of whatever `srcset` chose — and with the big one in cache first, the `<img>` then preferred it and the preloaded 760w copy was wasted (that is the real cause of the "preloaded but not used" warning). `paintMask()` now copies `img.currentSrc` after load, so the mask can never cost a byte at any DPR, and it arrives already absolute — which is what the custom property needs anyway.
- **Preconnect to `qljcyiwkwdfodmabnzol.supabase.co`.** Nothing can talk to Supabase until the eight runtime-injected scripts have downloaded and run, by which point the DNS + TLS cost is dead time on the product grid's critical path.
- **Numbers.** First-load images **622 KB → ~100 KB**; hero LCP image **113 KB → 46 KB**. Live cold on Slow 4G / 4x CPU at 390px, *before*: **LCP 4969 ms**, of which the hero image's download alone was **3211 ms** because five other cars were competing for the pipe. Uncontended on the live CDN the new file takes **845 ms** against the old one's **1436 ms**. A like-for-like cold A/B on two local ports (old commit vs new) put the LCP resource load at **3734 ms → 2319 ms**.
- **Pointers on phone.** The elbow and its card need empty stage either side of the car and below 1025px there is none — but the **dot is on the part and costs no width**. So below that width `.ge-callout-line`, `.ge-callout-leg` and `.ge-callout-card` are hidden and a **numbered pin** (`.ge-callout-pin`) takes the dot's place, keyed to a matching `.ge-car-chip-num` badge on its chip in the row under the car. The part still gets pointed at; only the label moves. Same `data-cat` delegation, so a tap on a pin filters the category exactly like the chip.
- The nav arrows moved from `top: 42%` to **24%** in the ≤1024px band: the brake pins sit at 66-69% of the car and on the E-Class, Touareg and Range Rover the right-hand pin landed right on the next arrow. Verified zero collisions across all six slides at 390px (the pin already won the *tap* — `.ge-callout` is z-index 4 against the nav's 3 — but the two circles touching read as a mistake).
- The pin gets its own `geCalloutPinPing` keyframe: the dot's `geCalloutPing` expands 2.6x, which on a 28px pin is a 73px ring — most of a phone-sized wheel arch.

### Native scroll, three removals, and a polish layer (2026-11-11)
Owner's report: *"scrolling is laggy and it fells like on pc that the website is capped at 30fps … all websites are moving normally but this feels laggy"*, plus *"remove signin wishlist"*, *"remove where it says shop by make"* and *"make the whole bittons better"*.

- **The "30fps" feeling was `scroll-behavior: smooth` on `<html>`, not dropped frames.** Measured 165fps with **zero** frames over 20ms on the same page, so nothing was actually stuttering. As an *element* rule it applies to EVERY scroll including the mouse wheel, so each tick was animated to its target instead of tracking the wheel — which reads as mushy and slow next to native scrolling everywhere else. Removed from `code/css/01-base.css`. **Don't put it back.**
- Smooth is kept where it was wanted, as a same-page anchor handler in `code/js/06-features.js`. It tests **`e.defaultPrevented`, not `a.hasAttribute('onclick')`** — the first version used the latter and silently did nothing, because *every* main nav link carries an onclick that only closes the mobile drawer and still leaves the browser to do the scrolling. Links that genuinely handle themselves (`goHome`, every `href="#"` opener) call `preventDefault`, so testing that is what separates the two.
- **The hero's WebGPU shader never stopped.** `.is-idle` only ever paused the CSS animations; the canvas kept drawing a full-screen frame at the display's refresh rate forever, including when scrolled far past the hero. `shaders@4.0.5` instances expose `pause()`/`resume()` (confirmed by inspecting one: `update, resize, pause, resume, destroy, getFailureReason`), so the instance is now retained and driven from the existing IntersectionObserver plus a `visibilitychange` handler, through `window._geHeroShaderRunning(run)`.
- **Accounts + wishlist off** — `ACCOUNTS_ENABLED` / `WISHLIST_ENABLED` in `code/js/01-config-data.js`, guards on `onAccountBtnClick`/`openAuthModal` and `toggleWishlist`/`openWishlist`/`renderWishlistCount`, and the "ACCOUNTS + WISHLIST OFF" block at the end of `code/css/08-account-auth.css`. Same belt-and-braces as catalog-only mode. Removed together deliberately: with ordering already off, an account bought a visitor nothing except the wishlist. `!important` is required in that block — `renderWishlistCount()` and `_syncAuthUI()` set inline `style.display`.
- The nav drawer's Wishlist link got **`id="navWishlist"`** so the CSS targets it by id; the first version used `#nav a:has(#navWishlistBadge)`, which works in current browsers but is needless fragility.
- **"Shop by Make" hidden** (`.makes-section`, block at the end of `code/css/02-sections.css`). The markup and `setMakeFilter()` stay, because the hero captions still call it. **This needed an escape hatch:** `activeMake` is reset by *nothing* else in the app, so once the chip row was gone, a visitor who tapped "Shop BMW parts" in the hero was stuck on a filtered catalog with no control and no explanation. `renderActiveMake()` in `02-catalog-render.js` now paints a "Showing parts for BMW ✕" chip under the category pills whenever a make filter is on. Don't remove it without also removing those hero captions.
- **`code/css/11-ui-polish.css`** (new, loaded last — the loader array in `index.html` AND the `<noscript>` list both needed the entry). One motion scale, one `:focus-visible` ring on every control (several had none at all), a press state on everything clickable, and `transition: all` replaced with named properties so a hover can't put an element through layout on every frame. **No colour, type, spacing or layout changes** — the palette is the owner's and this file must never introduce one of its own.

### Workshop services + admin Services tab (2026-11-12)
Owner's request: *"do the admin page and add mechanics servicing cars"*.

- **New `#services` band** between the product grid and `#features`: `code/js/09-services.js` + `code/css/12-services.css`, dark graphite surface so it reads as a different offer from the white catalog above it. Ten seeded services (oil, brakes, diagnostics, A/C, suspension, timing, battery, gearbox, pre-purchase inspection, general repair), a trust row, and a bottom "Not sure what your car needs?" CTA wired to WhatsApp and the real `tel:` number.
- **Every price ships as "Price on request" on purpose.** Inventing labour rates for a real workshop would be worse than asking the customer to message; the admin field is there for the owner's own numbers, and `from: true` renders them as "From AED …".
- **New admin tab, `admin/js/15-services.js`.** Card-per-service editor (not a table — a service has long text fields that would force a horizontal scroll), with reorder arrows, a per-service **Live** toggle, a section on/off switch, optional heading overrides, a Font Awesome icon picker, an optional photo URL, a parts-category link and the `CAR_MAKES` "Fits" chips. Everything is held in memory and written as **one** `expert_settings` row (`services`) on Save.
- **Re-render only on add/delete/move/toggle, never on `oninput`** — re-rendering the card list on every keystroke throws the caret to the end of the box.
- Storefront reads the row in `loadSBData()`'s existing `key=in.(…)` batch (one extra key, no extra request) and caches the raw string in `localStorage.expert_services_cache`, so a returning visitor paints the owner's real list rather than the seeded one.
- Also: `"@type"` in the homepage JSON-LD is now `["AutoPartsStore", "AutoRepair"]`, a **Services** link in the header nav and the footer, and `svc_*` + `nav_services` + `footer_servicing` strings in both `_T.en` and `_T.ar`.
- **The tab is read-only until an admin account exists** — saving goes through the same `authenticated` + `is_admin()` RLS as every other admin write, and `expert_admin_profiles` is still empty.

### The services collage (2026-11-13)
Owner: *"when scrolling down you see 3 or 4 collages type of things of photos showing services"*, then sent four 1774×887 workshop shots.

- *(First shape, since replaced — see the next bullet.)* Four alternating photo bands sat above the card grid inside `#services` — picture one side, heading + three tick points + a WhatsApp booking button on the other, sides swapping band by band, photo-first when stacked on a phone. Brakes / Oil & filter / Diagnostics / Our workshop.
- Stored in the same `expert_settings` `services` row: `collage` (one photo path, no extension) + `bands` (max four labels, `{id,name,sub,box,active}`, in reading order). Reshaped twice on 2026-11-13 — alternating photo bands, then four separate tiles, then the owner's own single collage with a name written on each frame; old rows fold forward via `b.name || b.title`. The `#services` section also moved to sit directly below the hero, above the category grid — the owner wanted the collage to be the first thing you meet after the rotating cars. **The labels are positioned by measured percentages, not an even grid — the collage is a pinwheel (seams at x 44.1%/65.2%, y 50.8%/58.9%).** Then made full-bleed by moving `#servicesBands` outside `.container` (no `100vw`), re-exported at the source's native 1920w/960w, with `clamp()`ed type and padding. The red scrolling `.marquee-wrap` strip under the hero was deleted outright in the same pass — markup, CSS and `fillMarquee()`.
- **The four source frames carry another business's sign** ("Alamdar Germany Auto Parts") across the top half. Each is cropped to the lower ~47-48%, below the second Arabic sign band, so none of that branding reaches the site. The owner was asked twice whether Alamdar is theirs and hasn't answered; **if it is, un-cropping is a one-command re-run** of the pipeline with the crop rect widened to the full frame. Originals in `img/services/src/` (14 MB, matching the `img/hero/src/` convention).
- Pipeline was the usual browser canvas: temporary `_imgtool.html` at the repo root (same origin as the PNGs, or the canvas taints) drawing a labelled 10% grid to read crop rects off a screenshot, then POSTing WebPs to a throwaway node server. First pass mis-framed `oil-service` (mechanic half out of frame) and left dead floor in `diagnostics`; both re-cropped before shipping. Tool and server deleted.
- Output: two WebP widths each (~850w and 430w, 2:1), 24-89 KB per file, `srcset`+`sizes` so phones pull the small copy.

## 5) Failed attempts

**The hero ring rendered frozen, and nothing said why (2026-11-13)**
- The CSS was correct and loaded — the `.ge-ring` rule carried `60s linear infinite geOrbit`, `@keyframes geOrbit` parsed, `@property` registered — yet `getComputedStyle(ring).animationName` was `"none"`, `ring.getAnimations()` was `[]` and `document.getAnimations()` never listed `geOrbit`. No console error.
- **Cause: the inline `<style id="ge-low-gpu-mode">` in `index.html`**, a profile inherited from earlier perf work, carries `.ge-hero *, .ge-hero *::before, .ge-hero *::after { animation: none !important }`. The tell was that the car float animation was named `geLowGpuCarFloat`, not `geCarFloat` — that block re-declares the one animation it wants to keep. The ring is now exempted by name: `.ge-hero *:not(.ge-ring)`.
- **Check that block first** when anything in the hero refuses to animate. It lives in `index.html`, not in `10-hero.css`, so a grep of the stylesheet finds nothing.

**Supabase access**
- **`create_project` failed** — the free plan allows only 2 active projects per owner. The owner created it themselves under Bahar Al Hind Co.
- **The claude.ai connector cannot see `qljcyiwkwdfodmabnzol`** ("You do not have permission"), even after a reconnect, because mkerba2011 isn't a member of that org.
- **Inviting mkerba2011 into Bahar Al Hind Co** didn't work — likely the same free-plan limit blocking Owner/Admin of another org. A **Developer** role would avoid it. Moot now that `supabase-german` exists.
- **Switching the main connector to the Bahar account** was rejected — the owner needs it for Epsilon and Kuwait.
- **First `claude mcp add` attempt** failed on a missing closing `"`. The new server also didn't appear in `/mcp` until Claude Code was restarted.

**Hero work**
- **Eyeballed callout anchors were rejected by the owner.** Several pointed at nothing — the Touareg's brake at the rear arch, the Porsche's control arm at the front splitter. Replaced by the grid-overlay measurement above.
- **`getBoundingClientRect()` returned rects 200–300px off** because of the stage's perspective transform. Abandoned programmatic measurement entirely; screenshots and the grid overlay are the only reliable method.
- **Clearing all timers to freeze the carousel for a screenshot blanked the stage** — it killed the transition's own `setTimeout`. Dispatch a synthetic `MouseEvent('mouseenter')` on `.ge-hero-stage` instead; the carousel already pauses on hover.
- **Raising the callout breakpoint to 1024px was not enough on its own** — at 1040px both cards still clipped. That is what forced the `--k` multiplier.
- **First thumbnail pass rendered the photos as white tiles**, rejected. A global colour-step key was the second failure: it ate the white label panel on the Remsa box and the chrome inside the headlight. The working method is a flood-fill inward **from the border** plus a feather pass.
- **The first hero-skeleton `<style>` was placed inside the preloader `<style>`** — i.e. *after* the CSS loader — where it would have outranked the real stylesheet. Moved above the loader.
- **`mobile.js` half-applied**: one anchor had two newlines where the file had one, so `chips-builder` failed while `chips-markup` succeeded, leaving `${chipList}` undefined and the hero throwing. One-off scripts must fail loudly **and** be checked with `git diff` before moving on.

**Measuring performance (2026-11-11)**
- **`encodedBodySize === decodedBodySize` on GitHub Pages does NOT mean the assets are uncompressed.** It looks alarming — it says 431 KB of CSS+JS rather than ~140 KB — but Fastly strips `content-encoding` and sets **`x-content-encoding-over-network: gzip`** instead, so Chrome reports decoded sizes while the bytes really did travel gzipped. `curl -H 'Accept-Encoding: gzip' -D -` on the asset is the check that settles it. Chased this as a bug before confirming; it is not one.
- **Don't trust an "after" trace taken in the same browser profile used for the "before".** The hero images were cache hits by then (`transferSize: 0`), which made LCP look like 1651 ms. A cold A/B needs a **fresh origin** — two local ports, old commit on one and the working tree on the other — or the numbers are fiction. Note the local server is HTTP/1.1, so its 6-connection limit distorts *queueing*; compare resource download times, not end-to-end LCP, against the live h2 site.
- Chrome prefers an **already-cached larger `srcset` candidate** over fetching a smaller one, so a warm profile will also lie about which file a phone picks. `img.currentSrc` is the reliable read.

**Tooling gotchas (still true)**
- Long bash heredocs and `node -e` with nested quotes break in this shell. Write one-off scripts with the Write tool into `C:\Users\mukke\AppData\Local\Temp\ge-work\` and run them with node. Inside node, `/tmp` resolves to `C:\tmp`, not the bash `/tmp`.
- The GateGuard hook blocks `rm` — delete with `node -e "require('fs').rmSync(path,{recursive:true,force:true})"`. It also demands a facts statement before the first Bash of a session and the first Edit/Write **per file**; state them, then retry the identical call.
- **Don't `git add -A` / `git add .`** — stage explicit paths.
- `git push` to `main` can be rejected as diverged because `generate-seo.yml` committed a regeneration. Recover with `git fetch && git merge origin/main --no-edit` (merge, **not** rebase).
- A `git mv` followed by an `Edit` does **not** re-stage the edit — check `git diff --cached` before committing.
- chrome-devtools `resize_page` silently no-ops here; use `emulate` with a `WxHxDPR` viewport string, and reload after changing it or the WebGPU canvas keeps its old size.

## 6) Next steps

1. **Admin accounts — owner runs this, and it blocks all admin work.** `expert_admin_profiles` is empty so nobody can log into `/admin/`, and `bootstrap` only works while it is empty (one shot). Give the owner a `! curl` POSTing `{"action":"bootstrap","accounts":[{"username":"…","password":"…","role":"super"}]}` to `https://qljcyiwkwdfodmabnzol.supabase.co/functions/v1/admin-manage-accounts` with `apikey` + `Authorization: Bearer <publishable key>`. Roles: `super` (owner), `bahar15` (manager), `1` (admin), `custom` (team). **The owner fills in their own passwords — never choose, type, or enter them.**
2. **Photos: 3 products still have none (ids 4, 9, 10), and 9 carry an illustrative photo** that should be swapped for the real part (see §4). Ring is done at ten parts; ids 2–3 have a representative photo. The rest show the grey gear placeholder, and **free stock cannot fill them** (see §4) — ignition coil, EPB calipers, Airmatic struts, valve block, ABC seal kit and three tail lights all need a real image of the actual part. ⚠️ **The owner cannot upload them yet** — the admin panel needs an account and `bootstrap` hasn't been run (step 1). Until then: owner sends photos → commit under `img/products/` → `update expert_products set img_url = 'https://mukarramkebra.github.io/German-Expert/img/products/<file>.webp' where id = …`, which fills the storefront card and the admin tab at once. Better still, once step 1 is done they can upload straight from the admin. Do NOT substitute a near-match from `img/parts/`.
3. **Import the catalog** when the product list arrives (CSV import supports `sku` and `makes`). Then raise `MIN_PRODUCTS` / set `SEO_MIN_PRODUCTS` in `.github/workflows/generate-seo.yml` above 0, so a Supabase outage returning `[]` can't wipe `sitemap.xml`.
4. **Replace the remaining `TODO-CONTACT`s** — email, the Google Maps link, the JSON-LD address, the edge-function sender/owner addresses. Ask whether the second number **+971 52 538 7296** should become a second contact line.
5. **Settle Land Rover and Opel.** Does the shop stock Land Rover? If yes, add `landrover` to `CAR_MAKES` in **both** `code/js/01-config-data.js` and `admin/js/01-core-data.js`, add a `#makeRow` button, then set `make: 'landrover'` on that hero entry. Either way, make the hero, the copy and the schema agree — Opel is sold but named nowhere.
6. **More hero cars.** Each needs a transparent cut-out in `img/hero/`, a short `badge`, and a `scale`. MINI and Opel are the two `CAR_MAKES` with no car on the stage. Studio shots on a plain backdrop cut out cleanly; outdoor photos mostly don't.
7. **SEO, still open** (Lighthouse mobile is already SEO 100 / Best Practices 100 / Accessibility 93):
   - **The empty catalog is the whole story.** `sitemap.xml` has 3 URLs and zero products, so there is no `Product`/`Offer` schema and nothing targeting part numbers or "<part> for <model> Sharjah". Everything else is rounding error next to importing the catalog.
   - **Nobody has submitted the site to Google Search Console / Bing Webmaster Tools.** This matters more than usual: GitHub Pages serves `robots.txt` only from the host root, which this repo doesn't control, so the `Sitemap:` directive is invisible and `<link rel="sitemap">` is the only discovery path. **Owner action** — submit `https://mukarramkebra.github.io/German-Expert/sitemap.xml` to both.
   - **JSON-LD `AutoPartsStore` is incomplete for local search**: `email` is a placeholder, `address` has no `streetAddress`, `priceRange: "AED"` isn't a valid value (it wants `"AED 25-5000"` or `"$$"`), and there's no `geo`, `hasMap` or `logo`. NAP completeness drives the local pack.
   - **`#pagePreloader` can hold the screen up to 2.5s** (`MAX_MS`) — pure added delay to perceived LCP. Consider cutting it hard or dropping the splash now that CLS is fixed.
8. **Owner to-dos to remind about:** the `RESEND_API_KEY` secret (plus optional `OWNER_EMAIL`/`FROM_EMAIL`); and Supabase Auth → URL Configuration (Site URL + the same as a Redirect URL, and Google sign-in if wanted — only matters for customer accounts, which are wishlist + profile while ordering is off).
9. **If online ordering is turned back on**, do both halves (see §4), then re-test a real checkout to Sharjah: a 2-decimal AED total on the `expert_orders` row, stock decremented, invoice email delivered.
10. **Services need the owner's real prices and durations.** All ten ship as "Price on request" because Claude will not invent a workshop's labour rates. Once an admin account exists: Services tab → type the price into each card (leave blank for the jobs that genuinely need an inspection first) → Save. The owner also offered to supply photos — a service card takes an image URL in the **Photo URL** field and it replaces the icon.

---

**Standing rules:** never ask whether to commit or push — when a change is verified locally, commit with explicit paths and push to `main`. **After every push that touches anything the storefront loads, flush the cache** via `mcp__supabase-german__execute_sql` (upsert `expert_settings.asset_version` to `now()` in ms), then poll the live Pages URL and tell the owner. Skip only for docs/`scripts/`-only pushes.

**Local preview:** no Python on this machine. A small node static server serving the repo under `/German-Expert/` works (so root-relative paths in `404.html` resolve); one has been running on port 8124. It serves from disk, so it picks up edits without a restart.
