"use client"

import { useState } from "react"
import Link from "next/link"
import { AlertCircle, ArrowLeft, ChevronDown, ChevronUp, ExternalLink, Info, MessageCircle } from "lucide-react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Logo } from "@/components/logo"
import { Input } from "@/components/ui/input"

export default function ResultsPage() {
  const [activeTab, setActiveTab] = useState("conditions")
  const [expandedCondition, setExpandedCondition] = useState<string | null>("contact-dermatitis")

  const toggleCondition = (id: string) => {
    if (expandedCondition === id) {
      setExpandedCondition(null)
    } else {
      setExpandedCondition(id)
    }
  }

  return (
    <div className="min-h-screen bg-muted">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="bg-primary py-2">
          <div className="container flex justify-between items-center">
            <div className="flex items-center gap-2 text-white text-sm">
              <span>MediCheck Health Assistant</span>
            </div>
            <div className="flex items-center gap-4">
              <div id="auth-links">
                <Link href="/login" className="text-white text-sm hover:underline">
                  Patient Portal
                </Link>
              </div>
              <div id="user-links" className="hidden">
                <Link href="/dashboard" className="text-white text-sm hover:underline">
                  Dashboard
                </Link>
              </div>
              <Link href="/about" className="text-white text-sm hover:underline">
                About Us
              </Link>
              <Link href="/contact" className="text-white text-sm hover:underline">
                Contact
              </Link>
            </div>
          </div>
        </div>
        <div className="container py-4">
          <div className="flex justify-between items-center">
            <Logo />
            <div className="flex items-center gap-4">
              <Link
                href="/symptom-checker"
                className="flex items-center gap-2 text-secondary hover:text-primary transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Symptom Checker</span>
              </Link>
              <Button
                variant="outline"
                size="sm"
                className="hidden md:flex border-primary text-primary hover:bg-primary hover:text-white"
              >
                <Info className="mr-2 h-4 w-4" />
                Save Results
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="container max-w-4xl py-8">
        <div className="flex flex-col items-start mb-8">
          <h1 className="text-3xl font-bold text-secondary mb-4">Your Health Analysis Results</h1>
          <p className="text-gray-600 max-w-[700px]">
            Based on the information you provided, our system has analyzed potential conditions that may match your
            symptoms.
          </p>
        </div>

        <Alert className="mb-8 border-amber-300 bg-amber-50 text-amber-800">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Important Medical Disclaimer</AlertTitle>
          <AlertDescription>
            This information is provided for educational purposes only and is not intended to be a substitute for
            professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other
            qualified health provider.
          </AlertDescription>
        </Alert>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-muted">
            <TabsTrigger value="conditions" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Potential Conditions
            </TabsTrigger>
            <TabsTrigger value="symptoms" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Symptom Analysis
            </TabsTrigger>
            <TabsTrigger value="next-steps" className="data-[state=active]:bg-primary data-[state=active]:text-white">
              Next Steps
            </TabsTrigger>
          </TabsList>

          <TabsContent value="conditions" className="mt-0 space-y-6">
            <div className="grid gap-6">
              <Card className="border-0 shadow-md overflow-hidden">
                <CardHeader className="bg-white pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-secondary">Contact Dermatitis</CardTitle>
                      <CardDescription>High match based on your symptoms and images</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium text-primary">85% match</div>
                      <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: "85%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-gray-600">
                    Contact dermatitis is a red, itchy rash caused by direct contact with a substance or an allergic
                    reaction to it. The rash isn't contagious or life-threatening, but it can be uncomfortable.
                  </p>

                  {expandedCondition === "contact-dermatitis" && (
                    <div className="mt-6 space-y-4 animate-in fade-in-50 duration-300">
                      <div>
                        <h4 className="font-medium text-secondary mb-2">Common Symptoms</h4>
                        <ul className="space-y-2">
                          {[
                            "Red rash or bumps",
                            "Itching, which may be severe",
                            "Dry, cracked, scaly skin",
                            "Bumps and blisters, sometimes with oozing and crusting",
                            "Swelling, burning or tenderness",
                          ].map((symptom, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="h-5 w-5 rounded-full bg-accent flex items-center justify-center mt-0.5">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="text-primary"
                                >
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              </div>
                              <span className="text-sm text-gray-600">{symptom}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-secondary mb-2">Possible Causes</h4>
                        <p className="text-sm text-gray-600">
                          This condition can be triggered by exposure to irritants or allergens such as soaps,
                          cosmetics, fragrances, jewelry, plants, and industrial chemicals. It can also be caused by an
                          allergic reaction to certain foods, medications, or environmental factors.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium text-secondary mb-2">Treatment Options</h4>
                        <p className="text-sm text-gray-600">
                          Treatment typically involves identifying and avoiding the cause of your reaction. Applying
                          anti-itch creams and taking oral medications may help reduce inflammation and relieve itching.
                          In severe cases, your doctor might prescribe stronger medications.
                        </p>
                      </div>

                      <div className="pt-4">
                        <Link
                          href="https://www.mayoclinic.org/diseases-conditions/contact-dermatitis/symptoms-causes/syc-20352742"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            variant="outline"
                            className="gap-2 w-full border-primary text-primary hover:bg-primary hover:text-white"
                          >
                            Learn More About Contact Dermatitis
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="bg-gray-50 flex justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleCondition("contact-dermatitis")}
                    className="text-secondary hover:text-primary hover:bg-transparent"
                  >
                    {expandedCondition === "contact-dermatitis" ? (
                      <>
                        <ChevronUp className="mr-2 h-4 w-4" />
                        <span>Show Less</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="mr-2 h-4 w-4" />
                        <span>Show More</span>
                      </>
                    )}
                  </Button>
                </CardFooter>
                <div className="h-1 w-full bg-muted">
                  <div className="h-full bg-primary" style={{ width: "85%" }}></div>
                </div>
              </Card>

              <Card className="border-0 shadow-md overflow-hidden">
                <CardHeader className="bg-white pb-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-secondary">Atopic Dermatitis (Eczema)</CardTitle>
                      <CardDescription>Moderate match based on your symptoms and images</CardDescription>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-sm font-medium text-primary">62% match</div>
                      <div className="h-2 w-24 bg-muted rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full" style={{ width: "62%" }}></div>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-gray-600">
                    Atopic dermatitis (eczema) is a condition that makes your skin red and itchy. It's common in
                    children but can occur at any age. Atopic dermatitis is long lasting (chronic) and tends to flare
                    periodically.
                  </p>

                  {expandedCondition === "eczema" && (
                    <div className="mt-6 space-y-4 animate-in fade-in-50 duration-300">
                      <div>
                        <h4 className="font-medium text-secondary mb-2">Common Symptoms</h4>
                        <ul className="space-y-2">
                          {[
                            "Dry skin",
                            "Itching, which may be severe, especially at night",
                            "Red to brownish-gray patches",
                            "Small, raised bumps, which may leak fluid and crust over when scratched",
                            "Thickened, cracked, scaly skin",
                            "Raw, sensitive, swollen skin from scratching",
                          ].map((symptom, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <div className="h-5 w-5 rounded-full bg-accent flex items-center justify-center mt-0.5">
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="text-primary"
                                >
                                  <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                              </div>
                              <span className="text-sm text-gray-600">{symptom}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h4 className="font-medium text-secondary mb-2">Possible Causes</h4>
                        <p className="text-sm text-gray-600">
                          The exact cause of atopic dermatitis is unknown, but it's thought to be linked to an
                          overactive immune system that responds aggressively when triggered by irritants. It's commonly
                          associated with other allergic conditions like hay fever and asthma.
                        </p>
                      </div>

                      <div>
                        <h4 className="font-medium text-secondary mb-2">Treatment Options</h4>
                        <p className="text-sm text-gray-600">
                          Treatment focuses on managing symptoms and preventing flare-ups. This may include moisturizing
                          regularly, avoiding triggers, using medicated creams or ointments, and taking oral medications
                          to control inflammation and reduce immune system reactions.
                        </p>
                      </div>

                      <div className="pt-4">
                        <Link
                          href="https://www.mayoclinic.org/diseases-conditions/atopic-dermatitis-eczema/symptoms-causes/syc-20353273"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button
                            variant="outline"
                            className="gap-2 w-full border-primary text-primary hover:bg-primary hover:text-white"
                          >
                            Learn More About Atopic Dermatitis
                            <ExternalLink className="h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="bg-gray-50 flex justify-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleCondition("eczema")}
                    className="text-secondary hover:text-primary hover:bg-transparent"
                  >
                    {expandedCondition === "eczema" ? (
                      <>
                        <ChevronUp className="mr-2 h-4 w-4" />
                        <span>Show Less</span>
                      </>
                    ) : (
                      <>
                        <ChevronDown className="mr-2 h-4 w-4" />
                        <span>Show More</span>
                      </>
                    )}
                  </Button>
                </CardFooter>
                <div className="h-1 w-full bg-muted">
                  <div className="h-full bg-primary" style={{ width: "62%" }}></div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="symptoms" className="mt-0 space-y-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-secondary">Symptom Analysis</CardTitle>
                <CardDescription>A detailed breakdown of your reported symptoms</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium text-secondary mb-3">Symptom Timeline</h3>
                    <div className="relative">
                      <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-muted"></div>

                      <div className="space-y-6">
                        {[
                          {
                            date: "3 days ago",
                            title: "Symptoms Started",
                            description: "Initial redness and mild itching appeared",
                          },
                          {
                            date: "2 days ago",
                            title: "Symptoms Worsened",
                            description: "Increased itching and development of small bumps",
                          },
                          {
                            date: "1 day ago",
                            title: "New Areas Affected",
                            description: "Spread to additional areas with more intense itching",
                          },
                          {
                            date: "Today",
                            title: "Current State",
                            description: "Redness, swelling, and severe itching in multiple areas",
                          },
                        ].map((event, index) => (
                          <div key={index} className="relative pl-10">
                            <div className="absolute left-0 top-1.5 h-8 w-8 rounded-full bg-accent flex items-center justify-center border-4 border-white">
                              <div className="h-2 w-2 rounded-full bg-primary"></div>
                            </div>
                            <div className="text-xs text-gray-500 mb-1">{event.date}</div>
                            <h4 className="text-sm font-medium text-secondary">{event.title}</h4>
                            <p className="text-sm text-gray-600">{event.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium text-secondary mb-3">Symptom Severity</h3>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Itching</span>
                          <span className="text-sm text-gray-500">Severe</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: "85%" }}></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Redness</span>
                          <span className="text-sm text-gray-500">Moderate</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: "60%" }}></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Swelling</span>
                          <span className="text-sm text-gray-500">Mild</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: "30%" }}></div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm font-medium">Pain</span>
                          <span className="text-sm text-gray-500">Mild</span>
                        </div>
                        <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary rounded-full" style={{ width: "25%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <h3 className="text-lg font-medium text-secondary mb-3">Affected Areas</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex items-center gap-2 p-3 rounded-lg border bg-white">
                        <div className="h-3 w-3 rounded-full bg-primary"></div>
                        <span className="text-sm">Arms</span>
                      </div>
                      <div className="flex items-center gap-2 p-3 rounded-lg border bg-white">
                        <div className="h-3 w-3 rounded-full bg-primary"></div>
                        <span className="text-sm">Hands</span>
                      </div>
                      <div className="flex items-center gap-2 p-3 rounded-lg border bg-white">
                        <div className="h-3 w-3 rounded-full bg-primary"></div>
                        <span className="text-sm">Neck</span>
                      </div>
                      <div className="flex items-center gap-2 p-3 rounded-lg border bg-white">
                        <div className="h-3 w-3 rounded-full bg-primary"></div>
                        <span className="text-sm">Face</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="next-steps" className="mt-0 space-y-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-secondary">Recommended Next Steps</CardTitle>
                <CardDescription>Based on your symptom analysis, here are our recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-3">
                    <h3 className="text-lg font-medium text-secondary">Medical Consultation</h3>
                    <p className="text-sm text-gray-600">
                      Based on your symptoms, we recommend consulting with a healthcare professional for proper
                      diagnosis and treatment.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
                      <div className="p-4 rounded-lg border bg-white">
                        <h4 className="font-medium text-secondary mb-2">Primary Care Physician</h4>
                        <p className="text-sm text-gray-600">
                          Start with your primary doctor who can provide initial assessment and referrals if needed.
                        </p>
                      </div>
                      <div className="p-4 rounded-lg border bg-white">
                        <h4 className="font-medium text-secondary mb-2">Dermatologist</h4>
                        <p className="text-sm text-gray-600">
                          A skin specialist who can diagnose and treat skin conditions like the ones identified.
                        </p>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h3 className="text-lg font-medium text-secondary">Self-Care Recommendations</h3>
                    <p className="text-sm text-gray-600">
                      While waiting for medical consultation, these self-care measures may help manage your symptoms:
                    </p>
                    <ul className="space-y-2 mt-3">
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 rounded-full bg-accent flex items-center justify-center mt-0.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-primary"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span className="text-sm text-gray-600">
                          Avoid scratching the affected area to prevent infection
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 rounded-full bg-accent flex items-center justify-center mt-0.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-primary"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span className="text-sm text-gray-600">
                          Apply cool, wet compresses to reduce itching and inflammation
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 rounded-full bg-accent flex items-center justify-center mt-0.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-primary"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span className="text-sm text-gray-600">
                          Consider over-the-counter hydrocortisone cream for temporary relief (consult with a
                          pharmacist)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 rounded-full bg-accent flex items-center justify-center mt-0.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-primary"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span className="text-sm text-gray-600">Keep the affected area clean and moisturized</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <div className="h-5 w-5 rounded-full bg-accent flex items-center justify-center mt-0.5">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="12"
                            height="12"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-primary"
                          >
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span className="text-sm text-gray-600">
                          Avoid potential irritants and allergens that may trigger symptoms
                        </span>
                      </li>
                    </ul>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h3 className="text-lg font-medium text-secondary">Continue Your Health Journey</h3>
                    <p className="text-sm text-gray-600">
                      Chat with our AI health assistant to get more personalized guidance and track your symptoms over
                      time.
                    </p>
                    <div className="bg-white rounded-lg p-4 mt-3">
                      <div className="flex items-start gap-3 mb-3">
                        <MessageCircle className="h-5 w-5 text-primary mt-0.5" />
                        <p className="text-sm text-gray-600">
                          How are your symptoms today? Would you like to discuss treatment options or learn more about
                          your condition?
                        </p>
                      </div>
                      <div className="relative">
                        <Input
                          placeholder="Type your message..."
                          className="pr-10 border-gray-300 focus:border-primary focus:ring-primary"
                        />
                        <Button
                          size="sm"
                          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 rounded-full bg-primary text-white p-0"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <path d="M22 2L11 13"></path>
                            <path d="M22 2L15 22L11 13L2 9L22 2Z"></path>
                          </svg>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between items-center mt-8">
          <Link href="/symptom-checker">
            <Button variant="outline" className="border-secondary text-secondary hover:bg-secondary hover:text-white">
              Start New Check
            </Button>
          </Link>
          <Link href="/health-chat">
            <Button className="bg-primary text-white hover:bg-primary/90">Continue with Health Chat</Button>
          </Link>
        </div>
      </div>

      <script
        dangerouslySetInnerHTML={{
          __html: `
          document.addEventListener('DOMContentLoaded', function() {
            const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
            const authLinks = document.getElementById('auth-links');
            const userLinks = document.getElementById('user-links');
            
            if (isLoggedIn) {
              authLinks.classList.add('hidden');
              userLinks.classList.remove('hidden');
            } else {
              authLinks.classList.remove('hidden');
              userLinks.classList.add('hidden');
            }
          });
        `,
        }}
      />
    </div>
  )
}
