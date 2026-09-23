import Order from "../models/Order.js";
import Product from "../models/Product.js";

import {
  sendOrderNotificationEmail,
  sendOrderConfirmationEmail,
} from "../utils/sendEmail.js";


// ============================================================
// CREATE ORDER
// ============================================================

export const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        message: "No order items",
      });
    }

    let totalAmount = 0;

    const orderItems = [];

    // Get actual product information from MongoDB
    for (const item of items) {

      const product = await Product.findById(item.product);

      if (!product || product.isSold) {
        return res.status(400).json({
          message: `Product unavailable: ${
            item.title || item.product
          }`,
        });
      }

      const quantity = Number(item.quantity || 1);

      if (quantity <= 0) {
        return res.status(400).json({
          message: "Invalid quantity",
        });
      }

      if (quantity > product.stock) {
        return res.status(400).json({
          message: `Only ${product.stock} item(s) available for ${product.title}`,
        });
      }

      const itemTotal =
        Number(product.price) * quantity;

      totalAmount += itemTotal;


      // Save detailed product information
      orderItems.push({
        product: product._id,

        title: product.title,

        description:
          product.description || "",

        category:
          product.category || "",

        condition:
          product.condition || "",

        price:
          product.price,

        image:
          product.images?.[0] || "",

        images:
          product.images || [],

        quantity,

        itemTotal,
      });
    }


    // Create order
    const order = await Order.create({

      user: req.user._id,

      items: orderItems,

      shippingAddress: {
        fullName:
          shippingAddress?.fullName || "",

        phone:
          shippingAddress?.phone || "",

        addressLine:
          shippingAddress?.addressLine ||
          shippingAddress?.address ||
          "",

        city:
          shippingAddress?.city || "",

        pincode:
          shippingAddress?.pincode || "",
      },

      paymentMethod:
        paymentMethod || "COD",

      totalAmount,
    });


    // Update product stock
    for (const item of orderItems) {

      const product =
        await Product.findById(item.product);

      if (product) {

        product.stock -= item.quantity;

        if (product.stock <= 0) {
          product.stock = 0;
          product.isSold = true;
        }

        await product.save();
      }
    }


    // Send emails
    sendOrderNotificationEmail(order);

    sendOrderConfirmationEmail(
      order,
      req.user.email
    );


    res.status(201).json(order);

  } catch (error) {

    console.error(
      "Create order error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// ============================================================
// GET MY ORDERS
// ============================================================

export const getMyOrders = async (req, res) => {
  try {

    const orders = await Order.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.json(orders);

  } catch (error) {

    res.status(500).json({
      message: error.message,
    });
  }
};


// ============================================================
// GET ALL ORDERS — ADMIN
// ============================================================

export const getAllOrders = async (req, res) => {
  try {

    const orders = await Order.find()
      .populate("user", "name email")
      .sort({
        createdAt: -1,
      });

    res.json(orders);

  } catch (error) {

    console.error(
      "Get all orders error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};


// ============================================================
// UPDATE ORDER STATUS — ADMIN
// ============================================================

export const updateOrderStatus = async (req, res) => {
  try {

    const order =
      await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.status =
      req.body.status || order.status;

    const updated =
      await order.save();

    res.json(updated);

  } catch (error) {

    console.error(
      "Update order status error:",
      error
    );

    res.status(500).json({
      message: error.message,
    });
  }
};