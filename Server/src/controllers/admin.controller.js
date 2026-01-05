import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/AsyncHandler.js";  

// Get all orders with filters
export const getAllOrders = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 20, sortBy = 'createdAt', order = 'desc' } = req.query;

  const query = {};
  if (status && status !== 'all') {
    query.status = status;
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);
  const sortOrder = order === 'desc' ? -1 : 1;

  const orders = await Order.find(query)
    .populate('user', 'fullName email phone')
    .sort({ [sortBy]: sortOrder })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await Order.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(200, {
      orders,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    }, "Orders fetched successfully")
  );
});

// Get single order details
export const getOrderById = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId)
    .populate('user', 'fullName email phone address');

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return res.status(200).json(
    new ApiResponse(200, order, "Order details fetched successfully")
  );
});

// Update order status
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { orderId } = req.params;
  const { status, adminNotes, estimatedDeliveryDate } = req.body;

  const validStatuses = ['pending', 'confirmed', 'processing', 'completed', 'cancelled'];
  if (status && !validStatuses.includes(status)) {
    throw new ApiError(400, "Invalid status value");
  }

  const updateData = {};
  if (status) updateData.status = status;
  if (adminNotes !== undefined) updateData.adminNotes = adminNotes;
  if (estimatedDeliveryDate) updateData.estimatedDeliveryDate = new Date(estimatedDeliveryDate);

  const order = await Order.findByIdAndUpdate(
    orderId,
    { $set: updateData },
    { new: true, runValidators: true }
  ).populate('user', 'fullName email phone');

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return res.status(200).json(
    new ApiResponse(200, order, "Order updated successfully")
  );
});

// Get all users
export const getAllUsers = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search = '' } = req.query;

  const query = {};
  if (search) {
    query.$or = [
      { fullName: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } }
    ];
  }

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const users = await User.find(query)
    .select('-password -refreshToken')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(parseInt(limit));

  const total = await User.countDocuments(query);

  return res.status(200).json(
    new ApiResponse(200, {
      users,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(total / parseInt(limit))
      }
    }, "Users fetched successfully")
  );
});

// Get user details with order history
export const getUserDetails = asyncHandler(async (req, res) => {
  const { userId } = req.params;

  const user = await User.findById(userId).select('-password -refreshToken');
  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const orders = await Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(10);

  const orderStats = await Order.aggregate([
    { $match: { user: user._id } },
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalSpent: { $sum: '$totalAmount' },
        completedOrders: {
          $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
        }
      }
    }
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      user,
      orders,
      stats: orderStats[0] || { totalOrders: 0, totalSpent: 0, completedOrders: 0 }
    }, "User details fetched successfully")
  );
});

// Get dashboard statistics
export const getDashboardStats = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    totalOrders,
    pendingOrders,
    completedOrders,
    totalRevenue,
    todayOrders,
    totalUsers,
    recentOrders
  ] = await Promise.all([
    Order.countDocuments(),
    Order.countDocuments({ status: 'pending' }),
    Order.countDocuments({ status: 'completed' }),
    Order.aggregate([
      { $match: { status: 'completed' } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]),
    Order.countDocuments({ createdAt: { $gte: today } }),
    User.countDocuments(),
    Order.find()
      .populate('user', 'fullName email')
      .sort({ createdAt: -1 })
      .limit(5)
  ]);

  const statusDistribution = await Order.aggregate([
    {
      $group: {
        _id: '$status',
        count: { $sum: 1 }
      }
    }
  ]);

  return res.status(200).json(
    new ApiResponse(200, {
      totalOrders,
      pendingOrders,
      completedOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      todayOrders,
      totalUsers,
      statusDistribution,
      recentOrders
    }, "Dashboard stats fetched successfully")
  );
});

// Delete order (admin only)
export const deleteOrder = asyncHandler(async (req, res) => {
  const { orderId } = req.params;

  const order = await Order.findByIdAndDelete(orderId);

  if (!order) {
    throw new ApiError(404, "Order not found");
  }

  return res.status(200).json(
    new ApiResponse(200, {}, "Order deleted successfully")
  );
});
