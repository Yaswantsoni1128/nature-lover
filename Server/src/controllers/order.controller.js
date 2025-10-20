import { Order } from "../models/order.model.js";
import { Cart } from "../models/cart.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const orderController = {
    // Create new order
    createOrder: async (req, res) => {
        try {
            const userId = req.user._id;
            const { deliveryAddress, contactInfo, notes } = req.body;

            // Get user's cart
            const cart = await Cart.findOne({ user: userId });
            
            if (!cart || cart.items.length === 0) {
                return res.status(400).json(
                    new ApiError(400, "Cart is empty")
                );
            }

            // Create order with confirmed status
            const order = new Order({
                user: userId,
                items: cart.items,
                totalAmount: cart.totalAmount,
                totalItems: cart.totalItems,
                status: 'confirmed', // Set as confirmed by default
                deliveryAddress: deliveryAddress || {},
                contactInfo: contactInfo || {},
                notes: notes || ""
            });

            await order.save();

            // Clear cart after creating order
            cart.items = [];
            cart.totalAmount = 0;
            cart.totalItems = 0;
            await cart.save();

            // Populate user details
            await order.populate('user', 'name email phone');

            res.status(201).json(
                new ApiResponse(201, order, "Order created successfully")
            );
        } catch (error) {
            console.error('Error creating order:', error);
            res.status(500).json(
                new ApiError(500, "Failed to create order")
            );
        }
    },

    // Get user's orders
    getUserOrders: async (req, res) => {
        try {
            const userId = req.user._id;
            const { page = 1, limit = 10, status } = req.query;

            const query = { user: userId };
            if (status) {
                query.status = status;
            }

            const orders = await Order.find(query)
                .populate('user', 'name email phone')
                .sort({ createdAt: -1 })
                .limit(limit * 1)
                .skip((page - 1) * limit);

            const total = await Order.countDocuments(query);

            res.status(200).json(
                new ApiResponse(200, {
                    orders,
                    pagination: {
                        currentPage: parseInt(page),
                        totalPages: Math.ceil(total / limit),
                        totalOrders: total,
                        hasNext: page < Math.ceil(total / limit),
                        hasPrev: page > 1
                    }
                }, "Orders retrieved successfully")
            );
        } catch (error) {
            console.error('Error getting orders:', error);
            res.status(500).json(
                new ApiError(500, "Failed to retrieve orders")
            );
        }
    },

    // Get single order by ID
    getOrderById: async (req, res) => {
        try {
            const { orderId } = req.params;
            const userId = req.user._id;

            const order = await Order.findOne({ _id: orderId, user: userId })
                .populate('user', 'name email phone');

            if (!order) {
                return res.status(404).json(
                    new ApiError(404, "Order not found")
                );
            }

            res.status(200).json(
                new ApiResponse(200, order, "Order retrieved successfully")
            );
        } catch (error) {
            console.error('Error getting order:', error);
            res.status(500).json(
                new ApiError(500, "Failed to retrieve order")
            );
        }
    },

    // Update order status
    updateOrderStatus: async (req, res) => {
        try {
            const { orderId } = req.params;
            const { status } = req.body;
            const userId = req.user._id;

            if (!['pending', 'confirmed', 'processing', 'completed', 'cancelled'].includes(status)) {
                return res.status(400).json(
                    new ApiError(400, "Invalid status")
                );
            }

            const order = await Order.findOneAndUpdate(
                { _id: orderId, user: userId },
                { status },
                { new: true }
            ).populate('user', 'name email phone');

            if (!order) {
                return res.status(404).json(
                    new ApiError(404, "Order not found")
                );
            }

            res.status(200).json(
                new ApiResponse(200, order, "Order status updated successfully")
            );
        } catch (error) {
            console.error('Error updating order status:', error);
            res.status(500).json(
                new ApiError(500, "Failed to update order status")
            );
        }
    },

    // Cancel order
    cancelOrder: async (req, res) => {
        try {
            const { orderId } = req.params;
            const userId = req.user._id;

            const order = await Order.findOne({ _id: orderId, user: userId });

            if (!order) {
                return res.status(404).json(
                    new ApiError(404, "Order not found")
                );
            }

            if (order.status === 'completed') {
                return res.status(400).json(
                    new ApiError(400, "Cannot cancel completed order")
                );
            }

            order.status = 'cancelled';
            await order.save();

            res.status(200).json(
                new ApiResponse(200, order, "Order cancelled successfully")
            );
        } catch (error) {
            console.error('Error cancelling order:', error);
            res.status(500).json(
                new ApiError(500, "Failed to cancel order")
            );
        }
    },

    // Get order statistics
    getOrderStats: async (req, res) => {
        try {
            const userId = req.user._id;

            const stats = await Order.aggregate([
                { $match: { user: userId } },
                {
                    $group: {
                        _id: null,
                        totalOrders: { $sum: 1 },
                        totalAmount: { $sum: '$totalAmount' },
                        totalItems: { $sum: '$totalItems' },
                        confirmedOrders: {
                            $sum: { $cond: [{ $eq: ['$status', 'confirmed'] }, 1, 0] }
                        },
                        completedOrders: {
                            $sum: { $cond: [{ $eq: ['$status', 'completed'] }, 1, 0] }
                        }
                    }
                }
            ]);

            const result = stats[0] || {
                totalOrders: 0,
                totalAmount: 0,
                totalItems: 0,
                confirmedOrders: 0,
                completedOrders: 0
            };

            res.status(200).json(
                new ApiResponse(200, result, "Order statistics retrieved successfully")
            );
        } catch (error) {
            console.error('Error getting order stats:', error);
            res.status(500).json(
                new ApiError(500, "Failed to retrieve order statistics")
            );
        }
    }
};

export default orderController;
