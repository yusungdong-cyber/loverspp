import { db } from "@/lib/db";
import { TREND_CATEGORIES } from "@/lib/constants";

interface TrendTopicData {
  title: string;
  keyword: string;
  searchVolume: number;
  competitionScore: number;
  monetizationScore: number;
  trendScore: number;
  category: string;
}

// Mock trending topics pool - simulates Google Trends API
const MOCK_TOPICS_POOL: TrendTopicData[] = [
  {
    title: "AI-Powered Home Automation in 2026",
    keyword: "ai home automation 2026",
    searchVolume: 74000,
    competitionScore: 35,
    monetizationScore: 88,
    trendScore: 92,
    category: "Technology",
  },
  {
    title: "Best Budget Electric Vehicles Under $30K",
    keyword: "budget electric vehicles 2026",
    searchVolume: 110000,
    competitionScore: 58,
    monetizationScore: 95,
    trendScore: 87,
    category: "Automotive",
  },
  {
    title: "Remote Work Productivity Tools Guide",
    keyword: "remote work productivity tools",
    searchVolume: 62000,
    competitionScore: 42,
    monetizationScore: 78,
    trendScore: 81,
    category: "Business",
  },
  {
    title: "Beginner's Guide to Passive Income Streams",
    keyword: "passive income streams beginners",
    searchVolume: 88000,
    competitionScore: 65,
    monetizationScore: 92,
    trendScore: 76,
    category: "Finance",
  },
  {
    title: "Plant-Based Protein Supplements Review",
    keyword: "plant based protein supplements",
    searchVolume: 49000,
    competitionScore: 30,
    monetizationScore: 85,
    trendScore: 74,
    category: "Health",
  },
  {
    title: "Smart Home Security Systems Comparison",
    keyword: "smart home security systems 2026",
    searchVolume: 93000,
    competitionScore: 48,
    monetizationScore: 90,
    trendScore: 85,
    category: "Technology",
  },
  {
    title: "Best Online Course Platforms for Creators",
    keyword: "online course platforms creators",
    searchVolume: 55000,
    competitionScore: 38,
    monetizationScore: 82,
    trendScore: 79,
    category: "Education",
  },
  {
    title: "Keto Diet Meal Prep for Beginners",
    keyword: "keto diet meal prep beginners",
    searchVolume: 71000,
    competitionScore: 52,
    monetizationScore: 75,
    trendScore: 72,
    category: "Food",
  },
  {
    title: "Side Hustle Ideas That Actually Work",
    keyword: "side hustle ideas 2026",
    searchVolume: 120000,
    competitionScore: 70,
    monetizationScore: 88,
    trendScore: 83,
    category: "Finance",
  },
  {
    title: "Best VPN Services for Privacy",
    keyword: "best vpn services privacy 2026",
    searchVolume: 85000,
    competitionScore: 62,
    monetizationScore: 93,
    trendScore: 80,
    category: "Technology",
  },
  {
    title: "Email Marketing Automation Strategies",
    keyword: "email marketing automation strategies",
    searchVolume: 46000,
    competitionScore: 40,
    monetizationScore: 86,
    trendScore: 77,
    category: "Marketing",
  },
  {
    title: "Standing Desk Benefits and Best Picks",
    keyword: "standing desk benefits best picks",
    searchVolume: 67000,
    competitionScore: 35,
    monetizationScore: 80,
    trendScore: 75,
    category: "Lifestyle",
  },
  {
    title: "Best Streaming Services Compared",
    keyword: "best streaming services comparison 2026",
    searchVolume: 140000,
    competitionScore: 75,
    monetizationScore: 70,
    trendScore: 82,
    category: "Entertainment",
  },
  {
    title: "How to Start Dropshipping in 2026",
    keyword: "start dropshipping 2026 guide",
    searchVolume: 98000,
    competitionScore: 68,
    monetizationScore: 91,
    trendScore: 78,
    category: "Business",
  },
  {
    title: "Natural Sleep Remedies That Work",
    keyword: "natural sleep remedies that work",
    searchVolume: 54000,
    competitionScore: 28,
    monetizationScore: 76,
    trendScore: 73,
    category: "Health",
  },
];

function calculateTrendScore(topic: TrendTopicData): number {
  const volumeNorm = Math.min(topic.searchVolume / 150000, 1) * 100;
  const compInverse = 100 - topic.competitionScore;
  return Math.round(
    volumeNorm * 0.35 + compInverse * 0.25 + topic.monetizationScore * 0.4
  );
}

function addVariance(base: number, range: number): number {
  return Math.max(0, Math.round(base + (Math.random() - 0.5) * range));
}

export async function generateTrendTopics(
  userId: string,
  category?: string
): Promise<{ sessionId: string; topics: TrendTopicData[] }> {
  let pool = [...MOCK_TOPICS_POOL];

  if (category && TREND_CATEGORIES.includes(category as typeof TREND_CATEGORIES[number])) {
    pool = pool.filter((t) => t.category === category);
  }

  // Add daily variance to simulate real trend data
  const varied = pool.map((t) => ({
    ...t,
    searchVolume: addVariance(t.searchVolume, 20000),
    competitionScore: addVariance(t.competitionScore, 10),
    monetizationScore: addVariance(t.monetizationScore, 8),
    trendScore: 0,
  }));

  varied.forEach((t) => {
    t.trendScore = calculateTrendScore(t);
  });

  // Sort by trend score descending, take top 5
  const top5 = varied.sort((a, b) => b.trendScore - a.trendScore).slice(0, 5);

  const session = await db.trendSession.create({
    data: {
      userId,
      topics: {
        create: top5.map((t) => ({
          title: t.title,
          keyword: t.keyword,
          searchVolume: t.searchVolume,
          competitionScore: t.competitionScore,
          monetizationScore: t.monetizationScore,
          trendScore: t.trendScore,
          category: t.category,
        })),
      },
    },
    include: { topics: true },
  });

  return { sessionId: session.id, topics: top5 };
}

export async function getLatestTrends(userId: string) {
  return db.trendSession.findFirst({
    where: { userId },
    orderBy: { createdAt: "desc" },
    include: { topics: { orderBy: { trendScore: "desc" } } },
  });
}

export async function getTrendHistory(userId: string, limit = 10) {
  return db.trendSession.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    include: { topics: { orderBy: { trendScore: "desc" } } },
  });
}
