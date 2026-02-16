'use client';

import { useActionState } from 'react';
import { submitOnboarding } from './actions';

export default function OnboardingForm() {
    const [state, formAction, isPending] = useActionState(submitOnboarding, null);

    return (
        <form action={formAction} className="grid gap-6 py-4">
            <div className="grid gap-2">
                <label htmlFor="institution" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Institution / University</label>
                <input id="institution" name="institution" placeholder="e.g. National University" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                {(state?.errors as any)?.institution && <p className="text-destructive text-sm">{(state?.errors as any).institution}</p>}
            </div>

            <div className="grid gap-2">
                <label htmlFor="degree" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Degree / Title</label>
                <input id="degree" name="degree" placeholder="e.g. Biologist" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                {(state?.errors as any)?.degree && <p className="text-destructive text-sm">{(state?.errors as any).degree}</p>}
            </div>

            <div className="grid gap-2">
                <label htmlFor="fieldOfStudy" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Field of Study</label>
                <input id="fieldOfStudy" name="fieldOfStudy" placeholder="e.g. Herpetology" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                {(state?.errors as any)?.fieldOfStudy && <p className="text-destructive text-sm">{(state?.errors as any).fieldOfStudy}</p>}
            </div>

            {state?.message && <p className="text-destructive text-sm">{state.message}</p>}

            <div className="flex justify-end">
                <button type="submit" className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full sm:w-auto" disabled={isPending}>
                    Complete Profile
                </button>
            </div>
        </form>
    );
}
