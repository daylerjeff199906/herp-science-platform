import { useTranslations } from 'next-intl';
import { Button } from "@repo/ui/components/ui/button";
import Link from 'next/link';
import { Network, Fingerprint, Globe2, BookOpen } from 'lucide-react';

export default function Page() {
    const t = useTranslations('Home');

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            {/* Navbar */}
            <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between px-4 md:px-8">
                    <div className="flex items-center gap-2">
                        <Fingerprint className="h-6 w-6 text-primary" />
                        <span className="font-bold text-xl tracking-tight">{t('nav.title')}</span>
                    </div>

                    <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
                        {/* Placeholder links if needed */}
                        {/* <Link href="#" className="hover:text-foreground transition-colors">Comunidad</Link> */}
                        {/* <Link href="#" className="hover:text-foreground transition-colors">Recursos</Link> */}
                    </nav>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" asChild className="hidden sm:flex">
                            <Link href="/login">{t('nav.login')}</Link>
                        </Button>
                        <Button className="rounded-full px-6" asChild>
                            <Link href="/signup">{t('nav.join')}</Link>
                        </Button>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="container px-4 md:px-6 py-24 md:py-32 flex flex-col items-center text-center space-y-8">
                    <div className="space-y-4 max-w-4xl mx-auto">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight text-foreground">
                            {t('hero.titlePart1')}
                            <br className="hidden md:block" />
                            <span className="text-foreground/80"> {t('hero.titlePart2')} </span>
                            <span className="relative whitespace-nowrap text-foreground z-10 px-2">
                                <span className="absolute -inset-1 bg-primary/20 -skew-y-2 rounded-lg -z-10" aria-hidden="true"></span>
                                {t('hero.titleHighlight')}
                            </span>
                        </h1>
                        <p className="mx-auto max-w-[700px] text-muted-foreground text-lg md:text-xl leading-relaxed">
                            {t('hero.description')}
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
                        <Button size="lg" className="rounded-full text-lg px-8 h-12 shadow-lg shadow-primary/25 transition-all hover:scale-105" asChild>
                            <Link href="/signup">
                                {t('hero.ctaPrimary')}
                            </Link>
                        </Button>
                        <Button variant="outline" size="lg" className="rounded-full text-lg px-8 h-12" asChild>
                            <Link href="/login">
                                {t('nav.login')}
                            </Link>
                        </Button>
                    </div>

                    {/* Features / Trust Badges */}
                    <div className="pt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center w-full max-w-5xl mx-auto opacity-90">
                        <div className="flex flex-col items-center space-y-2 p-4 rounded-xl hover:bg-muted/50 transition-colors">
                            <div className="p-3 bg-primary/10 rounded-full text-primary">
                                <Network className="h-6 w-6" />
                            </div>
                            <h3 className="font-semibold">IIAP Connect</h3>
                            <p className="text-sm text-muted-foreground">Integrado con el ecosistema de investigación.</p>
                        </div>
                        <div className="flex flex-col items-center space-y-2 p-4 rounded-xl hover:bg-muted/50 transition-colors">
                            <div className="p-3 bg-primary/10 rounded-full text-primary">
                                <Globe2 className="h-6 w-6" />
                            </div>
                            <h3 className="font-semibold">Identidad Digital</h3>
                            <p className="text-sm text-muted-foreground">Tu perfil único y verificable, similar a ORCID.</p>
                        </div>
                        <div className="flex flex-col items-center space-y-2 p-4 rounded-xl hover:bg-muted/50 transition-colors">
                            <div className="p-3 bg-primary/10 rounded-full text-primary">
                                <BookOpen className="h-6 w-6" />
                            </div>
                            <h3 className="font-semibold">Recursos Abiertos</h3>
                            <p className="text-sm text-muted-foreground">Acceso a datos y publicaciones científicas.</p>
                        </div>
                    </div>
                </section>
            </main>

            <footer className="py-6 w-full border-t">
                <div className="container px-4 md:px-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Instituto de Investigaciones de la Amazonía Peruana.</p>
                    <div className="flex gap-4">
                        <Link href="#" className="hover:underline">Privacidad</Link>
                        <Link href="#" className="hover:underline">Términos</Link>
                    </div>
                </div>
            </footer>
        </div>
    );
}
