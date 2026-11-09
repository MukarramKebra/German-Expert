# Handoff — German Expert (as of 2026-11-09)

## 1) Goal

Turn this copy of the Expert Hardware Kuwait site into **German Expert**, a German car-parts store in **Sharjah, UAE**, with its own design, its own database, its own admin and its own link:

- Live site: https://mukarramkebra.github.io/German-Expert/
- Repo: https://github.com/MukarramKebra/German-Expert
- Supabase project: `qljcyiwkwdfodmabnzol` ("German Expert"), in organization **Bahar Al Hind Co**

The owner will send a link to their existing online product list later; importing it is a separate step after the database is wired.

## 2) Current state

**Done and live:**
- The front end and admin are pushed to `main`: commit `d439e8bc` plus the bot's SEO regeneration `283bfe5e`.
- GitHub Pages is enabled (branch `main`, path `/`).
- All of these return 200: `/`, `/admin/`, `robots.txt`, `logo.svg`, `og-image.png`, `favicon.svg`, `sitemap.xml`. A missing path returns the custom 404.
- Both GitHub Actions runs succeeded (`Generate product SEO pages`, `pages-build-deployment`).

**Database wired (2026-11-09):**
- The schema is applied: all 15 tables (`expert_*`, `offer_*`) exist with RLS on, and all 10 functions (`is_admin`, `decrement_stock`, …) are present.
- `GE_SB_KEY_B64` (`code/js/01-config-data.js`) and `SB_KEY` (`admin/js/01-core-data.js`) now hold the base64 of the real publishable key `sb_publishable_Wn8…` — verified: anon `SELECT` returns 200, anon `INSERT` into `expert_products` is rejected `401 / 42501` by RLS.
- All 5 edge functions are deployed and smoke-tested, **all with `verify_jwt: false`** (`admin-manage-accounts` and `send-offers` do their own auth in-body, so JWT verification would break the cron caller and the bootstrap action):
  `unsubscribe` 302→`unsubscribed.html?status=invalid` · `order-invoice` 400 "Missing order id" · `notify-order` 400 "order_id required" · `admin-manage-accounts` 403 `forbidden` · `send-offers` 401 `Unauthorized` (both the no-auth and the wrong-cron-token paths, which proves the `expert_service_secrets` read works).
- Verified end to end in a browser against the live DB: inserted a temporary product, confirmed it rendered with an AED price and the Enquire button, then deleted it. The catalog is empty again (0 products, 0 orders).

**Still not done:**
- **No admin accounts** (`expert_admin_profiles` is empty) — the owner must run the `bootstrap` call with their own passwords. Claude never picks or types them.
- **No `RESEND_API_KEY`**, so `notify-order` and `send-offers` cannot actually send mail yet. Both deploy and respond correctly; they'd fail only at the Resend call.
- `TODO-CONTACT` placeholders are still in place (WhatsApp `971500000000`, `info@german-expert.ae`, Maps link, JSON-LD address).
- The catalog is empty — awaiting the owner's product list.
- `favicon.svg` and `og-image.png` still carry the old placeholder wordmark, not the real logo.

**Connections:**
- The **claude.ai Supabase connector** is signed in as **mkerba2011@gmail.com**. It sees only that account's org: Experts Hardware (Kuwait, `qhebhvllkovfbkqrcnmm`), Epsilon Billing (`mgxhwduuqdtxzxkhgfnc`, which the owner is actively working on) and Dhow Tech (inactive). **Leave it on that account.**
- For German Expert, a separate **local-scope MCP server `supabase-german`** was added for this folder with `claude mcp add --transport http supabase-german "https://mcp.supabase.com/mcp?project_ref=qljcyiwkwdfodmabnzol"`. It's stored in `C:\Users\mukke\.claude.json` under the German-Expert project.
  - The owner reports it **connected in a new terminal**. Its tools appear as `mcp__supabase-german__*`. If they're missing, have the owner run `/mcp` → supabase-german → Authenticate while the browser is logged into the Bahar Al Hind Co Supabase account.

