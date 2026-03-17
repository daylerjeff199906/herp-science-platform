'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { sendApplicationConfirmationEmail } from '@/lib/email'

export async function notifyApplicationSuccess({
    callId,
    profileId,
    locale,
}: {
    callId: string
    profileId: string
    locale: string
}) {
    const cookieStore = await cookies()
    const supabase = createClient(cookieStore)

    // Fetch details for the email
    const { data: call } = await supabase
        .from('event_calls')
        .select(`
            title,
            role:participant_roles(name),
            main_event:main_events(name),
            edition:editions(name),
            auto_approve
        `)
        .eq('id', callId)
        .single()

    const { data: profile } = await supabase
        .from('profiles')
        .select('first_name, email')
        .eq('id', profileId)
        .single()

    if (call && profile && profile.email) {
        // Handle cases where Supabase might return relations as arrays in some type definitions
        const roleData = Array.isArray(call.role) ? call.role[0] : call.role
        const mainEventData = Array.isArray(call.main_event) ? call.main_event[0] : call.main_event
        const editionData = Array.isArray(call.edition) ? call.edition[0] : call.edition

        const callTitle = typeof call.title === 'object' ? (call.title as any)?.[locale] : call.title
        const roleName = typeof roleData?.name === 'object' ? (roleData?.name as any)?.[locale] : roleData?.name || 'Participante'
        const eventName = (typeof mainEventData?.name === 'object' ? (mainEventData?.name as any)?.[locale] : mainEventData?.name) ||
            (typeof editionData?.name === 'object' ? (editionData?.name as any)?.[locale] : editionData?.name) ||
            'Evento General'

        const isAutoApproved = call?.auto_approve || false

        await sendApplicationConfirmationEmail({
            email: profile.email,
            firstName: profile.first_name || 'Participante',
            callTitle: callTitle || 'Convocatoria',
            roleName: roleName,
            eventName: eventName,
            locale,
            isAutoApproved
        })
    }

    return { success: true }
}
