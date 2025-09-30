import { NextApiRequest, NextApiResponse } from 'next';
import { verifyEmailToken } from '@/lib/email/verification';
import { emailVerificationSchema } from '@/lib/validations/auth';

interface VerificationResponse {
  success: boolean;
  user?: object;
  message?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VerificationResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    // Validate request body
    const validationResult = emailVerificationSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Validatiefout',
        message: validationResult.error.issues.map((e) => e.message).join(', ')
      });
    }

    const { token } = validationResult.data;

    // Verify the email token
    const result = await verifyEmailToken(token);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }

    return res.status(200).json({
      success: true,
      user: result.user,
      message: 'E-mailadres succesvol geverifieerd! Welkom bij de Exam Training Platform.'
    });

  } catch (error) {
    console.error('Email verification error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Er is een fout opgetreden bij het verifiëren van je e-mailadres'
    });
  }
}
