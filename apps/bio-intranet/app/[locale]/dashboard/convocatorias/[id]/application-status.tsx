import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CheckCircle2, Calendar, FileText, Info } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ApplicationClient } from "./application-client";

export interface ApplicationStatusProps {
    isParticipant: boolean;
    existingApplication: {
        id: string;
        status: string;
        submitted_at: string;
        submitted_data?: Record<string, any>;
        submission?: {
            id?: string;
            comments?: Array<{
                id: string;
                content: string;
                created_at: string;
                author?: { first_name?: string };
            }>;
            history?: Array<{
                id: string;
                new_status: string;
                justification?: string;
                created_at: string;
            }>;
        } | null;
    } | null;
    isClosed: boolean;
    call: {
        id: string;
        title: string | Record<string, any>;
        end_date: string;
        is_direct?: boolean;
        form_schema?: any[];
        role?: {
            name?: string | Record<string, any>;
        };
    };
    userProfile: { id: string } | null;
    locale: string;
}

const statusConfig: Record<string, { label: string; color: string }> = {
    draft: { label: 'Borrador', color: 'text-slate-500 bg-slate-100' },
    submitted: { label: 'Presentado', color: 'text-blue-600 bg-blue-100' },
    under_review: { label: 'En Revisión', color: 'text-amber-600 bg-amber-100' },
    changes_requested: { label: 'Cambios Solicitados', color: 'text-orange-500 bg-orange-100' },
    approved: { label: 'Aprobado', color: 'text-primary bg-primary/20' },
    rejected: { label: 'Rechazado', color: 'text-rose-600 bg-rose-100' }
};

