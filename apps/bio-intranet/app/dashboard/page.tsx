
'use client'

import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'

export default function DashboardPage() {
    const searchParams = useSearchParams()
    const isNewUser = searchParams.get('welcome') === 'true'

    useEffect(() => {
        if (isNewUser) {
            // Could trigger a toast here
            // alert("Welcome to Bio Intranet! Your profile is set up.")
        }
    }, [isNewUser])

    return (
        <div className="flex min-h-screen flex-col items-center justify-center p-24">
            <h1 className="text-4xl font-bold">Dashboard</h1>
            {isNewUser && (
                <div className="mt-4 p-4 bg-green-100 text-green-800 rounded-md border border-green-200">
                    Welcome! Your academic profile has been created successfully.
                </div>
            )}
            <p className="mt-4 text-center max-w-lg">
                This is the protected dashboard area.
            </p>
        </div>
    )
}
