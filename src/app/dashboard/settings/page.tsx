"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Key,
  Zap,
  Brain,
  Shield,
  Globe,
  ExternalLink,
  Copy,
  ArrowRight,
  AlertTriangle,
} from "lucide-react";

interface SettingsData {
  openaiApiKey: string;
  claudeApiKey: string;
  aiProvider: string;
  hasOpenaiKey: boolean;
  hasClaudeKey: boolean;
}

type ValidationResult = {
  valid: boolean;
  error?: string;
  model?: string;
} | null;

export default function SettingsPage() {
  const [settings, setSettings] = useState<SettingsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // Form state
  const [openaiKey, setOpenaiKey] = useState("");
  const [claudeKey, setClaudeKey] = useState("");
  const [aiProvider, setAiProvider] = useState("openai");

  // Validation
  const [validatingOpenai, setValidatingOpenai] = useState(false);
  const [validatingClaude, setValidatingClaude] = useState(false);
  const [openaiValidation, setOpenaiValidation] = useState<ValidationResult>(null);
  const [claudeValidation, setClaudeValidation] = useState<ValidationResult>(null);

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      setSettings(data);
      setOpenaiKey(data.openaiApiKey || "");
      setClaudeKey(data.claudeApiKey || "");
      setAiProvider(data.aiProvider || "openai");
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    try {
      const body: Record<string, string> = { aiProvider };
      if (openaiKey && !openaiKey.includes("••••")) body.openaiApiKey = openaiKey;
      if (claudeKey && !claudeKey.includes("••••")) body.claudeApiKey = claudeKey;

      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (res.ok) {
        setSaved(true);
        fetchSettings();
        setTimeout(() => setSaved(false), 3000);
      }
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  }

  async function validateKey(provider: "openai" | "claude") {
    const apiKey = provider === "openai" ? openaiKey : claudeKey;
    if (!apiKey || apiKey.includes("••••")) return;

    if (provider === "openai") setValidatingOpenai(true);
    else setValidatingClaude(true);

    try {
      const res = await fetch("/api/settings/validate-key", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ provider, apiKey }),
      });
      const data = await res.json();

      if (provider === "openai") setOpenaiValidation(data);
      else setClaudeValidation(data);
    } catch {
      const result = { valid: false, error: "Network error" };
      if (provider === "openai") setOpenaiValidation(result);
      else setClaudeValidation(result);
    } finally {
      if (provider === "openai") setValidatingOpenai(false);
      else setValidatingClaude(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center text-muted-foreground">
        Loading settings...
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-muted-foreground">
          Connect your AI and WordPress APIs for content generation
        </p>
      </div>

      {/* ─── AI Provider Selection ─── */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5 text-primary" />
            AI Provider
          </CardTitle>
          <CardDescription>
            Choose which AI model to use for article generation
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Select value={aiProvider} onValueChange={setAiProvider}>
              <SelectTrigger className="w-[280px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="openai">
                  OpenAI (GPT-4o)
                </SelectItem>
                <SelectItem value="claude">
                  Anthropic Claude (Sonnet 4.5)
                </SelectItem>
              </SelectContent>
            </Select>
            <Badge variant="outline" className="text-xs">
              {aiProvider === "openai" ? "gpt-4o" : "claude-sonnet-4-5-20250929"}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* ─── OpenAI API Key ─── */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10">
                <Zap className="h-5 w-5 text-emerald-500" />
              </div>
              <div>
                <CardTitle className="text-lg">OpenAI API Key</CardTitle>
                <CardDescription>Required for GPT-4o article generation</CardDescription>
              </div>
            </div>
            {settings?.hasOpenaiKey ? (
              <Badge className="bg-green-500/10 text-green-500">
                <CheckCircle className="mr-1 h-3 w-3" /> Connected
              </Badge>
            ) : (
              <Badge className="bg-yellow-500/10 text-yellow-500">
                <AlertTriangle className="mr-1 h-3 w-3" /> Not Set
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="openaiKey">API Key</Label>
            <div className="flex gap-2">
              <Input
                id="openaiKey"
                type="password"
                placeholder="sk-..."
                value={openaiKey}
                onChange={(e) => {
                  setOpenaiKey(e.target.value);
                  setOpenaiValidation(null);
                }}
                className="font-mono"
              />
              <Button
                variant="outline"
                onClick={() => validateKey("openai")}
                disabled={validatingOpenai || !openaiKey || openaiKey.includes("••••")}
              >
                {validatingOpenai ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Verify"
                )}
              </Button>
            </div>
            {openaiValidation && (
              <div className={`flex items-center gap-2 text-sm ${openaiValidation.valid ? "text-green-500" : "text-red-500"}`}>
                {openaiValidation.valid ? (
                  <><CheckCircle className="h-4 w-4" /> Valid key — Model: {openaiValidation.model}</>
                ) : (
                  <><XCircle className="h-4 w-4" /> {openaiValidation.error}</>
                )}
              </div>
            )}
          </div>

          <div className="rounded-lg border bg-muted/50 p-4">
            <h4 className="mb-2 text-sm font-medium">How to get your OpenAI API key</h4>
            <ol className="space-y-1.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">1</span>
                Go to <a href="https://platform.openai.com/api-keys" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">platform.openai.com/api-keys <ExternalLink className="h-3 w-3" /></a>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">2</span>
                Click &quot;Create new secret key&quot;
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">3</span>
                Copy the key (starts with <code className="rounded bg-muted px-1.5 py-0.5 text-xs">sk-</code>)
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">4</span>
                Paste it above and click &quot;Verify&quot;
              </li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* ─── Claude API Key ─── */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-orange-500/10">
                <Brain className="h-5 w-5 text-orange-500" />
              </div>
              <div>
                <CardTitle className="text-lg">Claude API Key (Anthropic)</CardTitle>
                <CardDescription>Required for Claude Sonnet article generation</CardDescription>
              </div>
            </div>
            {settings?.hasClaudeKey ? (
              <Badge className="bg-green-500/10 text-green-500">
                <CheckCircle className="mr-1 h-3 w-3" /> Connected
              </Badge>
            ) : (
              <Badge className="bg-yellow-500/10 text-yellow-500">
                <AlertTriangle className="mr-1 h-3 w-3" /> Not Set
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="claudeKey">API Key</Label>
            <div className="flex gap-2">
              <Input
                id="claudeKey"
                type="password"
                placeholder="sk-ant-..."
                value={claudeKey}
                onChange={(e) => {
                  setClaudeKey(e.target.value);
                  setClaudeValidation(null);
                }}
                className="font-mono"
              />
              <Button
                variant="outline"
                onClick={() => validateKey("claude")}
                disabled={validatingClaude || !claudeKey || claudeKey.includes("••••")}
              >
                {validatingClaude ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  "Verify"
                )}
              </Button>
            </div>
            {claudeValidation && (
              <div className={`flex items-center gap-2 text-sm ${claudeValidation.valid ? "text-green-500" : "text-red-500"}`}>
                {claudeValidation.valid ? (
                  <><CheckCircle className="h-4 w-4" /> Valid key — Model: {claudeValidation.model}</>
                ) : (
                  <><XCircle className="h-4 w-4" /> {claudeValidation.error}</>
                )}
              </div>
            )}
          </div>

          <div className="rounded-lg border bg-muted/50 p-4">
            <h4 className="mb-2 text-sm font-medium">How to get your Claude API key</h4>
            <ol className="space-y-1.5 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">1</span>
                Go to <a href="https://console.anthropic.com/settings/keys" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-primary hover:underline">console.anthropic.com/settings/keys <ExternalLink className="h-3 w-3" /></a>
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">2</span>
                Click &quot;Create Key&quot;
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">3</span>
                Copy the key (starts with <code className="rounded bg-muted px-1.5 py-0.5 text-xs">sk-ant-</code>)
              </li>
              <li className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">4</span>
                Paste it above and click &quot;Verify&quot;
              </li>
            </ol>
          </div>
        </CardContent>
      </Card>

      {/* ─── Save Button ─── */}
      <div className="flex items-center gap-4">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <Key className="mr-2 h-4 w-4" />
          )}
          {saving ? "Saving..." : "Save Settings"}
        </Button>
        {saved && (
          <span className="flex items-center gap-1 text-sm text-green-500">
            <CheckCircle className="h-4 w-4" /> Settings saved successfully
          </span>
        )}
      </div>

      <Separator />

      {/* ─── WordPress Connection Guide ─── */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
              <Globe className="h-5 w-5 text-blue-500" />
            </div>
            <div>
              <CardTitle className="text-lg">WordPress REST API Connection Guide</CardTitle>
              <CardDescription>
                Step-by-step guide to connect your WordPress blog
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Step 1 */}
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 font-semibold">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">1</span>
              Check REST API is enabled
            </h4>
            <div className="ml-9 space-y-2 text-sm text-muted-foreground">
              <p>
                WordPress REST API is enabled by default since version 4.7+.
                To verify, visit this URL in your browser:
              </p>
              <div className="flex items-center gap-2 rounded-md border bg-muted/50 px-3 py-2 font-mono text-xs">
                <code>https://yourblog.com/wp-json/wp/v2/posts</code>
                <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0" onClick={() => navigator.clipboard.writeText("https://yourblog.com/wp-json/wp/v2/posts")}>
                  <Copy className="h-3 w-3" />
                </Button>
              </div>
              <p>If you see JSON data, the REST API is working.</p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 font-semibold">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">2</span>
              Create an Application Password
            </h4>
            <div className="ml-9 space-y-2 text-sm text-muted-foreground">
              <p>Application Passwords are built into WordPress 5.6+. No plugins needed.</p>
              <ol className="list-inside list-decimal space-y-1">
                <li>Log in to your WordPress admin panel</li>
                <li>Go to <strong>Users</strong> <ArrowRight className="inline h-3 w-3" /> <strong>Profile</strong></li>
                <li>Scroll down to <strong>&quot;Application Passwords&quot;</strong> section</li>
                <li>Enter a name: <code className="rounded bg-muted px-1.5 py-0.5 text-xs">WP AutoProfit AI</code></li>
                <li>Click <strong>&quot;Add New Application Password&quot;</strong></li>
                <li>Copy the generated password (spaces are normal)</li>
              </ol>
              <div className="mt-2 rounded-md border border-yellow-500/20 bg-yellow-500/5 p-3">
                <p className="flex items-start gap-2">
                  <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-yellow-500" />
                  <span><strong>Important:</strong> Copy the password immediately! WordPress only shows it once. The password looks like: <code className="rounded bg-muted px-1.5 py-0.5 text-xs">xxxx xxxx xxxx xxxx xxxx xxxx</code></span>
                </p>
              </div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 font-semibold">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">3</span>
              Connect in WP AutoProfit AI
            </h4>
            <div className="ml-9 space-y-2 text-sm text-muted-foreground">
              <p>Go to the <strong>Sites</strong> page and click &quot;Add Site&quot;. You&apos;ll need:</p>
              <div className="grid gap-3 sm:grid-cols-3">
                <div className="rounded-md border p-3">
                  <p className="mb-1 font-medium text-foreground">Site URL</p>
                  <p className="text-xs">Your blog&apos;s full URL, e.g. <code className="rounded bg-muted px-1 text-xs">https://myblog.com</code></p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="mb-1 font-medium text-foreground">Username</p>
                  <p className="text-xs">Your WordPress login username (admin account recommended)</p>
                </div>
                <div className="rounded-md border p-3">
                  <p className="mb-1 font-medium text-foreground">App Password</p>
                  <p className="text-xs">The Application Password from Step 2</p>
                </div>
              </div>
              <Button
                variant="default"
                className="mt-2"
                onClick={() => window.location.href = "/dashboard/sites"}
              >
                <Globe className="mr-2 h-4 w-4" />
                Go to Sites Page
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Step 4 */}
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 font-semibold">
              <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary text-sm text-primary-foreground">4</span>
              Required WordPress Permissions
            </h4>
            <div className="ml-9 space-y-2 text-sm text-muted-foreground">
              <p>The connected user needs these capabilities:</p>
              <div className="grid gap-2 sm:grid-cols-2">
                {[
                  { cap: "publish_posts", desc: "Create and publish articles" },
                  { cap: "upload_files", desc: "Upload featured images" },
                  { cap: "manage_categories", desc: "Create categories and tags" },
                  { cap: "edit_posts", desc: "Edit existing articles" },
                ].map((item) => (
                  <div key={item.cap} className="flex items-center gap-2 rounded-md border px-3 py-2">
                    <CheckCircle className="h-3.5 w-3.5 text-green-500" />
                    <div>
                      <code className="text-xs font-medium text-foreground">{item.cap}</code>
                      <p className="text-xs">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <p className="mt-1">
                <strong>Tip:</strong> Using an <strong>Administrator</strong> or <strong>Editor</strong> account ensures all permissions are available.
              </p>
            </div>
          </div>

          <Separator />

          {/* Troubleshooting */}
          <div className="space-y-3">
            <h4 className="flex items-center gap-2 font-semibold">
              <Shield className="h-5 w-5 text-muted-foreground" />
              Troubleshooting
            </h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              {[
                {
                  q: "\"Connection failed\" error",
                  a: "Check your site URL includes https:// and has no trailing slash. Ensure your site is publicly accessible.",
                },
                {
                  q: "\"401 Unauthorized\" error",
                  a: "Verify your username and Application Password are correct. Make sure you're using an Application Password, not your regular login password.",
                },
                {
                  q: "\"403 Forbidden\" error",
                  a: "Your user account may not have sufficient permissions. Use an Administrator account.",
                },
                {
                  q: "REST API returns HTML instead of JSON",
                  a: "Your site may have the REST API disabled by a security plugin. Check plugins like Wordfence, iThemes Security, or Disable REST API.",
                },
              ].map((faq) => (
                <div key={faq.q} className="rounded-md border p-3">
                  <p className="mb-1 font-medium text-foreground">{faq.q}</p>
                  <p className="text-xs">{faq.a}</p>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ─── Security Notice ─── */}
      <Card>
        <CardContent className="flex items-start gap-3 p-6">
          <Shield className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
          <div className="text-sm text-muted-foreground">
            <p className="mb-1 font-medium text-foreground">Your keys are encrypted</p>
            <p>
              All API keys and WordPress credentials are encrypted with AES-256-GCM
              before storage. Keys are never exposed in plain text — only masked previews
              are shown. Your credentials are transmitted over HTTPS and decrypted only
              server-side when making API calls.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
