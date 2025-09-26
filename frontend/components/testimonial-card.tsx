"use client"

import { motion } from "@/components/motion"
import { Quote } from "lucide-react"

interface TestimonialCardProps {
  quote: string
  author: string
  role: string
}

export function TestimonialCard({ quote, author, role }: TestimonialCardProps) {
  return (
    <motion.div
      className="flex flex-col space-y-4 rounded-xl border bg-background p-6 shadow-sm transition-all hover:shadow-md relative overflow-hidden"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="absolute -right-4 -top-4 text-primary/10">
        <Quote className="h-16 w-16" />
      </div>
      <div className="relative z-10">
        <p className="text-muted-foreground italic">"{quote}"</p>
      </div>
      <div className="flex items-center gap-3 mt-auto pt-4 border-t">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          <span className="text-primary font-medium">{author.charAt(0)}</span>
        </div>
        <div>
          <p className="font-medium">{author}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
    </motion.div>
  )
}

