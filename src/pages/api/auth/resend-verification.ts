import { NextApiRequest, NextApiResponse } from 'next';
import { resendVerificationEmail } from '@/lib/email/verification';
import { z } from 'zod';

const resendSchema = z.object({
  email: z.string().email('Voer een geldig e-mailadres in'),
});

interface ResendResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResendResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed'
    });
  }

  try {
    // Validate request body
    const validationResult = resendSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        error: 'Validatiefout',
        message: validationResult.error.issues.map((e) => e.message).join(', ')
      });
    }

    const { email } = validationResult.data;

    // Resend verification email
    const result = await resendVerificationEmail(email);

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Nieuwe verificatie-e-mail verzonden. Controleer je inbox.'
    });

  } catch (error) {
    console.error('Resend verification error:', error);
    
    return res.status(500).json({
      success: false,
      error: 'Er is een fout opgetreden bij het verzenden van de verificatie-e-mail'
    });
  }
}
