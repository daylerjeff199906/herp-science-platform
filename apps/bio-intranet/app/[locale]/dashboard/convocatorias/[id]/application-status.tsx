'use client';

import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CheckCircle2, Calendar, FileText, Info } from "lucide-react";
import Link from "next/link";
import { createClient } from "@/utils/supabase/client";
import { Button } from "@/components/ui/button";
import { ApplicationClient } from "./application-client";
import { RichTextRenderer } from '@/components/RichTextRenderer';

export interface ApplicationStatusProps {
    isParticipant: boolean;
    existingApplication?: {
        id?: string;
        status?: string;
        submitted_at?: string;
        submitted_data?: Record<string, unknown>;
        submission?: {
            id?: string;
            metadata?: Record<string, any>;
            comments?: Array<{
                id?: string;
                content?: string;
                created_at?: string;
                author?: { first_name?: string; last_name?: string } | Array<{ first_name?: string; last_name?: string }> | null;
            }>;
            history?: Array<{
                id?: string;
                new_status?: string;
                justification?: string | null;
                created_at?: string;
                profile?: { first_name?: string; last_name?: string; email?: string } | Array<{ first_name?: string; last_name?: string; email?: string }> | null;
            }>;
        } | null;
    } | null;
    isClosed: boolean;
    call?: {
        id?: string;
        title?: string | Record<string, string | undefined>;
        description?: string | Record<string, string | undefined>;
        content?: unknown;
        auto_approve?: boolean;
        form_schema?: unknown[];
        role?: {
            name?: string | Record<string, string | undefined>;
        };
    } | null;
    userProfile?: { id?: string } | null;
    locale: string;
}

