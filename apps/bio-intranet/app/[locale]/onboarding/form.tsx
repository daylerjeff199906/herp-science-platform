'use client';

import { useActionState } from 'react';
import { submitOnboarding } from './actions';
import { Alert, AlertDescription } from '@repo/ui/components/ui/alert';
import { AlertCircle } from 'lucide-react';
import { Button } from '@repo/ui/components/ui/button';

export default function OnboardingForm() {
    const [state, formAction, isPending] = useActionState(submitOnboarding, null);

    return (
        <form action={formAction} className="grid gap-6 py-4">
            <div className="grid gap-2">
                <label htmlFor="institution" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Institution / University</label>
                <input id="institution" name="institution" placeholder="e.g. National University" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                {(state?.errors as any)?.institution && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{(state?.errors as any).institution}</AlertDescription>
                    </Alert>
                )}
            </div>

            <div className="grid gap-2">
                <label htmlFor="degree" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Degree / Title</label>
                <input id="degree" name="degree" placeholder="e.g. Biologist" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                {(state?.errors as any)?.degree && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{(state?.errors as any).degree}</AlertDescription>
                    </Alert>
                )}
            </div>

            <div className="grid gap-2">
                <label htmlFor="fieldOfStudy" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Field of Study</label>
                <input id="fieldOfStudy" name="fieldOfStudy" placeholder="e.g. Herpetology" required className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50" />
                {(state?.errors as any)?.fieldOfStudy && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{(state?.errors as any).fieldOfStudy}</AlertDescription>
                    </Alert>
                )}
            </div>

            <div className="grid gap-2">
                <label htmlFor="bio" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Biography / About You</label>
                <textarea
                    id="bio"
                    name="bio"
                    placeholder="Tell us about yourself, your research interests, and what you do..."
                    rows={4}
                    className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 resize-none"
                />
                {(state?.errors as any)?.bio && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{(state?.errors as any).bio}</AlertDescription>
                    </Alert>
                )}
            </div>

            <div className="grid gap-2">
                <label htmlFor="birthYear" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Birth Year</label>
                <input
                    id="birthYear"
                    name="birthYear"
                    type="number"
                    placeholder="e.g. 1990"
                    min="1900"
                    max={new Date().getFullYear()}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                />
                {(state?.errors as any)?.birthYear && (
                    <Alert variant="destructive">
                        <AlertCircle className="h-4 w-4" />
                        <AlertDescription>{(state?.errors as any).birthYear}</AlertDescription>
                    </Alert>
                )}
            </div>

            {state?.message && (
                <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{state.message}</AlertDescription>
                </Alert>
            )}

            <div className="flex justify-end">
                <Button type="submit" className="w-full sm:w-auto" disabled={isPending}>
                    {isPending ? 'Completing Profile...' : 'Complete Profile'}
                </Button>
            </div>
        </form>
    );
}
