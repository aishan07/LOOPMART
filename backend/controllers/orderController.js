import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { sendOrderNotificationEmail, sendOrderConfirmationEmail } from "../utils/sendEmail.js";
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


    // =========================================================
    // GET REAL PRODUCT INFORMATION
    // =========================================================

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


      // Check available stock
      if (quantity > product.stock) {
        return res.status(400).json({
          message: `Only ${product.stock} item(s) available for ${product.title}`,
        });
      }


      const itemTotal =
        Number(product.price) * quantity;


      totalAmount += itemTotal;


      // =======================================================
      // SAVE PRODUCT DETAILS INSIDE ORDER
      // =======================================================

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


    // =========================================================
    // CREATE ORDER
    // =========================================================

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


    // =========================================================
    // UPDATE PRODUCT STOCK
    // =========================================================

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


    // =========================================================
    // SEND EMAILS
    // =========================================================

    sendOrderNotificationEmail(order);

    sendOrderConfirmationEmail(
      order,
      req.user.email
    );


    // =========================================================
    // RESPONSE
    // =========================================================

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