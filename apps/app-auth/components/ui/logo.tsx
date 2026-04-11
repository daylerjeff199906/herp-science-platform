import React from 'react'
import Image from 'next/image'
import { cn } from '@/lib/utils'

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
    name = "IIAP",
    description = "Instituto de Investigaciones de la Amazonía Peruana",
    showName = true,
    showDescription = true,
    orientation = 'horizontal',
    size = 'md',
    className,
    imageClassName,
    textClassName,
}: LogoProps) {

    const sizeConfig = {
        sm: {
            gap: "gap-2",
            iconSize: "w-12 h-12",
            textSize: "text-lg",
            descSize: "text-xs"
        },
        md: {
            gap: "gap-3",
            iconSize: "w-20 h-20",
            textSize: "text-lg",
            descSize: "text-xs"
        },
        lg: {
            gap: "gap-4",
            iconSize: "w-24 h-24",
            textSize: "text-3xl",
            descSize: "text-sm"
        },
        xl: {
            gap: "gap-5",
            iconSize: "w-32 h-32",
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
                <div className={cn("relative flex items-center justify-center shrink-0 overflow-hidden", config.iconSize, imageClassName)}>
                    <Image
                        src="/brands/logo-iiap.webp"
                        alt={name || "Logo IIAP"}
                        fill
                        className="object-contain w-full h-full"
                    />
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
