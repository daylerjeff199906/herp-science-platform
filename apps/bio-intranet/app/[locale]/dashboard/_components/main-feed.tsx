"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Heart, MessageSquare, Share2, MoreHorizontal, ExternalLink, Image as ImageIcon, Video, Calendar, FileText } from "lucide-react"
import Link from "next/link"

interface Post {
    id: string | number
    title: string
    date: string
    img_url: string
    snippet: string
    link: string
    author?: {
        name: string
        avatar: string
        role: string
    }
}

interface MainFeedProps {
    posts: Post[]
}

export function MainFeed({ posts }: MainFeedProps) {
    return (
        <div className="flex flex-col gap-4">
            {/* Create Post Area */}
            <Card className="border-none shadow-sm bg-card/50 backdrop-blur-sm">
                <CardContent className="pt-6">
                    <div className="flex gap-4">
                        <Avatar className="h-10 w-10 border">
                            <AvatarImage src="" />
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        <Button 
                            variant="outline" 
                            className="flex-1 justify-start text-muted-foreground rounded-full h-11 px-6 border-muted/20 hover:bg-muted/50 transition-all font-normal"
                        >
                            ¿Qué estás pensando hoy?
                        </Button>
                    </div>
                    <div className="flex justify-between mt-4">
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                            <ImageIcon className="mr-2 h-4 w-4 text-blue-500" /> <span className="text-xs font-semibold">Foto</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                            <Video className="mr-2 h-4 w-4 text-green-500" /> <span className="text-xs font-semibold">Video</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                            <Calendar className="mr-2 h-4 w-4 text-orange-500" /> <span className="text-xs font-semibold">Evento</span>
                        </Button>
                        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-primary">
                            <FileText className="mr-2 h-4 w-4 text-rose-500" /> <span className="text-xs font-semibold">Artículo</span>
                        </Button>
                    </div>
                </CardContent>
            </Card>

            {/* Feed Posts */}
            {posts.map((post) => (
                <Card key={post.id} className="border-none shadow-sm overflow-hidden group hover:shadow-md transition-all duration-300">
                    <CardHeader className="flex flex-row items-center space-y-0 gap-3 pb-3">
                        <Avatar className="h-12 w-12 border-2 border-primary/10">
                            <AvatarImage src={post.author?.avatar || "/brands/logo-iiap.webp"} />
                            <AvatarFallback>II</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="flex items-center justify-between">
                                <h4 className="font-bold text-sm hover:text-primary hover:underline cursor-pointer transition-colors">
                                    {post.author?.name || "IIAP - Instituto de Investigaciones de la Amazonía Peruana"}
                                </h4>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <MoreHorizontal className="h-4 w-4" />
                                </Button>
                            </div>
                            <p className="text-[11px] text-muted-foreground font-medium flex items-center gap-1">
                                {post.author?.role || "Institución"} • {post.date}
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4 pt-0">
                        <div className="space-y-2">
                            <h3 className="text-base font-bold leading-tight tracking-tight">
                                {post.title}
                            </h3>
                            <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                                {post.snippet}
                            </p>
                        </div>
                        
                        {/* Improved Image Rendering Logic */}
                        {post.img_url && (post.img_url.match(/\.(jpeg|jpg|gif|png|webp|avif)$/) !== null) ? (
                             <div className="relative aspect-[16/9] rounded-xl overflow-hidden border bg-muted/20">
                                <img 
                                    src={post.img_url} 
                                    alt={post.title} 
                                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                                />
                             </div>
                        ) : (
                            /* Placeholder for campaigns without direct image URLs */
                            <div className="relative h-56 rounded-xl overflow-hidden border bg-gradient-to-br from-primary/20 via-primary/5 to-transparent flex items-center justify-center p-8 group-hover:from-primary/30 transition-all duration-500">
                                <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-50"></div>
                                <div className="text-center space-y-4 z-10">
                                    <div className="w-14 h-14 rounded-full bg-background/50 backdrop-blur-md flex items-center justify-center mx-auto shadow-sm border border-white/20">
                                        <ExternalLink className="h-6 w-6 text-primary" />
                                    </div>
                                    <div className="space-y-1">
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary/80">Campaña Institucional</span>
                                        <p className="text-xs text-muted-foreground font-medium max-w-[200px] mx-auto">Esta publicación redirige al portal oficial del Estado Peruano.</p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Social Actions */}
                        <div className="pt-2 flex items-center justify-between border-t border-muted/10">
                            <div className="flex gap-1">
                                <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30">
                                    <Heart className="h-4 w-4 mr-2" /> <span className="text-xs font-semibold">12</span>
                                </Button>
                                <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950/30">
                                    <MessageSquare className="h-4 w-4 mr-2" /> <span className="text-xs font-semibold">5</span>
                                </Button>
                            </div>
                            <Button variant="ghost" size="sm" className="h-8 px-2 text-muted-foreground hover:text-primary">
                                <Share2 className="h-4 w-4 mr-2" /> <span className="text-xs font-semibold">Compartir</span>
                            </Button>
                        </div>
                        
                        <Link href={post.link} target="_blank" className="block w-full">
                            <Button className="w-full rounded-full font-bold shadow-sm hover:shadow-md transition-all">
                                Ver detalles de la campaña
                                <ExternalLink className="ml-2 h-4 w-4" />
                            </Button>
                        </Link>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}
