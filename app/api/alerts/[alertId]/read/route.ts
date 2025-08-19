import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Alert from '@/lib/models/Alert';
import { Types } from 'mongoose';

export async function POST(request: NextRequest, { params }: { params: { alertId: string } }) {
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
		const alertId = params.alertId;
		if (!Types.ObjectId.isValid(alertId)) {
			return NextResponse.json({ success: false, message: 'Invalid alert id' }, { status: 400 });
		}

		const result = await Alert.updateOne({ _id: new Types.ObjectId(alertId), user_email }, { $set: { read: true } });
		return NextResponse.json({ success: true, data: { modified: result.modifiedCount > 0 }, message: 'OK' });
	} catch (error) {
		console.error('Mark alert read error:', error);
		return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
	}
} 