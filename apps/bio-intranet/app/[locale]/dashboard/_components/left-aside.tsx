"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@repo/ui"
import { MapPin, Briefcase, Calendar, Link as LinkIcon } from "lucide-react"

interface UserData {
    name: string
    email: string
    avatar: string | null
}

interface LeftAsideProps {
    userData: UserData
}

export function LeftAside({ userData }: LeftAsideProps) {
    return (
        <div className="flex flex-col gap-4 sticky top-4">
            {/* Minimalist Profile Card */}
            <Card className="border-none shadow-sm overflow-hidden bg-card/50 backdrop-blur-sm">
                <div className="h-20 bg-gradient-to-r from-primary/80 to-primary relative">
                    <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                </div>
                <CardContent className="relative pt-0 pb-6 text-center">
                    <div className="-mt-10 mb-4 flex justify-center">
                        <Avatar className="h-20 w-20 border-4 border-background shadow-md">
                            <AvatarImage src={userData.avatar || ""} />
                            <AvatarFallback className="text-xl bg-primary/10 text-primary font-bold">
                                {userData.name.charAt(0)}
                            </AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="space-y-1">
                        <h3 className="font-bold text-lg leading-none">{userData.name}</h3>
                        <p className="text-sm text-muted-foreground">{userData.email}</p>
                    </div>

                    <div className="mt-6 pt-6 border-t border-muted/20 space-y-3 text-left">
                        <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
                            <Briefcase className="h-3.5 w-3.5" />
                            <span>Investigador Principal</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>Iquitos, Perú</span>
                        </div>
                        <div className="flex items-center gap-3 text-xs font-medium text-muted-foreground">
                            <Calendar className="h-3.5 w-3.5" />
                            <span>Se unió en Enero 2024</span>
                        </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-muted/20 flex flex-wrap gap-2 justify-center">
                        <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[10px] font-bold uppercase tracking-wider">Botánica</Badge>
                        <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[10px] font-bold uppercase tracking-wider">Amazonía</Badge>
                        <Badge variant="secondary" className="bg-primary/5 text-primary border-none text-[10px] font-bold uppercase tracking-wider">GIS</Badge>
                    </div>
                </CardContent>
            </Card>

            {/* Quick Links / Navigation */}
            <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
                <CardContent className="p-4 space-y-1">
                    <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-primary/5 text-sm font-semibold transition-colors group">
                        <span className="text-muted-foreground group-hover:text-primary transition-colors">Vistas del perfil</span>
                        <span className="text-primary font-bold">42</span>
                    </button>
                    <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-primary/5 text-sm font-semibold transition-colors group">
                        <span className="text-muted-foreground group-hover:text-primary transition-colors">Publicaciones</span>
                        <span className="text-primary font-bold">12</span>
                    </button>
                    <button className="w-full flex items-center justify-between p-2 rounded-lg hover:bg-primary/5 text-sm font-semibold transition-colors group">
                        <span className="text-muted-foreground group-hover:text-primary transition-colors">Proyectos</span>
                        <span className="text-primary font-bold">4</span>
                    </button>
                </CardContent>
            </Card>
        </div>
    )
}
