import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import ScanResult from '@/lib/models/ScanResult';
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

		const now = new Date();
		const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), 0, 0, 0));
		const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

		const scans_today = await ScanResult.countDocuments({ user_email, timestamp: { $gte: today, $lt: tomorrow } });
		const threats_detected = await ScanResult.countDocuments({ user_email, threat_level: { $in: ['Medium', 'High', 'Critical'] } });

		const recent_scans_docs = await ScanResult.find({ user_email }).sort({ timestamp: -1 }).limit(10).lean();
		const recent_scans = recent_scans_docs.map((s) => ({
			_id: s._id.toString(),
			url: s.url,
			scan_type: s.scan_type,
			threat_level: s.threat_level,
			threat_score: s.threat_score,
			scan_time: s.scan_time,
			timestamp: s.timestamp.toISOString(),
			status: s.status,
		}));

		const recent_alerts_docs = await Alert.find({ user_email }).sort({ timestamp: -1 }).limit(5).lean();
		const recent_alerts = recent_alerts_docs.map((a) => ({
			_id: a._id.toString(),
			message: a.message,
			severity: a.severity,
			alert_type: a.alert_type,
			timestamp: a.timestamp.toISOString(),
			read: a.read,
		}));

		const threatAgg = await ScanResult.aggregate([
			{ $match: { user_email } },
			{ $group: { _id: '$threat_level', count: { $sum: 1 } } },
		]);
		const threat_distribution: Record<string, number> = {};
		for (const t of threatAgg) threat_distribution[t._id] = t.count;

		const scanTypeAgg = await ScanResult.aggregate([
			{ $match: { user_email } },
			{ $group: { _id: '$scan_type', count: { $sum: 1 } } },
		]);
		const scan_types_distribution: Record<string, number> = {};
		for (const t of scanTypeAgg) scan_types_distribution[t._id] = t.count;

		const recent_scores = await ScanResult.find({ user_email }).sort({ timestamp: -1 }).limit(10).select('threat_score').lean();
		let current_threat_score = 0;
		if (recent_scores.length > 0) {
			const sum = recent_scores.reduce((acc, s) => acc + (s as any).threat_score, 0);
			current_threat_score = Math.floor(sum / recent_scores.length);
		}

		const total_scans = await ScanResult.countDocuments({ user_email });
		let risk_reduction = 0.0;
		if (total_scans > 0) {
			risk_reduction = Math.min(95.0, (threats_detected / total_scans) * 100);
			risk_reduction = Math.round(risk_reduction * 10) / 10;
		}

		return NextResponse.json({
			success: true,
			data: {
				user_email,
				scans_today,
				threats_detected,
				risk_reduction,
				current_threat_score,
				recent_scans,
				recent_alerts,
				threat_distribution,
				scan_types_distribution,
			},
			message: 'OK',
		});
	} catch (error) {
		console.error('Dashboard stats error:', error);
		return NextResponse.json({ success: false, message: 'Internal server error' }, { status: 500 });
	}
} 