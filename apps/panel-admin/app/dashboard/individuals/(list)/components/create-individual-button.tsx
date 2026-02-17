'use client';

import Link from 'next/link';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ROUTES } from '@/config';

export function CreateIndividualButton() {
    return (
        <Button className='rounded-full' asChild>
            <Link href={`${ROUTES.CORE.INDIVIDUALS}/create`}>
                <Plus className="mr-2 h-4 w-4" />
                Nuevo Individuo
            </Link>
        </Button>
    );
}