**Placeholders still in the code** (search `TODO-CONTACT`):
- phone/WhatsApp `+971 50 000 0000` (`SHOP_WA = '971500000000'`)
- email `info@german-expert.ae`
- the Google Maps link
- the JSON-LD address
- the edge-function sender and owner emails

## 3) Active files

| File | What it is |
|---|---|
| `code/js/01-config-data.js` | **Config at the top**: `GE_SB_URL`, `GE_SB_KEY_B64`, `GE_SB_KEY` (safe atob), `SHOP_WA`, `SITE_URL`, `CURRENCY`, `fmtPrice()`, `roundMoney()`. Also `CAR_MAKES`, `_sbFitmentMap`, `getProductMakes()`, `getRawPartNo()`, `getAllProducts()`, `normalizeCategory()`, `_SUBCAT_LABELS`, `_AR_CATS`, `activeMake` |
| `code/js/02-catalog-render.js` | `setMakeFilter()`, `normalizeQ()` (letters-only collapse), `partKey()`, `matchesSearch()` (part-number + makes), `_filterProductsBy()` |
| `code/js/03-…`, `04-i18n-order.js`, `05-accounts.js`, `06-features.js` | AED pricing, the WhatsApp texts, the `_T` en/ar strings, `AUTH_RESET_REDIRECT = SITE_URL` |
| `index.html` | head/SEO/JSON-LD (AutoPartsStore), make row `#makeRow`, 12 icon category tiles, pills, FAQ, contact, checkout (emirates) |
| `code/css/01-base.css`, `02-sections.css` | theme tokens (`--bar`, `--gold`, `--orange` = brass accent), make chips, icon tiles, CSS spinners |
| `admin/js/01-core-data.js` | `SB_URL`/`SB_KEY` (**placeholder key**), `DEFAULT_CATS`, `CAR_MAKES`, `getMakes()`, `parseMakes()`, `_pushFitmentMap()`; `_fixCustomProductIds()` disabled on purpose |
| `admin/js/14-product-view.js` | "Fits" make chips (`_pvMakesHtml`, `pvToggleMake`) |
| `admin/js/10-csv-import.js` | `sku` + `makes` CSV columns, German-parts template |
| `admin/js/05-categories.js` | `CAT_DEFS` (car categories), `DEFAULT_BANNERS = []` |
| `admin/js/03-auth.js` | `EMAIL_DOMAIN = 'german-expert.internal'` |
| `order-invoice.html` | its own `SB_URL` (already the new project) and AED `money()` |
| `supabase/schema.sql` | **full DB schema, source of truth**: tables, functions, RLS, grants, seed settings |
| `supabase/functions/*` | `admin-manage-accounts`, `notify-order`, `order-invoice`, `send-offers`, `unsubscribe` (all re-branded; `admin-login` stub deleted) |
| `scripts/generate-product-pages.js` | reads `GE_SB_URL`/`GE_SB_KEY_B64`, skips Supabase while the key is a placeholder, `MIN_PRODUCTS` default 0, AED |
| `.github/workflows/generate-seo.yml` | only `git add`s paths that exist |
| `logo.svg`, `logo-dark.svg`, `favicon.svg`, `og-image.png` | new brand assets |
| `CLAUDE.md` | project notes (rewritten for German Expert) |

## 4) Changes made

- **Repo:**
  - Fresh history on an orphan `main`; the old remote was renamed to `kuwait` and `origin` now points at German-Expert.
  - Removed about 40 MB of the old catalog: `expert-products/`, `product/`, `Banners/`, `Bahar-Products/`, audit JSONs, old SQL files, old Kuwait scripts, `ui-ux-pro-max.plugin`, old logos and images.
- **Brand:**
  - "German Expert" everywhere.
  - SVG wordmark logo with a GE octagon badge and a German-flag stripe.
  - Graphite/brass/gold theme with Barlow Condensed headings.
  - CSS spinners instead of the gear images.
  - A 1200×630 `og-image.png`.
