// ── CATEGORY BACKGROUNDS (admin-editable) ────────────────────────────────
function applyCatBgs() {
  try {
    var bgs = JSON.parse(localStorage.getItem('jain_cat_bgs') || '{}');
    document.querySelectorAll('.cat-card[data-cat]').forEach(function(card) {
      var slug = card.dataset.cat;
      if (bgs[slug]) card.style.backgroundImage = "url('" + bgs[slug] + "')";
    });
  } catch(e) {}
}
applyCatBgs();

// ── MARQUEE AUTO-FILL ─────────────────────────────────────────────────────
function fillMarquee() {
  var track = document.querySelector('.marquee-track');
  if (!track) return;
  var origHTML = track.innerHTML;
  var singleW  = track.scrollWidth;
  if (!singleW) return;
  var vw      = window.innerWidth || 1280;
  var copies  = Math.max(3, Math.ceil(vw / singleW) + 2);
  var half = '';
  for (var i = 0; i < copies; i++) half += origHTML;
  track.innerHTML = half + half;
  track.style.animationDuration = Math.round((singleW * copies) / 100) + 's';
}
fillMarquee();

// ── TRANSLATIONS ──────────────────────────────────────────────────────────
var _lang = 'en';
var _T = {
  en: {
    nav_home:'Home', nav_about:'About', nav_products:'Parts', nav_categories:'Categories', nav_faq:'FAQ', nav_contact:'Contact',
    nav_services:'Services',
    cart_label:' Cart',
    hero_tag:'<i class="fa fa-car"></i> German Car Parts Specialists — Sharjah',
    hero_h1:'Engineered in <span>Germany.</span><br/>Delivered in <span>the UAE.</span>',
    hero_p:'Genuine and OEM-quality parts for Mercedes-Benz, BMW, Audi, Volkswagen, Porsche and MINI — delivered fast across the UAE.',
    hero_shop:'Shop Parts', hero_quote:'Find My Part', hero_make:'Shop by Make',
    hero_t1:'Genuine &amp; OEM', hero_t2:'Delivery across the UAE', hero_t3:'Search by part number',
    stat_products:'Parts', stat_genuine:'Genuine', stat_delivery:'Delivery',
    cat_tag:'Shop by Category',
    cat_h2:'Shop by <span class="orange">Category</span>',
    cat_engine:'Engine Parts', cat_brakes:'Brakes', cat_suspension:'Suspension & Steering',
    cat_filters:'Filters', cat_electrical:'Electrical & Ignition', cat_cooling:'Cooling & A/C', cat_all:'All Parts',
    make_tag:'Shop by Make', make_all:'All Makes',
    pill_all:'All',
    prod_tag:'Full Catalog', prod_h2:'Our <span class="orange">Parts</span>',
    prod_search:'Search by part name or part number...',
    no_results:'No parts found. Try a different name or part number.', load_more:'Load more parts',
    cart_title:'Your Cart', cart_empty:'Your cart is empty.',
    cart_total_label:'Total:', cart_wa:'Request Quote on WhatsApp',
    feat_delivery_h:'Fast UAE Delivery', feat_delivery_p:'Same-day delivery in Sharjah, and 1-2 business days to Dubai, Ajman and the rest of the UAE.',
    feat_genuine_h:'Genuine & OEM', feat_genuine_p:'Original and OEM-quality parts from trusted German brands such as Bosch, Mann, Mahle, Lemförder and ATE.',
    feat_advice_h:'Fitment Help', feat_advice_p:'Send us your VIN or chassis number and our specialists will confirm the right part for your car.',
    feat_pricing_h:'Garage Pricing', feat_pricing_p:'Trade prices available for garages, workshops and fleet operators.',
    // Workshop services (#services) — the card contents come from the database
    // (admin Services tab), so only the section chrome is translated here.
    svc_tag:'Workshop & Servicing',
    svc_h2:'Our Mechanics <span class="orange">Service Your Car</span>',
    svc_p:"German-car specialists in Sharjah — we don't just sell the part, we fit it. Book any job below on WhatsApp and we'll confirm the price and a slot for you.",
    svc_t1:'German-car specialist mechanics', svc_t2:'Genuine & OEM parts fitted',
    svc_t3:'Workmanship guaranteed', svc_t4:'Industrial Area, Sharjah',
    svc_book:'Book on WhatsApp', svc_parts:'Shop the parts',
    svc_list_h:'Every job we take on',
    svc_list_p:"Tap any job to book it on WhatsApp — we'll confirm the price and a time.",
    svc_poa:'Price on request', svc_from:'From',
    svc_cta_h:'Not sure what your car needs?',
    svc_cta_p:"Send us the make, model and what it's doing — a warning light, a noise, a leak — and our mechanics will tell you what it takes.",
    svc_cta_wa:'Ask a mechanic', svc_cta_call:'+971 52 536 4791',
    faq_tag:'Got Questions?', faq_h2:'Frequently Asked <span class="orange">Questions</span>',
    faq_q1:'Where in the UAE do you deliver?',
    faq_a1:'We deliver same day within Sharjah, and within 1-2 business days to Dubai, Ajman, Abu Dhabi, Umm Al Quwain, Ras Al Khaimah and Fujairah. You can also pick up from our Sharjah store.',
    faq_q2:'What payment methods do you accept?',
    faq_a2:'We accept cash on delivery, card on delivery and bank transfer. Payment details are confirmed with you directly on WhatsApp after you place an order.',
    faq_q3:'How do I make sure a part fits my car?',
    faq_a3:'Filter by your car make, search by part number, or send us your VIN (chassis number) on WhatsApp — we will confirm the exact part before you pay.',
    faq_q4:'Can I return or exchange a part?',
    faq_a4:'Yes. Unused, uninstalled parts in their original packaging can be returned or exchanged within 7 days of delivery. Electrical parts can only be exchanged if faulty. Contact us on WhatsApp to arrange it.',
    faq_q5:'How do I order or get help?',
    faq_a5:'Find the part you need and tap Enquire — it opens WhatsApp with the part details ready to send. Our team confirms availability, price and delivery, and you pay on delivery or by bank transfer.',
    contact_tag:'Get In Touch', contact_h2:'We\'re Here to <span class="orange">Help</span>',
    contact_p:'Can\'t find a part? Send us your VIN or part number and our team will source it for you — in Arabic or English.',
    contact_loc_label:'Location', contact_loc:'Sharjah, United Arab Emirates',
    contact_email_label:'Email', contact_phone_label:'Phone / WhatsApp',
    contact_hours_label:'Working Hours', contact_hours:'Sat-Thu: 8 AM - 9 PM',
    form_name:'Full Name', form_name_ph:'Your full name',
    form_phone:'Phone / WhatsApp', form_email:'Email', form_need:'What do you need?',
    form_msg:'Message', form_msg_ph:'Car make, model, year, VIN and the part you need...',
    form_send:'Send Message', form_success:'Message sent! We will get back to you shortly.',
    form_opt1:'General Enquiry', form_opt2:'Part Request (VIN)', form_opt3:'Part Availability',
    form_opt4:'Garage / Trade Account', form_opt5:'Delivery Information', form_opt6:'Other',
    about_tag:'Who We Are', about_h2:'Your <span class="orange">German Car</span> Parts Specialist',
    about_badge:'Sharjah',
    about_p1:'German Expert is a Sharjah-based specialist in parts for German cars. From service items like filters and brake pads to engine, suspension and electrical parts, we stock what Mercedes-Benz, BMW, Audi, Volkswagen, Porsche and MINI owners need.',
    about_p2:'We supply genuine and OEM-quality parts only, at fair prices, with real fitment advice in Arabic and English.',
    about_f1:'Genuine and OEM-quality parts only', about_f2:'Fitment checked by VIN on request',
    about_f3:'Same-day delivery within Sharjah', about_f4:'Trade pricing for garages and workshops',
    about_f5:'Easy returns and after-sales support', about_cta:'Contact Us',
    footer_desc:'Sharjah\'s specialist for genuine and OEM-quality German car parts, delivering across the UAE.',
    footer_nav:'Navigation', footer_cats:'Categories', footer_support:'Support',
    footer_servicing:'Car Servicing',
    footer_trade:'Garage Accounts', footer_bulk:'Bulk Orders', footer_delivery_info:'Delivery Info',
    footer_returns:'Returns Policy', footer_tech:'Fitment Help', footer_accessibility:'Accessibility', footer_privacy:'Privacy Policy',
    footer_copy:'© 2026 German Expert. All rights reserved. Sharjah, UAE.',
    intro_tag:'Welcome to German Expert',
    intro_h2:'Sharjah\'s <span class="orange">German Car</span> Parts Specialist',
    intro_p:'German Expert supplies engine, brake, suspension, filter, electrical and cooling parts for Mercedes-Benz, BMW, Audi, Volkswagen, Porsche and MINI to drivers and garages across the UAE. Tell us your car and we\'ll find the right part.',
    intro_c1:'Genuine & OEM Parts', intro_c2:'Same-Day Sharjah Delivery',
    intro_c3:'Garage & Trade Pricing', intro_c4:'Arabic & English Support',
    intro_cta_text:'Call Us: +971 52 536 4791',
    co_title:'Complete Your Order', co_order_sum:'Order Summary', co_your_details:'Your Details',
    co_delivery_addr:'Delivery Address', co_total_label:'Total Amount',
    co_full_name:'Full Name *', co_wa_num:'WhatsApp Number *', co_area:'Emirate *',
    co_block:'Area', co_street:'Street', co_house:'Building / Villa',
    co_floor:'Flat / Unit', co_notes:'Notes', co_submit:'Send Order on WhatsApp',
    back_btn:'Back to Parts',
    lang_switch:'عربي',
    mq_items:['Mercedes-Benz','BMW','Audi','Volkswagen','Porsche','MINI','Brake Pads & Discs','Oil & Air Filters','Spark Plugs','Suspension','Genuine & OEM']
  },
  ar: {
    nav_home:'الرئيسية', nav_about:'من نحن', nav_products:'القطع', nav_categories:'الفئات', nav_faq:'الأسئلة الشائعة', nav_contact:'اتصل بنا',
    nav_services:'الخدمات',
    cart_label:' سلة',
    hero_tag:'<i class="fa fa-car"></i> متخصصون في قطع غيار السيارات الألمانية — الشارقة',
    hero_h1:'صُنعت في <span>ألمانيا.</span><br/>تُوصَل في <span>الإمارات.</span>',
    hero_p:'قطع غيار أصلية وبجودة المصنع لمرسيدس-بنز وبي إم دبليو وأودي وفولكس فاجن وبورشه وميني — توصيل سريع في جميع أنحاء الإمارات.',
    hero_shop:'تسوق القطع', hero_quote:'ابحث عن قطعتي', hero_make:'تسوق حسب الماركة',
    hero_t1:'أصلية وبجودة المصنع', hero_t2:'توصيل لجميع أنحاء الإمارات', hero_t3:'ابحث برقم القطعة',
    stat_products:'قطعة', stat_genuine:'أصلي', stat_delivery:'توصيل',
    cat_tag:'تسوق حسب الفئة',
    cat_h2:'تسوق حسب <span class="orange">الفئة</span>',
    cat_engine:'قطع المحرك', cat_brakes:'الفرامل', cat_suspension:'التعليق والتوجيه',
    cat_filters:'الفلاتر', cat_electrical:'الكهرباء والإشعال', cat_cooling:'التبريد والتكييف', cat_all:'جميع القطع',
    make_tag:'تسوق حسب الماركة', make_all:'كل الماركات',
    pill_all:'الكل',
    prod_tag:'الكتالوج الكامل', prod_h2:'<span class="orange">قطعنا</span>',
    prod_search:'ابحث باسم القطعة أو رقمها...',
    no_results:'لا توجد قطع. جرّب اسماً أو رقم قطعة مختلفاً.', load_more:'تحميل المزيد من القطع',
    cart_title:'سلة التسوق', cart_empty:'سلة التسوق فارغة.',
    cart_total_label:'المجموع:', cart_wa:'طلب عرض سعر عبر واتساب',
    feat_delivery_h:'توصيل سريع في الإمارات', feat_delivery_p:'توصيل في نفس اليوم داخل الشارقة، وخلال 1-2 يوم عمل إلى دبي وعجمان وباقي الإمارات.',
    feat_genuine_h:'أصلي وبجودة المصنع', feat_genuine_p:'قطع أصلية وبجودة المصنع من علامات ألمانية موثوقة مثل بوش ومان وماهلي وليمفوردر.',
    feat_advice_h:'مساعدة في التوافق', feat_advice_p:'أرسل لنا رقم الشاصي (VIN) وسيتأكد خبراؤنا من القطعة المناسبة لسيارتك.',
    feat_pricing_h:'أسعار للكراجات', feat_pricing_p:'أسعار تجارية متاحة للكراجات وورش الصيانة وأساطيل السيارات.',
    svc_tag:'الورشة والصيانة',
    svc_h2:'فنيّونا <span class="orange">يصلحون سيارتك</span>',
    svc_p:'متخصصون في السيارات الألمانية في الشارقة — لا نبيع القطعة فقط، بل نركّبها لك. احجز أي خدمة أدناه على واتساب وسنؤكد لك السعر والموعد.',
    svc_t1:'فنيّون متخصصون في السيارات الألمانية', svc_t2:'تركيب قطع أصلية وبجودة المصنع',
    svc_t3:'ضمان على العمل', svc_t4:'المنطقة الصناعية، الشارقة',
    svc_book:'احجز على واتساب', svc_parts:'تسوق القطع',
    svc_list_h:'كل الخدمات التي نقدمها',
    svc_list_p:'اضغط على أي خدمة لحجزها على واتساب — وسنؤكد لك السعر والموعد.',
    svc_poa:'السعر عند الطلب', svc_from:'يبدأ من',
    svc_cta_h:'غير متأكد ما تحتاجه سيارتك؟',
    svc_cta_p:'أرسل لنا الماركة والموديل ووصف المشكلة — لمبة تحذير أو صوت أو تسريب — وسيخبرك فنيّونا بما تحتاجه.',
    svc_cta_wa:'اسأل الفني', svc_cta_call:'+971 52 536 4791',
    faq_tag:'لديك سؤال؟', faq_h2:'الأسئلة <span class="orange">الشائعة</span>',
    faq_q1:'إلى أين توصلون داخل الإمارات؟',
    faq_a1:'نوصل في نفس اليوم داخل الشارقة، وخلال 1-2 يوم عمل إلى دبي وعجمان وأبوظبي وأم القيوين ورأس الخيمة والفجيرة. يمكنك أيضاً الاستلام من متجرنا في الشارقة.',
    faq_q2:'ما هي طرق الدفع المتاحة؟',
    faq_a2:'نقبل الدفع نقداً أو بالبطاقة عند الاستلام، والتحويل البنكي. يتم تأكيد تفاصيل الدفع معك مباشرة عبر واتساب بعد إتمام الطلب.',
    faq_q3:'كيف أتأكد أن القطعة تناسب سيارتي؟',
    faq_a3:'اختر ماركة سيارتك، أو ابحث برقم القطعة، أو أرسل لنا رقم الشاصي (VIN) عبر واتساب — وسنؤكد القطعة الصحيحة قبل الدفع.',
    faq_q4:'هل يمكنني إرجاع أو استبدال قطعة؟',
    faq_a4:'نعم، يمكن إرجاع أو استبدال القطع غير المستخدمة وغير المركّبة وبعبوتها الأصلية خلال 7 أيام من الاستلام. القطع الكهربائية تُستبدل فقط في حال وجود عيب. تواصل معنا عبر واتساب.',
    faq_q5:'كيف أطلب أو أحصل على مساعدة؟',
    faq_a5:'اختر القطعة التي تحتاجها واضغط "استفسر" — سيفتح واتساب وتفاصيل القطعة جاهزة للإرسال. يؤكد فريقنا التوفر والسعر والتوصيل، والدفع عند الاستلام أو بالتحويل البنكي.',
    contact_tag:'تواصل معنا', contact_h2:'نحن هنا <span class="orange">لمساعدتك</span>',
    contact_p:'لم تجد القطعة؟ أرسل لنا رقم الشاصي أو رقم القطعة وسنوفرها لك — بالعربية أو الإنجليزية.',
    contact_loc_label:'الموقع', contact_loc:'الشارقة، الإمارات العربية المتحدة',
    contact_email_label:'البريد الإلكتروني', contact_phone_label:'الهاتف / واتساب',
    contact_hours_label:'ساعات العمل', contact_hours:'السبت-الخميس: 8 ص - 9 م',
    form_name:'الاسم الكامل', form_name_ph:'اسمك الكامل',
    form_phone:'الهاتف / واتساب', form_email:'البريد الإلكتروني', form_need:'ماذا تحتاج؟',
    form_msg:'الرسالة', form_msg_ph:'الماركة والموديل والسنة ورقم الشاصي والقطعة المطلوبة...',
    form_send:'إرسال الرسالة', form_success:'تم إرسال الرسالة! سنتواصل معك قريباً.',
    form_opt1:'استفسار عام', form_opt2:'طلب قطعة (رقم الشاصي)', form_opt3:'توفر قطعة',
    form_opt4:'حساب كراج / تجاري', form_opt5:'معلومات التوصيل', form_opt6:'أخرى',
    about_tag:'من نحن', about_h2:'متخصصك في قطع <span class="orange">السيارات الألمانية</span>',
    about_badge:'الشارقة',
    about_p1:'جيرمان إكسبرت متجر في الشارقة متخصص في قطع غيار السيارات الألمانية — من قطع الصيانة مثل الفلاتر وفحمات الفرامل إلى قطع المحرك والتعليق والكهرباء لمرسيدس وبي إم دبليو وأودي وفولكس فاجن وبورشه وميني.',
    about_p2:'نوفر قطعاً أصلية وبجودة المصنع فقط، بأسعار عادلة ونصائح حقيقية حول التوافق بالعربية والإنجليزية.',
    about_f1:'قطع أصلية وبجودة المصنع فقط', about_f2:'التحقق من التوافق برقم الشاصي عند الطلب',
    about_f3:'توصيل في نفس اليوم داخل الشارقة', about_f4:'أسعار تجارية للكراجات والورش',
    about_f5:'إرجاع سهل ودعم ما بعد البيع', about_cta:'اتصل بنا',
    footer_desc:'متخصص الشارقة في قطع غيار السيارات الألمانية الأصلية وبجودة المصنع، مع التوصيل لجميع الإمارات.',
    footer_nav:'التنقل', footer_cats:'الفئات', footer_support:'الدعم',
    footer_servicing:'صيانة السيارات',
    footer_trade:'حسابات الكراجات', footer_bulk:'الطلبات بالجملة', footer_delivery_info:'معلومات التوصيل',
    footer_returns:'سياسة الإرجاع', footer_tech:'مساعدة التوافق', footer_accessibility:'إمكانية الوصول', footer_privacy:'سياسة الخصوصية',
    footer_copy:'© 2026 جيرمان إكسبرت. جميع الحقوق محفوظة. الشارقة، الإمارات.',
    intro_tag:'مرحباً بك في جيرمان إكسبرت',
    intro_h2:'متخصص الشارقة في قطع <span class="orange">السيارات الألمانية</span>',
    intro_p:'جيرمان إكسبرت توفر قطع المحرك والفرامل والتعليق والفلاتر والكهرباء والتبريد لمرسيدس وبي إم دبليو وأودي وفولكس فاجن وبورشه وميني للأفراد والكراجات في جميع أنحاء الإمارات. أخبرنا بسيارتك وسنجد القطعة المناسبة.',
    intro_c1:'قطع أصلية وبجودة المصنع', intro_c2:'توصيل في نفس اليوم بالشارقة',
    intro_c3:'أسعار للكراجات والتجار', intro_c4:'دعم بالعربية والإنجليزية',
    intro_cta_text:'اتصل بنا: 4791 536 52 971+',
    co_title:'أكمل طلبك', co_order_sum:'ملخص الطلب', co_your_details:'بياناتك',
    co_delivery_addr:'عنوان التوصيل', co_total_label:'المبلغ الإجمالي',
    co_full_name:'الاسم الكامل *', co_wa_num:'رقم واتساب *', co_area:'الإمارة *',
    co_block:'المنطقة', co_street:'الشارع', co_house:'المبنى / الفيلا',
    co_floor:'الشقة / الوحدة', co_notes:'ملاحظات', co_submit:'إرسال الطلب عبر واتساب',
    back_btn:'العودة للقطع',
    lang_switch:'EN',
    mq_items:['مرسيدس-بنز','بي إم دبليو','أودي','فولكس فاجن','بورشه','ميني','فحمات وأقراص الفرامل','فلاتر الزيت والهواء','بواجي','نظام التعليق','أصلي وبجودة المصنع']
  }
};

