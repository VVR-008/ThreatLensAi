"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { DashboardNavigation } from "@/components/dashboard-navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { Scan, AlertTriangle, CheckCircle, XCircle, ChevronDown, ChevronRight, Globe, Zap, Clock, RefreshCw, Brain } from "lucide-react"

// Types for API responses
interface ScanResult {
  success: boolean
  data: {
    scan_id: string
    url: string
    threat_level: string
    threat_score: number
    scan_time_seconds: number
    html_analysis: Record<string, any>
    llm_analysis: Record<string, any>
    screenshot_captured: boolean
    gemini_used: boolean
  }
  message: string
  scan_time: number
}

export default function ScannerPage() {
  const [url, setUrl] = useState("")
  const [isScanning, setIsScanning] = useState(false)
  const [scanComplete, setScanComplete] = useState(false)
  const [results, setResults] = useState<ScanResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const [scanProgress, setScanProgress] = useState(0)
  const { user, isLoading } = useAuth()
  const router = useRouter()

  // Redirect if not authenticated
  useEffect(() => {
    if (typeof window !== 'undefined' && !isLoading && !user) {
      router.push('/login')
    }
  }, [user, isLoading, router])

  const handleScan = async () => {
    if (!url || !user?.email) return

    setIsScanning(true)
    setScanComplete(false)
    setError(null)
    setScanProgress(0)

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setScanProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return 90
          }
          return prev + 10
        })
      }, 300)

      const response = await fetch('/api/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.email}`
        },
        body: JSON.stringify({
          url,
          includeScreenshot: true
        })
      })

      clearInterval(progressInterval)
      setScanProgress(100)

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Scan failed')
      }

      const data: ScanResult = await response.json()
      setResults(data)
      setScanComplete(true)

    } catch (err) {
      console.error('Scan error:', err)
      setError(err instanceof Error ? err.message : 'Scan failed')
    } finally {
      setIsScanning(false)
    }
  }

  const toggleSection = (section: string) => {
    setExpandedSections((prev) => (prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]))
  }

  const getThreatColor = (score: number) => {
    if (score >= 80) return "text-destructive"
    if (score >= 60) return "text-orange-500"
    if (score >= 40) return "text-yellow-500"
    return "text-secondary"
  }

  const getThreatBg = (score: number) => {
    if (score >= 80) return "from-destructive/20 to-destructive/5"
    if (score >= 60) return "from-orange-500/20 to-orange-500/5"
    if (score >= 40) return "from-yellow-500/20 to-yellow-500/5"
    return "from-secondary/20 to-secondary/5"
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

  const isValidUrl = (string: string) => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const retryScan = () => {
    setError(null)
    setResults(null)
    setScanComplete(false)
    setScanProgress(0)
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
        <DashboardNavigation />
        <div className="glass-morphism border-b border-border/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-12">
              <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                <span>Tools</span>
                <span>/</span>
                <span>URL Scanner</span>
              </div>
              {error && (
                <Button
                  onClick={retryScan}
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

        {/* Scanner Content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-orbitron text-3xl font-bold mb-2">
              URL <span className="text-primary">Threat Scanner</span>
            </h1>
            <p className="text-muted-foreground">Analyze URLs for phishing, malware, and security threats</p>
          </div>

          {/* Scanner Input */}
          <Card className="glass-morphism cyber-border mb-8">
            <CardHeader>
              <CardTitle className="font-orbitron flex items-center space-x-2">
                <Globe className="h-5 w-5 text-primary" />
                <span>Enter URL to Analyze</span>
              </CardTitle>
              <CardDescription>Paste any URL to perform comprehensive threat analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Input
                  type="url"
                  placeholder="https://example.com"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  className="text-lg py-6 cyber-border focus:cyber-glow transition-all duration-300 bg-transparent"
                  disabled={isScanning}
                />
                {url && !isValidUrl(url) && <p className="text-destructive text-sm mt-2">Please enter a valid URL</p>}
              </div>
              <Button
                onClick={handleScan}
                disabled={!url || !isValidUrl(url) || isScanning}
                className="w-full bg-primary hover:bg-primary/90 cyber-glow font-semibold py-6 text-lg"
              >
                {isScanning ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground mr-2"></div>
                    Analyzing URL...
                  </>
                ) : (
                  <>
                    <Scan className="mr-2 h-5 w-5" />
                    Analyze URL
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Error Display */}
          {error && (
            <Card className="glass-morphism cyber-border mb-8 border-destructive/30">
              <CardContent className="p-6">
                <div className="flex items-center space-x-3 text-destructive">
                  <AlertTriangle className="h-5 w-5" />
                  <div>
                    <h3 className="font-medium">Scan Failed</h3>
                    <p className="text-sm text-muted-foreground">{error}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Scanning Progress */}
          {isScanning && (
            <Card className="glass-morphism cyber-border mb-8">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Scanning Progress</span>
                    <span className="text-sm text-muted-foreground">Analyzing threats...</span>
                  </div>
                  <Progress value={scanProgress} className="h-2" />
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-secondary" />
                      <span>DNS Resolution</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="h-4 w-4 text-secondary" />
                      <span>SSL Analysis</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      <span>Content Scan</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <span>AI Analysis</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Results */}
          {scanComplete && results && (
            <div className="space-y-6">
              {/* Threat Score Overview */}
              <Card className="glass-morphism cyber-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h3 className="font-orbitron text-xl font-bold mb-2">Threat Analysis Complete</h3>
                      <p className="text-muted-foreground text-sm">Scanned in {results.data.scan_time_seconds}s</p>
                    </div>
                    <Badge className={getRiskBadgeColor(results.data.threat_level)} variant="outline">
                      {results.data.threat_level} Risk
                    </Badge>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Threat Score Visualization */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Threat Score</span>
                        <span className={`text-2xl font-orbitron font-bold ${getThreatColor(results.data.threat_score)}`}>
                          {results.data.threat_score}/100
                        </span>
                      </div>
                      <div className="relative">
                        <div
                          className={`h-4 rounded-full bg-gradient-to-r ${getThreatBg(results.data.threat_score)} border cyber-border`}
                        >
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${results.data.threat_score >= 80 ? "from-destructive to-destructive/80" : results.data.threat_score >= 60 ? "from-orange-500 to-orange-500/80" : results.data.threat_score >= 40 ? "from-yellow-500 to-yellow-500/80" : "from-secondary to-secondary/80"} transition-all duration-1000 ease-out`}
                            style={{ width: `${results.data.threat_score}%` }}
                          ></div>
                        </div>
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>Safe</span>
                          <span>Dangerous</span>
                        </div>
                      </div>
                    </div>

                    {/* URL Info */}
                    <div className="space-y-2">
                      <p className="text-sm font-medium">Analyzed URL</p>
                      <p className="text-sm text-muted-foreground break-all bg-muted/20 p-2 rounded cyber-border">
                        {results.data.url}
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <span>Screenshot: {results.data.screenshot_captured ? 'Captured' : 'Not captured'}</span>
                        <span>•</span>
                        <span>AI: {results.data.gemini_used ? 'Gemini' : 'Standard'}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Detailed Findings */}
              <Card className="glass-morphism cyber-border">
                <CardHeader>
                  <CardTitle className="font-orbitron">Detailed Findings</CardTitle>
                  <CardDescription>Comprehensive threat analysis breakdown</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* HTML Analysis */}
                  {results.data.html_analysis && Object.keys(results.data.html_analysis).length > 0 && (
                    <Collapsible>
                      <CollapsibleTrigger
                        onClick={() => toggleSection('html')}
                        className="flex items-center justify-between w-full p-4 rounded-lg glass-morphism cyber-border hover:cyber-glow transition-all duration-300"
                      >
                        <div className="flex items-center space-x-3">
                          <CheckCircle className="h-5 w-5 text-secondary" />
                          <div className="text-left">
                            <p className="font-medium">HTML Analysis</p>
                            <p className="text-sm text-muted-foreground">Page structure and form analysis</p>
                          </div>
                        </div>
                        {expandedSections.includes('html') ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-2">
                        <div className="p-4 rounded-lg bg-muted/10 border-l-4 border-l-primary/30">
                          <pre className="text-sm text-muted-foreground whitespace-pre-wrap">
                            {JSON.stringify(results.data.html_analysis, null, 2)}
                          </pre>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  )}

                  {/* LLM Analysis */}
                  {results.data.llm_analysis && Object.keys(results.data.llm_analysis).length > 0 && (
                    <Collapsible>
                      <CollapsibleTrigger
                        onClick={() => toggleSection('llm')}
                        className="flex items-center justify-between w-full p-4 rounded-lg glass-morphism cyber-border hover:cyber-glow transition-all duration-300"
                      >
                        <div className="flex items-center space-x-3">
                          <Brain className="h-5 w-5 text-primary" />
                          <div className="text-left">
                            <p className="font-medium">AI Analysis</p>
                            <p className="text-sm text-muted-foreground">Gemini LLM threat assessment</p>
                          </div>
                        </div>
                        {expandedSections.includes('llm') ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-2">
                        <div className="p-4 rounded-lg bg-muted/10 border-l-4 border-l-primary/30">
                          <div className="space-y-3">
                            {Object.entries(results.data.llm_analysis).map(([key, value]) => (
                              <div key={key} className="flex items-start space-x-3">
                                <span className="text-primary font-medium min-w-[120px]">{key}:</span>
                                <span className="text-sm text-muted-foreground">{String(value)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                </CardContent>
              </Card>

              {/* Actions */}
              <Card className="glass-morphism cyber-border">
                <CardHeader>
                  <CardTitle className="font-orbitron flex items-center space-x-2">
                    <Zap className="h-5 w-5 text-primary" />
                    <span>Security Actions</span>
                  </CardTitle>
                  <CardDescription>Recommended actions based on analysis results</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex space-x-4">
                    <Button className="bg-primary hover:bg-primary/90 cyber-glow">
                      Block Domain
                    </Button>
                    <Button variant="outline" className="cyber-border hover:cyber-glow bg-transparent">
                      Generate Report
                    </Button>
                    <Button variant="outline" className="cyber-border hover:cyber-glow bg-transparent">
                      Share Results
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
