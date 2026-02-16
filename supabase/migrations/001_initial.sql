-- VibeExchange (바이브코딩 거래소) — Initial Schema
-- Run this in Supabase SQL Editor or via supabase db push

-- ══════════════════════════════════════════════════
-- PROFILES
-- ══════════════════════════════════════════════════
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  display_name text,
  created_at timestamptz default now() not null
);

alter table public.profiles enable row level security;

create policy "Profiles are viewable by everyone"
  on public.profiles for select using (true);

create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, split_part(new.email, '@', 1));
  return new;
end;
$$ language plpgsql security definer;

create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ══════════════════════════════════════════════════
-- FLOW A: REQUESTS (제작 요청)
-- ══════════════════════════════════════════════════
create table if not exists public.requests (
  id uuid default gen_random_uuid() primary key,
  owner_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  type text not null check (type in ('landing', 'website', 'shopify', 'other')),
  budget_min integer not null default 0,
  budget_max integer not null default 0,
  currency text not null default 'KRW',
  deadline date,
  description text not null default '',
  checklist jsonb,
  reference_urls text[],
  preferred_stack text,
  status text not null default 'open' check (status in ('open', 'in_discussion', 'closed')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.requests enable row level security;

create policy "Requests are viewable by everyone"
  on public.requests for select using (true);

create policy "Auth users can create requests"
  on public.requests for insert with check (auth.uid() = owner_id);

create policy "Owners can update own requests"
  on public.requests for update using (auth.uid() = owner_id);

create policy "Owners can delete own requests"
  on public.requests for delete using (auth.uid() = owner_id);

-- ══════════════════════════════════════════════════
-- PROPOSALS (제안서)
-- ══════════════════════════════════════════════════
create table if not exists public.proposals (
  id uuid default gen_random_uuid() primary key,
  request_id uuid references public.requests(id) on delete cascade not null,
  creator_id uuid references public.profiles(id) on delete cascade not null,
  price_amount integer not null,
  currency text not null default 'KRW',
  timeline_days integer not null default 7,
  message text not null default '',
  portfolio_urls text[],
  status text not null default 'submitted' check (status in ('submitted', 'selected', 'rejected')),
  created_at timestamptz default now() not null
);

alter table public.proposals enable row level security;

-- Proposals visible to creator + request owner
create policy "Proposal creator can view own proposals"
  on public.proposals for select using (auth.uid() = creator_id);

create policy "Request owner can view proposals on their requests"
  on public.proposals for select using (
    auth.uid() in (select owner_id from public.requests where id = request_id)
  );

create policy "Auth users can create proposals"
  on public.proposals for insert with check (auth.uid() = creator_id);

create policy "Request owner can update proposal status"
  on public.proposals for update using (
    auth.uid() in (select owner_id from public.requests where id = request_id)
  );

-- ══════════════════════════════════════════════════
-- REQUEST ATTACHMENTS
-- ══════════════════════════════════════════════════
create table if not exists public.request_attachments (
  id uuid default gen_random_uuid() primary key,
  request_id uuid references public.requests(id) on delete cascade not null,
  url text not null,
  created_at timestamptz default now() not null
);

alter table public.request_attachments enable row level security;

create policy "Attachments viewable by everyone"
  on public.request_attachments for select using (true);

create policy "Request owner can add attachments"
  on public.request_attachments for insert with check (
    auth.uid() in (select owner_id from public.requests where id = request_id)
  );

-- ══════════════════════════════════════════════════
-- FLOW B: LISTINGS (SaaS 거래소)
-- ══════════════════════════════════════════════════
create table if not exists public.listings (
  id uuid default gen_random_uuid() primary key,
  seller_id uuid references public.profiles(id) on delete cascade not null,
  title text not null,
  category text not null check (category in ('saas', 'automation', 'template', 'micro_app')),
  price_amount integer not null default 0,
  price_currency text not null default 'KRW',
  short_desc text not null default '',
  long_desc text,
  tags text[],
  demo_url text,
  repo_info text,
  delivery_notes text,
  maintenance_notes text,
  payment_method text not null default 'contact' check (payment_method in ('stripe', 'external', 'contact')),
  external_payment_url text,
  status text not null default 'draft' check (status in ('draft', 'published', 'sold')),
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.listings enable row level security;

create policy "Published listings viewable by everyone"
  on public.listings for select using (status = 'published' or auth.uid() = seller_id);

create policy "Auth users can create listings"
  on public.listings for insert with check (auth.uid() = seller_id);

create policy "Sellers can update own listings"
  on public.listings for update using (auth.uid() = seller_id);

create policy "Sellers can delete own listings"
  on public.listings for delete using (auth.uid() = seller_id);

-- ══════════════════════════════════════════════════
-- LISTING IMAGES
-- ══════════════════════════════════════════════════
create table if not exists public.listing_images (
  id uuid default gen_random_uuid() primary key,
  listing_id uuid references public.listings(id) on delete cascade not null,
  url text not null,
  created_at timestamptz default now() not null
);

alter table public.listing_images enable row level security;

create policy "Listing images viewable by everyone"
  on public.listing_images for select using (true);

create policy "Listing owner can manage images"
  on public.listing_images for insert with check (
    auth.uid() in (select seller_id from public.listings where id = listing_id)
  );

create policy "Listing owner can delete images"
  on public.listing_images for delete using (
    auth.uid() in (select seller_id from public.listings where id = listing_id)
  );

-- ══════════════════════════════════════════════════
-- THREADS (메시징)
-- ══════════════════════════════════════════════════
create table if not exists public.threads (
  id uuid default gen_random_uuid() primary key,
  listing_id uuid references public.listings(id) on delete cascade not null,
  buyer_id uuid references public.profiles(id) on delete cascade not null,
  seller_id uuid references public.profiles(id) on delete cascade not null,
  created_at timestamptz default now() not null,
  unique(listing_id, buyer_id)
);

alter table public.threads enable row level security;

create policy "Thread participants can view threads"
  on public.threads for select using (auth.uid() in (buyer_id, seller_id));

create policy "Buyers can create threads"
  on public.threads for insert with check (auth.uid() = buyer_id);

-- ══════════════════════════════════════════════════
-- MESSAGES
-- ══════════════════════════════════════════════════
create table if not exists public.messages (
  id uuid default gen_random_uuid() primary key,
  thread_id uuid references public.threads(id) on delete cascade not null,
  sender_id uuid references public.profiles(id) on delete cascade not null,
  body text not null,
  created_at timestamptz default now() not null
);

alter table public.messages enable row level security;

create policy "Thread participants can view messages"
  on public.messages for select using (
    auth.uid() in (
      select buyer_id from public.threads where id = thread_id
      union
      select seller_id from public.threads where id = thread_id
    )
  );

create policy "Thread participants can send messages"
  on public.messages for insert with check (
    auth.uid() = sender_id
    and auth.uid() in (
      select buyer_id from public.threads where id = thread_id
      union
      select seller_id from public.threads where id = thread_id
    )
  );

-- ══════════════════════════════════════════════════
-- DEALS (거래)
-- ══════════════════════════════════════════════════
create table if not exists public.deals (
  id uuid default gen_random_uuid() primary key,
  listing_id uuid references public.listings(id) on delete cascade not null,
  buyer_id uuid references public.profiles(id) on delete cascade not null,
  seller_id uuid references public.profiles(id) on delete cascade not null,
  price_amount integer not null,
  price_currency text not null default 'KRW',
  status text not null default 'initiated' check (status in ('initiated', 'negotiating', 'paid', 'delivered', 'completed', 'cancelled')),
  platform_fee_amount integer not null default 0,
  payment_provider text,
  provider_session_id text,
  fee_due_amount integer,
  created_at timestamptz default now() not null,
  updated_at timestamptz default now() not null
);

alter table public.deals enable row level security;

create policy "Deal participants can view deals"
  on public.deals for select using (auth.uid() in (buyer_id, seller_id));

create policy "Buyers can initiate deals"
  on public.deals for insert with check (auth.uid() = buyer_id);

create policy "Deal participants can update deals"
  on public.deals for update using (auth.uid() in (buyer_id, seller_id));

-- ══════════════════════════════════════════════════
-- REPORTS (신고)
-- ══════════════════════════════════════════════════
create table if not exists public.reports (
  id uuid default gen_random_uuid() primary key,
  target_type text not null check (target_type in ('request', 'listing')),
  target_id uuid not null,
  reporter_id uuid references public.profiles(id) on delete cascade not null,
  reason text not null,
  created_at timestamptz default now() not null
);

alter table public.reports enable row level security;

create policy "Auth users can create reports"
  on public.reports for insert with check (auth.uid() = reporter_id);

-- No public read on reports (admin only)

-- ══════════════════════════════════════════════════
-- INDEXES
-- ══════════════════════════════════════════════════
create index if not exists idx_requests_status on public.requests(status);
create index if not exists idx_requests_owner on public.requests(owner_id);
create index if not exists idx_requests_created on public.requests(created_at desc);

create index if not exists idx_proposals_request on public.proposals(request_id);
create index if not exists idx_proposals_creator on public.proposals(creator_id);

create index if not exists idx_listings_status on public.listings(status);
create index if not exists idx_listings_category on public.listings(category);
create index if not exists idx_listings_seller on public.listings(seller_id);
create index if not exists idx_listings_created on public.listings(created_at desc);

create index if not exists idx_threads_listing on public.threads(listing_id);
create index if not exists idx_threads_buyer on public.threads(buyer_id);
create index if not exists idx_threads_seller on public.threads(seller_id);

create index if not exists idx_messages_thread on public.messages(thread_id);

create index if not exists idx_deals_listing on public.deals(listing_id);
create index if not exists idx_deals_buyer on public.deals(buyer_id);
create index if not exists idx_deals_seller on public.deals(seller_id);

-- ══════════════════════════════════════════════════
-- UPDATED_AT TRIGGER
-- ══════════════════════════════════════════════════
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger requests_updated_at before update on public.requests
  for each row execute function public.set_updated_at();

create trigger listings_updated_at before update on public.listings
  for each row execute function public.set_updated_at();

create trigger deals_updated_at before update on public.deals
  for each row execute function public.set_updated_at();
