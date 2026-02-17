'use client'

import React, { useState, useRef } from 'react'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Edit, Loader2, Upload } from 'lucide-react'
import { getPresignedAvatarUrl, updateAvatar } from '@/app/[locale]/dashboard/profile/actions-r2'
import { toast } from 'sonner'
import { useTranslations } from 'next-intl'

interface AvatarUploadProps {
    avatarUrl?: string | null
    firstName?: string
    lastName?: string
}

export function AvatarUpload({ avatarUrl, firstName, lastName }: AvatarUploadProps) {
    const t = useTranslations('Profile.avatar')
    const [isUploading, setIsUploading] = useState(false)
    const fileInputRef = useRef<HTMLInputElement>(null)
    const [previewUrl, setPreviewUrl] = useState<string | null>(avatarUrl || null)

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (!file) return

        if (!file.type.startsWith('image/')) {
            toast.error(t('invalidType'))
            return
        }

        if (file.size > 5 * 1024 * 1024) { // 5MB
            toast.error(t('tooLarge'))
            return
        }

        setIsUploading(true)

        try {
            // 1. Get presigned URL
            const presignResult = await getPresignedAvatarUrl(file.type)
            if (presignResult.error || !presignResult.signedUrl) {
                throw new Error(presignResult.error || 'Failed to get upload URL')
            }

            // 2. Upload to R2
            const uploadResponse = await fetch(presignResult.signedUrl, {
                method: 'PUT',
                body: file,
                headers: {
                    'Content-Type': file.type,
                },
            })

            if (!uploadResponse.ok) {
                throw new Error('Upload failed')
            }

            // 3. Update profile
            const updateResult = await updateAvatar(presignResult.publicUrl)
            if (updateResult.error) {
                throw new Error(updateResult.error)
            }

            setPreviewUrl(presignResult.publicUrl)
            toast.success(t('success'))

        } catch (error) {
            console.error(error)
            toast.error(t('error'))
        } finally {
            setIsUploading(false)
        }
    }

    const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()

    return (
        <div className="relative group min-w-[100px] min-h-[100px] h-24 w-24">
            <Avatar className="h-24 w-24 border-2 border-border">
                <AvatarImage src={previewUrl || ''} alt="Profile" className="object-cover" />
                <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>

            <div className="absolute inset-0 bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                {isUploading ? (
                    <Loader2 className="h-6 w-6 text-white animate-spin" />
                ) : (
                    <Edit className="h-6 w-6 text-white" />
                )}
            </div>
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
                disabled={isUploading}
            />
        </div>
    )
}
