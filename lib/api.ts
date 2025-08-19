/**
 * API utility functions for making requests to the backend
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || ''

export interface ApiResponse<T = any> {
  success: boolean
  data: T
  message: string
  scan_time?: number
}

export interface ScanResult {
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

export interface ScreenshotAnalysisResult {
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

export interface DashboardStats {
  user_email: string
  scans_today: number
  threats_detected: number
  risk_reduction: number
  current_threat_score: number
  recent_scans: any[]
  recent_alerts: any[]
  threat_distribution: Record<string, number>
  scan_types_distribution: Record<string, number>
}

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public details?: any
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

/**
 * Make an authenticated API request
 */
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {},
  userEmail: string
): Promise<ApiResponse<T>> {
  const url = `${API_BASE_URL}${endpoint}`
  
  const config: RequestInit = {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userEmail}`,
      ...options.headers,
    },
  }

  try {
    const response = await fetch(url, config)
    
    if (!response.ok) {
      let errorMessage = 'Request failed'
      let errorDetails = null
      
      try {
        const errorData = await response.json()
        errorMessage = errorData.detail || errorData.message || errorMessage
        errorDetails = errorData
      } catch {
        // If error response is not JSON, use status text
        errorMessage = response.statusText || errorMessage
      }
      
      throw new ApiError(errorMessage, response.status, errorDetails)
    }

    const data = await response.json()
    return data
  } catch (error) {
    if (error instanceof ApiError) {
      throw error
    }
    
    // Network or other errors
    throw new ApiError(
      error instanceof Error ? error.message : 'Network error',
      0,
      error
    )
  }
}

/**
 * Scan a URL for threats
 */
export async function scanUrl(
  url: string,
  userEmail: string,
  includeScreenshot: boolean = true,
): Promise<ApiResponse<ScanResult>> {
  return apiRequest<ScanResult>('/api/scan', {
    method: 'POST',
    body: JSON.stringify({
      url,
      include_screenshot: includeScreenshot
    })
  }, userEmail)
}

/**
 * Analyze a screenshot for threats
 */
export async function analyzeScreenshot(
  file: File,
  userEmail: string,
  htmlContent?: string,
): Promise<ApiResponse<ScreenshotAnalysisResult>> {
  const formData = new FormData()
  formData.append('screenshot', file)
  
  if (htmlContent) {
    formData.append('html_content', htmlContent)
  }

  // For FormData, we need to remove Content-Type header to let browser set it
  const response = await fetch(`/api/analyze-screenshot`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${userEmail}`
    },
    body: formData
  })

  if (!response.ok) {
    let errorMessage = 'Request failed'
    try {
      const errorData = await response.json()
      errorMessage = errorData.detail || errorData.message || errorMessage
    } catch {
      errorMessage = response.statusText || errorMessage
    }
    throw new ApiError(errorMessage, response.status)
  }

  return response.json()
}

/**
 * Get dashboard statistics for a user
 */
export async function getDashboardStats(
  userEmail: string
): Promise<ApiResponse<DashboardStats>> {
  return apiRequest<DashboardStats>('/api/dashboard/stats', {
    method: 'GET'
  }, userEmail)
}

/**
 * Get recent scans for a user
 */
export async function getRecentScans(
  userEmail: string,
  limit: number = 20,
): Promise<ApiResponse<any[]>> {
  return apiRequest<any[]>(`/api/scans/recent?limit=${limit}`, {
    method: 'GET'
  }, userEmail)
}

/**
 * Get alerts for a user
 */
export async function getAlerts(
  userEmail: string,
  limit: number = 50,
): Promise<ApiResponse<any[]>> {
  return apiRequest<any[]>(`/api/alerts?limit=${limit}`, {
    method: 'GET'
  }, userEmail)
}

/**
 * Mark an alert as read
 */
export async function markAlertRead(
  alertId: string,
  userEmail: string
): Promise<ApiResponse<any>> {
  return apiRequest<any>(`/api/alerts/${alertId}/read`, {
    method: 'POST'
  }, userEmail)
}

export { ApiError } 