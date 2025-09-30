import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { RegistrationForm } from '@/components/forms/RegistrationForm';
import { RegistrationData, RegistrationResponse } from '@/types';

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const handleRegistration = async (data: RegistrationData): Promise<void> => {
    setIsLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result: RegistrationResponse = await response.json();

      if (result.success) {
        setUserEmail(data.email);
        setRegistrationSuccess(true);
      } else {
        if (result.error) {
          setErrors({ general: result.error });
        }
      }
    } catch (error) {
      console.error('Registration error:', error);
      setErrors({ 
        general: 'Er is een onverwachte fout opgetreden. Probeer het opnieuw.' 
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!userEmail) return;

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: userEmail }),
      });

      const result = await response.json();

      if (result.success) {
        alert('Nieuwe verificatie-e-mail verzonden!');
      } else {
        alert(result.error || 'Er is een fout opgetreden');
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      alert('Er is een fout opgetreden bij het verzenden van de e-mail');
    }
  };

  if (registrationSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 text-green-600 text-4xl">
              ✅
            </div>
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Account Aangemaakt!
            </h2>
            <p className="mt-2 text-center text-sm text-gray-600">
              Je bent bijna klaar om te beginnen
            </p>
          </div>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <div className="text-center space-y-4">
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <span className="text-blue-600 text-xl">📧</span>
                  </div>
                  <div className="ml-3 text-left">
                    <h3 className="text-sm font-medium text-blue-800">
                      Controleer je e-mail
                    </h3>
                    <div className="mt-2 text-sm text-blue-700">
                      We hebben een verificatielink gestuurd naar{' '}
                      <strong>{userEmail}</strong>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-600 space-y-2">
                <p>
                  <strong>Volgende stappen:</strong>
                </p>
                <ol className="list-decimal list-inside space-y-1 text-left">
                  <li>Open je e-mailprogramma</li>
                  <li>Zoek naar een e-mail van Exam Training Platform</li>
                  <li>Klik op de verificatielink in de e-mail</li>
                  <li>Kom terug om in te loggen en te beginnen met oefenen!</li>
                </ol>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
                <div className="text-sm text-yellow-800">
                  <strong>E-mail niet ontvangen?</strong>
                  <ul className="mt-2 list-disc list-inside space-y-1">
                    <li>Controleer je spam/junk folder</li>
                    <li>Wacht een paar minuten - e-mails kunnen vertraagd zijn</li>
                    <li>Controleer of je e-mailadres correct is: {userEmail}</li>
                  </ul>
                </div>
              </div>

              <div className="flex flex-col space-y-3">
                <button
                  onClick={handleResendVerification}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Nieuwe verificatie-e-mail verzenden
                </button>

                <button
                  onClick={() => router.push('/auth/login')}
                  className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Naar inlogpagina
                </button>

                <button
                  onClick={() => {
                    setRegistrationSuccess(false);
                    setErrors({});
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700"
                >
                  Terug naar registratie
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-blue-600">📚</h1>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Maak je account aan
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Begin vandaag nog met je VWO Wiskunde B voorbereiding
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <RegistrationForm
            onSubmit={handleRegistration}
            isLoading={isLoading}
            errors={errors}
          />
        </div>

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">
                Waarom Exam Training Platform?
              </span>
            </div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-3">
            <div className="bg-white overflow-hidden shadow rounded-lg px-4 py-3">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-green-500 text-lg">🎯</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    Gerichte Voorbereiding
                  </p>
                  <p className="text-sm text-gray-500">
                    Oefen met echte examenvragen per onderwerp
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg px-4 py-3">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-blue-500 text-lg">🤖</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    AI-Powered Feedback
                  </p>
                  <p className="text-sm text-gray-500">
                    Ontvang directe feedback op je antwoorden
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white overflow-hidden shadow rounded-lg px-4 py-3">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <span className="text-purple-500 text-lg">📊</span>
                </div>
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-900">
                    Voortgang Tracking
                  </p>
                  <p className="text-sm text-gray-500">
                    Zie je ontwikkeling per onderwerp
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
