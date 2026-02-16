"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { formatDate } from "@/lib/utils";
import { Globe, Plus, Trash2, CheckCircle, XCircle, Loader2 } from "lucide-react";

interface WpSite {
  id: string;
  siteUrl: string;
  username: string;
  isConnected: boolean;
  lastVerifiedAt: string | null;
  createdAt: string;
  _count: { articles: number };
}

export default function SitesPage() {
  const [sites, setSites] = useState<WpSite[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [error, setError] = useState("");

  const [siteUrl, setSiteUrl] = useState("");
  const [username, setUsername] = useState("");
  const [appPassword, setAppPassword] = useState("");

  useEffect(() => {
    fetchSites();
  }, []);

  async function fetchSites() {
    setLoading(true);
    try {
      const res = await fetch("/api/sites");
      const data = await res.json();
      setSites(data.sites || []);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  async function handleAddSite(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setFormLoading(true);

    try {
      const res = await fetch("/api/sites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          siteUrl,
          username,
          applicationPassword: appPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to connect");
        return;
      }

      setDialogOpen(false);
      setSiteUrl("");
      setUsername("");
      setAppPassword("");
      fetchSites();
    } catch {
      setError("Connection failed. Check your credentials.");
    } finally {
      setFormLoading(false);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Remove this WordPress site?")) return;
    await fetch(`/api/sites/${id}`, { method: "DELETE" });
    fetchSites();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">WordPress Sites</h1>
          <p className="text-muted-foreground">
            Connect your WordPress sites for one-click publishing
          </p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Site
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Connect WordPress Site</DialogTitle>
              <DialogDescription>
                Enter your WordPress site URL and REST API credentials.
                Use an Application Password for secure access.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleAddSite}>
              <div className="space-y-4 py-4">
                {error && (
                  <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
                    {error}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="siteUrl">Site URL</Label>
                  <Input
                    id="siteUrl"
                    placeholder="https://yourblog.com"
                    value={siteUrl}
                    onChange={(e) => setSiteUrl(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="username">WordPress Username</Label>
                  <Input
                    id="username"
                    placeholder="admin"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="appPassword">Application Password</Label>
                  <Input
                    id="appPassword"
                    type="password"
                    placeholder="xxxx xxxx xxxx xxxx xxxx xxxx"
                    value={appPassword}
                    onChange={(e) => setAppPassword(e.target.value)}
                    required
                  />
                  <p className="text-xs text-muted-foreground">
                    Generate at: WordPress Admin &rarr; Users &rarr; Profile &rarr; Application Passwords
                  </p>
                </div>
              </div>
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={formLoading}>
                  {formLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Globe className="mr-2 h-4 w-4" />
                  )}
                  {formLoading ? "Connecting..." : "Connect & Verify"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {loading ? (
        <div className="flex h-32 items-center justify-center text-muted-foreground">
          Loading sites...
        </div>
      ) : sites.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-16">
            <Globe className="mb-4 h-12 w-12 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-semibold">No sites connected</h3>
            <p className="mb-4 text-center text-muted-foreground">
              Connect your WordPress site to enable one-click publishing
            </p>
            <Button onClick={() => setDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Site
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {sites.map((site) => (
            <Card key={site.id}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <CardTitle className="text-base font-medium">
                  {site.siteUrl.replace(/^https?:\/\//, "")}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {site.isConnected ? (
                    <Badge className="bg-green-500/10 text-green-500">
                      <CheckCircle className="mr-1 h-3 w-3" /> Connected
                    </Badge>
                  ) : (
                    <Badge className="bg-red-500/10 text-red-500">
                      <XCircle className="mr-1 h-3 w-3" /> Disconnected
                    </Badge>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1 text-sm text-muted-foreground">
                    <p>Username: {site.username}</p>
                    <p>Articles: {site._count.articles}</p>
                    <p>Added: {formatDate(site.createdAt)}</p>
                    {site.lastVerifiedAt && (
                      <p>Last verified: {formatDate(site.lastVerifiedAt)}</p>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(site.id)}
                    className="text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
