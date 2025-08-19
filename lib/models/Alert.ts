import mongoose, { Schema, Document, Model, Types } from 'mongoose';

export interface IAlert extends Document {
	user_email: string;
	message: string;
	severity: 'info' | 'high' | 'critical';
	alert_type: string;
	timestamp: Date;
	read: boolean;
	scan_id?: Types.ObjectId;
}

const AlertSchema = new Schema<IAlert>({
	user_email: { type: String, required: true, index: true },
	message: { type: String, required: true },
	severity: { type: String, enum: ['info', 'high', 'critical'], required: true },
	alert_type: { type: String, required: true },
	timestamp: { type: Date, default: Date.now, index: true },
	read: { type: Boolean, default: false },
	scan_id: { type: Schema.Types.ObjectId, ref: 'ScanResult' },
}, {
	versionKey: false,
	timestamps: false,
});

AlertSchema.index({ user_email: 1, timestamp: -1 });
AlertSchema.index({ user_email: 1, read: 1 });

const Alert: Model<IAlert> = mongoose.models.Alert || mongoose.model<IAlert>('Alert', AlertSchema);
export default Alert; 