function setLang(lang) {
  _lang = lang;
  localStorage.setItem('bahar_lang', lang);
  var html = document.documentElement;
  html.lang = lang;
  html.dir  = lang === 'ar' ? 'rtl' : 'ltr';

  var btn = document.getElementById('langBtn');
  if (btn) btn.textContent = _T[lang].lang_switch;

  var t = _T[lang];

  // textContent replacements
  document.querySelectorAll('[data-i18n]').forEach(function(el) {
    var k = el.getAttribute('data-i18n');
    if (t[k] !== undefined) el.textContent = t[k];
  });

  // innerHTML replacements (elements containing nested HTML like spans)
  document.querySelectorAll('[data-i18n-html]').forEach(function(el) {
    var k = el.getAttribute('data-i18n-html');
    if (t[k] !== undefined) el.innerHTML = t[k];
  });

  // placeholder replacements
  document.querySelectorAll('[data-i18n-placeholder]').forEach(function(el) {
    var k = el.getAttribute('data-i18n-placeholder');
    if (t[k] !== undefined) el.placeholder = t[k];
  });

  // Re-render product cards with translated names/descriptions. true = keep
  // the batches already scrolled through (see renderProducts()'s preserveShown
  // in js/02-catalog-render.js) — switching language is the same result set in
  // another language, not a new one, so it shouldn't also move the visitor.
  if (typeof renderProducts === 'function') renderProducts(true);

  // Rebuild marquee with translated items
  var track = document.querySelector('.marquee-track');
  if (track && t.mq_items) {
    track.innerHTML = t.mq_items.map(function(item) {
      return '<span>' + item + '</span><span class="sep">&nbsp;&#183;&nbsp;</span>';
    }).join('');
    fillMarquee();
  }
}

