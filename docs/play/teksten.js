// ============================================================
// TEKSTEN VAN DE WEBDAGZAAK — alleen de zinnen die de app niet al
// heeft. Al het andere (knoppen van het bord, "Zaak opgelost!",
// "Deel resultaat", "Dag #…") komt uit het taalbestand van de app
// via T(), zodat web en app dezelfde woorden gebruiken.
// Per taal dezelfde aanspreekvorm en woordkeuze als i18n/<taal>.js
// (zaak/Fall/caso/affaire/дело/事件 …). Geen woord voor kopen.
//   practice  onder de speelknop bij het eerste bezoek
//   cta       de knop naar de App Store
//   ctaSub    regel onder de knop
//   next      aftellen naar de zaak van morgen ({0} = 05:12:33)
//   brand     merkregel onderaan
// ============================================================
const WEB_TEKST = {
  nl: { practice: 'Eerst een oefenzaak van 30 seconden.', cta: 'Speel 128 zaken gratis in de app', ctaSub: 'Voor iPhone · geen reclame', next: 'Nieuwe zaak over {0}', brand: 'Elke dag een nieuwe zaak' },
  en: { practice: 'First, a 30-second practice case.', cta: 'Play 128 cases free in the app', ctaSub: 'For iPhone · no ads', next: 'New case in {0}', brand: 'A new case every day' },
  de: { practice: 'Zuerst ein Übungsfall von 30 Sekunden.', cta: 'Spiel 128 Fälle gratis in der App', ctaSub: 'Für iPhone · ohne Werbung', next: 'Neuer Fall in {0}', brand: 'Jeden Tag ein neuer Fall' },
  es: { practice: 'Primero, un caso de práctica de 30 segundos.', cta: 'Juega 128 casos gratis en la app', ctaSub: 'Para iPhone · sin anuncios', next: 'Nuevo caso en {0}', brand: 'Un caso nuevo cada día' },
  fr: { practice: 'D’abord, un entraînement de 30 secondes.', cta: 'Joue à 128 affaires gratuites dans l’app', ctaSub: 'Pour iPhone · sans publicité', next: 'Nouvelle affaire dans {0}', brand: 'Une nouvelle affaire chaque jour' },
  id: { practice: 'Mulai dengan kasus latihan 30 detik.', cta: 'Mainkan 128 kasus gratis di aplikasi', ctaSub: 'Untuk iPhone · tanpa iklan', next: 'Kasus baru dalam {0}', brand: 'Kasus baru setiap hari' },
  it: { practice: 'Prima un caso di prova di 30 secondi.', cta: 'Gioca 128 casi gratis nell’app', ctaSub: 'Per iPhone · senza pubblicità', next: 'Nuovo caso tra {0}', brand: 'Un nuovo caso ogni giorno' },
  pt: { practice: 'Primeiro, um caso de treino de 30 segundos.', cta: 'Jogue 128 casos grátis no app', ctaSub: 'Para iPhone · sem anúncios', next: 'Novo caso em {0}', brand: 'Um caso novo todo dia' },
  tr: { practice: 'Önce 30 saniyelik bir alıştırma vakası.', cta: 'Uygulamada 128 vakayı ücretsiz oyna', ctaSub: 'iPhone için · reklamsız', next: 'Yeni vakaya {0} kaldı', brand: 'Her gün yeni bir vaka' },
  vi: { practice: 'Trước tiên, một vụ luyện tập 30 giây.', cta: 'Chơi miễn phí 128 vụ án trong ứng dụng', ctaSub: 'Dành cho iPhone · không quảng cáo', next: 'Vụ án mới sau {0}', brand: 'Mỗi ngày một vụ án mới' },
  ru: { practice: 'Сначала учебное дело на 30 секунд.', cta: 'Играйте в 128 дел бесплатно в приложении', ctaSub: 'Для iPhone · без рекламы', next: 'Новое дело через {0}', brand: 'Каждый день новое дело' },
  ar: { practice: 'أولًا قضية تدريبية مدتها 30 ثانية.', cta: 'العب 128 قضية مجانًا في التطبيق', ctaSub: 'لأجهزة iPhone · بلا إعلانات', next: 'قضية جديدة بعد {0}', brand: 'قضية جديدة كل يوم' },
  ur: { practice: 'پہلے 30 سیکنڈ کا ایک مشقی کیس۔', cta: 'ایپ میں 128 کیس مفت کھیلیں', ctaSub: 'iPhone کے لیے · کوئی اشتہار نہیں', next: 'نیا کیس {0} میں آئے گا', brand: 'ہر روز ایک نیا کیس' },
  hi: { practice: 'पहले 30 सेकंड का एक अभ्यास केस।', cta: 'ऐप में 128 केस मुफ़्त खेलें', ctaSub: 'iPhone के लिए · कोई विज्ञापन नहीं', next: 'नया केस {0} में', brand: 'हर दिन एक नया केस' },
  mr: { practice: 'आधी 30 सेकंदांचे एक सराव प्रकरण.', cta: 'ॲपमध्ये 128 प्रकरणे मोफत खेळा', ctaSub: 'iPhone साठी · जाहिराती नाहीत', next: 'नवे प्रकरण {0} मध्ये', brand: 'दररोज एक नवे प्रकरण' },
  bn: { practice: 'প্রথমে 30 সেকেন্ডের একটি অনুশীলনী কেস।', cta: 'অ্যাপে 128টি কেস বিনামূল্যে খেলুন', ctaSub: 'iPhone-এর জন্য · কোনো বিজ্ঞাপন নেই', next: 'নতুন কেস {0} পরে', brand: 'প্রতিদিন একটি নতুন কেস' },
  te: { practice: 'ముందుగా 30 సెకన్ల సాధన కేసు.', cta: 'యాప్‌లో 128 కేసులు ఉచితంగా ఆడండి', ctaSub: 'iPhone కోసం · ప్రకటనలు లేవు', next: 'కొత్త కేసు {0} తర్వాత', brand: 'ప్రతి రోజూ ఒక కొత్త కేసు' },
  zh: { practice: '先来一个30秒的练习案件。', cta: '在应用中免费玩128个案件', ctaSub: '适用于iPhone · 无广告', next: '{0}后有新案件', brand: '每天一个新案件' },
  ja: { practice: 'まずは30秒の練習事件から。', cta: 'アプリで128件の事件を無料でプレイ', ctaSub: 'iPhone用 · 広告なし', next: '次の事件まで {0}', brand: '毎日、新しい事件' },
  ko: { practice: '먼저 30초짜리 연습 사건부터 해요.', cta: '앱에서 사건 128개를 무료로 플레이하세요', ctaSub: 'iPhone용 · 광고 없음', next: '새 사건까지 {0}', brand: '매일 새로운 사건' }
};

// WT('next', '05:12:33'): de tekst in de taal van de pagina, anders Engels
function WT(key, ...vals) {
  const lang = typeof I18n !== 'undefined' ? I18n.lang : 'en';
  const t = (WEB_TEKST[lang] && WEB_TEKST[lang][key]) || WEB_TEKST.en[key] || key;
  return vals.length && typeof I18n !== 'undefined' ? I18n.format(t, vals) : t.replace(/\{0\}/g, vals[0] !== undefined ? String(vals[0]) : '{0}');
}

if (typeof module !== 'undefined' && module.exports) module.exports = { WEB_TEKST, WT };
