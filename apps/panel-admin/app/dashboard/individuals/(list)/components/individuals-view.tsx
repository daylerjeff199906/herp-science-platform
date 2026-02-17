'use client';

import { useState } from 'react';
import { Individual, IndividualResponse } from '@repo/shared-types';
import { IndividualsTable } from './individuals-table';
import { PaginationCustom } from '@/components/ui/pagination-custom';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import {
    changeStatusIndividual,
    deleteIndividual,
} from '@/services/individuals';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface IndividualsViewProps {
    individuals: IndividualResponse;
}

export function IndividualsView({
    individuals,
}: IndividualsViewProps) {
    const router = useRouter();
    const [confirmDialog, setConfirmDialog] = useState<{
        open: boolean;
        title: string;
        description: string;
        onConfirm: () => void;
        isLoading: boolean;
        variant: 'default' | 'destructive';
    }>({
        open: false,
        title: '',
        description: '',
        onConfirm: () => { },
        isLoading: false,
        variant: 'default',
    });

    const handleStatusChange = (individual: Individual) => {
        const newStatus = individual.status === 1 ? 0 : 1;
        const actionText = newStatus === 1 ? 'activar' : 'desactivar';

        setConfirmDialog({
            open: true,
            title: `¿${newStatus === 1 ? 'Activar' : 'Desactivar'} individuo?`,
            description: `¿Está seguro que desea ${actionText} el individuo con código "${individual.code || 'N/A'}"?`,
            onConfirm: async () => {
                setConfirmDialog((prev) => ({ ...prev, isLoading: true }));
                try {
                    const result = await changeStatusIndividual(individual.id);
                    if (result.success) {
                        toast.success(result.message || `Individuo ${actionText}do correctamente`);
                        router.refresh();
                    } else {
                        toast.error(typeof result.error === 'string' ? result.error : 'Error al cambiar el estado');
                    }
                } catch (error) {
                    toast.error('Error al cambiar el estado del individuo');
                } finally {
                    setConfirmDialog((prev) => ({ ...prev, open: false, isLoading: false }));
                }
            },
            isLoading: false,
            variant: newStatus === 0 ? 'destructive' : 'default',
        });
    };

    const handleDelete = (individual: Individual) => {
        setConfirmDialog({
            open: true,
            title: '¿Eliminar individuo?',
            description: `¿Está seguro que desea eliminar el individuo con código "${individual.code || 'N/A'}"? Esta acción no se puede deshacer.`,
            onConfirm: async () => {
                setConfirmDialog((prev) => ({ ...prev, isLoading: true }));
                try {
                    const result = await deleteIndividual(individual.id);
                    if (result.success) {
                        toast.success(result.message || 'Individuo eliminado correctamente');
                        router.refresh();
                    } else {
                        toast.error(typeof result.error === 'string' ? result.error : 'Error al eliminar');
                    }
                } catch (error) {
                    toast.error('Error al eliminar el individuo');
                } finally {
                    setConfirmDialog((prev) => ({ ...prev, open: false, isLoading: false }));
                }
            },
            isLoading: false,
            variant: 'destructive',
        });
    };

    return (
        <div className="flex flex-col gap-4">

            <IndividualsTable
                data={individuals.data}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
            />

            <PaginationCustom
                currentPage={individuals.currentPage}
                totalPages={individuals.totalPages}
                totalItems={individuals.totalItems}
                pageSize={10}
            />

            <ConfirmDialog
                open={confirmDialog.open}
                onOpenChange={(open) => setConfirmDialog((prev) => ({ ...prev, open }))}
                title={confirmDialog.title}
                description={confirmDialog.description}
                onConfirm={confirmDialog.onConfirm}
                isLoading={confirmDialog.isLoading}
                variant={confirmDialog.variant}
                confirmText="Confirmar"
                cancelText="Cancelar"
            />
        </div>
    );
}
