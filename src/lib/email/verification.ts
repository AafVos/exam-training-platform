import { createEmailTransporter, getEmailFrom } from './config';
import { getVerificationEmailTemplate, getWelcomeEmailTemplate } from './templates';
import { findUserByVerificationToken, findUserByEmail, updateUser } from '../db/user';
import { generateSecureToken } from '../auth/password';

/**
 * Send verification email to user
 */
export async function sendVerificationEmail(
  email: string,
  name: string,
  verificationToken: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = createEmailTransporter();
    
    if (!transporter) {
      console.warn('Email transporter not configured. Skipping email send.');
      return { success: false, error: 'Email service not configured' };
    }

    const { subject, html, text } = getVerificationEmailTemplate(
      name,
      email,
      verificationToken
    );

    await transporter.sendMail({
      from: getEmailFrom(),
      to: email,
      subject,
      html,
      text,
    });

    console.log(`Verification email sent to ${email}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to send verification email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Send welcome email after email verification
 */
export async function sendWelcomeEmail(
  email: string,
  name: string,
  vwoLevel: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const transporter = createEmailTransporter();
    
    if (!transporter) {
      console.warn('Email transporter not configured. Skipping welcome email send.');
      return { success: false, error: 'Email service not configured' };
    }

    const { subject, html, text } = getWelcomeEmailTemplate(name, vwoLevel);

    await transporter.sendMail({
      from: getEmailFrom(),
      to: email,
      subject,
      html,
      text,
    });

    console.log(`Welcome email sent to ${email}`);
    return { success: true };
  } catch (error) {
    console.error('Failed to send welcome email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    };
  }
}

/**
 * Verify email token and activate user account
 */
export async function verifyEmailToken(
  token: string
): Promise<{ success: boolean; user?: object; error?: string }> {
  try {
    // Find user by verification token
    const user = await findUserByVerificationToken(token);

    if (!user) {
      return { success: false, error: 'Ongeldige of verlopen verificatietoken' };
    }

    // Check if already verified
    if (user.emailVerified) {
      return { success: false, error: 'E-mailadres is al geverifieerd' };
    }

    // Check token expiration (24 hours)
    const tokenAge = Date.now() - new Date(user.createdAt).getTime();
    const maxAge = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

    if (tokenAge > maxAge) {
      return { success: false, error: 'Verificatietoken is verlopen. Vraag een nieuwe verificatie aan.' };
    }

    // Update user as verified
    const updatedUser = await updateUser(user.id, {
      emailVerified: new Date().toISOString(),
      emailVerifyToken: undefined, // Clear the token after successful verification
    });

    if (!updatedUser) {
      return { success: false, error: 'Fout bij het bijwerken van de gebruiker' };
    }

    // Send welcome email
    if (user.vwoLevel) {
      await sendWelcomeEmail(user.email, user.name, user.vwoLevel);
    }

    return { 
      success: true, 
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        vwoLevel: updatedUser.vwoLevel,
        subject: updatedUser.subject,
        emailVerified: updatedUser.emailVerified,
        createdAt: updatedUser.createdAt,
        lastLoginAt: updatedUser.lastLoginAt,
        updatedAt: updatedUser.updatedAt,
      }
    };
  } catch (error) {
    console.error('Email verification error:', error);
    return { 
      success: false, 
      error: 'Er is een fout opgetreden bij het verifiëren van je e-mailadres' 
    };
  }
}

/**
 * Resend verification email
 */
export async function resendVerificationEmail(
  email: string
): Promise<{ success: boolean; error?: string }> {
  try {
    // Find unverified user
    const user = await findUserByEmail(email);

    if (!user) {
      return { success: false, error: 'Gebruiker niet gevonden' };
    }

    if (user.emailVerified) {
      return { success: false, error: 'E-mailadres is al geverifieerd' };
    }

    // Generate new verification token
    const newVerificationToken = generateSecureToken();

    // Update user with new token
    await updateUser(user.id, { emailVerifyToken: newVerificationToken });

    // Send new verification email
    const result = await sendVerificationEmail(
      user.email,
      user.name,
      newVerificationToken
    );

    if (!result.success) {
      return { success: false, error: result.error };
    }

    return { success: true };
  } catch (error) {
    console.error('Resend verification email error:', error);
    return { 
      success: false, 
      error: 'Er is een fout opgetreden bij het verzenden van de verificatie-e-mail' 
    };
  }
}