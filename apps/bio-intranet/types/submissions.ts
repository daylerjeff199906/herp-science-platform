import { Clock, FileText, MessageSquare, AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

export type SubmissionStatus = 'draft' | 'submitted' | 'under_review' | 'changes_requested' | 'approved' | 'rejected';

export const statusConfig: Record<SubmissionStatus, { 
    label: string; 
    color: string; 
    border: string; 
    icon: any; 
    iconColor: string; 
    hoverColor: string; 
}> = {
    draft: { label: 'Borrador', color: 'bg-slate-100 text-slate-700', border: 'border-slate-200', icon: Clock, iconColor: 'text-slate-500', hoverColor: 'hover:bg-slate-200/80' },
    submitted: { label: 'Presentado', color: 'bg-blue-50 text-blue-700', border: 'border-blue-200', icon: FileText, iconColor: 'text-blue-500', hoverColor: 'hover:bg-blue-100/80' },
    under_review: { label: 'En Revisión Comité', color: 'bg-amber-50 text-amber-700', border: 'border-amber-200', icon: MessageSquare, iconColor: 'text-amber-500', hoverColor: 'hover:bg-amber-100/80' },
    changes_requested: { label: 'Cambios Solicitados', color: 'bg-orange-50 text-orange-700', border: 'border-orange-200', icon: AlertTriangle, iconColor: 'text-orange-500', hoverColor: 'hover:bg-orange-100/80' },
    approved: { label: 'Aprobado', color: 'bg-emerald-50 text-emerald-700', border: 'border-emerald-200', icon: CheckCircle2, iconColor: 'text-emerald-500', hoverColor: 'hover:bg-emerald-100/80' },
    rejected: { label: 'Rechazado', color: 'bg-rose-50 text-rose-700', border: 'border-rose-200', icon: XCircle, iconColor: 'text-rose-500', hoverColor: 'hover:bg-rose-100/80' },
};
