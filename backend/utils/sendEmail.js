import nodemailer from "nodemailer";

// Create transporter lazily so environment variables
// are loaded before Gmail configuration is created.
const getTransporter = () =>
  nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });


// ============================================================
// FORMAT PRODUCT DETAILS
// ============================================================

const formatProductDetails = (items) => {
  return items
    .map((item, index) => {
      const quantity = Number(item.quantity || 1);
      const price = Number(item.price || 0);
      const itemTotal = price * quantity;

      return `
--------------------------------------------------
PRODUCT ${index + 1}
--------------------------------------------------

Product Name : ${item.title || "N/A"}
Category     : ${item.category || "N/A"}
Condition    : ${item.condition || "N/A"}
Quantity     : ${quantity}
Unit Price   : ₹${price}
Item Total   : ₹${itemTotal}

Description  :
${item.description || "No description available."}
`;
    })
    .join("\n");
};


// ============================================================
// ADMIN ORDER NOTIFICATION
// ============================================================

export const sendOrderNotificationEmail = async (order) => {
  try {
    const itemsDetails = formatProductDetails(order.items);

    const shipping = order.shippingAddress || {};

    const mailOptions = {
      from: `"LOOPMART" <${process.env.EMAIL_USER}>`,

      to: process.env.ADMIN_EMAIL,

      subject: `New LOOPMART Order — ₹${order.totalAmount}`,

      text: `
==================================================
              LOOPMART
           NEW ORDER RECEIVED
==================================================

A new order has been placed on LoopMart.

ORDER INFORMATION
--------------------------------------------------

Order ID      : ${order._id}
Order Date    : ${new Date(order.createdAt || Date.now()).toLocaleString("en-IN")}
Payment       : ${order.paymentMethod || "Cash on Delivery"}
Order Total   : ₹${order.totalAmount}

==================================================
              PRODUCT DETAILS
==================================================

${itemsDetails}

==================================================
              CUSTOMER DETAILS
==================================================

Name          : ${shipping.fullName || "N/A"}
Phone         : ${shipping.phone || "N/A"}

==================================================
              DELIVERY ADDRESS
==================================================

${shipping.addressLine || shipping.address || "N/A"}
${shipping.city || "N/A"} - ${shipping.pincode || "N/A"}

==================================================
              ORDER SUMMARY
==================================================

Total Items   : ${order.items?.length || 0}
Total Amount  : ₹${order.totalAmount}
Payment       : ${order.paymentMethod || "Cash on Delivery"}

==================================================

Please log in to the LoopMart Admin Dashboard
to review, confirm and process this order.

              — LOOPMART
==================================================
`,
    };

    await getTransporter().sendMail(mailOptions);

    console.log("Order notification email sent successfully");

  } catch (error) {
    console.error(
      "Failed to send order notification email:",
      error.message
    );
  }
};


// ============================================================
// CUSTOMER ORDER CONFIRMATION
// ============================================================

export const sendOrderConfirmationEmail = async (
  order,
  customerEmail
) => {
  try {
    const itemsDetails = formatProductDetails(order.items);

    const mailOptions = {
      from: `"LOOPMART" <${process.env.EMAIL_USER}>`,

      to: customerEmail,

      subject: `LOOPMART Order Confirmed — ₹${order.totalAmount}`,

      text: `
==================================================
              LOOPMART
           ORDER CONFIRMED
==================================================

Thank you for shopping with LoopMart!

Your order has been successfully received.

ORDER INFORMATION
--------------------------------------------------

Order ID      : ${order._id}
Order Date    : ${new Date(order.createdAt || Date.now()).toLocaleString("en-IN")}
Payment       : ${order.paymentMethod || "Cash on Delivery"}
Total Amount  : ₹${order.totalAmount}

==================================================
              YOUR PRODUCTS
==================================================

${itemsDetails}

==================================================
              DELIVERY DETAILS
==================================================

Name          : ${order.shippingAddress?.fullName || "N/A"}
Phone         : ${order.shippingAddress?.phone || "N/A"}

Address       :
${order.shippingAddress?.addressLine ||
  order.shippingAddress?.address ||
  "N/A"}

${order.shippingAddress?.city || "N/A"} -
${order.shippingAddress?.pincode || "N/A"}

==================================================

We'll be in touch with you about delivery soon.

Thank you for giving a product another beginning.

              — LOOPMART
==================================================
`,
    };

    await getTransporter().sendMail(mailOptions);

    console.log(
      "Customer confirmation email sent successfully"
    );

  } catch (error) {
    console.error(
      "Failed to send customer confirmation email:",
      error.message
    );
  }
};