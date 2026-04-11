'use client';

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}

interface PasswordStrengthProps {
    checks: {
        length: boolean;
        uppercase: boolean;
        lowercase: boolean;
        number: boolean;
        special: boolean;
    };
}

export function PasswordStrength({ checks }: PasswordStrengthProps) {
    return (
        <div className="space-y-2 text-sm text-muted-foreground bg-muted/50 p-3 rounded-md border text-xs">
            <div className="flex items-center gap-2">
                {checks.length ? (
                    <CheckIcon className="h-4 w-4 text-green-500" />
                ) : (
                    <div className="h-4 w-4 border rounded-full" />
                )}
                <span>Al menos 8 caracteres</span>
            </div>
            <div className="flex items-center gap-2">
                {checks.uppercase ? (
                    <CheckIcon className="h-4 w-4 text-green-500" />
                ) : (
                    <div className="h-4 w-4 border rounded-full" />
                )}
                <span>Una letra mayúscula</span>
            </div>
            <div className="flex items-center gap-2">
                {checks.lowercase ? (
                    <CheckIcon className="h-4 w-4 text-green-500" />
                ) : (
                    <div className="h-4 w-4 border rounded-full" />
                )}
                <span>Una letra minúscula</span>
            </div>
            <div className="flex items-center gap-2">
                {checks.number ? (
                    <CheckIcon className="h-4 w-4 text-green-500" />
                ) : (
                    <div className="h-4 w-4 border rounded-full" />
                )}
                <span>Un número</span>
            </div>
            <div className="flex items-center gap-2">
                {checks.special ? (
                    <CheckIcon className="h-4 w-4 text-green-500" />
                ) : (
                    <div className="h-4 w-4 border rounded-full" />
                )}
                <span>Un carácter especial (@$!%*?&)</span>
            </div>
        </div>
    );
}
