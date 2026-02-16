
import OnboardingForm from './form';

export default function OnboardingPage() {
    return (
        <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-1 lg:px-0">
            <div className="lg:p-8">
                <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[500px]">
                    <div className="flex flex-col space-y-2 text-center">
                        <h1 className="text-2xl font-semibold tracking-tight">
                            Welcome to Bio Intranet
                        </h1>
                        <p className="text-sm text-muted-foreground">
                            Please complete your academic profile to continue.
                        </p>
                    </div>
                    <OnboardingForm />
                </div>
            </div>
        </div>
    )
}
