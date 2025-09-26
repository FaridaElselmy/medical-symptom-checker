"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp, FileText, LogOut, Search, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Logo } from "@/components/logo";
import { useToast } from "@/hooks/use-toast";

type MedicalRecord = {
  id: string;
  condition: string;
  date: string;       // ISO string or readable date
  doctor: string;
  symptoms: string[];
  diagnosis?: string;
  treatment?: string;
  notes?: string;
};

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL; // set in .env.local

export default function DashboardPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);     // initial gate spinner
  const [fetching, setFetching] = useState(false);  // API spinner
  const [error, setError] = useState<string | null>(null);

  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // --- auth gate ---
  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    if (!isLoggedIn) {
      router.push("/login");
      return;
    }
    const userData = localStorage.getItem("user");
    if (userData) setUser(JSON.parse(userData));
    setLoading(false);
  }, [router]);

  // --- fetch from FastAPI (debounced on search) ---
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (loading) return;
    if (!API_BASE) {
      setError("Missing NEXT_PUBLIC_API_BASE_URL in .env.local");
      return;
    }

    const load = async () => {
      setFetching(true);
      setError(null);
      try {
        const token =
          localStorage.getItem("authToken") ||
          localStorage.getItem("token") ||
          "";

        const url = new URL(`${API_BASE.replace(/\/$/, "")}/medical-records`);
        if (searchQuery.trim()) url.searchParams.set("search", searchQuery.trim());

        const res = await fetch(url.toString(), {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
          // If FastAPI uses cookie auth instead:
          // credentials: "include",
        });

        if (!res.ok) {
          const msg = await safeText(res);
          throw new Error(msg || `Failed to load records (${res.status})`);
        }

        const data: any[] = await res.json();

        // map/normalize in case field names differ
        const safe: MedicalRecord[] = (data ?? []).map((r) => ({
          id: String(r.id),
          condition: r.condition ?? r.diagnosis_name ?? "Unknown",
          date: r.date ?? r.created_at ?? "",
          doctor: r.doctor ?? r.doctor_name ?? "—",
          symptoms: Array.isArray(r.symptoms) ? r.symptoms : (r.symptoms?.split?.(",") ?? []),
          diagnosis: r.diagnosis ?? r.assessment ?? "",
          treatment: r.treatment ?? r.plan ?? "",
          notes: r.notes ?? "",
        }));

        setRecords(safe);
      } catch (e: any) {
        setError(e?.message || "Unable to load medical records.");
      } finally {
        setFetching(false);
      }
    };

    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(load, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [loading, searchQuery]);

  const filteredRecords = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return records;
    return records.filter(
      (r) =>
        r.condition.toLowerCase().includes(q) ||
        r.doctor.toLowerCase().includes(q) ||
        r.symptoms.some((s) => s.toLowerCase().includes(q))
    );
  }, [records, searchQuery]);

  const toggleRecord = (id: string) =>
    setExpandedRecord((cur) => (cur === id ? null : id));

  const handleLogout = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("user");
    localStorage.removeItem("authToken");
    toast({ title: "Logged out", description: "You have been successfully logged out." });
    router.push("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted flex flex-col">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container py-4">
          <div className="flex justify-between items-center">
            <Logo />
            <h1 className="text-xl font-bold text-secondary hidden md:block">Medical History Dashboard</h1>
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                size="sm"
                className="border-primary text-primary hover:bg-primary hover:text-white"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 container max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-secondary">Welcome, {user?.firstName}!</h2>
              <p className="text-gray-600">View your complete medical history below</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-10 w-10 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="h-5 w-5 text-primary" />
              </div>
              <div className="hidden md:block">
                <p className="font-medium text-secondary">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </div>
          </div>

          <div className="relative mb-3">
            <Input
              type="text"
              placeholder="Search medical records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>

          {fetching && <p className="text-sm text-gray-500 mb-3">Loading records…</p>}
          {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

          <div className="space-y-4">
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => (
                <Card key={record.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg font-medium text-secondary">{record.condition}</CardTitle>
                        <CardDescription>
                          {record.date} • {record.doctor}
                        </CardDescription>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => toggleRecord(record.id)} className="p-0 h-8 w-8">
                        {expandedRecord === record.id ? (
                          <ChevronUp className="h-5 w-5" />
                        ) : (
                          <ChevronDown className="h-5 w-5" />
                        )}
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3">
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(record.symptoms ?? []).map((symptom, i) => (
                        <span key={i} className="px-2 py-1 bg-accent text-primary text-xs rounded-full">
                          {symptom}
                        </span>
                      ))}
                    </div>

                    {expandedRecord === record.id && (
                      <div className="mt-4 space-y-4 animate-in fade-in-50 duration-300">
                        <div>
                          <h4 className="text-sm font-medium text-secondary mb-1">Diagnosis</h4>
                          <p className="text-sm text-gray-600">{record.diagnosis || "—"}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-secondary mb-1">Treatment</h4>
                          <p className="text-sm text-gray-600">{record.treatment || "—"}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-secondary mb-1">Notes</h4>
                          <p className="text-sm text-gray-600">{record.notes || "—"}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button variant="link" className="p-0 h-auto text-primary">
                      <FileText className="h-4 w-4 mr-2" />
                      View full record
                    </Button>
                  </CardFooter>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-secondary mb-2">No records found</h3>
                <p className="text-gray-600">No medical records match your search criteria.</p>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="bg-white border-t border-gray-200 py-4">
        <div className="container text-center text-sm text-gray-500">
          <p>© 2025 MediCheck. All rights reserved.</p>
          <p className="mt-1 text-xs">
            <strong>Medical Disclaimer:</strong> The information provided is not intended to be a substitute for
            professional medical advice.
          </p>
        </div>
      </footer>
    </div>
  );
}

async function safeText(res: Response) {
  try {
    return await res.text();
  } catch {
    return "";
  }
}
