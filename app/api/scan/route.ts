import { NextRequest, NextResponse } from 'next/server'
import { saveScanAndUpdate, extractThreatLevel, extractThreatScore, extractScanTimeSeconds, extractHtmlAnalysis, extractLlmAnalysis } from '@/lib/services/scans'

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, includeScreenshot, apiKey } = body

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json(
        { error: 'Authorization header required' },
        { status: 401 }
      )
    }

    const userEmail = authHeader.replace('Bearer ', '').trim()
    if (!userEmail || !userEmail.includes('@')) {
      return NextResponse.json(
        { error: 'Valid user email required' },
        { status: 401 }
      )
    }

    const backendRequest = {
      url,
      include_screenshot: includeScreenshot ?? true,
      api_key: apiKey
    }

    const response = await fetch(`${API_BASE_URL}/api/scan/url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userEmail}`
      },
      body: JSON.stringify(backendRequest)
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json(
        { error: errorData.detail || 'Backend API error' },
        { status: response.status }
      )
    }

    const data = await response.json()

		try {
			await saveScanAndUpdate({
				user_email: userEmail,
				url,
				scan_type: 'URL',
				threat_level: extractThreatLevel(data),
				threat_score: extractThreatScore(data),
				scan_time: extractScanTimeSeconds(data),
				html_analysis: extractHtmlAnalysis(data),
				llm_analysis: extractLlmAnalysis(data),
			})
		} catch (persistErr) {
			console.error('Failed to persist scan result:', persistErr)
		}

    return NextResponse.json(data)

  } catch (error) {
    console.error('Scan API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 