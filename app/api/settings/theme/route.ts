import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import User from '@/lib/models/User'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ success: false, message: 'Authorization header required' }, { status: 401 })
    }
    const user_email = authHeader.replace('Bearer ', '').trim()
    if (!user_email || !user_email.includes('@')) {
      return NextResponse.json({ success: false, message: 'Valid user email required' }, { status: 401 })
    }

    await dbConnect()
    const { theme } = await request.json()
    if (!theme || !['light', 'dark', 'system'].includes(theme)) {
      return NextResponse.json({ success: false, message: 'Invalid theme' }, { status: 400 })
    }

    // Store theme preference on user document (add field if missing)
    const user = await User.findOneAndUpdate(
      { email: user_email },
      { $set: { theme } },
      { new: true }
    )

    if (!user) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
    }

    return NextResponse.json({ success: true, message: 'Theme saved', data: { theme } })
  } catch (error) {
    console.error('Save theme error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}


