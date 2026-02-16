/* ── Profile ─────────────────────────────────────── */
export interface Profile {
  id: string;
  email: string;
  display_name: string | null;
  created_at: string;
}

/* ── Flow A: Requests ────────────────────────────── */
export type RequestType = "landing" | "website" | "shopify" | "other";
export type RequestStatus = "open" | "in_discussion" | "closed";

export interface BuildRequest {
  id: string;
  owner_id: string;
  title: string;
  type: RequestType;
  budget_min: number;
  budget_max: number;
  currency: string;
  deadline: string | null;
  description: string;
  checklist: Record<string, boolean> | null;
  reference_urls: string[] | null;
  preferred_stack: string | null;
  status: RequestStatus;
  created_at: string;
  updated_at: string;
  // joined
  profiles?: Profile;
}

export type ProposalStatus = "submitted" | "selected" | "rejected";

export interface Proposal {
  id: string;
  request_id: string;
  creator_id: string;
  price_amount: number;
  currency: string;
  timeline_days: number;
  message: string;
  portfolio_urls: string[] | null;
  status: ProposalStatus;
  created_at: string;
  // joined
  profiles?: Profile;
  requests?: BuildRequest;
}

/* ── Flow B: Marketplace ─────────────────────────── */
export type ListingCategory = "saas" | "automation" | "template" | "micro_app";
export type ListingStatus = "draft" | "published" | "sold";
export type PaymentMethod = "stripe" | "external" | "contact";

export interface Listing {
  id: string;
  seller_id: string;
  title: string;
  category: ListingCategory;
  price_amount: number;
  price_currency: string;
  short_desc: string;
  long_desc: string | null;
  tags: string[] | null;
  demo_url: string | null;
  repo_info: string | null;
  delivery_notes: string | null;
  maintenance_notes: string | null;
  payment_method: PaymentMethod;
  external_payment_url: string | null;
  status: ListingStatus;
  created_at: string;
  updated_at: string;
  // joined
  profiles?: Profile;
  listing_images?: ListingImage[];
}

export interface ListingImage {
  id: string;
  listing_id: string;
  url: string;
  created_at: string;
}

/* ── Messaging ───────────────────────────────────── */
export interface Thread {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  created_at: string;
  // joined
  listings?: Listing;
  buyer_profile?: Profile;
  seller_profile?: Profile;
  messages?: Message[];
}

export interface Message {
  id: string;
  thread_id: string;
  sender_id: string;
  body: string;
  created_at: string;
  // joined
  profiles?: Profile;
}

/* ── Deals ───────────────────────────────────────── */
export type DealStatus =
  | "initiated"
  | "negotiating"
  | "paid"
  | "delivered"
  | "completed"
  | "cancelled";

export interface Deal {
  id: string;
  listing_id: string;
  buyer_id: string;
  seller_id: string;
  price_amount: number;
  price_currency: string;
  status: DealStatus;
  platform_fee_amount: number;
  payment_provider: string | null;
  provider_session_id: string | null;
  fee_due_amount: number | null;
  created_at: string;
  updated_at: string;
  // joined
  listings?: Listing;
  buyer_profile?: Profile;
  seller_profile?: Profile;
}

/* ── Reports ─────────────────────────────────────── */
export type ReportTargetType = "request" | "listing";

export interface Report {
  id: string;
  target_type: ReportTargetType;
  target_id: string;
  reporter_id: string;
  reason: string;
  created_at: string;
}
