'use client'

import { useActionState } from 'react'
import { forgotPassword } from './actions'
import Link from 'next/link'

const initialState = {
    error: '',
    success: '',
}

export default function ForgotPasswordPage() {
    const [state, action, isPending] = useActionState(async (state: any, payload: FormData) => {
        const result = await forgotPassword(payload);
        if (result?.error) return { error: result.error, success: '' };
        if (result?.success) return { error: '', success: result.success };
        return { error: '', success: '' };
    }, initialState)

    return (
        <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">Forgot Password</h1>
                <p className="text-muted-foreground">
                    Enter your email to reset your password
                </p>
            </div>
            <form action={action} className="grid gap-4">
                <div className="grid gap-2">
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="m@example.com"
                        required
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>

                {state?.error && <div className="text-sm font-medium text-destructive">{state.error}</div>}
                {state?.success && <div className="text-sm font-medium text-green-600">{state.success}</div>}

                <button type="submit" disabled={isPending} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full">
                    {isPending ? 'Sending...' : 'Send Reset Link'}
                </button>
            </form>
            <div className="text-center text-sm">
                Remember your password?{" "}
                <Link href="/login" className="underline text-primary">
                    Log in
                </Link>
            </div>
        </div>
    )
}
