import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { GetServerSideProps } from 'next';

interface VerifyEmailPageProps {
  token?: string;
}

export default function VerifyEmailPage({ token }: VerifyEmailPageProps) {
  const router = useRouter();
  const [verificationState, setVerificationState] = useState<
    'loading' | 'success' | 'error'
  >('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const [userInfo, setUserInfo] = useState<{
    name: string;
    email: string;
    vwoLevel?: string;
    subject: string;
  } | null>(null);

  useEffect(() => {
    if (!token) {
      setVerificationState('error');
      setErrorMessage('Geen verificatietoken gevonden.');
      return;
    }

    verifyEmail(token);
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: verificationToken }),
      });

      const result = await response.json();

      if (result.success) {
        setVerificationState('success');
        setUserInfo(result.user);
      } else {
        setVerificationState('error');
        setErrorMessage(result.error || 'Er is een fout opgetreden');
      }
    } catch (error) {
      console.error('Email verification error:', error);
      setVerificationState('error');
      setErrorMessage('Er is een onverwachte fout opgetreden');
    }
  };

  const handleResendVerification = () => {
    // Redirect to a resend page or show form
    router.push('/auth/resend-verification');
  };

  if (verificationState === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <div className="mx-auto h-12 w-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              E-mailadres Verifiëren
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Even geduld, we controleren je verificatielink...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (verificationState === 'success') {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 text-green-600 text-4xl">
              🎉
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              E-mailadres Geverifieerd!
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Welkom bij de Exam Training Platform
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-md p-4">
                <div className="flex items-center justify-center">
                  <div className="flex-shrink-0">
                    <span className="text-green-600 text-xl">✅</span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-sm font-medium text-green-800">
                      Account succesvol geactiveerd!
                    </h3>
                    <div className="mt-2 text-sm text-green-700">
                      Je kunt nu inloggen en beginnen met oefenen voor VWO Wiskunde B.
                    </div>
                  </div>
                </div>
              </div>

              {userInfo && (
                <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">
                    Account Details:
                  </h4>
                  <div className="text-sm text-blue-700 space-y-1">
                    <p><strong>Naam:</strong> {userInfo.name}</p>
                    <p><strong>E-mail:</strong> {userInfo.email}</p>
                    <p><strong>Niveau:</strong> {userInfo.vwoLevel}</p>
                    <p><strong>Vak:</strong> {userInfo.subject}</p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <h4 className="text-sm font-medium text-gray-900">
                  🚀 Je kunt nu:
                </h4>
                <div className="grid grid-cols-1 gap-3 text-sm">
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Oefenen met echte examenvragen</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>AI-feedback ontvangen op je antwoorden</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Je voortgang per onderwerp bekijken</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="text-green-500">✓</span>
                    <span>Gerichte oefening op zwakke punten</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col space-y-3">
                <button
                  onClick={() => router.push('/dashboard')}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Start met Oefenen 🎯
                </button>

                <button
                  onClick={() => router.push('/auth/login')}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Naar Inlogpagina
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 text-red-600 text-4xl">
            ❌
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Verificatie Mislukt
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Er is een probleem opgetreden bij het verifiëren van je e-mailadres
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <div className="text-center space-y-6">
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-red-600 text-xl">⚠️</span>
                </div>
                <div className="ml-3 text-left">
                  <h3 className="text-sm font-medium text-red-800">
                    Verificatie Fout
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    {errorMessage}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-sm text-gray-600 space-y-2">
              <p><strong>Mogelijke oorzaken:</strong></p>
              <ul className="list-disc list-inside space-y-1 text-left">
                <li>De verificatielink is verlopen (geldig voor 24 uur)</li>
                <li>De link is al eerder gebruikt</li>
                <li>De link is beschadigd of onvolledig</li>
                <li>Je e-mailadres is al geverifieerd</li>
              </ul>
            </div>

            <div className="flex flex-col space-y-3">
              <button
                onClick={handleResendVerification}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Nieuwe Verificatie-e-mail Aanvragen
              </button>

              <button
                onClick={() => router.push('/auth/login')}
                className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Probeer In te Loggen
              </button>

              <button
                onClick={() => router.push('/auth/register')}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Nieuw Account Aanmaken
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { token } = context.query;

  return {
    props: {
      token: token || null,
    },
  };
};
