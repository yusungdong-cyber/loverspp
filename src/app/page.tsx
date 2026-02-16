import Link from "next/link";
import { Button } from "@/components/ui/button";
import { TrendingUp, FileText, Globe, Zap, BarChart3, Target } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-2">
            <Zap className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">WP AutoProfit AI</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Log In</Button>
            </Link>
            <Link href="/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="container py-24 text-center">
        <h1 className="mx-auto max-w-4xl text-5xl font-bold tracking-tight sm:text-6xl">
          Monetize Your WordPress Blog{" "}
          <span className="text-primary">on Autopilot</span>
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
          AI-powered platform that detects trending topics, generates SEO-optimized articles,
          and publishes directly to WordPress. Start earning while you sleep.
        </p>
        <div className="mt-10 flex items-center justify-center gap-4">
          <Link href="/register">
            <Button size="lg" className="h-12 px-8 text-base">
              Start Free Trial
            </Button>
          </Link>
          <Link href="/login">
            <Button size="lg" variant="outline" className="h-12 px-8 text-base">
              Log In
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/50 py-24">
        <div className="container">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Everything You Need to AutoProfit
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: TrendingUp,
                title: "Trend Detection",
                desc: "AI scans trending topics daily, scoring them by search volume, competition, and monetization potential.",
              },
              {
                icon: FileText,
                title: "SEO Article Generator",
                desc: "Generate 1,200-1,800 word articles with proper H1/H2 structure, FAQ sections, and schema markup.",
              },
              {
                icon: Globe,
                title: "One-Click Publishing",
                desc: "Connect your WordPress site and publish articles as drafts or schedule them for peak traffic times.",
              },
              {
                icon: BarChart3,
                title: "SEO Score System",
                desc: "Real-time SEO scoring with keyword density, readability, and heading structure analysis.",
              },
              {
                icon: Target,
                title: "Monetization Built-In",
                desc: "Auto-inserted ad placeholders, affiliate blocks, and CTA sections in every article.",
              },
              {
                icon: Zap,
                title: "AI Image Handling",
                desc: "Auto-generated featured images and in-article image prompts with SEO-optimized ALT text.",
              },
            ].map((f) => (
              <div
                key={f.title}
                className="rounded-lg border bg-card p-6 shadow-sm transition-shadow hover:shadow-md"
              >
                <f.icon className="mb-4 h-10 w-10 text-primary" />
                <h3 className="mb-2 text-lg font-semibold">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="container py-24 text-center">
        <h2 className="text-3xl font-bold">Ready to Automate Your Blog Income?</h2>
        <p className="mt-4 text-muted-foreground">
          Join thousands of bloggers using AI to generate passive income from WordPress.
        </p>
        <Link href="/register">
          <Button size="lg" className="mt-8 h-12 px-10 text-base">
            Get Started Now
          </Button>
        </Link>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="container text-center text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} WP AutoProfit AI. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
