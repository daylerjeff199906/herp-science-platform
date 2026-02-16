'use client';

import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Individual, IndividualFilter, IndividualResponse } from '@repo/shared-types';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { IndividualsTable } from './individuals-table';
import { IndividualForm } from '@/components/forms/individual-form';
import { SmartFilter, FilterField } from '@/components/ui/smart-filter';
import { PaginationCustom } from '@/components/ui/pagination-custom';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { 
    changeStatusIndividual, 
    deleteIndividual,
} from '@/services/individuals';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { Sex, Activity, Museum, ForestType } from '@repo/shared-types';

interface IndividualsViewProps {
    individuals: IndividualResponse;
    sexes: Sex[];
    activities: Activity[];
    museums: Museum[];
    forestTypes: ForestType[];
}

export function IndividualsView({
    individuals,
    sexes,
    activities,
    museums,
    forestTypes,
}: IndividualsViewProps) {
    const router = useRouter();
    const [isSheetOpen, setIsSheetOpen] = useState(false);
    const [selectedIndividual, setSelectedIndividual] = useState<Individual | null>(null);
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
        onConfirm: () => {},
        isLoading: false,
        variant: 'default',
    });

    const filterFields: FilterField[] = [
        {
            key: 'sexId',
            label: 'Sexo',
            type: 'select',
            placeholder: 'Filtrar por sexo',
            options: sexes.map((s) => ({ value: s.id, label: s.name })),
        },
        {
            key: 'hasEggs',
            label: 'Huevos',
            type: 'boolean',
        },
        {
            key: 'activityId',
            label: 'Actividad',
            type: 'select',
            placeholder: 'Filtrar por actividad',
            options: activities.map((a) => ({ value: a.id, label: a.name })),
        },
        {
            key: 'museumId',
            label: 'Museo',
            type: 'select',
            placeholder: 'Filtrar por museo',
            options: museums.map((m) => ({ value: m.id, label: m.name })),
        },
        {
            key: 'forestTypeId',
            label: 'Tipo de Bosque',
            type: 'select',
            placeholder: 'Filtrar por tipo de bosque',
            options: forestTypes.map((f) => ({ value: f.id, label: f.name })),
        },
    ];

    const handleAdd = () => {
        setSelectedIndividual(null);
        setIsSheetOpen(true);
    };

    const handleEdit = (individual: Individual) => {
        setSelectedIndividual(individual);
        setIsSheetOpen(true);
    };

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

    const handleSheetClose = () => {
        setIsSheetOpen(false);
        setSelectedIndividual(null);
    };

    const handleFormSuccess = () => {
        setIsSheetOpen(false);
        setSelectedIndividual(null);
        router.refresh();
    };

    return (
        <div className="space-y-4">
            <div className="flex flex-col gap-4">
                <div className="flex items-end justify-between">
                    <div>
                        <h1 className="text-xl font-bold tracking-tight">Individuos</h1>
                        <p className="text-xs text-muted-foreground">
                            Administra el registro de individuos del sistema.
                        </p>
                    </div>
                    <Button onClick={handleAdd} className="text-xs">
                        <Plus className="mr-2 h-4 w-4" />
                        Nuevo Individuo
                    </Button>
                </div>

                <SmartFilter
                    fields={filterFields}
                    searchPlaceholder="Buscar por código, especie..."
                />
            </div>

            <IndividualsTable
                data={individuals.data}
                onEdit={handleEdit}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
            />

            <PaginationCustom
                currentPage={individuals.currentPage}
                totalPages={individuals.totalPages}
                totalItems={individuals.totalItems}
                pageSize={10}
            />

            <Sheet open={isSheetOpen} onOpenChange={handleSheetClose}>
                <SheetContent className="w-full sm:max-w-2xl overflow-y-auto">
                    <SheetHeader>
                        <SheetTitle className="text-sm">
                            {selectedIndividual ? 'Editar Individuo' : 'Nuevo Individuo'}
                        </SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                        <IndividualForm
                            initialData={selectedIndividual}
                            sexes={sexes}
                            activities={activities}
                            museums={museums}
                            forestTypes={forestTypes}
                            onSuccess={handleFormSuccess}
                        />
                    </div>
                </SheetContent>
            </Sheet>

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
