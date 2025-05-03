import { Building, Camera, MessageCircle, Stethoscope } from "lucide-react"
import Link from "next/link"

interface ServiceCardProps {
  title: string
  description: string
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

