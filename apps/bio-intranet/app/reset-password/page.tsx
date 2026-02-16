'use client'

import { useActionState } from 'react'
import { resetPassword } from './actions'

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
        <div className="flex min-h-screen flex-col items-center justify-center p-24">
            <form className="flex w-full max-w-md flex-col gap-4">
                <h1 className="text-2xl font-bold">Reset Password</h1>
                <label htmlFor="password">New Password:</label>
                <input id="password" name="password" type="password" required className="border p-2 rounded" />

                {state?.error && <p className="text-red-500">{state.error}</p>}

                <button formAction={action} disabled={isPending} className="bg-blue-500 text-white p-2 rounded">
                    {isPending ? 'Updating...' : 'Update Password'}
                </button>
            </form>
        </div>
    )
}