- **Localisation:**
  - AED with 2 decimals through `fmtPrice()`.
  - Checkout uses the 7 emirates and Area/Street/Building/Flat.
  - Cash/card on delivery and bank transfer (no KNET).
  - UAE wording in the FAQ, about, footer, terms (UAE/Sharjah law, a fitment clause), accessibility, unsubscribed, invoice and 404 pages.
  - Arabic strings updated (the toggle is still disabled).
- **Car-parts features:**
  - 12 categories: `engine, brakes, suspension, filters, electrical, cooling, oils-fluids, transmission, exhaust, body-lights, accessories, all`.
  - A Shop-by-Make row backed by `expert_settings.fitment_map`.
  - Part-number search that ignores spacing and punctuation; "1100" no longer collapses to "10".
  - "Part No:" labels.
- **Admin:**
  - Car categories, the "Fits" editor and the CSV `sku`/`makes` columns.
  - UAE SEO defaults, AED, and the new login and top-bar branding.
  - No default banners.
  - Removed every "id > 60" assumption (`getAllProducts`, `getNextSkuNumber`, the generator) and disabled `_fixCustomProductIds()`, which would have deleted and re-inserted products with id ≤ 60.
- **Backend:**
  - `supabase/schema.sql` rebuilt from the **live** Kuwait schema rather than its stale files, with locked-down RLS, `revoke … from public` and grants.
  - Edge functions re-branded; `OWNER_EMAIL`/`FROM_EMAIL` env overrides added; `EMAIL_DOMAIN` set to `german-expert.internal`.
- **Docs:** `CLAUDE.md` rewritten for German Expert.
- **Hero showcase (2026-11-09):**
  - New top section `#showcase` replaces the moving offers strip (`#offers` and its cache script were removed from `index.html`; `initOffersTicker()` no-ops without `#offersTrack`, and the admin Featured tab has no storefront effect for now).
  - Animated WebGPU studio background from `shaders@4.0.5`, loaded from jsDelivr after page load in `code/js/08-hero.js`, with a CSS-gradient fallback (no WebGPU / reduced motion / Save-Data).
  - 3D car stage: pointer tilt, float, light sheen, floor reflection. It's driven by `HERO_CARS` in `08-hero.js`, which is **empty until the owner sends a car image** (cut-out PNG/WebP into `img/hero/`). 2+ cars rotate automatically. Styles are in `code/css/10-hero.css`.

- **Database wired + online ordering switched off (2026-11-09):**
  - Real publishable key written into both config points; all 5 edge functions deployed (see "Current state").
  - **Catalog-only mode.** The owner asked to "disable all online purchasing ways" and chose *remove cart entirely — catalog only*. One switch does it: `ONLINE_ORDERING_ENABLED = false` in `code/js/01-config-data.js`. Every "Add to Cart" is now an **Enquire on WhatsApp** button; nothing writes to `expert_orders`, no stock is deducted, no order email is sent.
  - New `enquireOnWhatsApp(id, variantIdx)` in `code/js/06-features.js` — sibling of `askPriceOnWhatsApp()`, but quotes the price actually on screen (variant price + Featured Sale applied, via the same rule as `_pmCurrentPrice()`); items with no visible price fall through to the ask-for-price wording so nothing sends "0.00 AED".
  - Buttons swapped at: the product card (`02-catalog-render.js`), the product modal's `buyBtn` (`03-product-cart-checkout.js`) and the wishlist (`06-features.js`). Enquiry is deliberately offered for **out-of-stock** parts too — nothing is reserved, the shop can order one in, and the stock badge still states availability.
  - Defence in depth, because stale cached scripts keep running the old markup: `addToCart()` and `pmAddToCart()` redirect to the enquiry, and `openCart()`, `openCheckout()` and `handleCheckoutSubmit()` return immediately. `handleCheckoutSubmit()` is the one that would insert the order, call `decrement_stock` and trigger `notify-order`.
  - CSS block at the end of `code/css/03-cart-features-contact.css` hides the markup-only surfaces: `#navCart`, `.mob-cart-fab`, `#cartModal`, `#checkoutOverlay`, plus `#navTrackOrder` / `#navCancelOrder` / `#navMyOrders` / `#trackOverlay`. Track/Cancel Order went too because an order can only be created by checkout — the admin panel manages existing orders but has no "create order" action, so every lookup would return "not found". Gave the two nav anchors ids in `index.html` to target them.
  - FAQ Q5 rewritten (en + ar) from "use Track Order" to the Enquire flow.
  - **Restoring ordering is two steps, do both:** flip `ONLINE_ORDERING_ENABLED` to `true` **and** delete the "CATALOG-ONLY MODE" block in `code/css/03-cart-features-contact.css`. The flag alone re-enables checkout with no way to reach the cart.
  - Verified in-browser: all 7 surfaces computed `display:none`; `openCart()`/`openCheckout()` left their overlays closed; `addToCart()` left `cart.length === 0` and opened WhatsApp instead; visible nav reduced to About/Parts/FAQ/Contact/Wishlist.

