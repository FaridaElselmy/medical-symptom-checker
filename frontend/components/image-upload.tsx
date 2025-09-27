"use client"

import { useState, useRef, ChangeEvent, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Upload, X, UploadCloud } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

export function ImageUpload({ onUploadComplete }: { onUploadComplete: (result: any) => void }) {
  const [images, setImages] = useState<string[]>([])
  const [dragging, setDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<number | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
  const router = useRouter()

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  // Check authentication status
  useEffect(() => {
    const checkAuth = () => {
      if (typeof window === "undefined") return false
      
      const token = localStorage.getItem("access_token")
      const isLoggedIn = localStorage.getItem("isLoggedIn") === "true"
      
      return !!(token && isLoggedIn)
    }
    
    setIsAuthenticated(checkAuth())
  }, [])

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
    
    if (!isAuthenticated) {
      alert("Please log in to upload images")
      router.push("/login")
      return
    }
    
    handleFiles(e.dataTransfer.files)
  }

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!isAuthenticated) {
      alert("Please log in to upload images")
      router.push("/login")
      e.target.value = ""
      return
    }

    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (files: FileList) => {
    const newImages = Array.from(files).map((file) => URL.createObjectURL(file))
    setImages((prev) => [...prev, ...newImages])

    // Process ALL files instead of just the first one
    Array.from(files).forEach((file) => {
      processImageForPrediction(file)
    })
  }

  const processImageForPrediction = async (file: File) => {
    if (!isAuthenticated) {
      alert("Please log in to upload images")
      router.push("/login")
      return
    }

    setIsLoading(true)
    setUploadProgress(0)

    try {
      const token = localStorage.getItem("access_token")
      if (!token) {
        throw new Error("No authentication token found")
      }

      const formData = new FormData()
      formData.append("file", file)

      const response = await fetch("https://faridaaaa-medical-diagnosis-api.hf.space/predict", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`
        },
        body: formData
      })

      if (!response.ok) {
        if (response.status === 401) {
          // Token is invalid - clear storage and redirect
          localStorage.removeItem("access_token")
          localStorage.removeItem("isLoggedIn")
          setIsAuthenticated(false)
          alert("Your session has expired. Please log in again.")
          router.push("/login")
          return
        }
        
        const errorData = await response.json().catch(() => null)
        throw new Error(
          errorData?.detail ||
            `Upload failed with status ${response.status}: ${response.statusText}`
        )
      }

      const result = await response.json()
      onUploadComplete(result)
    } catch (error) {
      console.error("Upload error:", error)
      alert(`Upload failed: ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setIsLoading(false)
      setUploadProgress(null)
    }
  }

  // If not authenticated, show login prompt
  if (!isAuthenticated) {
    return (
      <div className="space-y-6">
        <div className="space-y-2">
          <Label className="text-secondary">Upload Photos of Allergic Reactions or Skin Conditions</Label>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
            <UploadCloud className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-yellow-800 mb-2">Authentication Required</h3>
            <p className="text-yellow-700 mb-4">
              Please log in to upload and analyze images for medical diagnosis.
            </p>
            <Button 
              onClick={() => router.push("/login")}
              className="bg-primary text-white hover:bg-primary/90"
            >
              Go to Login
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label className="text-secondary">Upload Photos of Allergic Reactions or Skin Conditions</Label>
        <div className="grid grid-cols-1 gap-4">
          <div
            className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 cursor-pointer transition-all duration-200 ${
              dragging ? "border-primary bg-accent" : "hover:bg-muted"
            } ${isLoading ? "opacity-50" : ""}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div className="flex flex-col items-center justify-center space-y-3">
              <div className={`rounded-full p-4 ${dragging || isLoading ? "bg-accent" : "bg-muted"}`}>
                {isLoading ? (
                  <UploadCloud className="h-8 w-8 text-primary animate-pulse" />
                ) : (
                  <Upload className={`h-8 w-8 ${dragging ? "text-primary" : "text-gray-400"}`} />
                )}
              </div>
              <div className="text-center">
                {isLoading ? (
                  <>
                    <p className="text-base font-medium text-secondary">Analyzing images...</p>
                    <p className="text-sm text-gray-500">Please wait</p>
                  </>
                ) : (
                  <>
                    <p className="text-base font-medium text-secondary">
                      {dragging ? "Drop to upload" : "Drag and drop your images here"}
                    </p>
                    <p className="text-sm text-gray-500">or click to browse files</p>
                  </>
                )}
              </div>

              <Button
                variant="outline"
                type="button"
                className="border-primary text-primary hover:bg-primary hover:text-white"
                onClick={() => {
                  fileInputRef.current?.click();
                }}
                disabled={isLoading}
              >
                {isLoading ? "Processing..." : "Select Files"}
              </Button>

              <input
                type="file"
                accept="image/*"
                multiple
                ref={fileInputRef}
                className="hidden"
                onChange={handleImageUpload}
                disabled={isLoading}
              />
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
                  {index === 0 && isLoading && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                      <div className="text-white text-sm">Analyzing...</div>
                    </div>
                  )}
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