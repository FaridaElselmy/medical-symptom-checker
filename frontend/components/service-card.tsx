<<<<<<< HEAD
import Link from "next/link"
import { ArrowRight, Stethoscope, Camera, MessageCircle, Heart, Droplets } from 'lucide-react'
import { Card, CardContent } from "@/components/ui/card"
=======
import { Building, Camera, MessageCircle, Stethoscope } from "lucide-react"
import Link from "next/link"
>>>>>>> upstream/main

interface ServiceCardProps {
  title: string
  description: string
<<<<<<< HEAD
  icon: string
  link: string
}

const iconMap = {
  stethoscope: Stethoscope,
  camera: Camera,
  "message-circle": MessageCircle,
  heart: Heart,
  droplets: Droplets,
}

export function ServiceCard({ title, description, icon, link }: ServiceCardProps) {
  const IconComponent = iconMap[icon as keyof typeof iconMap] || Stethoscope

  return (
    <Link href={link}>
      <Card className="h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1 cursor-pointer group">
        <CardContent className="p-6 flex flex-col h-full">
          <div className="mb-4 p-3 bg-primary/10 rounded-lg w-fit group-hover:bg-primary/20 transition-colors">
            <IconComponent className="h-8 w-8 text-primary" />
          </div>
          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
            {title}
          </h3>
          <p className="text-gray-600 mb-4 flex-grow">
            {description}
          </p>
          <div className="flex items-center text-primary font-medium group-hover:gap-2 transition-all">
            Learn More
            <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
=======
  icon: "stethoscope" | "camera" | "building" | "message-circle"
  link: string
}

export function ServiceCard({ title, description, icon, link }: ServiceCardProps) {
  const icons = {
    stethoscope: Stethoscope,
    camera: Camera,
    building: Building,
    "message-circle": MessageCircle,
  }

  const Icon = icons[icon]

  return (
    <Link href={link}>
      <div className="flex flex-col items-center text-center space-y-4 p-6 border rounded-lg bg-white shadow-sm hover:shadow-md transition-shadow group">
        <div className="relative">
          <div className="h-16 w-16 rounded-full bg-accent flex items-center justify-center group-hover:bg-primary/10 transition-colors">
            <Icon className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h3 className="text-xl font-bold text-secondary">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  )
}

>>>>>>> upstream/main