function toggleLang() {
  setLang(_lang === 'en' ? 'ar' : 'en');
}

// Arabic is switched off for now: the toggle button is hidden (see .lang-btn at the top of
// css/06-lang-rtl.css), so a visitor who picked Arabic earlier mustn't stay stuck in
// it with no way back. Set ARABIC_ENABLED = true and remove that CSS rule to
// bring it back.
var ARABIC_ENABLED = false;

// Apply saved language on load
(function() {
  var saved = localStorage.getItem('bahar_lang');
  if (saved === 'ar' && ARABIC_ENABLED) setLang('ar');
})();

// ── SAVE ORDER TO SUPABASE ────────────────────────────────────────────────────
// Saves the order and links it to the logged-in user (or null for guests).
// Guest orders are also stored in localStorage so they can be viewed in "My Orders".
async function saveOrderToSupabase(order) {
  // Generated client-side (rather than relying on the DB's default and
  // reading it back via Prefer: return=representation) because that Prefer
  // header requires SELECT-level RLS access to the just-inserted row —
  // access the anon role intentionally no longer has, now that
  // expert_orders isn't bulk-readable. Knowing the id up front avoids
  // needing that read entirely. Callers that already need the id before
  // this resolves (e.g. to show it on the order-confirmation screen) can
  // pass their own via order.id.
  const newOrderId = order.id || crypto.randomUUID();
  const payload = [{
    id:             newOrderId,
    short_code:     order.short_code || null,
    customer_name:  order.name,
    customer_phone: order.phone,
    customer_email: order.email || null,
    address:        order.address,
    notes:          order.notes || '',
    items:          order.items,
    total:          roundMoney(order.total),
    status:         'pending',
    user_id:        (_authUser ? _authUser.id : null)   // link to account if logged in
  }];
  console.log('[JainHardware] Saving order:', payload);
  // A logged-in customer's row carries their user_id, which RLS only accepts from
  // the `authenticated` role — so it must be sent with their token, not the anon
  // key (anon inserts require user_id IS NULL). If that still fails (e.g. an
  // expired token), retry as a guest order so the order and its email aren't lost.
  const _post = (rows, hdrs) => sbFetch(SB_URL + '/rest/v1/expert_orders', {
    method: 'POST',
    headers: Object.assign({}, hdrs, {
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    }),
    body: JSON.stringify(rows)
  });
  let result = await _post(payload, (_authUser && _authToken) ? getAuthHeaders() : SB_H);
  if (result.error && payload[0].user_id) {
    payload[0].user_id = null;
    result = await _post(payload, SB_H);
  }
  if (result.error) {
    console.error('[JainHardware] Order save FAILED:', result.error);
    // Still save to localStorage as a fallback
  } else {
    console.log('[JainHardware] Order saved OK');
    notifyOrderByEmail(newOrderId);
  }
  // If guest → also store in localStorage so they can see it in My Orders
  if (!_authUser) {
    const guestOrder = {
      id: result.error ? ('guest-' + Date.now()) : newOrderId,
      short_code:     result.error ? null : (order.short_code || null),
      customer_name:  order.name,
      customer_phone: order.phone,
      address:        order.address,
      items:          order.items,
      total:          roundMoney(order.total),
      status:         'pending',
      created_at:     new Date().toISOString()
    };
    saveGuestOrder(guestOrder);
  }
}

// Fire-and-forget: emails the shop owner (see supabase/functions/notify-order) an invoice-formatted
// summary of the order with a "View & Print Invoice" link. Runs server-side
// (supabase/functions/notify-order) so it works the same for every order
// regardless of who placed it; failures here must never block checkout.
function notifyOrderByEmail(orderId) {
  fetch(SB_URL + '/functions/v1/notify-order', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ order_id: orderId })
  }).catch(function(e) { console.error('[JainHardware] Order email notify failed:', e); });
}

// ═══════════════════════════════════════════════════════════════════════════════
