/**
 * Seed script for VibeExchange
 *
 * Usage: npx tsx scripts/seed.ts
 *
 * Prerequisites:
 * - Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 * - Run the migration SQL first
 */

import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!supabaseUrl || !serviceRoleKey) {
  console.error("Missing env vars: NEXT_PUBLIC_SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { autoRefreshToken: false, persistSession: false },
});

async function seed() {
  console.log("Seeding VibeExchange...");

  // Create test users
  const users = [
    { email: "buyer@test.com", password: "test1234", display_name: "김구매" },
    { email: "seller@test.com", password: "test1234", display_name: "바이브마스터" },
    { email: "creator@test.com", password: "test1234", display_name: "이크리에이터" },
  ];

  const userIds: string[] = [];

  for (const u of users) {
    const { data, error } = await supabase.auth.admin.createUser({
      email: u.email,
      password: u.password,
      email_confirm: true,
    });
    if (error) {
      console.error(`User ${u.email}: ${error.message}`);
      continue;
    }
    if (data.user) {
      userIds.push(data.user.id);
      await supabase
        .from("profiles")
        .update({ display_name: u.display_name })
        .eq("id", data.user.id);
      console.log(`Created user: ${u.email} (${data.user.id})`);
    }
  }

  if (userIds.length < 3) {
    console.error("Failed to create all test users");
    process.exit(1);
  }

  const [buyerId, sellerId, creatorId] = userIds;

  // Seed Requests (Flow A)
  const requests = [
    { owner_id: buyerId, title: "스타트업 랜딩 페이지 제작", type: "landing", budget_min: 500000, budget_max: 1000000, currency: "KRW", description: "AI 스타트업 소개 랜딩 페이지를 제작해주실 분을 찾습니다.\n\n- 히어로 섹션\n- 기능 소개 (3~4개)\n- 요금제 비교\n- FAQ\n- 모바일 반응형 필수", preferred_stack: "Next.js, Tailwind CSS", reference_urls: ["https://stripe.com", "https://linear.app"], status: "open" },
    { owner_id: buyerId, title: "포트폴리오 웹사이트 리뉴얼", type: "website", budget_min: 300000, budget_max: 800000, currency: "KRW", description: "디자이너 포트폴리오 사이트를 모던하게 리뉴얼하고 싶습니다.", status: "open" },
    { owner_id: buyerId, title: "쇼핑몰 Shopify 커스터마이징", type: "shopify", budget_min: 1000000, budget_max: 2000000, currency: "KRW", description: "패션 쇼핑몰 Shopify 테마 커스터마이징이 필요합니다.", status: "in_discussion" },
    { owner_id: buyerId, title: "SaaS 대시보드 UI 개발", type: "website", budget_min: 200, budget_max: 500, currency: "USD", description: "데이터 분석 SaaS의 대시보드 프론트엔드 개발.", status: "open" },
  ];

  for (const req of requests) {
    const { error } = await supabase.from("requests").insert(req);
    if (error) console.error(`Request: ${error.message}`);
    else console.log(`Created request: ${req.title}`);
  }

  // Seed Listings (Flow B)
  const listings = [
    { seller_id: sellerId, title: "AI 이미지 생성 SaaS", category: "saas", price_amount: 5000000, price_currency: "KRW", short_desc: "Stable Diffusion 기반 이미지 생성 서비스. 월 500명 활성 사용자.", long_desc: "Stable Diffusion API를 활용한 웹 기반 이미지 생성 서비스입니다.\n\n기술 스택: Next.js 14, Supabase, Replicate API, Stripe\n월 매출: ~₩800,000", tags: ["AI", "이미지", "SaaS"], demo_url: "https://demo.example.com", payment_method: "contact", status: "published" },
    { seller_id: sellerId, title: "자동 이메일 마케팅 봇", category: "automation", price_amount: 1500000, price_currency: "KRW", short_desc: "GPT 기반 이메일 캠페인 자동 생성 및 발송 시스템.", tags: ["GPT", "이메일", "마케팅"], payment_method: "external", external_payment_url: "https://pay.example.com", status: "published" },
    { seller_id: creatorId, title: "Next.js SaaS 보일러플레이트", category: "template", price_amount: 300000, price_currency: "KRW", short_desc: "인증, 결제, 대시보드 포함 풀스택 템플릿.", tags: ["Next.js", "템플릿", "Stripe"], demo_url: "https://template-demo.example.com", payment_method: "contact", status: "published" },
    { seller_id: creatorId, title: "URL 단축기 마이크로앱", category: "micro_app", price_amount: 800000, price_currency: "KRW", short_desc: "커스텀 도메인 지원 URL 단축 서비스.", tags: ["URL", "마이크로앱"], payment_method: "contact", status: "published" },
  ];

  for (const listing of listings) {
    const { error } = await supabase.from("listings").insert(listing);
    if (error) console.error(`Listing: ${error.message}`);
    else console.log(`Created listing: ${listing.title}`);
  }

  // Seed a Proposal
  const { data: reqData } = await supabase.from("requests").select("id").limit(1).single();
  if (reqData) {
    const { error } = await supabase.from("proposals").insert({
      request_id: reqData.id,
      creator_id: creatorId,
      price_amount: 700000,
      currency: "KRW",
      timeline_days: 7,
      message: "안녕하세요! 비슷한 랜딩 페이지를 여러 번 제작한 경험이 있습니다. Next.js + Tailwind로 깔끔하게 만들어 드리겠습니다.",
      portfolio_urls: ["https://portfolio.example.com"],
    });
    if (error) console.error(`Proposal: ${error.message}`);
    else console.log("Created sample proposal");
  }

  console.log("\nSeeding complete!");
  console.log("Test accounts:");
  console.log("  buyer@test.com / test1234");
  console.log("  seller@test.com / test1234");
  console.log("  creator@test.com / test1234");
}

seed().catch(console.error);
