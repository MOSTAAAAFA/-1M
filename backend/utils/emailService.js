const nodemailer = require('nodemailer');
const logger = require('./logger');

// Create transporter
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    logger.error('Email service error:', error);
  } else {
    logger.info('Email service ready');
  }
});

// Send email function
const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: `"1M Motors" <${process.env.EMAIL_FROM || process.env.EMAIL_USER}>`,
      to: options.to,
      subject: options.subject,
      html: options.html
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info(`Email sent: ${info.messageId}`);
    return info;
  } catch (error) {
    logger.error('Email send error:', error);
    throw error;
  }
};

// Email templates
const templates = {
  orderConfirmation: (order, user) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #C9A84C 0%, #E0C06A 100%); color: #000; padding: 32px; text-align: center; }
        .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
        .content { padding: 32px; }
        .order-details { background: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0; }
        .item { display: flex; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid #eee; }
        .total { font-size: 20px; font-weight: 700; color: #C9A84C; margin-top: 16px; }
        .footer { background: #111; color: #888; text-align: center; padding: 24px; font-size: 12px; }
        .btn { display: inline-block; background: #C9A84C; color: #000; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 700; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>🎉 Order Confirmed!</h1>
          <p>Thank you for your purchase</p>
        </div>
        <div class="content">
          <p>Dear ${user.name},</p>
          <p>Your order has been confirmed and is being processed. We'll notify you when it ships.</p>

          <div class="order-details">
            <h3>Order Details</h3>
            ${order.items.map(item => `
              <div class="item">
                <span>${item.make} ${item.model}</span>
                <span>$${item.price.toLocaleString()}</span>
              </div>
            `).join('')}
            <div class="total">Total: $${order.total.toLocaleString()}</div>
          </div>

          <p>Order ID: <strong>${order._id}</strong></p>
          <p>Order Date: <strong>${new Date(order.createdAt).toLocaleDateString()}</strong></p>

          <a href="${process.env.FRONTEND_URL}/orders/${order._id}" class="btn">View Order Details</a>
        </div>
        <div class="footer">
          <p>1M Motors - Luxury · Performance · Excellence</p>
          <p>If you have any questions, contact us at support@1mmotors.com</p>
        </div>
      </div>
    </body>
    </html>
  `,

  welcomeEmail: (user) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #C9A84C 0%, #E0C06A 100%); color: #000; padding: 40px; text-align: center; }
        .header h1 { margin: 0; font-size: 32px; font-weight: 700; }
        .content { padding: 40px; }
        .footer { background: #111; color: #888; text-align: center; padding: 24px; font-size: 12px; }
        .btn { display: inline-block; background: #C9A84C; color: #000; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 700; margin: 20px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welcome to 1M Motors!</h1>
        </div>
        <div class="content">
          <p>Dear ${user.name},</p>
          <p>Thank you for joining 1M Motors - where luxury meets performance.</p>
          <p>Explore our exclusive collection of premium vehicles and experience automotive excellence like never before.</p>
          <a href="${process.env.FRONTEND_URL}/cars" class="btn">Explore Collection</a>
        </div>
        <div class="footer">
          <p>1M Motors - Luxury · Performance · Excellence</p>
        </div>
      </div>
    </body>
    </html>
  `,

  passwordReset: (user, resetUrl) => `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: 'Segoe UI', sans-serif; background: #f4f4f4; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: #fff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 16px rgba(0,0,0,0.1); }
        .header { background: #111; color: #fff; padding: 32px; text-align: center; }
        .content { padding: 32px; }
        .btn { display: inline-block; background: #C9A84C; color: #000; padding: 14px 32px; text-decoration: none; border-radius: 8px; font-weight: 700; margin: 20px 0; }
        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 12px; margin: 20px 0; }
        .footer { background: #111; color: #888; text-align: center; padding: 24px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Password Reset Request</h1>
        </div>
        <div class="content">
          <p>Dear ${user.name},</p>
          <p>You requested to reset your password. Click the button below to proceed:</p>
          <a href="${resetUrl}" class="btn">Reset Password</a>
          <div class="warning">
            <strong>⚠️ Security Notice:</strong><br>
            This link expires in 1 hour. If you didn't request this, please ignore this email.
          </div>
        </div>
        <div class="footer">
          <p>1M Motors - Luxury · Performance · Excellence</p>
        </div>
      </div>
    </body>
    </html>
  `
};

module.exports = {
  sendEmail,
  templates
};
