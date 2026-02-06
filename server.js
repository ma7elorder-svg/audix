const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Configuration
const SENDER_EMAIL = process.env.SENDER_EMAIL;
const APP_PASSWORD = process.env.APP_PASSWORD;
const RECEIVER_EMAIL = process.env.RECEIVER_EMAIL;

// Email Transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: SENDER_EMAIL,
        pass: APP_PASSWORD
    }
});

// Order Endpoint
app.post('/api/order', async (req, res) => {
    try {
        const orderData = req.body;
        console.log('Received order from:', orderData.customer.name);

        // Format email content
        const emailSubject = `طلب جديد من ${orderData.customer.name}`;

        // Items list for HTML
        const itemsList = orderData.items.map(item =>
            `<li>${item.name} × ${item.quantity} - <strong>${item.price * item.quantity} د.ل</strong></li>`
        ).join('');

        const emailHtml = `
            <div dir="rtl" style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                <h2 style="color: #0066FF; border-bottom: 2px solid #0066FF; padding-bottom: 10px;">طلب جديد من متجر Audix</h2>
                
                <div style="background-color: #f9f9f9; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                    <h3 style="margin-top: 0;">معلومات العميل:</h3>
                    <p><strong>الاسم:</strong> ${orderData.customer.name}</p>
                    <p><strong>رقم الهاتف:</strong> ${orderData.customer.phone}</p>
                    <p><strong>المدينة:</strong> ${orderData.customer.city}</p>
                    <p><strong>العنوان:</strong> ${orderData.customer.address}</p>
                    <p><strong>ملاحظات:</strong> ${orderData.customer.notes || 'لا توجد'}</p>
                </div>

                <div style="margin-bottom: 20px;">
                    <h3>المنتجات المطلوبة:</h3>
                    <ul>
                        ${itemsList}
                    </ul>
                </div>

                <div style="font-size: 1.2em; font-weight: bold; background-color: #0066FF; color: white; padding: 10px; border-radius: 5px; text-align: center;">
                    الإجمالي: ${orderData.total} د.ل
                </div>

                <div style="margin-top: 20px; font-size: 0.9em; color: #666; text-align: left;">
                    <p>Date: ${orderData.timestamp}</p>
                </div>
            </div>
        `;

        // Send Email
        await transporter.sendMail({
            from: `"Audix Orders" <${SENDER_EMAIL}>`,
            to: RECEIVER_EMAIL,
            subject: emailSubject,
            html: emailHtml
        });

        console.log('Email sent successfully');
        res.status(200).json({ success: true, message: 'Order sent successfully' });

    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send order' });
    }
});

// Start Server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log(`Email Service Configured: Sending from ${SENDER_EMAIL} to ${RECEIVER_EMAIL}`);
});
