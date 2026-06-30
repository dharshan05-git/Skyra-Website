import { Router } from 'express';
import ShippingSettings from '../models/ShippingSettings.js';
import SiteSettings from '../models/SiteSettings.js';
import { success } from '../utils/ApiResponse.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();
router.get('/', asyncHandler(async (_req, res) => {
  const [shipping, site] = await Promise.all([
    ShippingSettings.findOne({ key: 'default' }).lean(),
    SiteSettings.findOne({ key: 'default' }).select('-__v').lean(),
  ]);
  return success(res, { shipping: shipping || {}, site: site || {} });
}));
export default router;
