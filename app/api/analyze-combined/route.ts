import { NextRequest, NextResponse } from 'next/server'
import { saveScanAndUpdate, extractThreatLevel, extractThreatScore, extractScanTimeSeconds, extractHtmlAnalysis, extractLlmAnalysis } from '@/lib/services/scans'

const API_BASE_URL = process.env.API_BASE_URL || 'http://localhost:8080'

export async function POST(request: NextRequest) {
  try {
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

    const formData = await request.formData()
    const url = formData.get('url') as string
    const screenshot = formData.get('screenshot') as File
    const htmlContent = formData.get('html_content') as string
    const apiKey = formData.get('api_key') as string

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    if (!screenshot) {
      return NextResponse.json(
        { error: 'Screenshot file is required' },
        { status: 400 }
      )
    }

		try { new URL(url) } catch { return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 }) }

    if (!screenshot.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    const backendFormData = new FormData()
    backendFormData.append('url', url)
    backendFormData.append('screenshot', screenshot)
    if (htmlContent) {
      backendFormData.append('html_content', htmlContent)
    }
    if (apiKey) {
      backendFormData.append('api_key', apiKey)
    }

    const response = await fetch(`${API_BASE_URL}/api/analyze/combined`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userEmail}`
      },
      body: backendFormData
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
				scan_type: 'Combined',
				threat_level: extractThreatLevel(data),
				threat_score: extractThreatScore(data),
				scan_time: extractScanTimeSeconds(data),
				html_analysis: extractHtmlAnalysis(data),
				llm_analysis: extractLlmAnalysis(data),
			})
		} catch (persistErr) {
			console.error('Failed to persist combined analysis:', persistErr)
		}

    return NextResponse.json(data)

  } catch (error) {
    console.error('Combined analysis API error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
} 