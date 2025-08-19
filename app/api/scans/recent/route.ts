import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ScanResult from '@/lib/models/ScanResult';

export async function GET(request: NextRequest) {
	try {
		const authHeader = request.headers.get('authorization');
		if (!authHeader) {
			return NextResponse.json({ success: false, message: 'Authorization header required' }, { status: 401 });
		}
		const user_email = authHeader.replace('Bearer ', '').trim();
		if (!user_email || !user_email.includes('@')) {
			return NextResponse.json({ success: false, message: 'Valid user email required' }, { status: 401 });
		}

		await dbConnect();
		const { searchParams } = new URL(request.url);
		const limit = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100);

		const docs = await ScanResult.find({ user_email }).sort({ timestamp: -1 }).limit(limit).lean();
		const scans = docs.map((s) => ({
			_id: s._id.toString(),
			url: s.url,
			scan_type: s.scan_type,
			threat_level: s.threat_level,
			threat_score: s.threat_score,
			scan_time: s.scan_time,
			timestamp: s.timestamp.toISOString(),
			status: s.status,
		}));

		return NextResponse.json({ success: true, data: scans, message: 'OK' });
	} catch (error) {
		console.error('Recent scans error:', error);
		return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
	}
} 