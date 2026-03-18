import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789')
const domainResend = process.env.RESEND_FROM_EMAIL || 'resend.dev'

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
      from: `Auth Services IIAP <noreply@${domainResend}>`,
      to: [email],
      subject: isSpanish
        ? '¡Bienvenido a la Intranet IIAP!'
        : 'Welcome to IIAP Intranet!',
      html: isSpanish
        ? `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <h1 style="color: #1a1a1a; margin-bottom: 20px;">¡Bienvenido a la comunidad, ${firstName}!</h1>
                    <p style="color: #4a4a4a; line-height: 1.6; margin-bottom: 15px;">
                        Nos emociona tenerte como parte de la Intranet IIAP. Tu perfil ha sido creado exitosamente y ahora puedes comenzar a conectar con otros investigadores.
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
                        We're excited to have you as part of IIAP Intranet. Your profile has been created successfully and you can now start connecting with other researchers.
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
export async function sendApplicationConfirmationEmail({
  email,
  firstName,
  callTitle,
  roleName,
  eventName,
  locale,
  isAutoApproved
}: {
  email: string
  firstName: string
  callTitle: string
  roleName: string
  eventName: string
  locale: string
  isAutoApproved: boolean
}) {
  const isSpanish = locale === 'es'

  try {
    const data = await resend.emails.send({
      from: `Eventos IIAP <noreply@${domainResend}>`,
      to: [email],
      subject: isSpanish
        ? `Confirmación de Postulación: ${callTitle}`
        : `Application Confirmation: ${callTitle}`,
      html: isSpanish
        ? `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
                    <h1 style="color: #1a1a1a; margin-bottom: 20px;">¡Hola ${firstName}!</h1>
                    <p style="color: #4a4a4a; line-height: 1.6; margin-bottom: 15px;">
                        Hemos recibido exitosamente tu postulación para la convocatoria <strong>"${callTitle}"</strong>.
                    </p>
                    <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <p style="margin: 5px 0;"><strong>Evento:</strong> ${eventName}</p>
                        <p style="margin: 5px 0;"><strong>Rol:</strong> ${roleName}</p>
                    </div>
                    <p style="color: #4a4a4a; line-height: 1.6; margin-bottom: 25px;">
                       ${isAutoApproved ? 'Tu participación ha sido registrada y aprobada automáticamente. Pronto recibirás más noticias sobre los siguientes pasos.' : 'Tu participación ha sido registrada. Pronto recibirás más noticias sobre los siguientes pasos.'}
                    </p>
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3004'}/es/dashboard/convocatorias" 
                       style="display: inline-block; background-color: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 30px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em;">
                        Ver mis Convocatorias
                    </a>
                </div>
                `
        : `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px;">
                    <h1 style="color: #1a1a1a; margin-bottom: 20px;">Hello ${firstName}!</h1>
                    <p style="color: #4a4a4a; line-height: 1.6; margin-bottom: 15px;">
                        We have successfully received your application for <strong>"${callTitle}"</strong>.
                    </p>
                    <div style="background-color: #f8fafc; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                        <p style="margin: 5px 0;"><strong>Event:</strong> ${eventName}</p>
                        <p style="margin: 5px 0;"><strong>Role:</strong> ${roleName}</p>
                    </div>
                    <p style="color: #4a4a4a; line-height: 1.6; margin-bottom: 25px;">
                        Your participation has been registered and auto-approved. You will receive more updates about the next steps soon.
                    </p>
                    <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3004'}/en/dashboard/convocatorias" 
                       style="display: inline-block; background-color: #000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 30px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.05em;">
                        View my Applications
                    </a>
                </div>
                `,
    })

    return { success: true, data }
  } catch (error) {
    console.error('Resend error:', error)
    return { success: false, error }
  }
}
