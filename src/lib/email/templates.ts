import { getBaseUrl } from './config';

/**
 * Email verification template
 */
export function getVerificationEmailTemplate(
  name: string,
  email: string,
  verificationToken: string
): { subject: string; html: string; text: string } {
  const verificationUrl = `${getBaseUrl()}/auth/verify-email?token=${verificationToken}`;

  const subject = 'Bevestig je e-mailadres - Exam Training Platform';

  const html = `
    <!DOCTYPE html>
    <html lang="nl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #2563eb;
          color: white;
          padding: 30px 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background-color: #f9fafb;
          padding: 30px 20px;
          border-radius: 0 0 8px 8px;
        }
        .button {
          display: inline-block;
          background-color: #2563eb;
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
          font-weight: bold;
        }
        .button:hover {
          background-color: #1d4ed8;
        }
        .footer {
          margin-top: 30px;
          padding-top: 20px;
          border-top: 1px solid #e5e7eb;
          font-size: 14px;
          color: #6b7280;
        }
        .warning {
          background-color: #fef3c7;
          border: 1px solid #f59e0b;
          border-radius: 4px;
          padding: 15px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎓 Exam Training Platform</h1>
        <p>Welkom bij je persoonlijke VWO Wiskunde B trainer!</p>
      </div>
      
      <div class="content">
        <h2>Hallo ${name}!</h2>
        
        <p>Bedankt voor je registratie bij de Exam Training Platform. Om je account te activeren, moet je eerst je e-mailadres bevestigen.</p>
        
        <p>Klik op de onderstaande knop om je e-mailadres te verifiëren:</p>
        
        <div style="text-align: center;">
          <a href="${verificationUrl}" class="button">
            E-mailadres Bevestigen
          </a>
        </div>
        
        <p>Of kopieer en plak deze link in je browser:</p>
        <p style="word-break: break-all; background-color: #e5e7eb; padding: 10px; border-radius: 4px;">
          ${verificationUrl}
        </p>
        
        <div class="warning">
          <strong>⚠️ Belangrijk:</strong> Deze verificatielink is 24 uur geldig. Na deze tijd moet je een nieuwe verificatie aanvragen.
        </div>
        
        <p>Na verificatie kun je:</p>
        <ul>
          <li>✅ Oefenen met echte VWO Wiskunde B examenvragen</li>
          <li>✅ AI-feedback ontvangen op je antwoorden</li>
          <li>✅ Je voortgang per onderwerp bijhouden</li>
          <li>✅ Gerichte oefening op zwakke punten</li>
        </ul>
        
        <p>Veel succes met je voorbereiding!</p>
        
        <p>Met vriendelijke groet,<br>
        Het Exam Training Platform Team</p>
        
        <div class="footer">
          <p><strong>Heb je deze e-mail niet verwacht?</strong></p>
          <p>Als je je niet hebt geregistreerd voor de Exam Training Platform, kun je deze e-mail veilig negeren. Je e-mailadres wordt dan niet toegevoegd aan ons systeem.</p>
          
          <p><strong>Hulp nodig?</strong></p>
          <p>Neem contact op via <a href="mailto:support@examtraining.nl">support@examtraining.nl</a></p>
        </div>
      </div>
    </body>
    </html>
  `;

  const text = `
Exam Training Platform - E-mailadres Verificatie

Hallo ${name}!

Bedankt voor je registratie bij de Exam Training Platform. Om je account te activeren, moet je eerst je e-mailadres bevestigen.

Klik op deze link om je e-mailadres te verifiëren:
${verificationUrl}

Deze verificatielink is 24 uur geldig. Na deze tijd moet je een nieuwe verificatie aanvragen.

Na verificatie kun je:
✅ Oefenen met echte VWO Wiskunde B examenvragen
✅ AI-feedback ontvangen op je antwoorden
✅ Je voortgang per onderwerp bijhouden
✅ Gerichte oefening op zwakke punten

Veel succes met je voorbereiding!

Met vriendelijke groet,
Het Exam Training Platform Team

---
Heb je deze e-mail niet verwacht? Als je je niet hebt geregistreerd voor de Exam Training Platform, kun je deze e-mail veilig negeren.

Hulp nodig? Neem contact op via support@examtraining.nl
  `;

  return { subject, html, text };
}

/**
 * Welcome email template (sent after email verification)
 */
