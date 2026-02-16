
import SignupForm from '@/components/auth/signup-form';
import Link from 'next/link';

export default function SignupPage() {
    return (
        <div className="mx-auto grid w-[350px] gap-6">
            <div className="grid gap-2 text-center">
                <h1 className="text-3xl font-bold">Sign Up</h1>
                <p className="text-muted-foreground">
                    Enter your information to create an account
                </p>
            </div>
            <SignupForm />
            <div className="text-center text-sm">
                Already have an account?{" "}
                <Link href="/login" className="underline text-primary">
                    Log in
                </Link>
            </div>
        </div>
    )
}
