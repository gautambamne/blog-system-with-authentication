import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (
    to: string,
    name: string,
    verificationCode: string
): Promise<boolean> => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Gautam<onboarding@resend.dev>',
            to: [to],
            subject: 'Verify Your Email Address - Blog App',
            headers: {
                'X-Priority': '1',
                'X-MSMail-Priority': 'High',
                'Importance': 'high',
            },
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Verify Your Email - Blog App</title>
                </head>
                <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
                    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 0;">
                        <!-- Header -->
                        <div style="background-color: #ff5722; padding: 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Blog App</h1>
                        </div>
                        <!-- Content -->
                        <div style="padding: 40px 30px;">
                            <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px;">Verify Your Email Address</h2>
                            <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Hello <strong>${name}</strong>,</p>
                            <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 30px 0;">
                                Thank you for joining Blog App! To complete your registration and secure your account, 
                                please verify your email address using the verification code below:
                            </p>
                            <!-- Verification Code Box -->
                            <div style="background: linear-gradient(135deg, #ff5722 0%, #e64a19 100%); padding: 30px; text-align: center; margin: 30px 0; border-radius: 12px; box-shadow: 0 4px 15px rgba(255, 87, 34, 0.3);">
                                <p style="color: #ffffff; font-size: 14px; margin: 0 0 10px 0; text-transform: uppercase; letter-spacing: 1px;">Your Verification Code</p>
                                <h1 style="color: #ffffff; letter-spacing: 8px; margin: 0; font-size: 36px; font-weight: bold; font-family: 'Courier New', monospace;">${verificationCode}</h1>
                            </div>
                            <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 20px 0;">
                                <p style="color: #856404; font-size: 14px; margin: 0; font-weight: bold;">⏰ Important: This code expires in 15 minutes</p>
                            </div>
                            <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                                If you didn't create a Blog App account, you can safely ignore this email. Your email address will not be used for any further communications.
                            </p>
                        </div>
                        <!-- Footer -->
                        <div style="background-color: #f8f9fa; padding: 20px 30px; border-top: 1px solid #e9ecef;">
                            <p style="color: #6c757d; font-size: 14px; margin: 0; text-align: center;">
                                Best regards,<br>
                                <strong>Blog App Team</strong><br>
                                <span style="font-size: 12px;">This is an automated message, please do not reply.</span>
                            </p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `Hello ${name},

Thank you for joining Blog App! 

Your verification code is: ${verificationCode}

This code will expire in 15 minutes.

If you didn't create an account, please ignore this email.

Best regards,
Blog App Team`,
        });

        if (error) {
            console.error('Email send error:', error);
            return false;
        }

        console.log('Email sent successfully:', data);
        return true;
    } catch (error) {
        console.error('Email service error:', error);
        return false;
    }
};

export const sendWelcomeEmail = async (
    to: string,
    name: string
): Promise<boolean> => {
    try {
        const { data, error } = await resend.emails.send({
            from: 'Blog App <onboarding@resend.dev>',
            to: [to],
            subject: 'Welcome to Blog App - Account Verified!',
            headers: {
                'X-Priority': '1',
                'X-MSMail-Priority': 'High',
                'Importance': 'high',
            },
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Welcome to Blog App</title>
                </head>
                <body style="margin: 0; padding: 0; background-color: #f4f4f4;">
                    <div style="font-family: 'Helvetica Neue', Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 0;">
                        <!-- Header -->
                        <div style="background: linear-gradient(135deg, #ff9800 0%, #ff5722 100%); padding: 30px; text-align: center;">
                            <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: bold;">Blog App</h1>
                            <p style="color: #ffffff; margin: 10px 0 0 0; font-size: 16px;">Welcome aboard! 📝</p>
                        </div>
                        <!-- Content -->
                        <div style="padding: 40px 30px;">
                            <h2 style="color: #333333; margin: 0 0 20px 0; font-size: 24px;">Welcome to Blog App!</h2>
                            <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">Hello <strong>${name}</strong>,</p>
                            <div style="background-color: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px; padding: 20px; margin: 20px 0;">
                                <p style="color: #155724; font-size: 16px; margin: 0; text-align: center;">
                                    ✅ <strong>Your email has been successfully verified!</strong>
                                </p>
                            </div>
                            <p style="color: #555555; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                                You can now enjoy all the features Blog App has to offer:
                            </p>
                            <ul style="color: #555555; font-size: 16px; line-height: 1.6; margin: 20px 0; padding-left: 20px;">
                                <li>Create and manage your blog posts</li>
                                <li>Connect with other bloggers</li>
                                <li>Access all platform features</li>
                                <li>Secure account management</li>
                            </ul>
                            <div style="text-align: center; margin: 30px 0;">
                                <p style="color: #555555; font-size: 16px; margin: 0 0 20px 0;">Ready to get started?</p>
                                <a href="#" style="background-color: #ff5722; color: #ffffff; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">Start Blogging</a>
                            </div>
                        </div>
                        <!-- Footer -->
                        <div style="background-color: #f8f9fa; padding: 20px 30px; border-top: 1px solid #e9ecef;">
                            <p style="color: #6c757d; font-size: 14px; margin: 0; text-align: center;">
                                Best regards,<br>
                                <strong>Blog App Team</strong><br>
                                <span style="font-size: 12px;">This is an automated message, please do not reply.</span>
                            </p>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `Hello ${name},

Welcome to Blog App!

Your email has been successfully verified! You can now enjoy all the features we have to offer.

Best regards,
Blog App Team`,
        });

        if (error) {
            console.error('Welcome email send error:', error);
            return false;
        }

        console.log('Welcome email sent successfully:', data);
        return true;
    } catch (error) {
        console.error('Welcome email service error:', error);
        return false;
    }
};
