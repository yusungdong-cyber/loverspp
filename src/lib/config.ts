// ============================================================
// LoversPick — single source of truth for all editable content
// Edit prices, links, and copy here. No need to touch components.
// ============================================================

export const SITE = {
  name: "LoversPick",
  tagline: "No tourist traps. No rip-offs. Just Seoul, done right.",
  description:
    "Real locals help you navigate Seoul in real time via chat. Price checks, restaurant orders, directions, reservations, and emergency support — all from someone who actually lives here.",
  url: "https://loverspick.com",
  ogImage: "/og-image.png",
  twitter: "@loverspick",
} as const;

// CTA links — update with your real Telegram bot / storefront URLs
export const CTA = {
  telegram: "https://t.me/loverspick_bot?utm_source=website&utm_medium=hero&utm_campaign=launch",
  buyPass: "https://loverspick.com/buy?utm_source=website&utm_medium=hero&utm_campaign=launch",
  whatsapp: "https://wa.me/821012345678?utm_source=website&utm_medium=footer&utm_campaign=launch",
} as const;

// Pricing — all amounts in USD
export interface PlanConfig {
  id: string;
  name: string;
  nameJa: string;
  days: number;
  price: number;
  features: string[];
  featuresJa: string[];
  popular?: boolean;
}

export const PLANS: PlanConfig[] = [
  {
    id: "3day",
    name: "3-Day Pass",
    nameJa: "3日パス",
    days: 3,
    price: 39,
    features: [
      "Unlimited chat messages",
      "Restaurant & café recommendations",
      "Price check on any purchase",
      "Subway & taxi guidance",
      "Response within 5 minutes (9 AM–11 PM KST)",
    ],
    featuresJa: [
      "チャット無制限",
      "レストラン＆カフェのおすすめ",
      "購入価格チェック",
      "地下鉄・タクシー案内",
      "5分以内に返信（9時〜23時 KST）",
    ],
  },
  {
    id: "5day",
    name: "5-Day Pass",
    nameJa: "5日パス",
    days: 5,
    price: 59,
    popular: true,
    features: [
      "Everything in 3-Day",
      "Reservation assistance",
      "Emergency support",
      "Cultural tips & etiquette help",
      "Response within 3 minutes (9 AM–11 PM KST)",
    ],
    featuresJa: [
      "3日パスの全機能",
      "予約サポート",
      "緊急サポート",
      "文化・マナーのアドバイス",
      "3分以内に返信（9時〜23時 KST）",
    ],
  },
  {
    id: "7day",
    name: "7-Day Pass",
    nameJa: "7日パス",
    days: 7,
    price: 79,
    features: [
      "Everything in 5-Day",
      "Extended hours (9 AM–2 AM KST)",
      "Multi-city support (Seoul + Busan)",
      "Shopping & bargain navigation",
      "Personalized itinerary help",
    ],
    featuresJa: [
      "5日パスの全機能",
      "延長対応（9時〜翌2時 KST）",
      "複数都市対応（ソウル＋釜山）",
      "ショッピング＆値段交渉サポート",
      "パーソナルな旅程サポート",
    ],
  },
];

export const PREMIUM_ADDON = {
  name: "Premium Add-on",
  nameJa: "プレミアムアドオン",
  price: 29,
  features: [
    "Priority response (under 1 minute)",
    "Late-night support until 4 AM KST",
    "Dedicated local concierge",
  ],
  featuresJa: [
    "優先返信（1分以内）",
    "深夜4時までサポート",
    "専属ローカルコンシェルジュ",
  ],
} as const;

// Exclusive benefits — NOT discounts
export const BENEFITS = [
  {
    icon: "🍜",
    title: "Free Side Dish",
    titleJa: "無料サイドメニュー",
    description: "Our partner restaurants add a bonus dish when you mention LoversPick.",
    descriptionJa: "提携レストランでLoversPick利用者にサイドメニューをサービス。",
  },
  {
    icon: "🍸",
    title: "Welcome Drink",
    titleJa: "ウェルカムドリンク",
    description: "Complimentary welcome drink at select bars and cafés across Seoul.",
    descriptionJa: "ソウルの厳選バー・カフェでウェルカムドリンクをプレゼント。",
  },
  {
    icon: "🏨",
    title: "Room Upgrade",
    titleJa: "ルームアップグレード",
    description: "When available, our hotel partners upgrade your room at no extra cost.",
    descriptionJa: "空き状況に応じて、提携ホテルが無料でお部屋をアップグレード。",
  },
  {
    icon: "🕐",
    title: "Late Checkout",
    titleJa: "レイトチェックアウト",
    description: "Enjoy a relaxed morning — late checkout arranged with partner hotels.",
    descriptionJa: "提携ホテルでレイトチェックアウトを手配。",
  },
  {
    icon: "💆",
    title: "Bonus Skincare Add-on",
    titleJa: "ボーナス・スキンケア",
    description: "Extra treatment step included free at partnered K-beauty spas.",
    descriptionJa: "提携K-ビューティースパで追加トリートメントを無料で。",
  },
  {
    icon: "🎁",
    title: "Surprise Local Gift",
    titleJa: "サプライズ・ローカルギフト",
    description: "A small handpicked gift from a local shop — our way of saying welcome.",
    descriptionJa: "地元のお店からセレクトしたギフトをプレゼント。",
  },
] as const;

