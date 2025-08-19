"use client"

import type React from "react"
import { DashboardNavigation } from "@/components/dashboard-navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { useState, useCallback, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Upload, AlertTriangle, Eye, Brain, X, Download, Share, FileImage, Zap, RefreshCw } from "lucide-react"

// Types for API responses
interface ScreenshotAnalysisResult {
  success: boolean
  data: {
    scan_id: string
    filename: string
    file_size: number
    content_type: string
    html_analysis: Record<string, any>
    llm_analysis: Record<string, any>
    threat_level: string
    threat_score: number
    scan_time_seconds: number
    gemini_used: boolean
  }
  message: string
  scan_time: number
}

export default function AnalyzerPage() {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [results, setResults] = useState<ScreenshotAnalysisResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)
  const [selectedElement, setSelectedElement] = useState<number | null>(null)
  const [analysisProgress, setAnalysisProgress] = useState(0)
  const { user, isLoading } = useAuth()
  const router = useRouter()

  // Redirect if not authenticated
  useEffect(() => {
    if (typeof window !== 'undefined' && !isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))
      setUploadedFiles((prev) => [...prev, ...files])
    }
  }, [])

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const files = Array.from(e.target.files).filter((file) => file.type.startsWith("image/"))
      setUploadedFiles((prev) => [...prev, ...files])
    }
  }

  const removeFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  const handleAnalyze = async () => {
    if (uploadedFiles.length === 0 || !user?.email) return

    setIsAnalyzing(true)
    setAnalysisComplete(false)
    setError(null)
    setAnalysisProgress(0)

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 15
        })
      }, 400)

      // Analyze each file
      const analysisPromises = uploadedFiles.map(async (file) => {
        const formData = new FormData()
        formData.append('screenshot', file)
        
        const response = await fetch('/api/analyze-screenshot', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${user.email}`
          },
          body: formData
        })

        if (!response.ok) {
          const errorData = await response.json()
          throw new Error(errorData.error || 'Analysis failed')
        }

        return response.json()
      })

      const analysisResults = await Promise.all(analysisPromises)
      
      clearInterval(progressInterval)
      setAnalysisProgress(100)

      // For now, show the first result (you can enhance this to show multiple results)
      setResults(analysisResults[0])
      setAnalysisComplete(true)

    } catch (err) {
      console.error('Analysis error:', err)
      setError(err instanceof Error ? err.message : 'Analysis failed')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const retryAnalysis = () => {
    setError(null)
    setResults(null)
    setAnalysisComplete(false)
    setAnalysisProgress(0)
  }

  const getThreatColor = (score: number) => {
    if (score >= 80) return "text-destructive"
    if (score >= 60) return "text-orange-500"
    if (score >= 40) return "text-yellow-500"
    return "text-secondary"
  }

  const getCategoryColor = (score: number) => {
    if (score >= 80) return "bg-destructive/20 text-destructive border-destructive/30"
    if (score >= 60) return "bg-orange-500/20 text-orange-500 border-orange-500/30"
    if (score >= 40) return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
    return "bg-secondary/20 text-secondary border-secondary/30"
  }

  const getRiskBadgeColor = (level: string) => {
    switch (level.toLowerCase()) {
      case "critical":
        return "bg-destructive/20 text-destructive border-destructive/30"
      case "high":
        return "bg-orange-500/20 text-orange-500 border-orange-500/30"
      case "medium":
        return "bg-yellow-500/20 text-yellow-500 border-yellow-500/30"
      case "low":
        return "bg-secondary/20 text-secondary border-secondary/30"
      default:
        return "bg-muted/20 text-muted-foreground border-muted-30"
    }
  }

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  // Don't render if not authenticated
  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-background matrix-grid">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background"></div>

      {/* Header */}
      <div className="relative z-10">
        {/* Navigation Component */}
        <DashboardNavigation />
        <div className="glass-morphism border-b border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-12">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>Tools</span>
                <span>/</span>
                <span>Screenshot Analyzer</span>
              </div>
              {error && (
                <Button
                  onClick={retryAnalysis}
                  variant="outline"
                  size="sm"
                  className="cyber-border hover:cyber-glow bg-transparent"
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Retry
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Analyzer Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-orbitron text-3xl font-bold mb-2">
              Screenshot <span className="text-primary">Threat Analyzer</span>
            </h1>
            <p className="text-muted-foreground">
              AI-powered visual analysis to detect phishing and social engineering attempts
            </p>
          </div>

          {/* Upload Zone */}
          <Card className="glass-morphism cyber-border mb-8">
            <CardHeader>
              <CardTitle className="font-orbitron flex items-center space-x-2">
                <FileImage className="h-5 w-5 text-primary" />
                <span>Upload Screenshots</span>
              </CardTitle>
              <CardDescription>Drag and drop images or click to browse (PNG, JPG, JPEG supported)</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all duration-300 ${
                  dragActive
                    ? "border-primary bg-primary/10 cyber-glow"
                    : "border-border hover:border-primary/50 hover:bg-primary/5"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  disabled={isAnalyzing}
                />
                <div className="space-y-4">
                  <div className="mx-auto w-16 h-16 rounded-full glass-morphism flex items-center justify-center">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-medium">Drop screenshots here</p>
                    <p className="text-muted-foreground">or click to browse files</p>
                  </div>
                </div>
              </div>

              {/* File Previews */}
              {uploadedFiles.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium mb-4">Uploaded Files ({uploadedFiles.length})</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {uploadedFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square rounded-lg glass-morphism cyber-border overflow-hidden">
                          <img
                            src={URL.createObjectURL(file) || "/placeholder.svg"}
                            alt={file.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => removeFile(index)}
                              className="rounded-full w-8 h-8 p-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2 truncate">{file.name}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {uploadedFiles.length > 0 && (
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="w-full mt-6 bg-primary hover:bg-primary/90 cyber-glow font-semibold py-6 text-lg"
                >
                  {isAnalyzing ? (
                    <>
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-2"></div>
                      Analyzing Screenshots...
                    </>
                  ) : (
                    <>
                      <Brain className="mr-2 h-5 w-5" />
                      Analyze Screenshots ({uploadedFiles.length})
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <Card className="glass-morphism cyber-border mb-8 border-destructive/30">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  <div>
                    <h3 className="font-medium">Analysis Failed</h3>
                    <p className="text-sm text-muted-foreground">{error}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Analysis Progress */}
          {isAnalyzing && (
            <Card className="glass-morphism cyber-border mb-8">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">AI Analysis Progress</span>
                    <span className="text-sm text-muted-foreground">Processing visual elements...</span>
                  </div>
                  <Progress value={analysisProgress} className="h-2" />
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-secondary"></div>
                      <span>Image preprocessing complete</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="animate-pulse w-2 h-2 rounded-full bg-primary"></div>
                      <span>AI threat detection in progress</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-muted-foreground"></div>
                      <span>Generating threat report</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Analysis Results */}
          {analysisComplete && results && (
            <div className="space-y-6">
              {/* Results Overview */}
              <Card className="glass-morphism cyber-border">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="font-orbitron">Analysis Complete</CardTitle>
                      <CardDescription>AI-powered threat detection results</CardDescription>
                    </div>
                    <Badge className={getRiskBadgeColor(results.data.threat_level)} variant="outline">
                      {results.data.threat_level} Risk
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Threat Score</p>
                      <p className={`text-3xl font-orbitron font-bold ${getThreatColor(results.data.threat_score)}`}>
                        {results.data.threat_score}/100
                      </p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">Analysis Time</p>
                      <p className="text-xl font-medium">{results.data.scan_time_seconds}s</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-muted-foreground">File Analyzed</p>
                      <p className="text-xl font-medium">{results.data.filename}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Screenshot Display */}
                <Card className="glass-morphism cyber-border">
                  <CardHeader>
                    <CardTitle className="font-orbitron flex items-center space-x-2">
                      <Eye className="h-5 w-5 text-primary" />
                      <span>Analyzed Screenshot</span>
                    </CardTitle>
                    <CardDescription>AI analysis results for uploaded image</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="relative">
                      {uploadedFiles.length > 0 && (
                        <img
                          src={URL.createObjectURL(uploadedFiles[0])}
                          alt="Analyzed screenshot"
                          className="w-full rounded-lg cyber-border"
                        />
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Analysis Details & Actions */}
                <div className="space-y-6">
                  {/* Analysis Details */}
                  <Card className="glass-morphism cyber-border">
                    <CardHeader>
                      <CardTitle className="font-orbitron">Analysis Details</CardTitle>
                      <CardDescription>AI threat assessment breakdown</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">File Size</span>
                          <span className="text-sm text-muted-foreground">
                            {(results.data.file_size / 1024).toFixed(1)} KB
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">Content Type</span>
                          <span className="text-sm text-muted-foreground">{results.data.content_type}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">AI Engine</span>
                          <span className="text-sm text-muted-foreground">
                            {results.data.gemini_used ? 'Gemini LLM' : 'Standard Analysis'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* LLM Analysis Results */}
                  {results.data.llm_analysis && Object.keys(results.data.llm_analysis).length > 0 && (
                    <Card className="glass-morphism cyber-border">
                      <CardHeader>
                        <CardTitle className="font-orbitron flex items-center space-x-2">
                          <Brain className="h-5 w-5 text-primary" />
                          <span>AI Analysis Results</span>
                        </CardTitle>
                        <CardDescription>Gemini LLM threat assessment</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {Object.entries(results.data.llm_analysis).map(([key, value]) => (
                            <div key={key} className="flex items-start space-x-3">
                              <span className="text-primary font-medium min-w-[120px]">{key}:</span>
                              <span className="text-sm text-muted-foreground">{String(value)}</span>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}

                  {/* Actions */}
                  <Card className="glass-morphism cyber-border">
                    <CardHeader>
                      <CardTitle className="font-orbitron flex items-center space-x-2">
                        <Zap className="h-5 w-5 text-primary" />
                        <span>Security Actions</span>
                      </CardTitle>
                      <CardDescription>Recommended response to detected threats</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex space-x-4">
                        <Button className="bg-primary hover:bg-primary/90 cyber-glow">
                          <Download className="mr-2 h-4 w-4" />
                          Export Report
                        </Button>
                        <Button variant="outline" className="cyber-border hover:cyber-glow bg-transparent">
                          <Share className="mr-2 h-4 w-4" />
                          Share Analysis
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
