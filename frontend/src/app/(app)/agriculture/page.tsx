"use client";

import * as React from "react";
import { Bug, CloudSun, Loader2, Sprout, TrendingDown, TrendingUp } from "lucide-react";
import { toast } from "sonner";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { api, APIError } from "@/lib/api";

export default function AgriculturePage() {
  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div>
        <h1 className="font-display text-3xl font-bold tracking-tight">Agriculture AI</h1>
        <p className="text-muted-foreground mt-1">
          Crop recommendations, pest diagnosis, weather and market prices — built for smallholders in
          the Horn of Africa.
        </p>
      </div>

      <Tabs defaultValue="crop" className="space-y-6">
        <TabsList>
          <TabsTrigger value="crop">Crop advice</TabsTrigger>
          <TabsTrigger value="pest">Pest diagnosis</TabsTrigger>
          <TabsTrigger value="prices">Market prices</TabsTrigger>
          <TabsTrigger value="weather">Weather</TabsTrigger>
        </TabsList>

        <TabsContent value="crop">
          <CropAdvice />
        </TabsContent>
        <TabsContent value="pest">
          <PestDiagnosis />
        </TabsContent>
        <TabsContent value="prices">
          <MarketPrices />
        </TabsContent>
        <TabsContent value="weather">
          <Weather />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function CropAdvice() {
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    setResult(null);
    try {
      const out = await api.post<{ recommendation: string }>("/agriculture/crop-recommendation", {
        location: String(fd.get("location")),
        soil_type: String(fd.get("soil") || ""),
        season: String(fd.get("season") || ""),
        farm_size_hectares: Number(fd.get("size") || 0) || undefined,
        irrigation: fd.get("irrigation") === "on",
        language: "en",
      });
      setResult(out.recommendation);
    } catch (err) {
      const msg = err instanceof APIError ? err.message : "Could not get crop advice.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sprout className="h-5 w-5 text-success" /> Crop recommendation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" required placeholder="Adama, Ethiopia" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="soil">Soil type</Label>
            <Input id="soil" name="soil" placeholder="Clay loam" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="season">Season</Label>
            <Input id="season" name="season" placeholder="Belg / Meher" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="size">Farm size (ha)</Label>
            <Input id="size" name="size" type="number" step="0.1" placeholder="1.5" />
          </div>
          <label className="flex items-center gap-2 sm:col-span-2 text-sm">
            <input type="checkbox" name="irrigation" className="h-4 w-4 rounded" />
            Has irrigation
          </label>
          <Button type="submit" variant="gradient" disabled={loading} className="sm:col-span-2">
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Get recommendation"}
          </Button>
        </form>
        {result && (
          <div className="mt-6 markdown-body rounded-lg border border-border bg-muted/30 p-4 text-sm">
            <pre className="whitespace-pre-wrap font-sans">{result}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function PestDiagnosis() {
  const [loading, setLoading] = React.useState(false);
  const [result, setResult] = React.useState<string | null>(null);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    setResult(null);
    try {
      const out = await api.post<{ diagnosis: string }>("/agriculture/pest-diagnosis", {
        crop: String(fd.get("crop")),
        symptoms: String(fd.get("symptoms")),
        language: "en",
      });
      setResult(out.diagnosis);
    } catch (err) {
      const msg = err instanceof APIError ? err.message : "Could not analyse.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="h-5 w-5 text-warning" /> Pest / disease diagnosis
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="crop">Crop</Label>
            <Input id="crop" name="crop" required placeholder="Coffee, Teff, Sorghum…" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="symptoms">
              Symptoms
              <span className="ml-1 text-xs font-normal text-muted-foreground">
                (at least 10 characters)
              </span>
            </Label>
            <Textarea
              id="symptoms"
              name="symptoms"
              required
              minLength={10}
              maxLength={2000}
              rows={4}
              placeholder="Yellowing of older leaves, dark spots, wilting after watering…"
            />
          </div>
          <Button type="submit" variant="gradient" disabled={loading}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Diagnose"}
          </Button>
        </form>
        {result && (
          <div className="mt-6 markdown-body rounded-lg border border-border bg-muted/30 p-4 text-sm">
            <pre className="whitespace-pre-wrap font-sans">{result}</pre>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function MarketPrices() {
  const [data, setData] = React.useState<{ items: Array<{ crop: string; min: number; max: number; trend: string }>; as_of: string } | null>(null);
  React.useEffect(() => {
    api.get<typeof data>("/agriculture/market-prices").then(setData);
  }, []);
  return (
    <Card>
      <CardHeader>
        <CardTitle>Market prices (ETB / 100 kg)</CardTitle>
      </CardHeader>
      <CardContent>
        {!data ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="text-left text-xs uppercase text-muted-foreground">
                <tr>
                  <th className="pb-3">Crop</th>
                  <th className="pb-3">Min</th>
                  <th className="pb-3">Max</th>
                  <th className="pb-3">Trend</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {data.items.map((it) => (
                  <tr key={it.crop} className="hover:bg-muted/40">
                    <td className="py-3 font-medium">{it.crop}</td>
                    <td className="py-3">{it.min.toLocaleString()}</td>
                    <td className="py-3">{it.max.toLocaleString()}</td>
                    <td className="py-3">
                      {it.trend === "up" ? (
                        <Badge variant="success" className="gap-1">
                          <TrendingUp className="h-3 w-3" /> up
                        </Badge>
                      ) : it.trend === "down" ? (
                        <Badge variant="destructive" className="gap-1">
                          <TrendingDown className="h-3 w-3" /> down
                        </Badge>
                      ) : (
                        <Badge variant="secondary">stable</Badge>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function Weather() {
  const [data, setData] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(false);

  async function fetchWeather(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    setLoading(true);
    try {
      const out = await api.post<any>("/agriculture/weather", {
        latitude: Number(fd.get("lat")),
        longitude: Number(fd.get("lon")),
      });
      setData(out);
    } catch (err) {
      const msg = err instanceof APIError ? err.message : "Weather service unavailable.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CloudSun className="h-5 w-5 text-cobalt" /> 7-day weather forecast
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={fetchWeather} className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="lat">Latitude</Label>
            <Input id="lat" name="lat" defaultValue={8.541} type="number" step="any" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lon">Longitude</Label>
            <Input id="lon" name="lon" defaultValue={39.27} type="number" step="any" required />
          </div>
          <div className="flex items-end">
            <Button type="submit" variant="gradient" disabled={loading} className="w-full">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Fetch"}
            </Button>
          </div>
        </form>
        {data?.daily && (
          <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-7">
            {data.daily.time.map((d: string, i: number) => (
              <div key={d} className="rounded-lg border border-border bg-muted/30 p-3 text-center text-xs">
                <p className="font-medium">{new Date(d).toLocaleDateString(undefined, { weekday: "short" })}</p>
                <p className="text-2xl font-display mt-1">
                  {Math.round(data.daily.temperature_2m_max[i])}°
                </p>
                <p className="text-muted-foreground">
                  {Math.round(data.daily.temperature_2m_min[i])}° min
                </p>
                <p className="mt-1 text-primary">
                  {data.daily.precipitation_sum[i].toFixed(1)} mm
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
