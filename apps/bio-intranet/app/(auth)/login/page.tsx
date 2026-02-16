'use client'

import { useActionState } from 'react'
import { login } from './actions'
import Link from 'next/link'

const initialState = {
    error: '',
}

export default function LoginPage() {
    const [loginState, loginAction, isLoginPending] = useActionState(async (state: any, payload: FormData) => {
        const result = await login(payload);
        if (result?.error) return { error: result.error };
        return { error: '' };
    }, initialState)

    return (
        <div className="mx-auto grid gap-6">
            <div className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">Login</h1>
                <p className="text-muted-foreground">
                    Enter your email below to login to your account
                </p>
            </div>
            <form action={loginAction} className="grid gap-4">
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
                <div className="grid gap-2">
                    <div className="flex items-center">
                        <label htmlFor="password">Password</label>
                        <Link
                            href="/forgot-password"
                            className="ml-auto inline-block text-sm underline text-primary"
                        >
                            Forgot your password?
                        </Link>
                    </div>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        required
                        className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    />
                </div>
                {loginState?.error && (
                    <div className="text-sm font-medium text-destructive">
                        {loginState.error}
                    </div>
                )}
                <button type="submit" disabled={isLoginPending} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 w-full">
                    {isLoginPending ? 'Logging in...' : 'Login'}
                </button>
            </form>

            <div className="text-center text-sm">
                Don't have an account?{" "}
                <Link href="/signup" className="underline text-primary">
                    Sign up
                </Link>
            </div>
        </div>
    )
}
