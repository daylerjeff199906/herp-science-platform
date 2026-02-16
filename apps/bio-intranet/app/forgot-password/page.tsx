'use client'

import { useActionState } from 'react'
import { forgotPassword } from './actions'

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
        <div className="flex min-h-screen flex-col items-center justify-center p-24">
            <form className="flex w-full max-w-md flex-col gap-4">
                <h1 className="text-2xl font-bold">Forgot Password</h1>
                <label htmlFor="email">Email:</label>
                <input id="email" name="email" type="email" required className="border p-2 rounded" />

                {state?.error && <p className="text-red-500">{state.error}</p>}
                {state?.success && <p className="text-green-500">{state.success}</p>}

                <button formAction={action} disabled={isPending} className="bg-blue-500 text-white p-2 rounded">
                    {isPending ? 'Sending...' : 'Send Reset Link'}
                </button>
            </form>
        </div>
    )
}
