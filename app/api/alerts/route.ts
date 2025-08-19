import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Alert from '@/lib/models/Alert';

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
		const limit = Math.min(parseInt(searchParams.get('limit') || '50', 10), 200);

		const docs = await Alert.find({ user_email }).sort({ timestamp: -1 }).limit(limit).lean();
		const alerts = docs.map((a) => ({
			_id: a._id.toString(),
			message: a.message,
			severity: a.severity,
			alert_type: a.alert_type,
			timestamp: a.timestamp.toISOString(),
			read: a.read,
		}));

		return NextResponse.json({ success: true, data: alerts, message: 'OK' });
	} catch (error) {
		console.error('Alerts list error:', error);
		return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
	}
} 