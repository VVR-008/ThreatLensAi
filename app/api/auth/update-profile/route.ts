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

    const { firstName, lastName, company } = await request.json()
    await dbConnect()
    const updated = await User.findOneAndUpdate(
      { email: user_email },
      { $set: { firstName, lastName, company } },
      { new: true }
    )
    if (!updated) {
      return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
    }
    return NextResponse.json({ success: true, message: 'Profile updated', data: { firstName: updated.firstName, lastName: updated.lastName, company: updated.company } })
  } catch (error) {
    console.error('Update profile error:', error)
    return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 })
  }
}


