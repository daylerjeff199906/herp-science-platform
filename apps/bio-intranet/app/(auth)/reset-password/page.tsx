'use client'

import { useActionState } from 'react'
import { resetPassword } from './actions'
import Link from 'next/link'

const initialState = {
    error: '',
}

export default function ResetPasswordPage() {
    const [state, action, isPending] = useActionState(async (state: any, payload: FormData) => {
        const result = await resetPassword(payload);
        if (result?.error) return { error: result.error };
        return { error: '' };
    }, initialState)

    return (
        <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">Reset Password</h1>
                <p className="text-muted-foreground">
                    Enter your new password below.
                </p>
            </div>
            <form action={action} className="grid gap-4">
                <div className="grid gap-2">
                    <label htmlFor="password">New Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>

                {state?.error && <div className="text-sm font-medium text-destructive">{state.error}</div>}

                <button type="submit" disabled={isPending} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full">
                    {isPending ? 'Updating...' : 'Update Password'}
                </button>
            </form>
        </div>
    )
}
