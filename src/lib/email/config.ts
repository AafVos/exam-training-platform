import nodemailer from 'nodemailer';

/**
 * Email service configuration
 */
export const emailConfig = {
  host: process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.EMAIL_SERVER_PORT || '587'),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_SERVER_USER,
    pass: process.env.EMAIL_SERVER_PASSWORD,
  },
};

/**
 * Create email transporter
 */
export function createEmailTransporter() {
  if (!process.env.EMAIL_SERVER_USER || !process.env.EMAIL_SERVER_PASSWORD) {
    console.warn('Email credentials not configured. Email sending will be disabled.');
    return null;
  }

  return nodemailer.createTransport(emailConfig);
}

/**
 * Email configuration for development/testing
 */
export const getEmailFrom = () => {
  return process.env.EMAIL_FROM || 'noreply@examtraining.nl';
};

/**
 * Get base URL for email links
 */
export const getBaseUrl = () => {
  return process.env.NEXTAUTH_URL || 'http://localhost:3000';
};