export function getWelcomeEmailTemplate(
  name: string,
  vwoLevel: string
): { subject: string; html: string; text: string } {
  const dashboardUrl = `${getBaseUrl()}/dashboard`;

  const subject = 'Welkom bij de Exam Training Platform! 🎉';

  const html = `
    <!DOCTYPE html>
    <html lang="nl">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #059669;
          color: white;
          padding: 30px 20px;
          text-align: center;
          border-radius: 8px 8px 0 0;
        }
        .content {
          background-color: #f0fdf4;
          padding: 30px 20px;
          border-radius: 0 0 8px 8px;
        }
        .button {
          display: inline-block;
          background-color: #059669;
          color: white;
          padding: 15px 30px;
          text-decoration: none;
          border-radius: 5px;
          margin: 20px 0;
          font-weight: bold;
        }
        .feature-box {
          background-color: white;
          border: 1px solid #d1fae5;
          border-radius: 8px;
          padding: 20px;
          margin: 15px 0;
        }
        .tips {
          background-color: #eff6ff;
          border-left: 4px solid #3b82f6;
          padding: 15px;
          margin: 20px 0;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>🎉 Account Geactiveerd!</h1>
        <p>Welkom bij de Exam Training Platform</p>
      </div>
      
      <div class="content">
        <h2>Gefeliciteerd ${name}!</h2>
        
        <p>Je e-mailadres is succesvol geverifieerd en je account is nu actief. Je bent klaar om te beginnen met je ${vwoLevel} Wiskunde B voorbereiding!</p>
        
        <div style="text-align: center;">
          <a href="${dashboardUrl}" class="button">
            Start met Oefenen
          </a>
        </div>
        
        <h3>🚀 Wat kun je nu doen?</h3>
        
        <div class="feature-box">
          <h4>📚 Oefenen met Examenvragen</h4>
          <p>Toegang tot een uitgebreide database met echte VWO Wiskunde B examenvragen uit voorgaande jaren.</p>
        </div>
        
        <div class="feature-box">
          <h4>🤖 AI-Powered Feedback</h4>
          <p>Ontvang direct feedback op je antwoorden met uitleg over waar je het goed deed en wat beter kan.</p>
        </div>
        
        <div class="feature-box">
          <h4>📊 Voortgang Bijhouden</h4>
          <p>Zie per onderwerp hoe je het doet en krijg gerichte aanbevelingen voor verbetering.</p>
        </div>
        
        <div class="tips">
          <h4>💡 Tips voor Succes</h4>
          <ul>
            <li><strong>Oefen regelmatig:</strong> 15-30 minuten per dag is effectiever dan lange sessies</li>
            <li><strong>Focus op zwakke punten:</strong> Gebruik je voortgangsrapport om te zien waar je extra aandacht nodig hebt</li>
            <li><strong>Lees de feedback:</strong> De AI-feedback helpt je fouten te begrijpen en te voorkomen</li>
            <li><strong>Stel vragen:</strong> Gebruik de hulpfunctie als je ergens niet uitkomt</li>
          </ul>
        </div>
        
        <p>We wensen je veel succes met je voorbereiding op het ${vwoLevel} Wiskunde B examen!</p>
        
        <p>Met vriendelijke groet,<br>
        Het Exam Training Platform Team</p>
      </div>
    </body>
    </html>
  `;

  const text = `
Exam Training Platform - Account Geactiveerd!

Gefeliciteerd ${name}!

Je e-mailadres is succesvol geverifieerd en je account is nu actief. Je bent klaar om te beginnen met je ${vwoLevel} Wiskunde B voorbereiding!

Start nu: ${dashboardUrl}

Wat kun je nu doen?

📚 Oefenen met Examenvragen
Toegang tot een uitgebreide database met echte VWO Wiskunde B examenvragen uit voorgaande jaren.

🤖 AI-Powered Feedback  
Ontvang direct feedback op je antwoorden met uitleg over waar je het goed deed en wat beter kan.

📊 Voortgang Bijhouden
Zie per onderwerp hoe je het doet en krijg gerichte aanbevelingen voor verbetering.

Tips voor Succes:
• Oefen regelmatig: 15-30 minuten per dag is effectiever dan lange sessies
• Focus op zwakke punten: Gebruik je voortgangsrapport om te zien waar je extra aandacht nodig hebt  
• Lees de feedback: De AI-feedback helpt je fouten te begrijpen en te voorkomen
• Stel vragen: Gebruik de hulpfunctie als je ergens niet uitkomt

We wensen je veel succes met je voorbereiding op het ${vwoLevel} Wiskunde B examen!

Met vriendelijke groet,
Het Exam Training Platform Team
  `;

  return { subject, html, text };
}
