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


// ── TRANSLATIONS ──────────────────────────────────────────────────────────
var _lang = 'en';
var _T = {
  en: {
    nav_home:'Home', nav_about:'About', nav_products:'Parts', nav_categories:'Categories', nav_faq:'FAQ', nav_contact:'Contact',
    nav_services:'Services',
    cart_label:' Cart',
    hero_tag:'<i class="fa fa-car"></i> German &amp; European Car Parts — Kuwait',
    hero_h1:'Engineered in <span>Germany.</span><br/>Delivered in <span>Kuwait.</span>',
    hero_p:'Genuine auto spare parts for Mercedes-Benz, BMW, Audi, Volkswagen, Porsche, Jaguar, Range Rover and Toyota — delivered across Kuwait.',
    hero_shop:'Shop Parts', hero_quote:'Find My Part', hero_make:'Shop by Make',
    hero_t1:'Genuine &amp; OEM', hero_t2:'Delivery across Kuwait', hero_t3:'Search by part number',
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
    feat_delivery_h:'Delivery Across Kuwait', feat_delivery_p:'Delivery available across Kuwait — message us on WhatsApp for timing.',
    feat_genuine_h:'Genuine & OEM', feat_genuine_p:'Original and OEM-quality parts from trusted German brands such as Bosch, Mann, Mahle, Lemförder and ATE.',
    feat_advice_h:'Fitment Help', feat_advice_p:'Send us your VIN or chassis number and our specialists will confirm the right part for your car.',
    feat_pricing_h:'Garage Pricing', feat_pricing_p:'Trade prices available for garages, workshops and fleet operators.',
    // Workshop services (#services) — the card contents come from the database
    // (admin Services tab), so only the section chrome is translated here.
    svc_tag:'Workshop & Servicing',
    svc_h2:'Our Mechanics <span class="orange">Service Your Car</span>',
    svc_p:"German-car specialists in Shuwaikh, Kuwait — we don't just sell the part, we fit it. Book any job below on WhatsApp and we'll confirm the price and a slot for you.",
    svc_t1:'German-car specialist mechanics', svc_t2:'Genuine & OEM parts fitted',
    svc_t3:'Workmanship guaranteed', svc_t4:'Shuwaikh Industrial Area',
    svc_book:'Book on WhatsApp', svc_parts:'Shop the parts',
    svc_list_h:'Every job we take on',
    svc_list_p:"Tap any job to book it on WhatsApp — we'll confirm the price and a time.",
    svc_poa:'Price on request', svc_from:'From',
    svc_cta_h:'Not sure what your car needs?',
    svc_cta_p:"Send us the make, model and what it's doing — a warning light, a noise, a leak — and our mechanics will tell you what it takes.",
    svc_cta_wa:'Ask a mechanic', svc_cta_call:'+965 9911 5215',
    faq_tag:'Got Questions?', faq_h2:'Frequently Asked <span class="orange">Questions</span>',
    faq_q1:'Where in Kuwait do you deliver?',
    faq_a1:'We deliver across Kuwait — message us on WhatsApp with your area and we will confirm timing. You can also pick up from our store in Shuwaikh Industrial Area.',
    faq_q2:'What payment methods do you accept?',
    faq_a2:'We accept cash on delivery, card on delivery and bank transfer. Payment details are confirmed with you directly on WhatsApp after you place an order.',
    faq_q3:'How do I make sure a part fits my car?',
    faq_a3:'Filter by your car make, search by part number, or send us your VIN (chassis number) on WhatsApp — we will confirm the exact part before you pay.',
    faq_q4:'Can I return or exchange a part?',
    faq_a4:'All returns need prior approval — please contact us by phone or on WhatsApp before sending anything back, and we will arrange it with you.',
    faq_q5:'How do I order or get help?',
    faq_a5:'Find the part you need and tap Enquire — it opens WhatsApp with the part details ready to send. Our team confirms availability, price and delivery, and you pay on delivery or by bank transfer.',
    contact_tag:'Get In Touch', contact_h2:'We\'re Here to <span class="orange">Help</span>',
    contact_p:'Can\'t find a part? Send us your VIN or part number and our team will source it for you — in Arabic or English.',
    contact_loc_label:'Location', contact_loc:'Shuwaikh Industrial Area, Kuwait',
    contact_email_label:'Email', contact_phone_label:'Phone / WhatsApp',
    contact_hours_label:'Working Hours', contact_hours:'Sat-Thu: 8 AM - 9 PM',
    form_name:'Full Name', form_name_ph:'Your full name',
    form_phone:'Phone / WhatsApp', form_email:'Email', form_need:'What do you need?',
    form_msg:'Message', form_msg_ph:'Car make, model, year, VIN and the part you need...',
    form_send:'Send Message', form_success:'Message sent! We will get back to you shortly.',
    form_opt1:'General Enquiry', form_opt2:'Part Request (VIN)', form_opt3:'Part Availability',
    form_opt4:'Garage / Trade Account', form_opt5:'Delivery Information', form_opt6:'Other',
    about_tag:'Who We Are', about_h2:'Your <span class="orange">German Car</span> Parts Specialist',
    about_badge:'Shuwaikh, Kuwait',
    about_p1:'Alamdar Auto Spare Parts Co. is an authorized distributor of auto spare parts in Kuwait, based in Shuwaikh Industrial Area. We specialise in parts for German and European cars — from service items like filters and brake pads to engine, suspension and electrical parts for Mercedes-Benz, BMW, Audi, Volkswagen, Porsche, Jaguar and Range Rover — plus Mercedes truck and Toyota parts.',
    about_p2:'We supply genuine and OEM-quality parts only, at fair prices, with real fitment advice in Arabic and English.',
    about_f1:'Genuine and OEM-quality parts only', about_f2:'Fitment checked by VIN on request',
    about_f3:'Delivery across Kuwait', about_f4:'Trade pricing for garages and workshops',
    about_f5:'Easy returns and after-sales support', about_cta:'Contact Us',
    footer_desc:'Authorized distributor of genuine auto spare parts in Kuwait — German and European cars, plus Toyota.',
    footer_nav:'Navigation', footer_cats:'Categories', footer_support:'Support',
    footer_servicing:'Car Servicing',
    footer_trade:'Garage Accounts', footer_bulk:'Bulk Orders', footer_delivery_info:'Delivery Info',
    footer_returns:'Returns Policy', footer_tech:'Fitment Help', footer_accessibility:'Accessibility', footer_privacy:'Privacy Policy',
    footer_copy:'© 2026 Alamdar Auto Spare Parts Co. Kuwait. All rights reserved.',
    intro_tag:'Welcome to Alamdar Auto',
    intro_h2:'Kuwait\'s <span class="orange">German Car</span> Parts Specialist',
    intro_p:'Alamdar Auto supplies engine, brake, suspension, filter, electrical and cooling parts for Mercedes-Benz, BMW, Audi, Volkswagen, Porsche, Jaguar and Range Rover to drivers and garages across Kuwait. Tell us your car and we\'ll find the right part.',
    intro_c1:'Genuine & OEM Parts', intro_c2:'Delivery Across Kuwait',
    intro_c3:'Garage & Trade Pricing', intro_c4:'Arabic & English Support',
    intro_cta_text:'Call Us: +965 9911 5215',
    co_title:'Complete Your Order', co_order_sum:'Order Summary', co_your_details:'Your Details',
    co_delivery_addr:'Delivery Address', co_total_label:'Total Amount',
    co_full_name:'Full Name *', co_wa_num:'WhatsApp Number *', co_area:'Governorate *',
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
    hero_tag:'<i class="fa fa-car"></i> قطع غيار السيارات الألمانية والأوروبية — الكويت',
    hero_h1:'صُنعت في <span>ألمانيا.</span><br/>تُوصَل في <span>الكويت.</span>',
    hero_p:'قطع غيار أصلية لمرسيدس-بنز وبي إم دبليو وأودي وفولكس فاجن وبورشه وجاكوار ورنج روفر وتويوتا — توصيل في جميع أنحاء الكويت.',
    hero_shop:'تسوق القطع', hero_quote:'ابحث عن قطعتي', hero_make:'تسوق حسب الماركة',
    hero_t1:'أصلية وبجودة المصنع', hero_t2:'توصيل لجميع أنحاء الكويت', hero_t3:'ابحث برقم القطعة',
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
    feat_delivery_h:'توصيل في جميع أنحاء الكويت', feat_delivery_p:'التوصيل متاح في جميع أنحاء الكويت — راسلنا على واتساب لتأكيد الموعد.',
    feat_genuine_h:'أصلي وبجودة المصنع', feat_genuine_p:'قطع أصلية وبجودة المصنع من علامات ألمانية موثوقة مثل بوش ومان وماهلي وليمفوردر.',
    feat_advice_h:'مساعدة في التوافق', feat_advice_p:'أرسل لنا رقم الشاصي (VIN) وسيتأكد خبراؤنا من القطعة المناسبة لسيارتك.',
    feat_pricing_h:'أسعار للكراجات', feat_pricing_p:'أسعار تجارية متاحة للكراجات وورش الصيانة وأساطيل السيارات.',
    svc_tag:'الورشة والصيانة',
    svc_h2:'فنيّونا <span class="orange">يصلحون سيارتك</span>',
    svc_p:'متخصصون في السيارات الألمانية في الشويخ، الكويت — لا نبيع القطعة فقط، بل نركّبها لك. احجز أي خدمة أدناه على واتساب وسنؤكد لك السعر والموعد.',
    svc_t1:'فنيّون متخصصون في السيارات الألمانية', svc_t2:'تركيب قطع أصلية وبجودة المصنع',
    svc_t3:'ضمان على العمل', svc_t4:'منطقة الشويخ الصناعية',
    svc_book:'احجز على واتساب', svc_parts:'تسوق القطع',
    svc_list_h:'كل الخدمات التي نقدمها',
    svc_list_p:'اضغط على أي خدمة لحجزها على واتساب — وسنؤكد لك السعر والموعد.',
    svc_poa:'السعر عند الطلب', svc_from:'يبدأ من',
    svc_cta_h:'غير متأكد ما تحتاجه سيارتك؟',
    svc_cta_p:'أرسل لنا الماركة والموديل ووصف المشكلة — لمبة تحذير أو صوت أو تسريب — وسيخبرك فنيّونا بما تحتاجه.',
    svc_cta_wa:'اسأل الفني', svc_cta_call:'+965 9911 5215',
    faq_tag:'لديك سؤال؟', faq_h2:'الأسئلة <span class="orange">الشائعة</span>',
    faq_q1:'إلى أين توصلون داخل الكويت؟',
    faq_a1:'نوصل إلى جميع مناطق الكويت — راسلنا على واتساب بمنطقتك وسنؤكد لك الموعد. يمكنك أيضاً الاستلام من متجرنا في منطقة الشويخ الصناعية.',
    faq_q2:'ما هي طرق الدفع المتاحة؟',
    faq_a2:'نقبل الدفع نقداً أو بالبطاقة عند الاستلام، والتحويل البنكي. يتم تأكيد تفاصيل الدفع معك مباشرة عبر واتساب بعد إتمام الطلب.',
    faq_q3:'كيف أتأكد أن القطعة تناسب سيارتي؟',
    faq_a3:'اختر ماركة سيارتك، أو ابحث برقم القطعة، أو أرسل لنا رقم الشاصي (VIN) عبر واتساب — وسنؤكد القطعة الصحيحة قبل الدفع.',
    faq_q4:'هل يمكنني إرجاع أو استبدال قطعة؟',
    faq_a4:'جميع المرتجعات تتطلب موافقة مسبقة — يرجى التواصل معنا هاتفياً أو عبر واتساب قبل إرجاع أي قطعة وسنرتب الأمر معك.',
    faq_q5:'كيف أطلب أو أحصل على مساعدة؟',
    faq_a5:'اختر القطعة التي تحتاجها واضغط "استفسر" — سيفتح واتساب وتفاصيل القطعة جاهزة للإرسال. يؤكد فريقنا التوفر والسعر والتوصيل، والدفع عند الاستلام أو بالتحويل البنكي.',
    contact_tag:'تواصل معنا', contact_h2:'نحن هنا <span class="orange">لمساعدتك</span>',
    contact_p:'لم تجد القطعة؟ أرسل لنا رقم الشاصي أو رقم القطعة وسنوفرها لك — بالعربية أو الإنجليزية.',
    contact_loc_label:'الموقع', contact_loc:'منطقة الشويخ الصناعية، الكويت',
    contact_email_label:'البريد الإلكتروني', contact_phone_label:'الهاتف / واتساب',
    contact_hours_label:'ساعات العمل', contact_hours:'السبت-الخميس: 8 ص - 9 م',
    form_name:'الاسم الكامل', form_name_ph:'اسمك الكامل',
    form_phone:'الهاتف / واتساب', form_email:'البريد الإلكتروني', form_need:'ماذا تحتاج؟',
    form_msg:'الرسالة', form_msg_ph:'الماركة والموديل والسنة ورقم الشاصي والقطعة المطلوبة...',
    form_send:'إرسال الرسالة', form_success:'تم إرسال الرسالة! سنتواصل معك قريباً.',
    form_opt1:'استفسار عام', form_opt2:'طلب قطعة (رقم الشاصي)', form_opt3:'توفر قطعة',
    form_opt4:'حساب كراج / تجاري', form_opt5:'معلومات التوصيل', form_opt6:'أخرى',
    about_tag:'من نحن', about_h2:'متخصصك في قطع <span class="orange">السيارات الألمانية</span>',
    about_badge:'الشويخ، الكويت',
    about_p1:'علمدار لقطع غيار السيارات شركة موزّع معتمد لقطع غيار السيارات في الكويت، ومقرنا في منطقة الشويخ الصناعية. نتخصص في قطع السيارات الألمانية والأوروبية — من قطع الصيانة مثل الفلاتر وفحمات الفرامل إلى قطع المحرك والتعليق والكهرباء لمرسيدس وبي إم دبليو وأودي وفولكس فاجن وبورشه وجاكوار ورنج روفر — إضافة إلى قطع شاحنات مرسيدس وتويوتا.',
    about_p2:'نوفر قطعاً أصلية وبجودة المصنع فقط، بأسعار عادلة ونصائح حقيقية حول التوافق بالعربية والإنجليزية.',
    about_f1:'قطع أصلية وبجودة المصنع فقط', about_f2:'التحقق من التوافق برقم الشاصي عند الطلب',
    about_f3:'توصيل في جميع أنحاء الكويت', about_f4:'أسعار تجارية للكراجات والورش',
    about_f5:'إرجاع سهل ودعم ما بعد البيع', about_cta:'اتصل بنا',
    footer_desc:'موزّع معتمد لقطع غيار السيارات الأصلية في الكويت — سيارات ألمانية وأوروبية وتويوتا.',
    footer_nav:'التنقل', footer_cats:'الفئات', footer_support:'الدعم',
    footer_servicing:'صيانة السيارات',
    footer_trade:'حسابات الكراجات', footer_bulk:'الطلبات بالجملة', footer_delivery_info:'معلومات التوصيل',
    footer_returns:'سياسة الإرجاع', footer_tech:'مساعدة التوافق', footer_accessibility:'إمكانية الوصول', footer_privacy:'سياسة الخصوصية',
    footer_copy:'© 2026 علمدار لقطع غيار السيارات الكويت. جميع الحقوق محفوظة.',
    intro_tag:'مرحباً بك في علمدار أوتو',
    intro_h2:'متخصص الكويت في قطع <span class="orange">السيارات الألمانية</span>',
    intro_p:'علمدار أوتو توفر قطع المحرك والفرامل والتعليق والفلاتر والكهرباء والتبريد لمرسيدس وبي إم دبليو وأودي وفولكس فاجن وبورشه وجاكوار ورنج روفر للأفراد والكراجات في جميع أنحاء الكويت. أخبرنا بسيارتك وسنجد القطعة المناسبة.',
    intro_c1:'قطع أصلية وبجودة المصنع', intro_c2:'توصيل في جميع أنحاء الكويت',
    intro_c3:'أسعار للكراجات والتجار', intro_c4:'دعم بالعربية والإنجليزية',
    intro_cta_text:'اتصل بنا: 5215 9911 965+',
    co_title:'أكمل طلبك', co_order_sum:'ملخص الطلب', co_your_details:'بياناتك',
    co_delivery_addr:'عنوان التوصيل', co_total_label:'المبلغ الإجمالي',
    co_full_name:'الاسم الكامل *', co_wa_num:'رقم واتساب *', co_area:'المحافظة *',
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