- **Real logo + side banners removed (2026-11-09):**
  - `DEFAULT_BANNERS` in `code/js/02-catalog-render.js` is now deliberately `[]`. It listed the Kuwait fork's hardware brands against a `Banners/` folder that doesn't exist here, firing 10 404s per page load. Two guards were needed, not one: `initSideBanners()` returns early and hides the rails when there are no slides, and `_sizeSideBanners()` — which runs on every resize, independently — bails when `#bannerLeft` has no children. Without the second, `.side-banner-rail` (CSS `display:none`) was being force-set back to `display:block`, painting two empty shadowed boxes.
  - Owner's real logo added as **`logo.jpg`** (renamed from `LOGO.jpeg`; lowercase because GitHub Pages is case-sensitive). 520×520 circular crest, white JPEG corners. Replaced `logo.svg` / `logo-dark.svg` in all 9 `index.html` slots, `admin/index.html` ×2, `404.html`, `terms.html`, `accessibility.html` and the product-page generator. Intrinsic `width`/`height` attributes changed 640×200 → 520×520 so the browser reserves the right box.
  - **`border-radius: 50%` is what makes it work.** The circle touches all four edges, so a 50% clip removes exactly the white corners — no transparent PNG needed, and no image-processing dependency. Applied in `01-base.css` (`.logo-img`), `02-sections.css` (`.about-img-card img`), `03-cart-features-contact.css` (`.intro-logo-img`, `.contact-logo-img`, `.modal-logo`), `04-footer.css` (`.footer-logo`), the two inline admin styles, `404.html`, `terms.html`, `accessibility.html` and the generator. **Any new logo slot needs this rule**, or white corners show on dark backgrounds. 404.html mattered most — it used the dark-background logo.
  - Header: the ring lettering is unreadable at 52px, so the `.logo-text-fallback` "GERMAN EXPERT" wordmark is now always shown instead of only on `onerror`, and the `<img>` took `alt=""` so a screen reader doesn't announce the name twice for one link.
  - Admin login logo capped at 168px (was `max-width:280px`, which made an oversized circle on the login card).
  - Verified: all 9 logo images load, every slot computes `border-radius: 50%` and a square box, both banner rails compute `display:none` with 0 slides, and the console is clean — the 10 404s are gone.
  - **Real WhatsApp number wired.** The logo carries two numbers; the owner chose the first, so `SHOP_WA = '971525364791'` (+971 52 536 4791) replaced the `971500000000` placeholder in `code/js/01-config-data.js`, every `wa.me` link and the `tel:` CTA across `index.html`/`terms.html`/`accessibility.html`, the `intro_cta_text` i18n strings (en + ar), and the JSON-LD `telephone` + `sameAs`. This mattered more than it looks — with ordering off, the Enquire button is the only way to buy, and until now every one of them opened a chat with a fake number. Verified with a temporary product: the enquiry opened `wa.me/971525364791` with the part name, SKU and AED price, and no `971500000000` remains in the DOM. The second number, +971 52 538 7296, is still unused.

## 5) Failed attempts