export default function ApplicationStatus({
    isParticipant,
    existingApplication,
    isClosed,
    call,
    userProfile,
    locale
}: ApplicationStatusProps) {
    if (isParticipant || existingApplication) {
        // Enforce fallback mapping if there is no submission profile
        const sub = existingApplication?.submission;
        const timeline = sub ? [
            ...(sub.comments || []).map((c) => ({
                type: 'comment' as const,
                id: `comment-${c.id}`,
                date: new Date(c.created_at),
                data: { content: c.content, author: c.author }
            })),
            ...(sub.history || []).map((h) => ({
                type: 'history' as const,
                id: `history-${h.id}`,
                date: new Date(h.created_at),
                data: { new_status: h.new_status, justification: h.justification }
            }))
        ].sort((a, b) => a.date.getTime() - b.date.getTime()) : existingApplication ? [
            {
                type: 'history' as const,
                id: 'initial',
                date: new Date(existingApplication.submitted_at),
                data: {
                    new_status: existingApplication.status,
                    justification: 'Postulación recibida y registrada en el sistema.'
                }
            }
        ] : [];

        const roleName = (typeof call.role?.name === 'object' ? (call.role?.name as any)?.[locale] : call.role?.name || 'Participante').toLowerCase();



        return (
            <div className="space-y-6 w-full">
                {existingApplication && (
                    <div className="relative overflow-hidden group border rounded-xl bg-background shadow-sm">
                        <div className="relative z-10 p-8 space-y-6">
                            <div className="text-center">
                                <div className="mx-auto w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mb-4 ring-8 ring-blue-50 dark:ring-blue-900/10">
                                    <CheckCircle2 className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                </div>
                                <h3 className="text-2xl font-bold tracking-tight">¡Ya estás en camino!</h3>
                                <p className="text-muted-foreground mx-auto">
                                    Tu postulación para <strong>{typeof call.title === 'object' ? (call.title as any)?.[locale] : call.title}</strong> fue recibida el {format(new Date(existingApplication.submitted_at), "d 'de' MMMM", { locale: es })}.
                                </p>
                                {/* 🟢 Resumen de la Postulación (Rol, Fecha, etc.) */}
                                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs border rounded-xl p-4 bg-background dark:bg-muted/20 shadow-sm mx-auto">
                                    <div className="flex flex-col gap-2">
                                        <h2 className="font-semibold text-muted-foreground text-left">Rol Postulado</h2>
                                        <p className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 mt-0.5">
                                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                            {typeof call.role?.name === 'object' ? (call.role?.name as any)?.[locale] : call.role?.name || 'Participante'}
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-2">
                                        <h2 className="font-semibold text-muted-foreground text-left">Fecha de Postulación</h2>
                                        <p className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 mt-0.5">
                                            <Calendar className="h-3.5 w-3.5 text-slate-400" />
                                            {format(new Date(existingApplication.submitted_at), "dd/MM/yyyy")}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <hr className="border-slate-100 dark:border-slate-800" />

                            {/* 🟢 Timeline de la Postulación */}
                            <div className="space-y-4 mx-auto">
                                <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-bold border-b pb-1">Historial de Seguimiento</h4>
                                <div className="relative pl-4 border-l-2 border-slate-200 dark:border-slate-800 space-y-4">
                                    {timeline.map((item) => (
                                        <div key={item.id} className="relative flex items-start gap-2">
                                            <div className="absolute left-[-23px] w-4 h-4 rounded-full bg-white border border-slate-300 dark:bg-slate-900 flex items-center justify-center mt-1">
                                                <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                                            </div>
                                            <div className="flex-1 text-xs">
                                                {item.type === 'comment' ? (
                                                    <div>
                                                        <span className="font-semibold">{item.data.author?.first_name || 'Comité'}:</span> {item.data.content}
                                                    </div>
                                                ) : (
                                                    <div>
                                                        <span className="text-muted-foreground">Estado: </span>
                                                        <span className={`font-bold px-1 rounded ${statusConfig[item.data.new_status || '']?.color || 'bg-slate-100 border'}`}>
                                                            {statusConfig[item.data.new_status || '']?.label || item.data.new_status}
                                                        </span>
                                                        {item.data.justification && <p className="mt-0.5 text-muted-foreground">"{item.data.justification}"</p>}
                                                    </div>
                                                )}
                                                <span className="text-[10px] text-muted-foreground block mt-0.5">{format(item.date, "dd/MM/yyyy HH:mm")}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {existingApplication.submitted_data && Object.keys(existingApplication.submitted_data).length > 0 && (
                                <div className="bg-background dark:bg-muted/30 rounded-xl p-4 text-left border shadow-sm mx-auto mt-4 space-y-2">
                                    <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-bold border-b pb-1">Datos Enviados</h4>
                                    <dl className="grid grid-cols-1 gap-x-4 gap-y-2">
                                        {Object.entries(existingApplication.submitted_data).map(([key, value]) => {
                                            const field = call.form_schema?.find((f: any) => f.id === key);
                                            const label = field?.label || key;
                                            return (
                                                <div key={key} className="flex flex-col">
                                                    <dt className="text-xs font-semibold text-foreground/80">{label}</dt>
                                                    <dd className="text-sm text-muted-foreground break-all">
                                                        {typeof value === 'string' && value.startsWith('http') ? (
                                                            <a href={value} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center">
                                                                <FileText className="h-3.5 w-3.5 mr-1" /> Ver archivo
                                                            </a>
                                                        ) : typeof value === 'boolean' ? (value ? 'Sí' : 'No') : String(value)}
                                                    </dd>
                                                </div>
                                            )
                                        })}
                                    </dl>
                                </div>
                            )}

                            <div className="pt-4 flex flex-col sm:flex-row gap-3 justify-center">
                                <Link href={`/${locale}/dashboard/convocatorias/mis-postulaciones`}>
                                    <Button variant="outline" className="rounded-full px-8">
                                        Ver mis postulaciones
                                    </Button>
                                </Link>
                                <div className="inline-flex items-center px-4 py-2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-sm font-bold uppercase tracking-wider border border-blue-500/20">
                                    Estado: {existingApplication.status === 'approved' ? 'Aprobada' : existingApplication.status === 'draft' ? 'Recibida' : existingApplication.status}
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        );
    }

    if (isClosed) {
        return (
            <div className="space-y-6 w-full">
                <div className="bg-muted p-6 text-center rounded-lg border">
                    <p className="text-muted-foreground font-medium">Esta convocatoria ya no acepta postulaciones.</p>
                </div>
                {call.form_schema && call.form_schema.length > 0 && userProfile && (
                    <div className="border rounded-xl p-6 bg-background dark:bg-muted/10 opacity-75">
                        <h4 className="text-sm font-semibold mb-2 text-muted-foreground">Formulario (Modo Vista - Convocatoria Cerrada)</h4>
                        <ApplicationClient
                            callId={call.id}
                            schema={call.form_schema || []}
                            profileId={userProfile.id}
                            locale={locale}
                            call={call}
                            disabled={true}
                        />
                    </div>
                )}
            </div>
        );
    }

    return null;
}
