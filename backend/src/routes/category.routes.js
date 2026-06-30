import { Router } from 'express'; import { getCategory, listCategories } from '../controllers/category.controller.js'; import { asyncHandler } from '../utils/asyncHandler.js';
const router = Router(); router.get('/', asyncHandler(listCategories)); router.get('/:slug', asyncHandler(getCategory)); export default router;
