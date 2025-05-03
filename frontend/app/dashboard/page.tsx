"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronDown, ChevronUp, FileText, LogOut, Search, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Logo } from "@/components/logo"
import { useToast } from "@/hooks/use-toast"

interface MedicalRecord {
  id: string;
  condition: string;
  confidence: number;
  date: string;
  symptoms: string[];
  diagnosis: string;
  treatment: string;
  notes: string;
}

export default function DashboardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [expandedRecord, setExpandedRecord] = useState<string | null>(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([])

  useEffect(() => {
    const verifyAuth = async () => {
      const token = localStorage.getItem("access_token")
      if (!token) {
        router.push("/login")
        return
      }

      try {
        // Verify token
        const verifyResponse = await fetch('http://localhost:8000/verify-token', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })
        
        if (!verifyResponse.ok) {
          throw new Error('Invalid token')
        }

        // Get user data
        const userData = localStorage.getItem("user")
        if (userData) {
          setUser(JSON.parse(userData))
        }

        // Fetch medical history
        const historyResponse = await fetch('http://localhost:8000/dashboard-history', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        })

        if (!historyResponse.ok) {
          throw new Error('Failed to fetch history')
        }

        const historyData = await historyResponse.json()
        setMedicalRecords(historyData)
      } catch (error) {
        console.error("Dashboard error:", error)
        toast({
          title: "Session expired",
          description: "Please login again",
          variant: "destructive"
        })
        localStorage.removeItem("access_token")
        localStorage.removeItem("user")
        router.push("/login")
      } finally {
        setLoading(false)
      }
    }

    verifyAuth()
  }, [router, toast])

  const handleLogout = () => {
    localStorage.removeItem("access_token")
    localStorage.removeItem("user")
    toast({
      title: "Logged out",
      description: "You have been successfully logged out.",
    })
    router.push("/")
  }

  const toggleRecord = (id: string) => {
    setExpandedRecord(expandedRecord === id ? null : id)
  }

  const filteredRecords = medicalRecords.filter(
    (record) =>
      record.condition.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.diagnosis.toLowerCase().includes(searchQuery.toLowerCase()) ||
      record.symptoms.some((symptom) => symptom.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    )
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

          <div className="relative mb-6">
            <Input
              type="text"
              placeholder="Search medical records..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>

          <div className="space-y-4">
            {filteredRecords.length > 0 ? (
              filteredRecords.map((record) => (
                <Card key={record.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg font-medium text-secondary">
                          {record.condition}
                          <span className="ml-2 text-sm font-normal text-primary">
                            ({Math.round(record.confidence * 100)}% confidence)
                          </span>
                        </CardTitle>
                        <CardDescription>
                          {record.date}
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
                    {record.symptoms.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {record.symptoms.map((symptom, index) => (
                          <span key={index} className="px-2 py-1 bg-accent text-primary text-xs rounded-full">
                            {symptom}
                          </span>
                        ))}
                      </div>
                    )}

                    {expandedRecord === record.id && (
                      <div className="mt-4 space-y-4 animate-in fade-in-50 duration-300">
                        <div>
                          <h4 className="text-sm font-medium text-secondary mb-1">Diagnosis</h4>
                          <p className="text-sm text-gray-600">{record.diagnosis}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-secondary mb-1">Treatment</h4>
                          <p className="text-sm text-gray-600">{record.treatment}</p>
                        </div>
                        <div>
                          <h4 className="text-sm font-medium text-secondary mb-1">Notes</h4>
                          <p className="text-sm text-gray-600">{record.notes}</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-secondary mb-2">
                  {medicalRecords.length === 0 ? "No medical records yet" : "No matching records found"}
                </h3>
                <p className="text-gray-600">
                  {medicalRecords.length === 0 
                    ? "Your medical history will appear here after using our services." 
                    : "Try a different search term."}
                </p>
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
  )
}