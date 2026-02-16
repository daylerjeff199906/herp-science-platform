
import { Resend } from 'resend';

// Use a fallback or env variable. In production, this must be set.
const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');

export async function sendWelcomeEmail(email: string, firstName: string) {
    try {
        const data = await resend.emails.send({
            from: 'Bio Intranet <onboarding@resend.dev>',
            to: [email],
            subject: 'Welcome to Bio Intranet!',
            html: `
        <div>
          <h1>Welcome, ${firstName}!</h1>
          <p>We are excited to have you on board.</p>
          <p>Your academic profile has been successfully created.</p>
        </div>
      `,
        });
        return { success: true, data };
    } catch (error) {
        console.error('Resend error:', error);
        return { success: false, error };
    }
}
