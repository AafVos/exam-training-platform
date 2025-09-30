import { NextApiRequest, NextApiResponse } from 'next';
import { createUser, findUserByEmail, updateUser } from '@/lib/db/user';
import { registerSchema } from '@/lib/validations/auth';
import { hashPassword, generateSecureToken } from '@/lib/auth/password';
import { sendVerificationEmail } from '@/lib/email/verification';
import { RegistrationResponse } from '@/types';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<RegistrationResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    // Validate request body
    const validationResult = registerSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Validatiefout',
        message: validationResult.error.issues.map((e) => e.message).join(', ')
      });
    }

    const { name, email, password, vwoLevel, subject = 'Wiskunde B' } = validationResult.data;

    // Check if user already exists
    const existingUser = await findUserByEmail(email);

    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'E-mailadres is al in gebruik'
      });
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Generate email verification token
    const emailVerifyToken = generateSecureToken();

    // Create user in Cosmos DB
    const user = await createUser({
      name: name.trim(),
      email: email.toLowerCase(),
      password: hashedPassword,
      vwoLevel: vwoLevel?.trim(),
      subject,
    });

    // Update user with verification token
    const updatedUser = await updateUser(user.id, {
      emailVerifyToken
    });

    if (!updatedUser) {
      throw new Error('Failed to update user with verification token');
    }

    // Send verification email
    const emailResult = await sendVerificationEmail(user.email, user.name, emailVerifyToken);
    
    if (!emailResult.success) {
      console.warn('Failed to send verification email:', emailResult.error);
      // Don't fail the registration if email sending fails
    }

    return res.status(201).json({
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
      },
      message: 'Account succesvol aangemaakt. Controleer je e-mail voor verificatie.'
    });

  } catch (error: unknown) {
    console.error('Registration error:', error);
    
    // Handle duplicate email error
    if (error instanceof Error && error.message === 'E-mailadres is al in gebruik') {
      return res.status(409).json({
        success: false,
        error: 'E-mailadres is al in gebruik'
      });
    }

    return res.status(500).json({
      success: false,
      error: 'Er is een fout opgetreden bij het aanmaken van je account'
    });
  }
}