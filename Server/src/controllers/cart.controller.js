import { Cart } from "../models/cart.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { ApiError } from "../utils/ApiError.js";

const cartController = {
    // Get user's cart
    getCart: async (req, res) => {
        try {
            const userId = req.user._id;
            
            let cart = await Cart.findOne({ user: userId }).populate('user', 'name email phone');
            
            if (!cart) {
                // Create empty cart if doesn't exist
                cart = new Cart({
                    user: userId,
                    items: [],
                    totalAmount: 0,
                    totalItems: 0
                });
                await cart.save();
            }
            
            res.status(200).json(
                new ApiResponse(200, cart, "Cart retrieved successfully")
            );
        } catch (error) {
            console.error('Error getting cart:', error);
            res.status(500).json(
                new ApiError(500, "Failed to retrieve cart")
            );
        }
    },

    // Add item to cart
    addToCart: async (req, res) => {
        try {
            const userId = req.user._id;
            const { itemId, name, type, price, quantity = 1, image, category } = req.body;

            // Validation
            // NOTE: price can be 0 for services (to be discussed), so don't treat 0 as missing.
            if (!itemId || !name || !type || price === undefined || price === null) {
                return res.status(400).json(
                    new ApiError(400, "Missing required fields: itemId, name, type, price")
                );
            }

            if (!['plant', 'service'].includes(type)) {
                return res.status(400).json(
                    new ApiError(400, "Type must be either 'plant' or 'service'")
                );
            }

            let cart = await Cart.findOne({ user: userId });
            
            if (!cart) {
                cart = new Cart({
                    user: userId,
                    items: [],
                    totalAmount: 0,
                    totalItems: 0
                });
            }

            // Check if item already exists in cart
            const existingItemIndex = cart.items.findIndex(
                item => item.itemId === itemId && item.type === type
            );

            if (existingItemIndex > -1) {
                // Update quantity if item exists
                cart.items[existingItemIndex].quantity += quantity;
            } else {
                // Add new item
                cart.items.push({
                    itemId,
                    name,
                    type,
                    price,
                    quantity,
                    image,
                    category
                });
            }

            await cart.save();
            
            res.status(200).json(
                new ApiResponse(200, cart, "Item added to cart successfully")
            );
        } catch (error) {
            console.error('Error adding to cart:', error);
            res.status(500).json(
                new ApiError(500, "Failed to add item to cart")
            );
        }
    },

    // Update item quantity in cart
    updateQuantity: async (req, res) => {
        try {
            const userId = req.user._id;
            const { itemId, type, quantity } = req.body;

            if (!itemId || !type || quantity < 0) {
                return res.status(400).json(
                    new ApiError(400, "Missing required fields or invalid quantity")
                );
            }

            const cart = await Cart.findOne({ user: userId });
            
            if (!cart) {
                return res.status(404).json(
                    new ApiError(404, "Cart not found")
                );
            }

            const itemIndex = cart.items.findIndex(
                item => item.itemId === itemId && item.type === type
            );

            if (itemIndex === -1) {
                return res.status(404).json(
                    new ApiError(404, "Item not found in cart")
                );
            }

            if (quantity === 0) {
                // Remove item if quantity is 0
                cart.items.splice(itemIndex, 1);
            } else {
                // Update quantity
                cart.items[itemIndex].quantity = quantity;
            }

            await cart.save();
            
            res.status(200).json(
                new ApiResponse(200, cart, "Cart updated successfully")
            );
        } catch (error) {
            console.error('Error updating cart:', error);
            res.status(500).json(
                new ApiError(500, "Failed to update cart")
            );
        }
    },

    // Remove item from cart
    removeFromCart: async (req, res) => {
        try {
            const userId = req.user._id;
            const { itemId, type } = req.body;

            if (!itemId || !type) {
                return res.status(400).json(
                    new ApiError(400, "Missing required fields: itemId, type")
                );
            }

            const cart = await Cart.findOne({ user: userId });
            
            if (!cart) {
                return res.status(404).json(
                    new ApiError(404, "Cart not found")
                );
            }

            const itemIndex = cart.items.findIndex(
                item => item.itemId === itemId && item.type === type
            );

            if (itemIndex === -1) {
                return res.status(404).json(
                    new ApiError(404, "Item not found in cart")
                );
            }

            cart.items.splice(itemIndex, 1);
            await cart.save();
            
            res.status(200).json(
                new ApiResponse(200, cart, "Item removed from cart successfully")
            );
        } catch (error) {
            console.error('Error removing from cart:', error);
            res.status(500).json(
                new ApiError(500, "Failed to remove item from cart")
            );
        }
    },

    // Clear entire cart
    clearCart: async (req, res) => {
        try {
            const userId = req.user._id;
            
            const cart = await Cart.findOne({ user: userId });
            
            if (!cart) {
                return res.status(404).json(
                    new ApiError(404, "Cart not found")
                );
            }

            cart.items = [];
            cart.totalAmount = 0;
            cart.totalItems = 0;
            
            await cart.save();
            
            res.status(200).json(
                new ApiResponse(200, cart, "Cart cleared successfully")
            );
        } catch (error) {
            console.error('Error clearing cart:', error);
            res.status(500).json(
                new ApiError(500, "Failed to clear cart")
            );
        }
    }
};

export default cartController;
