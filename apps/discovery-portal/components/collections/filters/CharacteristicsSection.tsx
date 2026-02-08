'use client';

import React from 'react';
import { SmartFilter, AccordionItem, AccordionTrigger, AccordionContent } from '@repo/ui';

interface CharacteristicsSectionProps {
    searchParams: URLSearchParams;
    onUpdate: (updates: Record<string, string | null>) => void;
}

export const CharacteristicsSection: React.FC<CharacteristicsSectionProps> = ({ searchParams, onUpdate }) => {
    return (
        <AccordionItem value="characteristics" className="border-b-0">
            <AccordionTrigger className="text-sm font-semibold hover:no-underline py-2">Características</AccordionTrigger>
            <AccordionContent className="space-y-4 pt-2 px-1">
                <SmartFilter
                    className="text-xs py-1"
                    type="check"
                    label="Con Huevos"
                    value={searchParams.get('hasEggs') === '1'}
                    onChange={(val) => onUpdate({ hasEggs: val ? '1' : null })}
                />
                <SmartFilter
                    className="text-xs py-1"
                    type="check"
                    label="Con Imagenes"
                    value={searchParams.get('hasImages') === '1'}
                    onChange={(val) => onUpdate({ hasImages: val ? '1' : null })}
                />
                <SmartFilter
                    className="text-xs py-1"
                    type="check"
                    label="Con Código Genético"
                    value={searchParams.get('barcode') === '1'}
                    onChange={(val) => onUpdate({ barcode: val ? '1' : null })}
                />
            </AccordionContent>
        </AccordionItem>
    );
};