const statusConfig: Record<string, { label: string; color: string }> = {
    draft: { label: 'Borrador', color: 'text-slate-500 bg-slate-100' },
    submitted: { label: 'Presentado', color: 'text-blue-600 bg-blue-100 border-blue-200' },
    under_review: { label: 'En Revisión', color: 'text-amber-600 bg-amber-100 border-amber-200' },
    changes_requested: { label: 'Cambios Solicitados', color: 'text-orange-500 bg-orange-100 border-orange-200' },
    approved: { label: 'Aprobado', color: 'text-primary bg-primary/10 border-primary/20' },
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
    const [activeTab, setActiveTab] = useState<'desc' | 'form' | 'tracking'>(
        existingApplication && existingApplication.status !== 'draft' ? 'tracking' : (existingApplication?.status === 'draft' ? 'form' : 'desc')
    );
    const isAutoApproved = call?.auto_approve;

    const supabase = createClient();
    const handleRevertToDraft = async () => {
        if (!existingApplication?.submission?.id) return;
        const { error } = await supabase
            .from('event_submissions')
            .update({ status: 'draft' })
            .eq('id', existingApplication.submission.id);

        if (!error) {
            window.location.reload();
        }
    };

    const sub = existingApplication?.submission;
    const timeline = sub ? [
        ...(sub.comments || []).map((c) => ({
            type: 'comment' as const,
            id: `comment-${c.id || Math.random()}`,
            date: new Date(c.created_at || Date.now()),
            data: c
        })),
        ...(sub.history || []).map((h) => ({
            type: 'history' as const,
            id: `history-${h.id || Math.random()}`,
            date: new Date(h.created_at || Date.now()),
            data: h
        }))
    ].sort((a, b) => a.date.getTime() - b.date.getTime()) : existingApplication ? [
        {
            type: 'history' as const,
            id: 'initial',
            date: new Date(existingApplication.submitted_at || Date.now()),
            data: {
                new_status: existingApplication.status,
                justification: 'Postulación recibida y registrada en el sistema.'
            }
        }
    ] : [];

    const isApproved = existingApplication?.status === 'approved' || isParticipant;

    const roleName = call?.role?.name;
    const currentRoleString = typeof roleName === 'object' && roleName ? roleName[locale] : (typeof roleName === 'string' ? roleName : 'Participante');

    const callTitle = call?.title;
    const currentCallTitle = typeof callTitle === 'object' && callTitle ? callTitle[locale] : (typeof callTitle === 'string' ? callTitle : 'Convocatoria');

    const callDescription = call?.description;
    const currentCallDescription = typeof callDescription === 'object' && callDescription ? callDescription[locale] : (typeof callDescription === 'string' ? callDescription : 'No hay descripción detallada disponible.');

    return (
        <div className="space-y-6 w-full">
            {/* 🟢 BANNER ESTILO GITHUB (Solo si ya interactuó o está cerrado) */}
            {(existingApplication && existingApplication.status !== 'draft' || isClosed) && (
                <div className={`p-4 border rounded-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm bg-background ${isApproved ? 'bg-primary/5 dark:bg-primary/10 border-primary/20 dark:border-primary/30' :
                    isClosed && !existingApplication ? 'bg-amber-50/50 dark:bg-amber-900/10 border-amber-200' :
                        'bg-blue-50/50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/50'
                    }`}>
                    <div className="flex items-start gap-3">
                        <div className={`p-1.5 rounded-full mt-0.5 ${isApproved ? 'bg-primary/10 dark:bg-primary/20 text-primary' :
                            isClosed && !existingApplication ? 'bg-amber-100 text-amber-600' : 'bg-blue-100 text-blue-600'
                            }`}>
                            {isClosed && !existingApplication ? <Info className="h-5 w-5" /> : <CheckCircle2 className="h-5 w-5" />}
                        </div>
                        <div className="space-y-0.5">
                            <h3 className="font-bold text-slate-900 dark:text-slate-100 text-sm flex items-center gap-2">
                                {isApproved ? 'Postulación aprobada y cerrada' :
                                    isClosed && !existingApplication ? 'Convocatoria finalizada' : 'Postulación recibida en revisión'}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                                {isClosed && !existingApplication ? 'Esta convocatoria ya no acepta postulaciones.' :
                                    `Has completado tu postulación para el rol de ${currentRoleString}.`}
                            </p>
                        </div>
                    </div>

                    <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
                        <Link href={`/${locale}/dashboard/convocatorias/mis-postulaciones`}>
                            <Button variant="outline" size="sm" className="rounded-md shadow-sm text-xs px-3 h-8">
                                Ver mis postulaciones
                            </Button>
                        </Link>
                        {existingApplication && existingApplication.status !== 'draft' && !isClosed && !isApproved && (
                            <Button
                                onClick={handleRevertToDraft}
                                variant="outline"
                                size="sm"
                                className="rounded-md shadow-sm text-xs px-3 h-8 bg-amber-50 text-amber-600 hover:bg-amber-100 border-amber-200"
                            >
                                Volver a Borrador
                            </Button>
                        )}
                        {existingApplication && (
                            <span className={`flex items-center px-2.5 py-1 text-xs font-semibold rounded-md border shadow-sm ${isApproved ? 'bg-primary/10 text-primary border-primary/20 dark:bg-primary/20' : statusConfig[existingApplication.status || '']?.color || 'bg-slate-100'
                                }`}>
                                {statusConfig[existingApplication.status || '']?.label || (isApproved ? 'Aprobada' : existingApplication.status)}
                            </span>
                        )}
                    </div>
                </div>
            )}

            {/* 🟢 TABS MINIMALISTAS - CONTENEDOR PRINCIPAL */}
            <div className="border rounded-xl bg-background shadow-sm overflow-hidden">
                <div className="border-b px-6 flex gap-6 text-sm font-medium bg-muted/20">
                    <button
                        className={`py-3 px-1 border-b-2 transition-colors ${activeTab === 'desc'
                            ? 'border-primary text-foreground font-semibold'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                        onClick={() => setActiveTab('desc')}
                    >
                        Descripción
                    </button>
                    <button
                        className={`py-3 px-1 border-b-2 transition-colors ${activeTab === 'form'
                            ? 'border-primary text-foreground font-semibold'
                            : 'border-transparent text-muted-foreground hover:text-foreground'
                            }`}
                        onClick={() => setActiveTab('form')}
                    >
                        {existingApplication ? 'Mis Respuestas' : 'Formulario'}
                    </button>
                    {existingApplication && (
                        <button
                            className={`py-3 px-1 border-b-2 transition-colors ${activeTab === 'tracking'
                                ? 'border-primary text-foreground font-semibold'
                                : 'border-transparent text-muted-foreground hover:text-foreground'
                                }`}
                            onClick={() => setActiveTab('tracking')}
                        >
                            Seguimiento
                        </button>
                    )}
                </div>

                <div className="p-6">
                    {/* 🟢 TAB 1: DESCRIPCIÓN */}
                    {activeTab === 'desc' && (
                        <div className="prose prose-slate dark:prose-invert max-w-none">
                            <h2 className="text-xl font-bold mb-4 border-b pb-2">Descripción del Evento</h2>
                            <div className="whitespace-pre-wrap text-muted-foreground mb-6 text-sm">
                                {currentCallDescription}
                            </div>

                            {Boolean(call?.content) && (
                                <div className="mt-4">
                                    <RichTextRenderer
                                        content={
                                            (() => {
                                                let d = call?.content;
                                                if (typeof d === 'string') { try { d = JSON.parse(d); } catch (e) { return null; } }
                                                if (!d || typeof d !== 'object') return null;
                                                const anyD = d as Record<string, unknown>;
                                                if (Array.isArray(anyD.blocks)) return anyD as { blocks: unknown[] };
                                                const loc = anyD[locale] as Record<string, unknown> | undefined;
                                                if (loc && Array.isArray(loc.blocks)) return loc as { blocks: unknown[] };
                                                if (Array.isArray(d)) return { blocks: d };
                                                return null;
                                            })()
                                        }
                                    />
                                </div>
                            )}
                        </div>
                    )}

                    {/* 🟢 TAB 2: FORMULARIO Y RESPUESTAS */}
                    {activeTab === 'form' && (
                        <div className="space-y-6">
                            {existingApplication && existingApplication.status !== 'draft' ? (
                                <div className="space-y-6">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs border rounded-xl p-4 bg-muted/20 dark:bg-muted/10 shadow-sm w-full">
                                        <div className="flex flex-col gap-1">
                                            <span className="font-semibold text-muted-foreground">Rol Postulado</span>
                                            <p className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 mt-0.5 text-sm">
                                                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                                                {currentRoleString}
                                            </p>
                                        </div>
                                        <div className="flex flex-col gap-1">
                                            <span className="font-semibold text-muted-foreground">Fecha de Postulación</span>
                                            <p className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5 mt-0.5 text-sm">
                                                <Calendar className="h-4 w-4 text-muted-foreground" />
                                                {existingApplication.submitted_at ? format(new Date(existingApplication.submitted_at), "dd/MM/yyyy") : '-'}
                                            </p>
                                        </div>
                                    </div>

                                    {existingApplication.submitted_data && Object.keys(existingApplication.submitted_data).length > 0 && (
                                        <div className="bg-background dark:bg-muted/10 rounded-xl p-4 border shadow-sm space-y-2 w-full">
                                            <h4 className="text-xs uppercase tracking-wider text-muted-foreground font-bold border-b pb-1">Datos Enviados</h4>
                                            <dl className="grid grid-cols-1 gap-y-3 mt-2">
                                                {Object.entries(existingApplication.submitted_data).map(([key, value]) => {
                                                    const field = call?.form_schema?.find((f) => (f as Record<string, unknown>).id === key) as Record<string, unknown> | undefined;
                                                    const label = (field?.label as string) || key;
                                                    return (
                                                        <div key={key} className="flex flex-col border-b pb-2 last:border-0">
                                                            <dt className="text-xs font-semibold text-foreground/80">{label}</dt>
                                                            <dd className="text-sm text-muted-foreground mt-0.5 break-all">
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
                            ) : isClosed ? (
                                <div className="bg-muted/50 p-6 text-center rounded-lg border">
                                    <p className="text-muted-foreground text-sm">Esta convocatoria fue cerrada y ya no acepta respuestas.</p>
                                </div>
                            ) : userProfile ? (
                                <ApplicationClient
                                    callId={call?.id || ''}
                                    schema={(call?.form_schema as any[]) || []}
                                    profileId={userProfile.id || ''}
                                    locale={locale}
                                    call={call as any}
                                    disabled={false}
                                    initialSubmissionId={existingApplication?.submission?.id}
                                    initialDataProp={existingApplication?.submission?.metadata || {}}
                                />
                            ) : (
                                <div className="bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 p-6 rounded-lg flex items-start gap-3">
                                    <Info className="h-5 w-5 mt-0.5 fle-shrink-0" />
                                    <div>
                                        <h3 className="font-bold text-sm">Debes completar tu perfil</h3>
                                        <p className="text-xs">No se pudo encontrar tu perfil de usuario para procesar la postulación.</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {/* 🟢 TAB 3: SEGUIMIENTO */}
                    {activeTab === 'tracking' && existingApplication && (
                        <div className="space-y-4 w-full">
                            <h4 className="text-xs uppercase tracking-wider font-bold border-b pb-1">Historial de Seguimiento</h4>
                            <div className="relative pl-6 border-l space-y-6 mt-4">
                                {timeline.map((item) => {
                                    if (item.type === 'comment') {
                                        const author = item.data.author;
                                        const authorName = Array.isArray(author) ? author[0]?.first_name : author?.first_name;
                                        return (
                                            <div key={item.id} className="relative">
                                                {/* Left Circular Avatar Node */}
                                                <div className="absolute left-[-36px] w-6 h-6 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center font-bold text-[10px] text-primary border-2 border-background">
                                                    {(authorName?.charAt(0) || 'C').toUpperCase()}
                                                </div>

                                                {/* Github Comment Box */}
                                                <div className="rounded-xl border bg-background shadow-sm overflow-hidden text-sm">
                                                    <div className="border-b px-4 py-2 text-[11px] font-medium text-slate-500 dark:text-slate-400 flex justify-between items-center">
                                                        <div className="flex items-center gap-1.5 flex-wrap">
                                                            <span className="font-semibold text-foreground">{authorName || 'Comité'}</span>
                                                            <span>comentó</span>
                                                            {(item.data as any).file?.file_name && (
                                                                <span className="text-[10px] px-1.5 py-0 bg-slate-100 border border-slate-200 text-slate-600 rounded-full flex items-center gap-1 font-medium shadow-none">
                                                                    <FileText className="h-2.5 w-2.5 text-slate-400" /> Sobre: {(item.data as any).file.file_name}
                                                                </span>
                                                            )}
                                                        </div>
                                                        <span>{format(item.date, "dd/MM/yyyy HH:mm")}</span>
                                                    </div>
                                                    <div className="p-4 text-slate-700 dark:text-slate-300 leading-relaxed text-xs">
                                                        {item.data.content}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    } else {
                                        return (
                                            <div key={item.id} className="relative flex flex-col sm:flex-row sm:items-center gap-2 text-xs text-muted-foreground">
                                                {/* Status Dot Node */}
                                                <div className="absolute left-[-28.5px] w-2.5 h-2.5 rounded-full bg-background border-2 border-slate-400 dark:border-slate-500 flex items-center justify-center">
                                                    <div className="w-1 h-1 rounded-full bg-slate-400 dark:bg-slate-500"></div>
                                                </div>

                                                <div className="flex items-center gap-1.5 flex-wrap">
                                                    <span>Cambió el estado a:</span>
                                                    <span className={`font-bold px-1.5 py-0.5 text-[10px] rounded-full border shadow-sm ${statusConfig[item.data.new_status || '']?.color || 'bg-slate-100'}`}>
                                                        {statusConfig[item.data.new_status || '']?.label || item.data.new_status}
                                                    </span>
                                                    {item.data.justification && (
                                                        <span className="text-slate-400 dark:text-slate-500 italic block sm:inline">
                                                            - "{item.data.justification}"
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
