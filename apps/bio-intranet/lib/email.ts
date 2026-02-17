import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789')

interface WelcomeEmailParams {
  email: string
  firstName: string
  locale: string
}

export async function sendWelcomeEmail({
  email,
  firstName,
  locale,
}: WelcomeEmailParams) {
  const isSpanish = locale === 'es'

  try {
    const data = await resend.emails.send({
      from: 'Bio Intranet <onboarding@resend.dev>',
      to: [email],
      subject: isSpanish
        ? '¡Bienvenido a Bio Intranet!'
        : 'Welcome to Bio Intranet!',
      html: isSpanish
        ? `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #1a1a1a; margin-bottom: 20px;">¡Bienvenido a la comunidad, ${firstName}!</h1>
                    <p style="color: #4a4a4a; line-height: 1.6; margin-bottom: 15px;">
                        Nos emociona tenerte como parte de Bio Intranet. Tu perfil ha sido creado exitosamente y ahora puedes comenzar a conectar con otros investigadores.
                    </p>
                    <p style="color: #4a4a4a; line-height: 1.6; margin-bottom: 25px;">
                        Explora el dashboard para descubrir todas las funcionalidades que tenemos para ti.
                    </p>
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3004'}/es/dashboard" 
                       style="display: inline-block; background-color: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
                        Ir al Dashboard
                    </a>
                    <p style="color: #6a6a6a; font-size: 14px; margin-top: 30px;">
                        Si tienes alguna pregunta, no dudes en contactarnos.
                    </p>
                </div>
                `
        : `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #1a1a1a; margin-bottom: 20px;">Welcome to the community, ${firstName}!</h1>
                    <p style="color: #4a4a4a; line-height: 1.6; margin-bottom: 15px;">
                        We're excited to have you as part of Bio Intranet. Your profile has been created successfully and you can now start connecting with other researchers.
                    </p>
                    <p style="color: #4a4a4a; line-height: 1.6; margin-bottom: 25px;">
                        Explore the dashboard to discover all the features we have for you.
                    </p>
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3004'}/en/dashboard" 
                       style="display: inline-block; background-color: #0066cc; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
                        Go to Dashboard
                    </a>
                    <p style="color: #6a6a6a; font-size: 14px; margin-top: 30px;">
                        If you have any questions, feel free to contact us.
                    </p>
                </div>
                `,
    })

    return { success: true, data }
  } catch (error) {
    console.error('Resend error:', error)
    return { success: false, error }
  }
}
