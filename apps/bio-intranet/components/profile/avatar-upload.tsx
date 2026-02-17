'use client'

import React, { useState, useRef } from 'react'
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Edit, Loader2, Trash2, Upload } from 'lucide-react'
import { updateAvatar } from '@/app/[locale]/dashboard/profile/actions-r2'
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
            const formData = new FormData()
            formData.append('file', file)
            formData.append('folder', 'avatars')

            // Upload to R2 via API
            const response = await fetch('/api/r2/upload', {
                method: 'POST',
                body: formData
            })

            console.log(response)

            if (!response.ok) {
                throw new Error('Upload failed')
            }

            const data = await response.json()
            const newUrl = data.url

            // Update profile
            const updateResult = await updateAvatar(newUrl)
            if (updateResult.error) {
                throw new Error(updateResult.error)
            }

            // If there was an old avatar and it was on R2, we *could* delete it here 
            // but for safety we'll just update the pointer.

            setPreviewUrl(newUrl)
            toast.success(t('success'))

        } catch (error) {
            console.error(error)
            toast.error(t('error'))
        } finally {
            setIsUploading(false)
            if (fileInputRef.current) fileInputRef.current.value = ''
        }
    }

    const handleDelete = async (e: React.MouseEvent) => {
        e.stopPropagation() // Prevent triggering file input
        if (!previewUrl) return

        if (!confirm('Are you sure you want to remove your profile photo?')) return

        setIsUploading(true)
        try {
            // Delete from R2
            await fetch('/api/r2/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url: previewUrl })
            })

            // Update Profile to null
            const updateResult = await updateAvatar('') // Empty string or null? Update action handles string.
            if (updateResult.error) throw new Error(updateResult.error)

            setPreviewUrl(null)
            toast.success('Avatar removed')
        } catch (error) {
            console.error(error)
            toast.error('Error removing avatar')
        } finally {
            setIsUploading(false)
        }
    }

    const initials = `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase()

    return (
        <div className="relative group min-w-[100px] min-h-[100px] h-24 w-24">
            <Avatar className="h-24 w-24 border-2 border-border cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                <AvatarImage src={previewUrl || ''} alt="Profile" className="object-cover" />
                <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>

            <div className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40 gap-2 pointer-events-none">
                {/* Pointer events none on container, enable on buttons */}
                <div className="flex gap-2 pointer-events-auto">
                    <Button
                        size="icon"
                        variant="secondary"
                        className="h-8 w-8 rounded-full opacity-90 hover:opacity-100"
                        onClick={() => fileInputRef.current?.click()}
                        disabled={isUploading}
                    >
                        {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Edit className="h-4 w-4" />}
                    </Button>
                    {previewUrl && (
                        <Button
                            size="icon"
                            variant="destructive"
                            className="h-8 w-8 rounded-full opacity-90 hover:opacity-100"
                            onClick={handleDelete}
                            disabled={isUploading}
                        >
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    )}
                </div>
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
