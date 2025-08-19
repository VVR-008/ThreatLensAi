"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Scan, Upload, AlertTriangle, TrendingUp, Eye, Activity, Bell, Clock, RefreshCw } from "lucide-react"
import Link from "next/link"
import { DashboardNavigation } from "@/components/dashboard-navigation"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"
import { getDashboardStats, getRecentScans, getAlerts, ApiError } from "@/lib/api"

interface ScanResult {
  _id: string
  url: string
  scan_type: string
  threat_level: string
  threat_score: number
  scan_time: number
  timestamp: string
  status: string
}

interface Alert {
  _id: string
  message: string
  severity: string
  alert_type: string
  timestamp: string
  read: boolean
}

interface DashboardStats {
  user_email: string
  scans_today: number
  threats_detected: number
  risk_reduction: number
  current_threat_score: number
  recent_scans: ScanResult[]
  recent_alerts: Alert[]
  threat_distribution: Record<string, number>
  scan_types_distribution: Record<string, number>
}

export default function DashboardPage() {
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const { user, isLoading: authLoading } = useAuth()
  const router = useRouter()

  // Redirect if not authenticated
  useEffect(() => {
    if (typeof window !== 'undefined' && !authLoading && !user) {
      router.push('/login')
    }
  }, [user, authLoading, router])

  // Fetch dashboard data using the API utility
  const fetchDashboardData = async () => {
    if (!user?.email) return
    
    try {
      setIsLoading(true)
      setError(null)
      
      // Use the API utility function instead of direct fetch
      const response = await getDashboardStats(user.email)
      
      if (response.success) {
        setDashboardStats(response.data)
      } else {
        throw new Error(response.message || 'Failed to fetch dashboard data')
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err)
      
      if (err instanceof ApiError) {
        setError(`API Error: ${err.message}`)
      } else {
        setError(err instanceof Error ? err.message : 'Failed to fetch dashboard data')
      }
    } finally {
      setIsLoading(false)
    }
  }

  // Refresh dashboard data
  const refreshDashboard = async () => {
    setIsRefreshing(true)
    await fetchDashboardData()
    setIsRefreshing(false)
  }

  // Fetch data on mount and when user changes
  useEffect(() => {
    if (user?.email) {
      fetchDashboardData()
    }
  }, [user?.email])

  // Auto-refresh every 5 minutes
  useEffect(() => {
    if (!user?.email) return
    
    const interval = setInterval(fetchDashboardData, 5 * 60 * 1000)
    return () => clearInterval(interval)
  }, [user?.email])

  const getThreatColor = (threat: string) => {
    switch (threat.toLowerCase()) {
      case "critical":
        return "text-destructive"
      case "high":
        return "text-orange-500"
      case "medium":
        return "text-yellow-500"
      case "low":
        return "text-secondary"
      default:
        return "text-muted-foreground"
    }
  }

  const getThreatBadgeColor = (threat: string) => {
    switch (threat.toLowerCase()) {
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

  const getAlertColor = (severity: string) => {
    switch (severity) {
      case "critical":
        return "border-l-destructive bg-destructive/5"
      case "high":
        return "border-l-orange-500 bg-orange-500/5"
      case "info":
        return "border-l-primary bg-primary/5"
      default:
        return "border-l-muted bg-muted/5"
    }
  }

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date()
    const scanTime = new Date(timestamp)
    const diffInMinutes = Math.floor((now.getTime() - scanTime.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return "Just now"
    if (diffInMinutes < 60) return `${diffInMinutes} min ago`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hour${Math.floor(diffInMinutes / 60) > 1 ? 's' : ''} ago`
    return `${Math.floor(diffInMinutes / 1440)} day${Math.floor(diffInMinutes / 1440) > 1 ? 's' : ''} ago`
  }

  // Show loading state while checking authentication
  if (authLoading) {
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

  // Show loading state while fetching data
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background matrix-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background"></div>
        <div className="relative z-10">
          <DashboardNavigation />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-muted-foreground">Loading dashboard data...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show error state
  if (error) {
    return (
      <div className="min-h-screen bg-background matrix-grid">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/80 to-background"></div>
        <div className="relative z-10">
          <DashboardNavigation />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <AlertTriangle className="w-12 h-12 text-destructive mx-auto mb-4" />
              <h2 className="text-xl font-semibold mb-2">Error Loading Dashboard</h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={refreshDashboard} className="bg-primary hover:bg-primary/90">
                <RefreshCw className="w-4 h-4 mr-2" />
                Retry
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
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
                <span>Dashboard</span>
                <span>/</span>
                <span>Security Command Center</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-xs text-muted-foreground">
                  User: {user.email}
                </span>
                <Button
                  onClick={refreshDashboard}
                  disabled={isRefreshing}
                  variant="outline"
                  size="sm"
                  className="cyber-border hover:cyber-glow bg-transparent"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                  Refresh
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-orbitron text-3xl font-bold mb-2">
              Security <span className="text-primary">Command Center</span>
            </h1>
            <p className="text-muted-foreground">Monitor threats and manage your digital security in real-time</p>
            <p className="text-sm text-muted-foreground mt-1">Logged in as: {user.email}</p>
          </div>

          {/* Top Stats Row */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="glass-morphism cyber-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Scans Today</p>
                    <p className="text-2xl font-orbitron font-bold text-primary">
                      {dashboardStats?.scans_today || 0}
                    </p>
                  </div>
                  <Scan className="h-8 w-8 text-primary/60" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-morphism cyber-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Threats Detected</p>
                    <p className="text-2xl font-orbitron font-bold text-destructive">
                      {dashboardStats?.threats_detected || 0}
                    </p>
                  </div>
                  <AlertTriangle className="h-8 w-8 text-destructive/60" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-morphism cyber-border">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Risk Reduced</p>
                    <p className="text-2xl font-orbitron font-bold text-secondary">
                      {dashboardStats?.risk_reduction || 0}%
                    </p>
                  </div>
                  <TrendingUp className="h-8 w-8 text-secondary/60" />
                </div>
              </CardContent>
            </Card>

            <Card className="glass-morphism cyber-border">
              <CardContent className="p-6">
                                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Current Risk Score</p>
                      <p className={`text-2xl font-orbitron font-bold ${getThreatColor((() => {
                        const score = dashboardStats?.current_threat_score ?? 0;
                        if (score >= 80) return 'critical';
                        if (score >= 60) return 'high';
                        if (score >= 40) return 'medium';
                        return 'low';
                      })())}`}>
                        {dashboardStats?.current_threat_score ?? 0}
                      </p>
                    </div>
                    <Activity className="h-8 w-8 text-primary/60 threat-pulse" />
                  </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Threat Level Meter */}
              <Card className="glass-morphism cyber-border">
                <CardHeader>
                  <CardTitle className="font-orbitron flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <span>Current Threat Level</span>
                  </CardTitle>
                  <CardDescription>Real-time security risk assessment for {user.email}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-center mb-6">
                    <div className="relative w-48 h-48">
                      <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="40" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
                        <circle
                          cx="50"
                          cy="50"
                          r="40"
                          stroke="url(#gradient)"
                          strokeWidth="8"
                          fill="none"
                          strokeLinecap="round"
                          strokeDasharray={`${(dashboardStats?.current_threat_score || 0) * 2.51} 251`}
                          className="transition-all duration-1000 ease-out"
                        />
                        <defs>
                          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#00ff88" />
                            <stop offset="50%" stopColor="#00e1ff" />
                            <stop offset="100%" stopColor="#ff0040" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <div className="text-4xl font-orbitron font-bold text-primary">
                            {dashboardStats?.current_threat_score || 0}
                          </div>
                          <div className="text-sm text-muted-foreground">Risk Score</div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <Badge className={getThreatBadgeColor((dashboardStats?.current_threat_score ?? 0) >= 60 ? 'high' : 'low')}>
                      {(dashboardStats?.current_threat_score ?? 0) >= 60 ? 'Elevated Risk' : 'Normal Risk'}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-2">
                      {(dashboardStats?.threats_detected ?? 0) > 0 
                        ? `Multiple suspicious activities detected in the last hour`
                        : `No recent threats detected`
                      }
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Scans Timeline */}
              <Card className="glass-morphism cyber-border">
                <CardHeader>
                  <CardTitle className="font-orbitron flex items-center space-x-2">
                    <Clock className="h-5 w-5 text-primary" />
                    <span>Recent Scans</span>
                  </CardTitle>
                  <CardDescription>Latest security analysis results for {user.email}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {dashboardStats?.recent_scans && dashboardStats.recent_scans.length > 0 ? (
                      dashboardStats.recent_scans.slice(0, 5).map((scan) => (
                        <div key={scan._id} className="flex items-center justify-between p-3 rounded-lg glass-morphism">
                          <div className="flex items-center space-x-3">
                            <div
                              className={`w-2 h-2 rounded-full ${getThreatColor(scan.threat_level).replace("text-", "bg-")}`}
                            ></div>
                            <div>
                              <p className="font-medium text-sm truncate max-w-[300px]">{scan.url}</p>
                              <p className="text-xs text-muted-foreground">
                                {scan.scan_type} • {formatTimeAgo(scan.timestamp)}
                              </p>
                            </div>
                          </div>
                          <Badge className={getThreatBadgeColor(scan.threat_level)}>
                            {scan.threat_level}
                          </Badge>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-8 text-muted-foreground">
                        <Scan className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No scans yet</p>
                        <p className="text-sm">Start your first security scan</p>
                      </div>
                    )}
                  </div>
                  <Link href="/scanner">
                    <Button variant="outline" className="w-full mt-4 cyber-border bg-transparent">
                      Start New Scan
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </div>

            {/* Right Column */}
            <div className="space-y-8">
              {/* Quick Actions */}
              <Card className="glass-morphism cyber-border">
                <CardHeader>
                  <CardTitle className="font-orbitron">Quick Actions</CardTitle>
                  <CardDescription>Start a new security scan</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Link href="/scanner">
                    <Button className="w-full bg-primary hover:bg-primary/90 cyber-glow">
                      <Scan className="mr-2 h-4 w-4" />
                      Scan URL
                    </Button>
                  </Link>
                  <Link href="/analyzer">
                    <Button variant="outline" className="w-full cyber-border hover:cyber-glow bg-transparent">
                      <Upload className="mr-2 h-4 w-4" />
                      Analyze Screenshot
                    </Button>
                  </Link>
                  <Button variant="outline" className="w-full cyber-border hover:cyber-glow bg-transparent">
                    <Eye className="mr-2 h-4 w-4" />
                    Monitor Domain
                  </Button>
                </CardContent>
              </Card>

              {/* Real-time Alerts */}
              <Card className="glass-morphism cyber-border">
                <CardHeader>
                  <CardTitle className="font-orbitron flex items-center space-x-2">
                    <Bell className="h-5 w-5 text-primary threat-pulse" />
                    <span>Live Alerts</span>
                  </CardTitle>
                  <CardDescription>Real-time security notifications for {user.email}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {dashboardStats?.recent_alerts && dashboardStats.recent_alerts.length > 0 ? (
                      dashboardStats.recent_alerts.slice(0, 3).map((alert) => (
                        <div key={alert._id} className={`p-3 rounded-lg border-l-4 ${getAlertColor(alert.severity)}`}>
                          <p className="text-sm font-medium">{alert.message}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {formatTimeAgo(alert.timestamp)}
                          </p>
                        </div>
                      ))
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No active alerts</p>
                      </div>
                    )}
                  </div>
                  <Button variant="outline" className="w-full mt-4 cyber-border bg-transparent">
                    View All Alerts
                  </Button>
                </CardContent>
              </Card>

              {/* System Status */}
              <Card className="glass-morphism cyber-border">
                <CardHeader>
                  <CardTitle className="font-orbitron">System Status</CardTitle>
                  <CardDescription>Security infrastructure health</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">AI Detection Engine</span>
                    <Badge className="bg-secondary/20 text-secondary border-secondary/30">Online</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Real-time Monitoring</span>
                    <Badge className="bg-secondary/20 text-secondary border-secondary/30">Active</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Threat Database</span>
                    <Badge className="bg-secondary/20 text-secondary border-secondary/30">Updated</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">API Gateway</span>
                    <Badge className="bg-secondary/20 text-secondary border-secondary/30">Operational</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm">User Session</span>
                    <Badge className="bg-primary/20 text-primary border-primary/30">Active</Badge>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
