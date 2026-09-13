import MasterData from '../models/MasterData.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../middleware/asyncHandler.js';

/**
 * @desc    Get master data by category
 * @route   GET /api/master-data/:category
 * @access  Public
 */
export const getByCategory = asyncHandler(async (req, res) => {
  const data = await MasterData.find({
    category: req.params.category,
    isActive: true,
  }).sort('sortOrder');

  ApiResponse.success(res, { data });
});

/**
 * @desc    Create master data
 * @route   POST /api/master-data
 * @access  Admin
 */
export const createMasterData = asyncHandler(async (req, res) => {
  const data = await MasterData.create(req.body);
  ApiResponse.created(res, { data });
});

/**
 * @desc    Update master data
 * @route   PUT /api/master-data/:id
 * @access  Admin
 */
export const updateMasterData = asyncHandler(async (req, res) => {
  const data = await MasterData.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!data) {
    throw ApiError.notFound('Master data not found');
  }

  ApiResponse.success(res, { data }, 'Updated successfully');
});

/**
 * @desc    Delete master data
 * @route   DELETE /api/master-data/:id
 * @access  Admin
 */
export const deleteMasterData = asyncHandler(async (req, res) => {
  const data = await MasterData.findByIdAndDelete(req.params.id);

  if (!data) {
    throw ApiError.notFound('Master data not found');
  }

  ApiResponse.success(res, null, 'Deleted successfully');
});
