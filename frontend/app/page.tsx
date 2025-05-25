"use client"
import Link from "next/link"
import { ArrowRight, CheckCircle, MessageCircle, Send } from "lucide-react"
import { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button"
import { Logo } from "@/components/logo"
import { ServiceCard } from "@/components/service-card"
import { FeatureCard } from "@/components/feature-card"
import { Input } from "@/components/ui/input"
import { HealthAssistantChat } from "@/components/health-assistant-chat"
export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user');
    setIsLoggedIn(!!token && !!user);
  }, [])
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="bg-primary py-2">
          <div className="container flex justify-between items-center">
            <div className="flex items-center gap-2 text-white text-sm">
              <span>MediCheck Health Assistant</span>
            </div>
            <div className="flex items-center gap-4">
              <Link href="/login" className="text-white text-sm hover:underline">
                Patient Portal
              </Link>
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
            <nav className="hidden md:flex items-center gap-8">
              <Link className="text-secondary font-medium hover:text-primary transition-colors" href="/">
                Home
              </Link>
              <Link className="text-secondary font-medium hover:text-primary transition-colors" href="/symptom-checker">
                Symptom Checker
              </Link>
              <Link className="text-secondary font-medium hover:text-primary transition-colors" href="/services">
                Services
              </Link>
              <Link className="text-secondary font-medium hover:text-primary transition-colors" href="/about">
                About Us
              </Link>
            </nav>
            <div className="flex items-center gap-4">
              <div id="auth-buttons" className="flex items-center gap-4">
                {isLoggedIn ? (
                  <Link href="/dashboard">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-primary text-primary hover:bg-primary hover:text-white"
                    >
                      Dashboard
                    </Button>
                  </Link>
                ) : (
                  <Link href="/login">
                    <Button
                      variant="outline"
                      size="sm"
                      className="hidden md:flex border-primary text-primary hover:bg-primary hover:text-white"
                    >
                      Sign In
                    </Button>
                  </Link>
                )}
                <Link href="/symptom-checker">
                  <Button size="sm" className="bg-primary text-white hover:bg-primary/90">
                    Get Started
                  </Button>
                </Link>
              </div>
              <div id="user-menu" className="hidden">
                <Link href="/dashboard">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary text-primary hover:bg-primary hover:text-white"
                  >
                    Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="flex-1">
        {/* Health Assistant Chat Section */}
        <section className="py-12 bg-gradient-to-b from-white to-accent">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-8">
              <div className="md:w-1/2">
                <h2 className="text-3xl font-bold text-secondary mb-4">Get Instant Health Guidance</h2>
                <p className="text-gray-600 mb-6">
                  Our AI-powered health assistant can answer your questions and provide general health information. Try
                  it now!
                </p>
                <p className="text-sm text-gray-500">
                  Note: This is for informational purposes only and does not replace professional medical advice.
                </p>
              </div>
              <div className="md:w-1/2">
                <HealthAssistantChat />
              </div>
            </div>
          </div>
        </section>
      
        <section className="bg-secondary text-white clip-diagonal">
          <div className="container py-16 md:py-24">
            <div className="grid gap-8 lg:grid-cols-2 lg:gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl">Whole Person Care is Our Specialty</h1>
                <p className="text-lg text-gray-200 max-w-[600px]">
                  Upload photos of allergic reactions or describe your symptoms to get information about potential
                  conditions. Always consult with a healthcare professional for proper diagnosis.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link href="/symptom-checker">
                    <Button className="w-full sm:w-auto bg-primary text-white hover:bg-primary/90">
                      Start Symptom Check <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  
                  <Link href="/about">
                    <Button className="w-full sm:w-auto bg-primary text-white hover:bg-primary/90">
                      Learn More
                    </Button>
                  </Link>
                </div>
              </div>
              <div className="relative lg:block">
                <div className="aspect-video rounded-lg overflow-hidden bg-black/10 backdrop-sm">
                  
                  <div className="absolute inset-0 flex items-center justify-center">
                    {/* Placeholder for HealthAssistantChat */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <section className="bg-white py-16">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-secondary mb-4">Our Services</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                MediCheck offers a range of services to help you understand your symptoms and find the right care
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ServiceCard
                title="Symptom Checker"
                description="Identify potential conditions based on your symptoms"
                icon="stethoscope"
                link="/symptom-checker"
              />
              <ServiceCard
                title="Photo Analysis"
                description="Upload photos of skin conditions for AI-powered analysis"
                icon="camera"
                link="/symptom-checker"
              />
              <ServiceCard
                title="Health Chat"
                description="Chat with our AI health assistant for guidance"
                icon="message-circle"
                link="/health-chat"
              />
            </div>
          </div>
        </section>

        <section className="bg-muted clip-diagonal-reverse">
          <div className="container py-16 md:py-24">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-secondary mb-4">How It Works</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Our platform uses advanced technology to help identify potential health conditions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard
                title="Describe Symptoms"
                description="Provide detailed information about your symptoms using our interactive form"
                icon="clipboard-list"
                step={1}
              />
              <FeatureCard
                title="Upload Photos"
                description="Upload clear photos of allergic reactions or skin conditions for analysis"
                icon="camera"
                step={2}
              />
              <FeatureCard
                title="Get Results"
                description="Receive information about potential conditions and recommended next steps"
                icon="file-text"
                step={3}
              />
            </div>
          </div>
        </section>

        <section className="bg-white py-16">
          <div className="container">
            <div className="grid gap-8 lg:grid-cols-2 items-center">
              <div className="order-2 lg:order-1">
                <div className="bg-secondary rounded-lg p-8 text-white relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16"></div>
                  <div className="relative">
                    <h3 className="text-3xl font-bold mb-4">Start Using MediCheck Today</h3>
                    <p className="text-lg mb-6">
                      Get instant access to our tools for checking your symptoms and finding the right care. Start now!
                    </p>
                    <Link href="/symptom-checker">
                      <Button className="bg-primary text-white hover:bg-primary/90">
                        Start Symptom Check <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>
      </main>

      <footer className="bg-primary text-white py-6">
        <div className="container text-center">
          <p>&copy; {new Date().getFullYear()} MediCheck. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
