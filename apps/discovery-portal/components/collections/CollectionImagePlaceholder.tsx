import Image from 'next/image'
import React from 'react'

export const CollectionImagePlaceholder = () => {
    return (
        <div className="flex items-center justify-center w-full h-full bg-primary/10 border border-primary/20 dark:bg-primary/20 dark:border-primary/30">
            <div className="relative w-16 h-16 opacity-50">
                <Image
                    src="/images/logo-iiap.png"
                    alt="IIAP Logo"
                    fill
                    className="object-contain"
                />
            </div>
        </div>
    )
}
