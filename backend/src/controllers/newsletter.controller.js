import Newsletter from '../models/Newsletter.js';
import { success } from '../utils/ApiResponse.js';
export const subscribe = async (req, res) => { const subscriber = await Newsletter.findOneAndUpdate({ email: req.body.email }, { active: true }, { upsert: true, new: true, setDefaultsOnInsert: true }); return success(res, { subscriber }, 'Subscription saved', 201); };
