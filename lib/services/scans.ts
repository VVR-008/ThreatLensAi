import dbConnect from '@/lib/db';
import ScanResult, { IScanResult } from '@/lib/models/ScanResult';
import UserAnalytics from '@/lib/models/UserAnalytics';
import Alert from '@/lib/models/Alert';

export type SaveScanInput = {
	user_email: string;
	url: string;
	scan_type: 'URL' | 'Screenshot' | 'Combined';
	threat_level: 'Low' | 'Medium' | 'High' | 'Critical';
	threat_score: number;
	scan_time: number;
	html_analysis?: Record<string, any>;
	llm_analysis?: Record<string, any>;
	screenshot_path?: string;
	status?: string;
};

export async function saveScanAndUpdate(input: SaveScanInput) {
	await dbConnect();

	const scanDoc = new ScanResult({
		user_email: input.user_email,
		url: input.url,
		scan_type: input.scan_type,
		threat_level: input.threat_level,
		threat_score: input.threat_score,
		scan_time: input.scan_time,
		html_analysis: input.html_analysis || {},
		llm_analysis: input.llm_analysis || {},
		screenshot_path: input.screenshot_path,
		status: input.status || 'completed',
	});

	const saved = await scanDoc.save();

	const inc: Record<string, number> = { total_scans: 1, [`threat_distribution.${input.threat_level}`]: 1, [`scan_types_distribution.${input.scan_type}`]: 1 };
	if (['Medium', 'High', 'Critical'].includes(input.threat_level)) {
		inc['threats_detected'] = 1;
	}

	await UserAnalytics.updateOne(
		{ user_email: input.user_email },
		{
			$set: { last_scan: saved.timestamp, updated_at: new Date() },
			$inc: inc,
		},
		{ upsert: true }
	);

	if (input.threat_level === 'High' || input.threat_level === 'Critical') {
		await new Alert({
			user_email: input.user_email,
			message: `Threat detected: ${input.threat_level} risk level for ${input.url}`,
			severity: input.threat_level === 'High' ? 'high' : 'critical',
			alert_type: 'threat_detection',
			scan_id: saved._id,
		}).save();
	}

	return saved;
}

export function extractThreatLevel(raw: any): 'Low' | 'Medium' | 'High' | 'Critical' {
	const v = (raw?.data?.threat_level || raw?.threat_level || '').toString().toLowerCase();
	if (v === 'critical') return 'Critical';
	if (v === 'high') return 'High';
	if (v === 'medium') return 'Medium';
	return 'Low';
}

export function extractThreatScore(raw: any): number {
	const n = Number(raw?.data?.threat_score ?? raw?.threat_score ?? 0);
	return Number.isFinite(n) ? n : 0;
}

export function extractScanTimeSeconds(raw: any): number {
	const n = Number(raw?.data?.scan_time_seconds ?? raw?.scan_time_seconds ?? raw?.scan_time ?? 0);
	return Number.isFinite(n) ? n : 0;
}

export function extractHtmlAnalysis(raw: any): Record<string, any> {
	return (raw?.data?.html_analysis ?? raw?.html_analysis ?? {}) || {};
}

export function extractLlmAnalysis(raw: any): Record<string, any> {
	return (raw?.data?.llm_analysis ?? raw?.llm_analysis ?? {}) || {};
} 