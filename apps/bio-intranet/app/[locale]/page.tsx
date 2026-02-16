import { useTranslations } from 'next-intl';
import { Button } from "@repo/ui/components/ui/button";
import Link from 'next/link';

export default function Page() {
    const t = useTranslations('Auth');

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-24 gap-4">
            <h1 className="text-4xl font-bold">{t('welcome')} to Bio Intranet</h1>
            <div className="flex gap-4">
                <Button asChild>
                    <Link href="/login">{t('login')}</Link>
                </Button>
                <Button variant="outline" asChild>
                    <Link href="/signup">{t('signup')}</Link>
                </Button>
            </div>
        </main>
    );
}
