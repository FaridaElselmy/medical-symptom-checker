<<<<<<< HEAD
import { ReactNode } from "react"
=======
import { Camera, ClipboardList, FileText } from "lucide-react"
>>>>>>> upstream/main

interface FeatureCardProps {
  title: string
  description: string
<<<<<<< HEAD
  icon: ReactNode
  step?: number
}

export function FeatureCard({ title, description, icon, step }: FeatureCardProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-4 p-6 bg-white rounded-lg shadow-sm">
      {step && (
        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-bold mb-2">
          {step}
        </div>
      )}
      <div className="h-16 w-16 rounded-full bg-accent flex items-center justify-center text-primary">
        {icon}
=======
  icon: "clipboard-list" | "camera" | "file-text"
  step: number
}

export function FeatureCard({ title, description, icon, step }: FeatureCardProps) {
  const icons = {
    "clipboard-list": ClipboardList,
    camera: Camera,
    "file-text": FileText,
  }

  const Icon = icons[icon]

  return (
    <div className="flex flex-col items-center text-center space-y-4 p-6 border rounded-lg bg-white shadow-sm relative">
      <div className="absolute top-4 right-4 h-6 w-6 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">
        {step}
      </div>
      <div className="h-16 w-16 rounded-full bg-accent flex items-center justify-center">
        <Icon className="h-8 w-8 text-primary" />
>>>>>>> upstream/main
      </div>
      <h3 className="text-xl font-bold text-secondary">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}
<<<<<<< HEAD
=======

>>>>>>> upstream/main
