const nodemailer = require("nodemailer");

const sendOrderConfirmationEmail = async (userEmail, order) => {
  try {
    // Configure the transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL, // Your email
        pass: process.env.EMAIL_PASSWORD, // Your email password (or use App Passwords)
      },
    });

    // Format order details into HTML
    const orderItems = order.itemsOrdered
      .map(
        (item) => `
      <li>
        <strong>${item.productId.name}</strong> - ₹${item.price} x ${item.quantity}
      </li>`
      )
      .join("");

    const mailOptions = {
      from: `"Apni Dukaan" <${process.env.EMAIL}>`,
      to: userEmail,
      subject: `Order Confirmation - ${order.orderId}`,
      html: `
        <h2>Thank you for your order!</h2>
        <p>Your order <strong>${order.orderId}</strong> has been placed successfully.</p>
        <h3>Order Details:</h3>
        <ul>${orderItems}</ul>
        <p><strong>Total Amount:</strong> ₹${order.itemsOrdered.reduce(
        (acc, item) => acc + item.price * item.quantity, 0)}</p>
        <p>We will notify you when your order is shipped.</p>
        <p>Best regards,<br>Apni Dukaan Team</p>
      `,
    };

    // Send email
    await transporter.sendMail(mailOptions);
    console.log("Order confirmation email sent successfully.");
  } catch (error) {
    console.error("Error sending email:", error);
    throw new Error("Error sending email");
  }
}; 0

module.exports = sendOrderConfirmationEmail;
