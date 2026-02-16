'use client'

import { useActionState } from 'react'
import { login, signup } from './actions'
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

    const [signupState, signupAction, isSignupPending] = useActionState(async (state: any, payload: FormData) => {
        const result = await signup(payload);
        if (result?.error) return { error: result.error };
        return { error: '' };
    }, initialState)

    return (
        <div className="mx-auto grid w-[350px] gap-6">
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

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or continue with
                    </span>
                </div>
            </div>

            {/* Separate form for sign up just to use the action correctly */}
            <form action={signupAction}>
                <button type="submit" disabled={isSignupPending} className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2 w-full">
                    {isSignupPending ? 'Signing up...' : 'Sign up'}
                </button>
                {signupState?.error && (
                    <div className="text-sm font-medium text-destructive mt-2 text-center">
                        {signupState.error}
                    </div>
                )}
            </form>
        </div>
    )
}