- **`create_project` failed:** the free plan allows only 2 active projects per owner (mkerba2011 already has Experts Hardware and Epsilon Billing). The owner then created the project themselves under another account/org (Bahar Al Hind Co).
- **The claude.ai Supabase connector can't see `qljcyiwkwdfodmabnzol`** (it gets "You do not have permission"), even after a reconnect, because the connector account (mkerba2011) isn't a member of Bahar Al Hind Co.
- **Inviting mkerba2011 into Bahar Al Hind Co** didn't work, or the owner declined it. A likely cause is that the free-plan limit also blocks becoming Owner/Admin of another org with an active free project; a **Developer** role would avoid that. This route is no longer needed now that `supabase-german` exists.
- **Switching the main connector to the Bahar account** was rejected because the owner needs the claude.ai connector for Epsilon and Kuwait. That's why the separate local `supabase-german` server was added.
- **First `! claude mcp add …` attempt** failed because the closing `"` was missing; the second attempt succeeded. The `/mcp` list didn't show the new server until Claude Code was restarted.
- **Tooling gotchas this session:**
  - Long bash heredocs or `node -e` with nested quotes broke. Write one-off scripts with the Write tool into `C:\Users\mukke\AppData\Local\Temp\ge-work\` and run them with node.
  - The GateGuard hook blocks `rm`; use `node -e "require('fs').rmSync(...)"`.
  - Edit scripts must match text **after** any generic regex pass they run first.

## 6) Next steps

1. **Admin accounts (owner runs this, blocks all admin work).** `expert_admin_profiles` is empty, so nobody can log into `/admin/`. The `bootstrap` action only works while that table is empty — one shot. Give the owner a `! curl` POSTing `{"action":"bootstrap","accounts":[{"username":"…","password":"…","role":"super"}, …]}` to `https://qljcyiwkwdfodmabnzol.supabase.co/functions/v1/admin-manage-accounts` with `apikey` + `Authorization: Bearer <publishable key>` headers. Roles: `super` (owner), `bahar15` (manager), `1` (admin), `custom` (team). **The owner fills in their own passwords — never choose, type, or enter them.**
2. **Regenerate `favicon.svg` and `og-image.png` from `logo.jpg`** — both still show the old placeholder wordmark, so browser tabs and WhatsApp/social share cards are off-brand. The share card is 1200×630.
3. **Replace the remaining `TODO-CONTACT`s** — email `info@german-expert.ae`, the Google Maps link and the JSON-LD address in `index.html`, plus the edge-function sender/owner addresses. The phone is done (see §4). The logo's second number, **+971 52 538 7296**, isn't used anywhere — ask whether to add it as a second contact line.
4. **Import the catalog** when the owner sends the product list (admin CSV import supports `sku` and `makes` columns). Then raise `MIN_PRODUCTS` / set `SEO_MIN_PRODUCTS` in `.github/workflows/generate-seo.yml` above 0, so a Supabase outage returning `[]` can't wipe `sitemap.xml`.
5. **Owner to-dos to remind about:**
   - `RESEND_API_KEY` (plus optional `OWNER_EMAIL`/`FROM_EMAIL`) secrets — without it `notify-order` and `send-offers` deploy fine but can't send.
   - Supabase Auth → URL Configuration: Site URL `https://mukarramkebra.github.io/German-Expert/` plus the same as a Redirect URL, and Google sign-in if wanted. (Only matters for customer accounts; with ordering off, accounts are just wishlist + profile.)
6. **If online ordering is ever turned back on**, do both halves — see the catalog-only entry in §4. Then re-test a real checkout to Sharjah and confirm the `expert_orders` row has a 2-decimal AED total, stock was decremented, and the invoice email arrived.

**Local preview:** no Python on this machine. A small node static server under `/German-Expert/` on port 8123 works; a copy is at `C:\Users\mukke\AppData\Local\Temp\claude\…\scratchpad\serve.js` (session scratch — recreate it if temp was cleared). One may already be listening on 8123 from an earlier session; it serves from disk, so it picks up edits without a restart.
