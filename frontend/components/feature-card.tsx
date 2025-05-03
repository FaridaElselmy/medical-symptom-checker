import { Camera, ClipboardList, FileText } from "lucide-react"

interface FeatureCardProps {
  title: string
  description: string
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
      </div>
      <h3 className="text-xl font-bold text-secondary">{title}</h3>
      <p className="text-gray-600">{description}</p>
    </div>
  )
}

