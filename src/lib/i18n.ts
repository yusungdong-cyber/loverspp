// ============================================================
// i18n — lightweight string map for EN / JA
// To add a new language: add a key to Lang and a new column to `strings`.
// ============================================================

export type Lang = "en" | "ja";

const strings = {
  // Nav
  "nav.how": { en: "How It Works", ja: "使い方" },
  "nav.services": { en: "Services", ja: "サービス" },
  "nav.pricing": { en: "Pricing", ja: "料金" },
  "nav.benefits": { en: "Benefits", ja: "特典" },
  "nav.reviews": { en: "Reviews", ja: "レビュー" },
  "nav.faq": { en: "FAQ", ja: "よくある質問" },

  // Hero
  "hero.badge": { en: "Seoul Travel Concierge", ja: "ソウル旅行コンシェルジュ" },
  "hero.headline": {
    en: "No Tourist Traps.\nNo Rip-offs.\nJust Seoul, Done Right.",
    ja: "ぼったくりなし。\n騙されない。\nソウルを正しく楽しもう。",
  },
  "hero.sub": {
    en: "Real locals answer your questions in real time via chat. Not AI — actual people who live in Seoul and know every street, menu, and fair price.",
    ja: "ソウルに住むリアルな現地人がチャットでリアルタイムにお答えします。AIではなく、すべての通り・メニュー・適正価格を知る本物の人間です。",
  },
  "hero.cta.telegram": { en: "Start on Telegram", ja: "Telegramで始める" },
  "hero.cta.buy": { en: "Buy a Pass", ja: "パスを購入" },

  // How it works
  "how.title": { en: "How It Works", ja: "使い方" },
  "how.step1.title": { en: "Choose Your Pass", ja: "パスを選ぶ" },
  "how.step1.desc": {
    en: "Pick a 3, 5, or 7-day pass. Add Premium for priority response and late-night support.",
    ja: "3日・5日・7日パスから選択。プレミアムで優先返信と深夜サポートを追加。",
  },
  "how.step2.title": { en: "Chat With a Local", ja: "ローカルとチャット" },
  "how.step2.desc": {
    en: "Open Telegram or WhatsApp and start chatting. Ask anything — prices, directions, restaurant orders, or emergencies.",
    ja: "TelegramまたはWhatsAppを開いてチャット開始。価格・道案内・注文・緊急時、何でも聞けます。",
  },
  "how.step3.title": { en: "Travel Safely", ja: "安心して旅する" },
  "how.step3.desc": {
    en: "Your local guides you through every situation. No scams, no confusion, no overpaying.",
    ja: "ローカルがあらゆる場面をサポート。詐欺・混乱・ぼったくりとは無縁の旅を。",
  },

  // Services
  "services.title": { en: "What We Help With", ja: "サポート内容" },
  "services.price.title": { en: "Price Check & Scam Prevention", ja: "価格チェック＆詐欺防止" },
  "services.price.desc": {
    en: "\"Is this price fair?\" — get an honest answer before you pay.",
    ja: "「この値段は適正？」— 支払う前に正直な回答を。",
  },
  "services.food.title": { en: "Restaurant Ordering & Recs", ja: "レストラン注文＆おすすめ" },
  "services.food.desc": {
    en: "What to eat, where to eat, how to order — even in Korean-only spots.",
    ja: "何を食べるか、どこで食べるか、注文方法 — 韓国語のみのお店でも。",
  },
  "services.directions.title": { en: "Directions & Transport", ja: "道案内・交通" },
  "services.directions.desc": {
    en: "Subway, bus, taxi — we'll guide you turn by turn in real time.",
    ja: "地下鉄・バス・タクシー — リアルタイムでルートを案内します。",
  },
  "services.reservation.title": { en: "Reservation Help", ja: "予約サポート" },
  "services.reservation.desc": {
    en: "Restaurants, spas, clinics — we make calls and book on your behalf.",
    ja: "レストラン・スパ・クリニック — 電話予約を代行します。",
  },
  "services.emergency.title": { en: "Emergency Support", ja: "緊急サポート" },
  "services.emergency.desc": {
    en: "Lost? Sick? Scammed? We help you handle it calmly and quickly.",
    ja: "迷子？体調不良？被害に遭った？落ち着いて迅速に対応します。",
  },
  "services.culture.title": { en: "Cultural Tips & Etiquette", ja: "文化・マナーのヒント" },
  "services.culture.desc": {
    en: "Know what's polite, what's expected, and how to blend in like a local.",
    ja: "礼儀作法、期待されること、現地に溶け込む方法をお伝えします。",
  },

  // Why not AI
  "why.title": { en: "Why Not AI?", ja: "なぜAIではないのか？" },
  "why.sub": {
    en: "AI can give you information. A local can solve your situation.",
    ja: "AIは情報を提供できます。ローカルはあなたの状況を解決します。",
  },
  "why.ai.title": { en: "AI Chatbot", ja: "AIチャットボット" },
  "why.local.title": { en: "LoversPick Local", ja: "LoversPick ローカル" },
  "why.row1.ai": { en: "Gives generic restaurant lists", ja: "一般的なレストランリストを表示" },
  "why.row1.local": { en: "Tells you which stall at the market has the best tteokbokki right now", ja: "今この瞬間、市場で一番美味しいトッポッキの屋台を教えてくれる" },
  "why.row2.ai": { en: "Says \"prices vary\"", ja: "「価格はさまざまです」と回答" },
  "why.row2.local": { en: "Tells you the exact fair price and if you're being overcharged", ja: "正確な適正価格と、ぼったくりかどうかを教えてくれる" },
  "why.row3.ai": { en: "Links you to an emergency page", ja: "緊急ページへリンクを提示" },
  "why.row3.local": { en: "Walks you through the situation step by step in real time", ja: "リアルタイムで状況をステップごとにサポート" },

  // Pricing
  "pricing.title": { en: "Choose Your Pass", ja: "パスを選ぶ" },
  "pricing.sub": {
    en: "Unlimited chat with a real Seoul local. No per-message fees, ever.",
    ja: "ソウルのリアルなローカルと無制限チャット。メッセージごとの課金は一切なし。",
  },
  "pricing.popular": { en: "Most Popular", ja: "一番人気" },
  "pricing.premium": { en: "Premium Add-on", ja: "プレミアムアドオン" },
  "pricing.cta": { en: "Get Started", ja: "始める" },
  "pricing.currency": { en: "$", ja: "$" },
  "pricing.perPass": { en: "per pass", ja: "/パス" },

  // Benefits
  "benefits.title": { en: "Exclusive Benefits", ja: "限定特典" },
  "benefits.sub": {
    en: "LoversPick members get free extras at our partner businesses across Seoul.",
    ja: "LoversPick会員はソウルの提携店舗で無料特典を受けられます。",
  },

  // Testimonials
  "testimonials.title": { en: "What Travelers Say", ja: "旅行者の声" },
  "testimonials.badge": { en: "As Seen On", ja: "メディア掲載" },

  // FAQ
  "faq.title": { en: "Frequently Asked Questions", ja: "よくある質問" },

  // Lead capture
  "lead.title": { en: "Get Early Access", ja: "早期アクセスを取得" },
  "lead.sub": {
    en: "Leave your details and we'll reach out before your trip.",
    ja: "ご連絡先を入力いただければ、旅行前にご連絡いたします。",
  },
  "lead.email": { en: "Email address", ja: "メールアドレス" },
  "lead.handle": { en: "Telegram or WhatsApp handle", ja: "Telegram / WhatsApp ID" },
  "lead.platform.label": { en: "Preferred platform", ja: "ご希望のプラットフォーム" },
  "lead.consent": {
    en: "I agree to receive occasional updates about LoversPick services. You can unsubscribe at any time. We respect your privacy and will never share your data with third parties.",
    ja: "LoversPick サービスに関する最新情報を受け取ることに同意します。いつでも配信停止できます。プライバシーを尊重し、第三者にデータを共有することはありません。",
  },
  "lead.submit": { en: "Join Waitlist", ja: "ウェイトリストに登録" },
  "lead.success": { en: "You're on the list! We'll be in touch soon.", ja: "登録完了！近日中にご連絡いたします。" },

  // Footer
  "footer.tagline": {
    en: "Real locals. Real-time help. No tourist traps.",
    ja: "リアルなローカル。リアルタイムサポート。ぼったくりなし。",
  },
  "footer.company": { en: "Company", ja: "会社情報" },
  "footer.about": { en: "About", ja: "概要" },
  "footer.careers": { en: "Careers", ja: "採用" },
  "footer.contact": { en: "Contact", ja: "お問い合わせ" },
  "footer.legal": { en: "Legal", ja: "法的情報" },
  "footer.terms": { en: "Terms of Service", ja: "利用規約" },
  "footer.privacy": { en: "Privacy Policy", ja: "プライバシーポリシー" },
  "footer.connect": { en: "Connect", ja: "つながる" },
  "footer.rights": { en: "All rights reserved.", ja: "All rights reserved." },
} as const;

type StringKey = keyof typeof strings;

export function t(key: StringKey, lang: Lang): string {
  return strings[key][lang];
}
