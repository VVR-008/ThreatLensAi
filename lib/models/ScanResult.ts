import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IScanResult extends Document {
	user_email: string;
	url: string;
	scan_type: 'URL' | 'Screenshot' | 'Combined';
	threat_level: 'Low' | 'Medium' | 'High' | 'Critical';
	threat_score: number;
	scan_time: number;
	timestamp: Date;
	html_analysis: Record<string, any>;
	llm_analysis: Record<string, any>;
	screenshot_path?: string;
	status: string;
}

const ScanResultSchema = new Schema<IScanResult>({
	user_email: { type: String, required: true, index: true },
	url: { type: String, required: true },
	scan_type: { type: String, enum: ['URL', 'Screenshot', 'Combined'], required: true },
	threat_level: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], required: true, index: true },
	threat_score: { type: Number, required: true },
	scan_time: { type: Number, required: true },
	timestamp: { type: Date, default: Date.now, index: true },
	html_analysis: { type: Schema.Types.Mixed, default: {} },
	llm_analysis: { type: Schema.Types.Mixed, default: {} },
	screenshot_path: { type: String },
	status: { type: String, default: 'completed' },
}, {
	versionKey: false,
	timestamps: false,
});

ScanResultSchema.index({ user_email: 1, timestamp: -1 });
ScanResultSchema.index({ user_email: 1, threat_level: 1 });
ScanResultSchema.index({ timestamp: -1 });

const ScanResult: Model<IScanResult> = mongoose.models.ScanResult || mongoose.model<IScanResult>('ScanResult', ScanResultSchema);
export default ScanResult; 