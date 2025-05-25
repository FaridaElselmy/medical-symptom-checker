"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Send } from "lucide-react"
import { Button } from "@/components/ui/button"

type Message = {
  role: "user" | "assistant"
  content: string
}

// Mock responses for the health assistant
const healthResponses = {
  headache:
    "Headaches can be caused by stress, dehydration, lack of sleep, eye strain, or underlying medical conditions. For persistent or severe headaches, please consult a healthcare professional.",
  fever:
    "To reduce fever: take appropriate medication like acetaminophen or ibuprofen (as advised by your doctor), stay hydrated, rest, and use a cool compress. If fever persists over 103°F (39.4°C) or lasts more than three days, seek medical attention.",
  cold: "Common cold symptoms include runny or stuffy nose, sore throat, cough, mild headache, sneezing, and low-grade fever. Rest, hydration, and over-the-counter medications can help manage symptoms.",
  doctor:
    "You should see a doctor if you experience: high persistent fever, severe pain, difficulty breathing, unexplained weight loss, persistent vomiting, changes in vision, or symptoms that don't improve with home treatment.",
  default:
    "I'm a health information assistant and can provide general health information. Remember, this isn't medical advice - please consult a healthcare professional for personalized guidance.",
}

function getResponse(message: string): string {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("headache")) return healthResponses.headache
  if (lowerMessage.includes("fever") || lowerMessage.includes("temperature")) return healthResponses.fever
  if (lowerMessage.includes("cold") || lowerMessage.includes("flu") || lowerMessage.includes("symptom"))
    return healthResponses.cold
  if (lowerMessage.includes("doctor") || lowerMessage.includes("hospital") || lowerMessage.includes("emergency"))
    return healthResponses.doctor

  return healthResponses.default
}

export function HealthAssistantChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "How can I help you with your health concerns today?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setIsLoading(true)

    // Add user message to chat
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])

    try {
      // Get response from our mock health assistant
      const responseText = getResponse(userMessage)

      // Add assistant response to chat with typing effect
      setTimeout(() => {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: responseText,
          },
        ])
        setIsLoading(false)
      }, 800)
    } catch (error) {
      console.error("Error in chat:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "I'm sorry, something went wrong. Please try again later.",
        },
      ])
      setIsLoading(false)
    }
  }

  const handleQuickPrompt = (prompt: string) => {
    setInput(prompt)
  }

  const quickPrompts = [
    "What causes headaches?",
    "How to reduce fever?",
    "Common cold symptoms",
    "When to see a doctor?",
  ]

  return (
    <div className="bg-white/90 p-6 rounded-lg max-w-md shadow-lg h-full flex flex-col">
      <h3 className="text-secondary font-bold text-xl mb-4">Chat with our Health Assistant</h3>

      <div className="bg-gray-50 rounded-lg p-3 mb-4 text-gray-600 text-sm flex-1 overflow-y-auto max-h-[200px]">
        {messages.map((message, index) => (
          <div key={index} className="flex items-start gap-2 mb-2">
            <div className={`flex-shrink-0 mt-0.5 ${message.role === "assistant" ? "text-primary" : "text-secondary"}`}>
              {message.role === "assistant" ? (
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
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              ) : (
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
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
              )}
            </div>
            <p className={`${message.role === "user" ? "text-secondary" : "text-gray-700"}`}>{message.content}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <form onSubmit={handleSubmit} className="relative">
        {/* Fixed input styling to ensure text is visible */}
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={isLoading ? "Getting response..." : "Type your symptoms or questions..."}
          className="w-full py-2 px-4 pr-10 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary text-gray-800 bg-white"
          disabled={isLoading}
        />
        <Button
          type="submit"
          size="icon"
          disabled={isLoading}
          className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 rounded-full bg-primary text-white"
        >
          <Send className="h-3.5 w-3.5" />
        </Button>
      </form>

      <div className="mt-4 flex flex-wrap gap-2">
        {quickPrompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => handleQuickPrompt(prompt)}
            className="px-3 py-1 bg-accent text-primary text-xs rounded-full hover:bg-accent/80 transition-colors"
            disabled={isLoading}
          >
            {prompt}
          </button>
        ))}
      </div>
    </div>
  )
}
