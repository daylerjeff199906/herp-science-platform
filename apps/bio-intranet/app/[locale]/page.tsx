"use client";

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Logo } from "@/components/ui/logo";
import { ArrowRight } from 'lucide-react';
import { useLocale } from 'next-intl';
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";

export default function Page() {
    const locale = useLocale();
    const [videoLoaded, setVideoLoaded] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const videoRef = useRef<HTMLVideoElement>(null);

    // Effect to handle video playback once loaded
    useEffect(() => {
        if (videoLoaded && videoRef.current) {
            videoRef.current.play().catch((error) => {
                console.log("Autoplay prevented:", error);
            });
        }
    }, [videoLoaded]);

    // Effect to handle scroll for navbar
    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden">
            {/* Header - Transparent initially, dark on scroll */}
            <header className={`fixed top-0 z-50 w-full transition-all duration-300 ${scrolled
                ? 'bg-background/95 backdrop-blur-md border-b border-border'
                : 'bg-transparent'
                }`}>
                <div className="container flex h-20 items-center justify-between px-6 md:px-12">
                    {/* Left Navigation with Dropdowns */}
                    <nav className="hidden md:flex items-center gap-8">
                        <Link
                            href="#"
                            className={`text-sm font-medium uppercase tracking-wider transition-colors flex items-center gap-1 text-white`}
                        >
                            About
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </Link>
                        <Link
                            href="#"
                            className={`text-sm font-medium uppercase tracking-wider transition-colors flex items-center gap-1 text-white`}
                        >
                            Services
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </Link>
                    </nav>

                    {/* Centered Logo */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Link href={`/${locale}`} className="flex items-center justify-center">
                            <div className={`px-4 py-2 border-2 transition-colors border-white`}>
                                <span className={`text-xl font-bold tracking-wider text-white`}>
                                    B.E.A IIAP
                                </span>
                            </div>
                        </Link>
                    </div>

                    {/* Right Actions - Login and Register */}
                    <div className="hidden md:flex items-center gap-6">
                        <Link
                            href={`/${locale}/login`}
                            className={`text-sm font-medium uppercase tracking-wider transition-colors text-white`}
                        >
                            Login
                        </Link>
                        <Link
                            href={`/${locale}/signup`}
                            className={`text-sm font-medium uppercase tracking-wider transition-colors text-white`}
                        >
                            Register
                        </Link>
                    </div>

                    {/* Mobile Menu Button with Sheet */}
                    <div className="md:hidden">
                        <Sheet>
                            <SheetTrigger asChild>
                                <button className="p-2">
                                    <svg className={`w-6 h-6 ${scrolled ? 'text-foreground' : 'text-white'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    </svg>
                                </button>
                            </SheetTrigger>
                            <SheetContent side="right" className="bg-[#111111]/90 backdrop-blur-md border-white/10 text-white">
                                <div className="flex flex-col gap-8 mt-12">
                                    {/* Navigation Links */}
                                    <nav className="flex flex-col gap-6">
                                        <SheetClose asChild>
                                            <Link
                                                href="#"
                                                className="text-lg font-medium uppercase tracking-wider text-white hover:text-primary transition-colors flex items-center justify-between"
                                            >
                                                About
                                                <ArrowRight className="w-5 h-5 text-white/50" />
                                            </Link>
                                        </SheetClose>
                                        <SheetClose asChild>
                                            <Link
                                                href="#"
                                                className="text-lg font-medium uppercase tracking-wider text-white hover:text-primary transition-colors flex items-center justify-between"
                                            >
                                                Services
                                                <ArrowRight className="w-5 h-5 text-white/50" />
                                            </Link>
                                        </SheetClose>
                                    </nav>

                                    {/* Divider */}
                                    <div className="h-px w-full bg-white/10"></div>

                                    {/* Auth Links */}
                                    <div className="flex flex-col gap-4">
                                        <SheetClose asChild>
                                            <Button asChild variant="ghost" className="justify-start text-white hover:text-white hover:bg-white/10 text-base uppercase tracking-wider">
                                                <Link href={`/${locale}/login`}>
                                                    Login
                                                </Link>
                                            </Button>
                                        </SheetClose>
                                        <SheetClose asChild>
                                            <Button asChild className="text-base uppercase tracking-wider">
                                                <Link href={`/${locale}/signup`}>
                                                    Register
                                                </Link>
                                            </Button>
                                        </SheetClose>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section - Matching Reference Image */}
                <section className="relative h-screen w-full overflow-hidden">
                    {/* Background Video/Image Container */}
                    <div className="absolute inset-0 z-0">
                        {/* Fallback Background Image - Shows while video loads or if video fails */}
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-background to-primary/10">
                            {/* You can replace this gradient with an actual image: */}
                            <img src="/images/hero-fallback.webp" alt="Hero background" className="absolute inset-0 h-full w-full object-cover" />
                        </div>

                        {/* Video Layer - Fades in when loaded */}
                        <div className={`transition-opacity duration-1000 absolute inset-0 ${videoLoaded ? 'opacity-100' : 'opacity-0'}`}>
                            <video
                                ref={videoRef}
                                className="absolute inset-0 h-full w-full object-cover"
                                playsInline
                                muted
                                loop
                                onCanPlayThrough={() => setVideoLoaded(true)}
                                poster="/hero-poster.jpg"
                            >
                                <source src="https://videos.pexels.com/video-files/855018/855018-hd_1920_1080_30fps.mp4" type="video/mp4" />
                            </video>
                        </div>

                        {/* Dark overlay for text contrast */}
                        <div className="absolute inset-0 bg-black/50 z-10"></div>
                    </div>

                    {/* Hero Content - Left aligned with bottom controls */}
                    <div className="relative z-30 container h-full flex flex-col justify-between px-6 md:px-12 py-12 md:py-16">
                        {/* Main Title - Large, bold, left-aligned */}
                        <div className="flex-1 flex items-center">
                            <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-bold tracking-tight text-white leading-[0.9] max-w-4xl">
                                Descubre
                                <br />
                                la Ciencia
                                <br />
                                Amazónica
                            </h1>
                        </div>

                        {/* Bottom Row: Tagline (left) and Explore Button (right) */}
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 md:gap-8">
                            {/* Tagline with dot indicator */}
                            <div className="flex items-center gap-3 max-w-md">
                                <div className="w-3 h-3 bg-primary rounded-full flex-shrink-0"></div>
                                <p className="text-white text-sm md:text-base font-medium uppercase tracking-wide">
                                    Plataforma de investigación biológica
                                </p>
                            </div>

                            {/* Explore Button */}
                            <Button
                                variant="ghost"
                                className="group text-white hover:text-white hover:bg-white/10 flex items-center gap-3 text-sm md:text-base font-semibold uppercase tracking-widest"
                            >
                                Explore
                                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                            </Button>
                        </div>
                    </div>
                </section>
            </main>

            {/* Footer */}
            <footer className="border-t bg-background py-16">
                <div className="container px-4 md:px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-sm">
                    <div className="space-y-4">
                        <Logo size="md" />
                        <p className="text-muted-foreground leading-relaxed max-w-xs">
                            Impulsando la investigación científica y la conservación en la Amazonía Peruana a través de la tecnología y la colaboración abierta.
                        </p>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-bold text-foreground text-base">Plataforma</h4>
                        <ul className="space-y-3 text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary transition-colors">Proyectos</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Datos Abiertos</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Colecciones Biológicas</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-bold text-foreground text-base">Recursos</h4>
                        <ul className="space-y-3 text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary transition-colors">Documentación</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">API para Desarrolladores</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Centro de Ayuda</Link></li>
                        </ul>
                    </div>

                    <div className="space-y-4">
                        <h4 className="font-bold text-foreground text-base">Legal</h4>
                        <ul className="space-y-3 text-muted-foreground">
                            <li><Link href="#" className="hover:text-primary transition-colors">Política de Privacidad</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Términos de Servicio</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Cookies</Link></li>
                        </ul>
                    </div>
                </div>
                <div className="container mt-16 pt-8 border-t text-center text-muted-foreground px-4">
                    <p>&copy; {new Date().getFullYear()} IIAP. Todos los derechos reservados.</p>
                </div>
            </footer>
        </div>
    );
}
