import mongoose from 'mongoose';

const schema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true, trim: true, unique: true, index: true },
  active: { type: Boolean, default: true },
}, { timestamps: true });

export default mongoose.models.Newsletter || mongoose.model('Newsletter', schema);
