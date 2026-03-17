'use client';

import { useState } from "react";
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
    submitted: { label: 'Presentado', color: 'text-blue-600 bg-blue-100 border-blue-200' },
    under_review: { label: 'En Revisión', color: 'text-amber-600 bg-amber-100 border-amber-200' },
    changes_requested: { label: 'Cambios Solicitados', color: 'text-orange-500 bg-orange-100 border-orange-200' },
    approved: { label: 'Aprobado', color: 'text-purple-600 bg-purple-50 border-purple-200 dark:bg-purple-900/20' },
    rejected: { label: 'Rechazado', color: 'text-rose-600 bg-rose-100 border-rose-200' }
};

export default function ApplicationStatus({
    isParticipant,
    existingApplication,
    isClosed,
    call,
    userProfile,
    locale
}: ApplicationStatusProps) {
    const [activeTab, setActiveTab] = useState<'info' | 'tracking'>('info');

    if (isParticipant || existingApplication) {
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

        const isApproved = existingApplication?.status === 'approved' || isParticipant;

        return (
            <div className="space-y-6 w-full">
                {existingApplication && (
                    <div className="relative overflow-hidden group border rounded-xl bg-background shadow-sm">
                        
                        {/* 🟢 BANNER ESTILO GITHUB */}
                        <div className={`p-4 border-b flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                            isApproved ? 'bg-purple-50/50 dark:bg-purple-900/10 border-purple-200 dark:border-purple-900/50' :
                             existingApplication.status === 'draft' ? 'bg-slate-50 dark:bg-slate-900/20 border-slate-200 dark:border-slate-800' : 'bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/50'
                        }`}>
                            <div className="flex items-start gap-3">
                                <div className={`p-1.5 rounded-full mt-0.5 ${
                                    isApproved ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400' : 'bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400'
                                }`}>
                                    <CheckCircle2 className="h-5 w-5" />
                                </div>
                                <div className="space-y-0.5">
                                    <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                                        Postulación {isApproved ? 'aprobada y cerrada' : 'recibida en revisión'}
                                    </h3>
                                    <p className="text-xs text-muted-foreground">
                                        Has completado tu postulación para el rol de <strong>{typeof call.role?.name === 'object' ? (call.role?.name as any)?.[locale] : call.role?.name || 'Participante'}</strong>.
                                    </p>
                                </div>
                            </div>
                            
                            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                                <Link href={`/${locale}/dashboard/convocatorias/mis-postulaciones`}>
                                    <Button variant="outline" size="sm" className="rounded-md shadow-sm text-xs px-3 h-8">
                                        Ver mis postulaciones
                                    </Button>
                                </Link>
                                <span className={`flex items-center px-2.5 py-1 text-xs font-semibold rounded-md border shadow-sm ${
                                    isApproved ? 'bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800' : statusConfig[existingApplication.status]?.color || 'bg-slate-100 border'
                                }`}>
                                    {statusConfig[existingApplication.status]?.label || (isApproved ? 'Aprobada' : existingApplication.status)}
                                </span>
                            </div>
                        </div>

                        {/* 🟢 TABS MINIMALISTAS */}
                        <div className="border-b px-6 flex gap-4 text-sm font-medium">
                            <button
                                className={`py-3 px-1 border-b-2 transition-colors ${
                                    activeTab === 'info' 
                                    ? 'border-primary text-foreground font-semibold' 
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                                }`}
                                onClick={() => setActiveTab('info')}
                            >
                                Información
                            </button>
                            <button
                                className={`py-3 px-1 border-b-2 transition-colors ${
                                    activeTab === 'tracking' 
                                    ? 'border-primary text-foreground font-semibold' 
                                    : 'border-transparent text-muted-foreground hover:text-foreground'
                                }`}
                                onClick={() => setActiveTab('tracking')}
                            >
                                Seguimiento
                            </button>
                        </div>

                        <div className="p-6 space-y-6">
                            {/* 🟢 TAB: INFORMACIÓN */}
                            {activeTab === 'info' && (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs border rounded-xl p-4 bg-muted/20 dark:bg-muted/10 shadow-sm mx-auto w-full">
                                        <div className="flex flex-col gap-2">
                                            <h2 className="font-semibold text-muted-foreground text-left">Rol Postulado</h2>
                                            <p className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 mt-0.5 text-sm">
                                                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                                {typeof call.role?.name === 'object' ? (call.role?.name as any)?.[locale] : call.role?.name || 'Participante'}
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-2">
                                            <h2 className="font-semibold text-muted-foreground text-left">Fecha de Postulación</h2>
                                            <p className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 mt-0.5 text-sm">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                {format(new Date(existingApplication.submitted_at), "dd/MM/yyyy")}
                                            </p>
                                        </div>
                                    </div>

                                    {existingApplication.submitted_data && Object.keys(existingApplication.submitted_data).length > 0 && (
                                        <div className="bg-background dark:bg-muted/10 rounded-xl p-4 text-left border shadow-sm mx-auto mt-4 space-y-2 w-full">
                                            <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-bold border-b pb-1">Datos Enviados</h4>
                                            <dl className="grid grid-cols-1 gap-x-4 gap-y-2 mt-1">
                                                {Object.entries(existingApplication.submitted_data).map(([key, value]) => {
                                                    const field = call.form_schema?.find((f: any) => f.id === key);
                                                    const label = field?.label || key;
                                                    return (
                                                        <div key={key} className="flex flex-col">
                                                            <dt className="text-xs font-semibold text-foreground/80">{label}</dt>
                                                            <dd className="text-sm text-muted-foreground break-all">
                                                                {typeof value === 'string' && value.startsWith('http') ? (
                                                                    <a href={value} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1">
                                                                        <FileText className="h-3.5 w-3.5" /> Ver archivo
                                                                    </a>
                                                                ) : typeof value === 'boolean' ? (value ? 'Sí' : 'No') : String(value)}
                                                            </dd>
                                                        </div>
                                                    )
                                                })}
                                            </dl>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* 🟢 TAB: SEGUIMIENTO */}
                            {activeTab === 'tracking' && (
                                <div className="space-y-4 mx-auto w-full">
                                    <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-bold border-b pb-1">Historial de Seguimiento</h4>
                                    <div className="relative pl-5 border-l-2 border-slate-200 dark:border-slate-800 space-y-5 mt-3">
                                        {timeline.map((item) => (
                                            <div key={item.id} className="relative flex items-start gap-3">
                                                <div className="absolute left-[-23px] w-4 h-4 rounded-full bg-background border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center mt-0.5">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-slate-400"></div>
                                                </div>
                                                <div className="flex-1 text-xs">
                                                    {item.type === 'comment' ? (
                                                        <div>
                                                            <span className="font-semibold text-foreground">{item.data.author?.first_name || 'Comité'}:</span> {item.data.content}
                                                        </div>
                                                    ) : (
                                                        <div>
                                                            <span className="text-muted-foreground">Estado: </span>
                                                            <span className={`font-bold px-1.5 py-0.5 text-[10px] rounded border ${statusConfig[item.data.new_status || '']?.color || 'bg-slate-100'}`}>
                                                                {statusConfig[item.data.new_status || '']?.label || item.data.new_status}
                                                            </span>
                                                            {item.data.justification && <p className="mt-1 text-muted-foreground italic">"{item.data.justification}"</p>}
                                                        </div>
                                                    )}
                                                    <span className="text-[10px] text-muted-foreground block mt-1">{format(item.date, "dd/MM/yyyy HH:mm")}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
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
