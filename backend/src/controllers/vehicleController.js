import Vehicle from '../models/Vehicle.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import ApiFeatures from '../utils/apiFeatures.js';
import asyncHandler from '../middleware/asyncHandler.js';
import { uploadMultipleToCloudinary, deleteFromCloudinary } from '../services/uploadService.js';
import { UPLOAD } from '../constants/index.js';

/**
 * @desc    Get all vehicles (public, with filters)
 * @route   GET /api/vehicles
 * @access  Public
 */
export const getVehicles = asyncHandler(async (req, res) => {
  const baseFilter = { isActive: true, status: 'approved' };

  // Build filter from query params
  const filter = { ...baseFilter };
  if (req.query.brand) filter.brand = new RegExp(req.query.brand, 'i');
  if (req.query.category) filter.category = req.query.category;
  if (req.query.transmission) filter.transmission = req.query.transmission;
  if (req.query.fuelType) filter.fuelType = req.query.fuelType;
  if (req.query.city) filter['location.city'] = new RegExp(req.query.city, 'i');
  if (req.query.minPrice || req.query.maxPrice) {
    filter.pricePerDay = {};
    if (req.query.minPrice) filter.pricePerDay.$gte = Number(req.query.minPrice);
    if (req.query.maxPrice) filter.pricePerDay.$lte = Number(req.query.maxPrice);
  }
  if (req.query.seats) filter.seats = { $gte: Number(req.query.seats) };

  const totalCount = await Vehicle.countDocuments(filter);

  const features = new ApiFeatures(Vehicle.find(filter), req.query)
    .search(['name', 'brand', 'model', 'description'])
    .sort()
    .selectFields()
    .paginate();

  features.totalCount = totalCount;

  const vehicles = await features.query.populate('vendor', 'name avatar');

  ApiResponse.paginated(res, vehicles, features.getPagination());
});

/**
 * @desc    Get single vehicle
 * @route   GET /api/vehicles/:id
 * @access  Public
 */
export const getVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findOne({
    _id: req.params.id,
    isActive: true,
  })
    .populate('vendor', 'name avatar phone')
    .populate({
      path: 'reviews',
      match: { isActive: true },
      populate: { path: 'user', select: 'name avatar' },
      options: { sort: { createdAt: -1 }, limit: 10 },
    });

  if (!vehicle) {
    throw ApiError.notFound('Vehicle not found');
  }

  ApiResponse.success(res, { vehicle });
});

/**
 * @desc    Get featured vehicles
 * @route   GET /api/vehicles/featured
 * @access  Public
 */
export const getFeaturedVehicles = asyncHandler(async (req, res) => {
  const vehicles = await Vehicle.find({
    isActive: true,
    status: 'approved',
  })
    .sort('-rating.average -createdAt')
    .limit(8)
    .populate('vendor', 'name avatar');

  ApiResponse.success(res, { vehicles });
});

/**
 * @desc    Get vendor's vehicles
 * @route   GET /api/vehicles/vendor
 * @access  Vendor
 */
export const getVendorVehicles = asyncHandler(async (req, res) => {
  const filter = { vendor: req.user._id, isActive: true };
  if (req.query.status) filter.status = req.query.status;

  const totalCount = await Vehicle.countDocuments(filter);

  const features = new ApiFeatures(Vehicle.find(filter), req.query)
    .sort('-createdAt')
    .paginate();
  
  features.totalCount = totalCount;

  const vehicles = await features.query;

  ApiResponse.paginated(res, vehicles, features.getPagination());
});

/**
 * @desc    Create vehicle (vendor)
 * @route   POST /api/vehicles
 * @access  Vendor
 */
export const createVehicle = asyncHandler(async (req, res) => {
  req.body.vendor = req.user._id;

  const vehicle = await Vehicle.create(req.body);

  ApiResponse.created(res, { vehicle }, 'Vehicle created and submitted for approval');
});

/**
 * @desc    Update vehicle (vendor — owner only)
 * @route   PUT /api/vehicles/:id
 * @access  Vendor
 */
export const updateVehicle = asyncHandler(async (req, res) => {
  let vehicle = await Vehicle.findById(req.params.id);

  if (!vehicle) {
    throw ApiError.notFound('Vehicle not found');
  }

  if (vehicle.vendor.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('You can only update your own vehicles');
  }

  vehicle = await Vehicle.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  ApiResponse.success(res, { vehicle }, 'Vehicle updated successfully');
});

/**
 * @desc    Delete vehicle (soft delete)
 * @route   DELETE /api/vehicles/:id
 * @access  Vendor
 */
export const deleteVehicle = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);

  if (!vehicle) {
    throw ApiError.notFound('Vehicle not found');
  }

  if (vehicle.vendor.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('You can only delete your own vehicles');
  }

  vehicle.isActive = false;
  await vehicle.save();

  ApiResponse.success(res, null, 'Vehicle deleted successfully');
});

/**
 * @desc    Upload vehicle images
 * @route   POST /api/vehicles/:id/images
 * @access  Vendor
 */
export const uploadImages = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);

  if (!vehicle) {
    throw ApiError.notFound('Vehicle not found');
  }

  if (vehicle.vendor.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('You can only upload images to your own vehicles');
  }

  if (!req.files || req.files.length === 0) {
    throw ApiError.badRequest('Please upload at least one image');
  }

  if (vehicle.images.length + req.files.length > UPLOAD.MAX_FILES) {
    throw ApiError.badRequest(`Maximum ${UPLOAD.MAX_FILES} images allowed per vehicle`);
  }

  const uploadedImages = await uploadMultipleToCloudinary(
    req.files,
    UPLOAD.FOLDERS.VEHICLES
  );

  vehicle.images.push(...uploadedImages);
  await vehicle.save();

  ApiResponse.success(res, { images: vehicle.images }, 'Images uploaded successfully');
});

/**
 * @desc    Delete vehicle image
 * @route   DELETE /api/vehicles/:id/images/:imageId
 * @access  Vendor
 */
export const deleteImage = asyncHandler(async (req, res) => {
  const vehicle = await Vehicle.findById(req.params.id);

  if (!vehicle) {
    throw ApiError.notFound('Vehicle not found');
  }

  if (vehicle.vendor.toString() !== req.user._id.toString()) {
    throw ApiError.forbidden('You can only delete images from your own vehicles');
  }

  const image = vehicle.images.id(req.params.imageId);

  if (!image) {
    throw ApiError.notFound('Image not found');
  }

  await deleteFromCloudinary(image.publicId);
  image.deleteOne();
  await vehicle.save();

  ApiResponse.success(res, { images: vehicle.images }, 'Image deleted successfully');
});
