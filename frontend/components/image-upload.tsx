"use client"

import type React from "react"

import { useState } from "react"
import { Upload, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function ImageUpload() {
  const [images, setImages] = useState<string[]>([])
  const [dragging, setDragging] = useState(false)

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files).map((file) => URL.createObjectURL(file))
      setImages((prev) => [...prev, ...newImages])
    }
  }

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index))
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const newImages = Array.from(e.dataTransfer.files).map((file) => URL.createObjectURL(file))
      setImages((prev) => [...prev, ...newImages])
    }
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-secondary">Upload Photos of Allergic Reactions or Skin Conditions</Label>
        <div className="grid grid-cols-1 gap-4">
          <div
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 cursor-pointer transition-all duration-200 ${dragging ? "border-primary bg-accent" : "hover:bg-muted"}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className={`rounded-full p-4 ${dragging ? "bg-accent" : "bg-muted"}`}>
                <Upload className={`h-8 w-8 ${dragging ? "text-primary" : "text-gray-400"}`} />
              </div>
              <div className="text-center">
                <p className="text-base font-medium text-secondary">Drag and drop your images here</p>
                <p className="text-sm text-gray-500">or click to browse files</p>
              </div>
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                id="image-upload"
                onChange={handleImageUpload}
              />
              <Label htmlFor="image-upload" className="cursor-pointer">
                <Button
                  variant="outline"
                  type="button"
                  className="border-primary text-primary hover:bg-primary hover:text-white"
                >
                  Select Files
                </Button>
              </Label>
            </div>
          </div>

          {images.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
              {images.map((image, index) => (
                <div key={index} className="relative rounded-lg overflow-hidden border aspect-square group">
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`Uploaded image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <Button
                      variant="destructive"
                      size="icon"
                      className="h-8 w-8 rounded-full"
                      onClick={() => removeImage(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="image-description" className="text-secondary">
          Describe the Condition
        </Label>
        <Textarea
          id="image-description"
          placeholder="Please provide details about the condition shown in the images. When did it start? Is it painful or itchy? Has it changed over time?"
          rows={4}
          className="border-gray-300 focus:border-primary focus:ring-primary"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="affected-areas" className="text-secondary">
          Affected Areas
        </Label>
        <Textarea
          id="affected-areas"
          placeholder="Which parts of your body are affected? Is it spreading?"
          rows={2}
          className="border-gray-300 focus:border-primary focus:ring-primary"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="triggers" className="text-secondary">
          Potential Triggers
        </Label>
        <Textarea
          id="triggers"
          placeholder="Have you noticed anything that might have triggered this reaction? (e.g., new foods, medications, skincare products, environmental factors)"
          rows={2}
          className="border-gray-300 focus:border-primary focus:ring-primary"
        />
      </div>
    </div>
  )
}