// Testimonials
export const TESTIMONIALS = [
  {
    name: "Sarah M.",
    city: "New York",
    text: "A taxi driver tried to charge me ₩45,000 for a ₩12,000 ride. My LoversPick local told me the real fare and even texted me the Korean phrase to say. Saved me instantly.",
  },
  {
    name: "James K.",
    city: "London",
    text: "I asked for a restaurant rec near Hongdae and got a reply in 2 minutes with the exact place, what to order, and how to say it. Better than any guidebook.",
  },
  {
    name: "田中 ゆき",
    city: "Tokyo",
    text: "韓国語が話せなくても、チャットでリアルタイムにサポートしてもらえて安心でした。明洞のお店で値段交渉まで手伝ってくれました。",
  },
  {
    name: "Emily R.",
    city: "Los Angeles",
    text: "I got food poisoning at 1 AM and my LoversPick local helped me find a 24-hour pharmacy AND translated my symptoms. Lifesaver — literally.",
  },
  {
    name: "佐藤 健太",
    city: "Osaka",
    text: "AIチャットボットとは全然違います。本当にソウルに住んでいる人がリアルタイムで答えてくれるので、信頼感が全く違いました。",
  },
  {
    name: "Michael T.",
    city: "Sydney",
    text: "Worth every penny. My local helped me navigate Gwangjang Market, told me which stalls were legit, and even recommended the best bindaetteok vendor.",
  },
] as const;

// FAQ
export interface FAQItem {
  question: string;
  questionJa: string;
  answer: string;
  answerJa: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "How fast will I get a response?",
    questionJa: "返信はどのくらい早いですか？",
    answer:
      "During operating hours (9 AM–11 PM KST for standard, extended for Premium), you'll typically receive a response within 3–5 minutes. Premium add-on users get priority replies in under 1 minute.",
    answerJa:
      "営業時間中（スタンダード: 9時〜23時 KST、プレミアム: 延長対応）は通常3〜5分以内に返信します。プレミアムアドオンでは1分以内の優先返信が可能です。",
  },
  {
    question: "What languages are supported?",
    questionJa: "対応言語は何ですか？",
    answer:
      "Our locals are fluent in English and Japanese. We're expanding to Mandarin and Spanish soon.",
    answerJa:
      "英語と日本語に対応しています。近日中に中国語とスペイン語にも対応予定です。",
  },
  {
    question: 'What counts as a "tourist trap"?',
    questionJa: "「観光客向けのぼったくり」とは何ですか？",
    answer:
      "Any business that systematically overcharges foreigners, provides misleading information, or uses high-pressure tactics. Our locals know which spots are genuine and which ones exploit tourists.",
    answerJa:
      "外国人に対して組織的に高額請求したり、誤解を招く情報を提供したり、強引な営業をする店舗を指します。私たちのローカルは、どの店が本物でどの店が観光客を搾取しているか熟知しています。",
  },
  {
    question: "What is the refund policy?",
    questionJa: "返金ポリシーはどうなっていますか？",
    answer:
      "If you haven't started a chat session, we offer a full refund within 7 days of purchase. Once a chat session begins, we'll issue a prorated refund for unused days if you're not satisfied.",
    answerJa:
      "チャットセッションを開始していない場合、購入から7日以内であれば全額返金いたします。チャットセッション開始後にご満足いただけなかった場合は、未使用日数に応じた日割り返金を行います。",
  },
  {
    question: "How do you handle my data and privacy?",
    questionJa: "データとプライバシーはどのように扱われますか？",
    answer:
      "We collect only the minimum data needed to provide the service: your chat handle and messages. We never sell your data, and chat logs are automatically deleted 30 days after your pass expires. See our Privacy Policy for full details.",
    answerJa:
      "サービス提供に必要な最低限のデータ（チャットハンドルとメッセージ）のみ収集します。データの販売は一切行わず、チャットログはパス有効期限後30日で自動削除されます。詳細はプライバシーポリシーをご覧ください。",
  },
];
