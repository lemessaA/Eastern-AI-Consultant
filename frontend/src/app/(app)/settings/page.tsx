"use client";

import * as React from "react";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { api } from "@/lib/api";
import { useAuthStore } from "@/store/auth";
import type { User } from "@/types";

export default function SettingsPage() {
  const user = useAuthStore((s) => s.user);
  const setUser = useAuthStore((s) => s.setUser);
  const [saving, setSaving] = React.useState(false);

  async function save(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setSaving(true);
    try {
      const updated = await api.patch<User>("/users/me", {
        full_name: String(fd.get("full_name")),
        bio: String(fd.get("bio") || ""),
        country: String(fd.get("country") || ""),
        city: String(fd.get("city") || ""),
        phone: String(fd.get("phone") || ""),
      });
      setUser(updated);
      toast.success("Profile saved.");
    } catch {
      toast.error("Could not save.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground mt-1">Manage your profile and preferences.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={save} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="full_name">Full name</Label>
              <Input id="full_name" name="full_name" defaultValue={user?.full_name} required />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email} disabled />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input value={user?.role} disabled className="capitalize" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="country">Country</Label>
              <Input id="country" name="country" defaultValue={user?.country ?? ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input id="city" name="city" defaultValue={user?.city ?? ""} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" name="phone" defaultValue={user?.phone ?? ""} />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea id="bio" name="bio" rows={4} defaultValue={user?.bio ?? ""} />
            </div>
            <Button type="submit" variant="gradient" disabled={saving} className="sm:col-span-2">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Save profile"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
