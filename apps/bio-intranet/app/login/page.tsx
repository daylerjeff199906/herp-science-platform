'use client'

import { useActionState } from 'react'
import { login, signup } from './actions'

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
        <div className="flex min-h-screen flex-col items-center justify-center p-24">
            <form className="flex w-full max-w-md flex-col gap-4">
                <h1 className="text-2xl font-bold">Log in</h1>
                <label htmlFor="email">Email:</label>
                <input id="email" name="email" type="email" required className="border p-2 rounded" />

                <label htmlFor="password">Password:</label>
                <input id="password" name="password" type="password" required className="border p-2 rounded" />

                <a href="/forgot-password" className="text-sm text-blue-500 hover:underline">Forgot password?</a>

                {loginState?.error && <p className="text-red-500">{loginState.error}</p>}
                {signupState?.error && <p className="text-red-500">{signupState.error}</p>}

                <button formAction={loginAction} disabled={isLoginPending} className="bg-blue-500 text-white p-2 rounded">
                    {isLoginPending ? 'Logging in...' : 'Log in'}
                </button>
                <button formAction={signupAction} disabled={isSignupPending} className="bg-green-500 text-white p-2 rounded">
                    {isSignupPending ? 'Signing up...' : 'Sign up'}
                </button>
            </form>
        </div>
    )
}
