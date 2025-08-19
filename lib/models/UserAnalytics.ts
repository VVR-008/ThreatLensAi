import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUserAnalytics extends Document {
	user_email: string;
	total_scans: number;
	threats_detected: number;
	risk_reduction: number;
	last_scan?: Date;
	threat_distribution: Record<string, number>;
	scan_types_distribution: Record<string, number>;
	updated_at: Date;
}

const UserAnalyticsSchema = new Schema<IUserAnalytics>({
	user_email: { type: String, required: true, unique: true, index: true },
	total_scans: { type: Number, default: 0 },
	threats_detected: { type: Number, default: 0 },
	risk_reduction: { type: Number, default: 0.0 },
	last_scan: { type: Date },
	threat_distribution: { type: Schema.Types.Mixed, default: {} },
	scan_types_distribution: { type: Schema.Types.Mixed, default: {} },
	updated_at: { type: Date, default: Date.now },
}, {
	versionKey: false,
	timestamps: false,
});

UserAnalyticsSchema.index({ user_email: 1 });

const UserAnalytics: Model<IUserAnalytics> = mongoose.models.UserAnalytics || mongoose.model<IUserAnalytics>('UserAnalytics', UserAnalyticsSchema);
export default UserAnalytics; 