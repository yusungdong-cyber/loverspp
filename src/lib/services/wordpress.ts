import { db } from "@/lib/db";
import { encrypt, decrypt } from "@/lib/crypto";

interface WpApiResponse {
  id: number;
  link: string;
  status: string;
}

interface WpMediaResponse {
  id: number;
  source_url: string;
}

interface WpConnectionResult {
  success: boolean;
  siteName?: string;
  error?: string;
}

function getAuthHeader(username: string, password: string): string {
  const encoded = Buffer.from(`${username}:${password}`).toString("base64");
  return `Basic ${encoded}`;
}

export async function validateWpConnection(
  siteUrl: string,
  username: string,
  applicationPassword: string
): Promise<WpConnectionResult> {
  try {
    const baseUrl = siteUrl.replace(/\/+$/, "");
    const response = await fetch(`${baseUrl}/wp-json/wp/v2/users/me`, {
      headers: {
        Authorization: getAuthHeader(username, applicationPassword),
      },
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Connection failed: ${response.status} ${response.statusText}`,
      };
    }

    const data = await response.json();
    return { success: true, siteName: data.name || data.slug };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Connection failed",
    };
  }
}

export async function saveWpSite(
  userId: string,
  siteUrl: string,
  username: string,
  applicationPassword: string
) {
  const encryptedPassword = encrypt(applicationPassword);
  const normalizedUrl = siteUrl.replace(/\/+$/, "");

  return db.wpSite.upsert({
    where: {
      userId_siteUrl: { userId, siteUrl: normalizedUrl },
    },
    update: {
      username,
      applicationPassword: encryptedPassword,
      isConnected: true,
      lastVerifiedAt: new Date(),
    },
    create: {
      userId,
      siteUrl: normalizedUrl,
      username,
      applicationPassword: encryptedPassword,
      isConnected: true,
      lastVerifiedAt: new Date(),
    },
  });
}

export async function getUserSites(userId: string) {
  return db.wpSite.findMany({
    where: { userId },
    select: {
      id: true,
      siteUrl: true,
      username: true,
      isConnected: true,
      lastVerifiedAt: true,
      createdAt: true,
      _count: { select: { articles: true } },
    },
    orderBy: { createdAt: "desc" },
  });
}

export async function getSiteCredentials(siteId: string, userId: string) {
  const site = await db.wpSite.findFirst({
    where: { id: siteId, userId },
  });

  if (!site) throw new Error("Site not found");

  return {
    siteUrl: site.siteUrl,
    username: site.username,
    applicationPassword: decrypt(site.applicationPassword),
  };
}

export async function publishToWordPress(
  siteId: string,
  userId: string,
  article: {
    title: string;
    htmlContent: string;
    metaDescription?: string;
    tags?: string[];
    categories?: string[];
    status?: "draft" | "publish" | "future";
    scheduledAt?: Date;
    featuredImageUrl?: string;
  }
): Promise<{ wpPostId: number; link: string }> {
  const creds = await getSiteCredentials(siteId, userId);
  const baseUrl = creds.siteUrl;
  const auth = getAuthHeader(creds.username, creds.applicationPassword);

  // Create/get categories
  const categoryIds: number[] = [];
  if (article.categories?.length) {
    for (const catName of article.categories) {
      const catId = await findOrCreateCategory(baseUrl, auth, catName);
      if (catId) categoryIds.push(catId);
    }
  }

  // Create/get tags
  const tagIds: number[] = [];
  if (article.tags?.length) {
    for (const tagName of article.tags) {
      const tagId = await findOrCreateTag(baseUrl, auth, tagName);
      if (tagId) tagIds.push(tagId);
    }
  }

  // Build post body
  const postBody: Record<string, unknown> = {
    title: article.title,
    content: article.htmlContent,
    status: article.status || "draft",
    categories: categoryIds,
    tags: tagIds,
    excerpt: article.metaDescription || "",
  };

  if (article.status === "future" && article.scheduledAt) {
    postBody.date = article.scheduledAt.toISOString();
    postBody.status = "future";
  }

  // Upload featured image if URL provided
  if (article.featuredImageUrl) {
    const mediaId = await uploadMediaFromUrl(
      baseUrl,
      auth,
      article.featuredImageUrl,
      article.title
    );
    if (mediaId) postBody.featured_media = mediaId;
  }

  const response = await fetch(`${baseUrl}/wp-json/wp/v2/posts`, {
    method: "POST",
    headers: {
      Authorization: auth,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(postBody),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`WordPress API error: ${response.status} - ${err}`);
  }

  const data: WpApiResponse = await response.json();
  return { wpPostId: data.id, link: data.link };
}

async function findOrCreateCategory(
  baseUrl: string,
  auth: string,
  name: string
): Promise<number | null> {
  try {
    // Search existing
    const searchRes = await fetch(
      `${baseUrl}/wp-json/wp/v2/categories?search=${encodeURIComponent(name)}`,
      { headers: { Authorization: auth } }
    );
    const existing = await searchRes.json();
    if (Array.isArray(existing) && existing.length > 0) return existing[0].id;

    // Create new
    const createRes = await fetch(`${baseUrl}/wp-json/wp/v2/categories`, {
      method: "POST",
      headers: { Authorization: auth, "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const created = await createRes.json();
    return created.id || null;
  } catch {
    return null;
  }
}

async function findOrCreateTag(
  baseUrl: string,
  auth: string,
  name: string
): Promise<number | null> {
  try {
    const searchRes = await fetch(
      `${baseUrl}/wp-json/wp/v2/tags?search=${encodeURIComponent(name)}`,
      { headers: { Authorization: auth } }
    );
    const existing = await searchRes.json();
    if (Array.isArray(existing) && existing.length > 0) return existing[0].id;

    const createRes = await fetch(`${baseUrl}/wp-json/wp/v2/tags`, {
      method: "POST",
      headers: { Authorization: auth, "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    const created = await createRes.json();
    return created.id || null;
  } catch {
    return null;
  }
}

async function uploadMediaFromUrl(
  baseUrl: string,
  auth: string,
  imageUrl: string,
  title: string
): Promise<number | null> {
  try {
    const imgResponse = await fetch(imageUrl);
    if (!imgResponse.ok) return null;

    const buffer = await imgResponse.arrayBuffer();
    const contentType = imgResponse.headers.get("content-type") || "image/jpeg";
    const ext = contentType.includes("png") ? "png" : "jpg";

    const res = await fetch(`${baseUrl}/wp-json/wp/v2/media`, {
      method: "POST",
      headers: {
        Authorization: auth,
        "Content-Type": contentType,
        "Content-Disposition": `attachment; filename="${encodeURIComponent(title.slice(0, 50))}.${ext}"`,
      },
      body: Buffer.from(buffer),
    });

    if (!res.ok) return null;
    const media: WpMediaResponse = await res.json();
    return media.id;
  } catch {
    return null;
  }
}

export async function deleteSite(siteId: string, userId: string) {
  return db.wpSite.deleteMany({ where: { id: siteId, userId } });
}
