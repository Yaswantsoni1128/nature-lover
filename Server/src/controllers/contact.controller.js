import sendEmail from '../services/sendEmail.js';

const contactController = {
    sendMessage: async (req, res) => {
        try {
            const { firstName, lastName, email, phone, message } = req.body;
            
            // Validation
            if (!firstName || !lastName || !email || !message) {
                return res.status(400).json({
                    success: false,
                    message: 'First name, last name, email, and message are required'
                });
            }

            // Email validation
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return res.status(400).json({
                    success: false,
                    message: 'Please enter a valid email address'
                });
            }

            // Prepare email content
            const emailSubject = `New Contact Form Submission - ${firstName} ${lastName}`;
            const emailMessage = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #16a34a; border-bottom: 2px solid #16a34a; padding-bottom: 10px;">
                        New Contact Form Submission
                    </h2>
                    
                    <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #166534; margin-top: 0;">Contact Information</h3>
                        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
                        <p><strong>Email:</strong> ${email}</p>
                        <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                    </div>
                    
                    <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #374151; margin-top: 0;">Message</h3>
                        <p style="white-space: pre-wrap; line-height: 1.6;">${message}</p>
                    </div>
                    
                    <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0; color: #1e40af;">
                            <strong>Action Required:</strong> Please respond to this inquiry within 24 hours.
                        </p>
                    </div>
                    
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                    <p style="color: #6b7280; font-size: 14px; margin: 0;">
                        This message was sent from the Nature Lovers contact form.
                    </p>
                </div>
            `;

            // Send email to business
            await sendEmail({
                to: 'yaswantsoni2004@gmail.com',
                subject: emailSubject,
                message: emailMessage
            });

            // Send confirmation email to customer
            const customerEmailSubject = 'Thank you for contacting Nature Lovers!';
            const customerEmailMessage = `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h2 style="color: #16a34a; text-align: center;">
                        🌱 Thank You for Contacting Nature Lovers!
                    </h2>
                    
                    <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <p>Dear ${firstName},</p>
                        <p>Thank you for reaching out to us! We have received your message and will get back to you within 24 hours.</p>
                    </div>
                    
                    <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
                        <h3 style="color: #374151; margin-top: 0;">What happens next?</h3>
                        <ul style="color: #4b5563; line-height: 1.6;">
                            <li>Our expert team will review your inquiry</li>
                            <li>We'll contact you within 24 hours</li>
                            <li>We'll provide personalized recommendations</li>
                            <li>We'll schedule a consultation if needed</li>
                        </ul>
                    </div>
                    
                    <div style="background-color: #eff6ff; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p style="margin: 0; color: #1e40af;">
                            <strong>Need immediate assistance?</strong> Call us at +91 9509899906
                        </p>
                    </div>
                    
                    <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
                    <p style="color: #6b7280; font-size: 14px; text-align: center; margin: 0;">
                        Nature Lovers - Transforming Gardens Into Paradise<br>
                        📧 naturelovers636@gmail.com | 📞 +91 9509899906
                    </p>
                </div>
            `;

            await sendEmail({
                to: email,
                subject: customerEmailSubject,
                message: customerEmailMessage
            });

            res.status(200).json({
                success: true,
                message: 'Message sent successfully! We will get back to you within 24 hours.'
            });

        } catch (error) {
            console.error('Error sending contact message:', error);
            res.status(500).json({
                success: false,
                message: 'Failed to send message. Please try again later.'
            });
        }
    }
};

export default contactController;
