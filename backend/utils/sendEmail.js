import nodemailer from "nodemailer";

// created lazily (not at import time) so it always picks up the
// already-loaded environment variables, no matter the import order
const getTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

export const sendOrderNotificationEmail = async (order) => {
  try {
    const itemsList = order.items
      .map((item) => `- ${item.title} x${item.quantity} — ₹${item.price}`)
      .join("\n");

    const mailOptions = {
      from: `"LOOPMART" <${process.env.EMAIL_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New Order Received — ₹${order.totalAmount}`,
      text: `You have a new order!

Order ID: ${order._id}
Total: ₹${order.totalAmount}
Payment: ${order.paymentMethod}

Items:
${itemsList}

Shipping to:
${order.shippingAddress.fullName}
${order.shippingAddress.addressLine}
${order.shippingAddress.city} - ${order.shippingAddress.pincode}
Phone: ${order.shippingAddress.phone}

Log in to your admin dashboard to confirm and process this order.`,
    };

    await getTransporter().sendMail(mailOptions);
    console.log("Order notification email sent");
  } catch (error) {
    console.error("Failed to send order notification email:", error.message);
  }
};

export const sendOrderConfirmationEmail = async (order, customerEmail) => {
  try {
    const itemsList = order.items
      .map((item) => `- ${item.title} x${item.quantity} — ₹${item.price}`)
      .join("\n");

    const mailOptions = {
      from: `"LOOPMART" <${process.env.EMAIL_USER}>`,
      to: customerEmail,
      subject: `Your LOOPMART order is confirmed`,
      text: `Thanks for your order!

Order ID: ${order._id}
Total: ₹${order.totalAmount}
Payment: ${order.paymentMethod}

Items:
${itemsList}

We'll be in touch about delivery soon.

— LOOPMART`,
    };

    await getTransporter().sendMail(mailOptions);
    console.log("Customer confirmation email sent");
  } catch (error) {
    console.error("Failed to send customer confirmation email:", error.message);
  }
};