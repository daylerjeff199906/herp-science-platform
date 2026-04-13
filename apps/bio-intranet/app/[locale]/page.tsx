"use client";

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { createClient } from "@/utils/supabase/client";
import { MainFeed } from "./dashboard/_components/main-feed";
import { LeftAside } from "./dashboard/_components/left-aside";
import { RightAside } from "./dashboard/_components/right-aside";
import { LandingNavbar } from "@/components/landing-navbar";
import { SCRAPED_POSTS } from "@/lib/constants/scraped-data";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";

export default function Page() {
    const locale = useLocale();
    const t = useTranslations();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            const supabase = createClient();
            const { data: { user: authUser } } = await supabase.auth.getUser();
            if (authUser) {
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('first_name, last_name, avatar_url')
                    .eq('auth_id', authUser.id)
                    .maybeSingle();

                setUser({
                    name: `${profile?.first_name || ''} ${profile?.last_name || ''}`.trim() || authUser.email?.split('@')[0],
                    email: authUser.email,
                    avatar: profile?.avatar_url || null
                });
            }
            setLoading(false);
        };
        fetchUser();
    }, []);

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden">
            <LandingNavbar />

            {/* Aesthetic Background Decoration */}
            <div className="fixed inset-0 z-0 pointer-events-none opacity-20 dark:opacity-[0.05]">
                <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-primary/30 rounded-full blur-[120px] -translate-y-1/2" />
                <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-[120px] translate-y-1/2" />
            </div>

            <main className="flex-1 relative z-10 pt-24 pb-12">
                <div className="container mx-auto px-4 max-w-7xl">
                    <div className="grid grid-cols-1 md:grid-cols-12 lg:grid-cols-12 gap-6">
                        
                        {/* Left Column */}
                        <div className="hidden md:block md:col-span-4 lg:col-span-3">
                            {user ? (
                                <LeftAside userData={user} />
                            ) : (
                                <div className="flex flex-col gap-4 sticky top-24">
                                    <Card className="border-none shadow-sm bg-gradient-to-br from-primary to-primary/80 text-white overflow-hidden">
                                        <CardContent className="pt-8 pb-8 px-6 text-center space-y-6 relative">
                                            <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]" />
                                            <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto backdrop-blur-md border border-white/30">
                                                <Sparkles className="h-8 w-8 text-white" />
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-xl font-black leading-tight uppercase tracking-tight">Potencia tu Investigación</h3>
                                                <p className="text-sm text-white/80 font-medium">Únete a la mayor red de científicos de la Amazonía.</p>
                                            </div>
                                            <Link href={`/${locale}/signup`} className="block">
                                                <Button className="w-full rounded-full bg-white text-primary hover:bg-white/90 font-black shadow-lg shadow-black/10">
                                                    Crear cuenta gratis
                                                    <ArrowRight className="ml-2 h-4 w-4" />
                                                </Button>
                                            </Link>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
                                        <CardContent className="p-6 space-y-4">
                                            <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Misión IIAP</h4>
                                            <p className="text-sm font-medium leading-relaxed">Promovemos el conocimiento científico para el desarrollo sostenible de la región amazónica.</p>
                                            <div className="pt-2">
                                                <Link href="#" className="text-xs font-bold text-primary hover:underline flex items-center gap-1">
                                                    Saber más sobre nosotros <ArrowRight className="h-3 w-3" />
                                                </Link>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}
                        </div>

                        {/* Center Column - Feed */}
                        <main className="col-span-1 md:col-span-8 lg:col-span-6 space-y-6">
                            {/* Mobile Welcome Card (only when no user and mobile) */}
                            {!user && (
                                <div className="md:hidden">
                                     <Card className="border-none shadow-sm bg-primary text-white mb-4">
                                        <CardContent className="p-6 flex items-center justify-between">
                                            <div className="space-y-1">
                                                <p className="font-bold text-lg leading-tight uppercase tracking-tight">Comunidad IIAP</p>
                                                <p className="text-xs text-white/80">Regístrate para ver más contenido.</p>
                                            </div>
                                            <Link href={`/${locale}/signup`}>
                                                <Button size="sm" className="bg-white text-primary hover:bg-white/90 rounded-full font-bold">Unirse</Button>
                                            </Link>
                                        </CardContent>
                                    </Card>
                                </div>
                            )}

                            <MainFeed posts={SCRAPED_POSTS} />
                        </main>

                        {/* Right Column - Widgets */}
                        <div className="hidden lg:block lg:col-span-3">
                            <RightAside />
                        </div>

                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="border-t bg-card/30 py-12 backdrop-blur-md">
                <div className="container mx-auto px-6 max-w-7xl">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-8">
                        <div className="flex flex-col items-center md:items-start gap-4">
                            <span className="text-2xl font-black tracking-tighter text-primary">IIAP</span>
                            <p className="text-sm text-muted-foreground text-center md:text-left max-w-xs">
                                Plataforma de inteligencia amazónica para la gestión del conocimiento científico.
                            </p>
                        </div>
                        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                            <Link href="#" className="hover:text-primary transition-colors">Nosotros</Link>
                            <Link href="#" className="hover:text-primary transition-colors">Transparencia</Link>
                            <Link href="#" className="hover:text-primary transition-colors">Datos Abiertos</Link>
                            <Link href="#" className="hover:text-primary transition-colors">Contacto</Link>
                        </div>
                    </div>
                    <div className="mt-12 pt-8 border-t border-muted/20 text-center text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">
                        &copy; {new Date().getFullYear()} IIAP • Amazonía Peruana • Todos los derechos reservados
                    </div>
                </div>
            </footer>
        </div>
    );
}
