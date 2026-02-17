import React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'
import { Leaf } from 'lucide-react'

interface LogoProps {
    image?: React.ReactNode | string
    name?: string
    description?: string
    showName?: boolean
    showDescription?: boolean
    orientation?: 'horizontal' | 'vertical'
    size?: 'sm' | 'md' | 'lg' | 'xl'
    className?: string
    imageClassName?: string
    textClassName?: string
}

export function Logo({
    image,
    name = "B.E.A IIAP",
    description,
    showName = true,
    showDescription = false,
    orientation = 'horizontal',
    size = 'md',
    className,
    imageClassName,
    textClassName,
}: LogoProps) {

    const sizeConfig = {
        sm: {
            gap: "gap-2",
            iconSize: "w-6 h-6",
            textSize: "text-sm",
            descSize: "text-[10px]"
        },
        md: {
            gap: "gap-3",
            iconSize: "w-8 h-8",
            textSize: "text-lg",
            descSize: "text-xs"
        },
        lg: {
            gap: "gap-4",
            iconSize: "w-12 h-12",
            textSize: "text-3xl",
            descSize: "text-sm"
        },
        xl: {
            gap: "gap-5",
            iconSize: "w-16 h-16",
            textSize: "text-4xl",
            descSize: "text-base"
        }
    }

    const config = sizeConfig[size]

    return (
        <div className={cn(
            "flex items-center",
            orientation === 'vertical' ? "flex-col text-center" : "flex-row text-left",
            config.gap,
            className
        )}>
            {image ? (
                <div className={cn("relative flex items-center justify-center shrink-0", config.iconSize, imageClassName)}>
                    {typeof image === 'string' ? (
                        <Image
                            src={image}
                            alt={name || "Logo"}
                            fill
                            className="object-contain"
                        />
                    ) : (
                        image
                    )}
                </div>
            ) : (
                <div className={cn("relative flex items-center justify-center shrink-0 p-2 border border-primary rounded-lg", config.iconSize, imageClassName)}>
                    <Leaf className="w-8 h-8 text-primary" />
                </div>
            )}

            {(showName || (showDescription && description)) && (
                <div className={cn("flex flex-col", orientation === 'vertical' && "items-center")}>
                    {showName && (
                        <span className={cn("font-extrabold tracking-tight leading-none", config.textSize, textClassName)}>
                            {name}
                        </span>
                    )}
                    {showDescription && description && (
                        <span className={cn("text-muted-foreground mt-1", config.descSize)}>
                            {description}
                        </span>
                    )}
                </div>
            )}
        </div>
    )
}
