"use client"

import { motion } from "@/components/motion"
<<<<<<< HEAD
import { Star } from 'lucide-react'

interface TestimonialCardProps {
  name: string
  role: string
  content: string
  rating: number
  avatar?: string
}

export function TestimonialCard({ name, role, content, rating, avatar }: TestimonialCardProps) {
=======
import { Quote } from "lucide-react"

interface TestimonialCardProps {
  quote: string
  author: string
  role: string
}

export function TestimonialCard({ quote, author, role }: TestimonialCardProps) {
>>>>>>> upstream/main
  return (
    <motion.div
      className="flex flex-col space-y-4 rounded-xl border bg-background p-6 shadow-sm transition-all hover:shadow-md relative overflow-hidden"
      whileHover={{ y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
<<<<<<< HEAD
      <div className="flex items-center gap-1 mb-2">
        {[...Array(5)].map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${
              i < rating ? "text-yellow-400 fill-current" : "text-gray-300"
            }`}
          />
        ))}
      </div>
      <div className="relative z-10">
        <p className="text-muted-foreground italic">"{content}"</p>
      </div>
      <div className="flex items-center gap-3 mt-auto pt-4 border-t">
        <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
          {avatar ? (
            <img src={avatar || "/placeholder.svg"} alt={name} className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <span className="text-primary font-medium">{name?.charAt(0) || "?"}</span>
          )}
        </div>
        <div>
          <p className="font-medium">{name}</p>
=======
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
>>>>>>> upstream/main
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
    </motion.div>
  )
}
<<<<<<< HEAD
=======

>>>>>>> upstream/main
