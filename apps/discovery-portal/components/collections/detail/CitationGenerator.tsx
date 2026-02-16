'use client'

import React, { useState } from 'react'
import { IndividualDetails } from '@repo/shared-types'
import { Quote, Copy, Check, FileText } from 'lucide-react'
import { useTranslations } from 'next-intl'
import { cn } from '@repo/ui'

interface CitationGeneratorProps {
    individual: IndividualDetails
}

type CitationFormat = 'APA' | 'BibTeX' | 'RIS'

export function CitationGenerator({ individual }: CitationGeneratorProps) {
    const t = useTranslations('Collections.Detail')
    const [isOpen, setIsOpen] = useState(false)
    const [format, setFormat] = useState<CitationFormat>('APA')
    const [copied, setCopied] = useState(false)

    // Helper to generate citations
    const generateCitation = (format: CitationFormat): string => {
        const url = typeof window !== 'undefined' ? window.location.href : ''
        const accessDate = new Date().toLocaleDateString()
        const year = new Date().getFullYear()
        const title = `${individual.species.scientificName} (${individual.code})`
        const publisher = individual.museum?.name || 'IIAP'

        const code = individual.code || 'UNKNOWN'

        switch (format) {
            case 'APA':
                return `${publisher} (${year}). ${title}. ${t('accessedOn')} ${accessDate}, ${t('from')} ${url}`
            case 'BibTeX':
                return `@misc{${code.replace(/\s+/g, '_')},
  author = {${publisher}},
  title = {${title}},
  year = {${year}},
  url = {${url}},
  note = {Accessed: ${accessDate}}
}`
            case 'RIS':
                return `TY  - DATA
TI  - ${title}
AU  - ${publisher}
PY  - ${year}
UR  - ${url}
ER  - `
            default:
                return ''
        }
    }

    const handleCopy = async () => {
        try {
            await navigator.clipboard.writeText(generateCitation(format))
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy', err)
        }
    }

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
                title={t('cite')}
            >
                <Quote className="w-5 h-5" />
            </button>
        )
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-black/50 z-50 transition-opacity"
                onClick={() => setIsOpen(false)}
            />

            {/* Modal */}
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                <div
                    className="bg-background rounded-lg shadow-xl max-w-lg w-full p-6 animate-in fade-in zoom-in-95 duration-200"
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                            <Quote className="w-5 h-5 text-primary" />
                            {t('citeRecord')}
                        </h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-gray-400 hover:text-gray-900"
                        >
                            &times;
                        </button>
                    </div>

                    <div className="flex gap-2 mb-4">
                        {(['APA', 'BibTeX', 'RIS'] as CitationFormat[]).map((fmt) => (
                            <button
                                key={fmt}
                                onClick={() => setFormat(fmt)}
                                className={cn(
                                    "px-3 py-1.5 text-sm font-medium rounded-md transition-colors",
                                    format === fmt
                                        ? "bg-primary text-primary-foreground"
                                        : "bg-muted text-muted-foreground hover:bg-muted/80"
                                )}
                            >
                                {fmt}
                            </button>
                        ))}
                    </div>

                    <div className="relative">
                        <pre className="p-4 bg-muted rounded-md text-sm overflow-x-auto whitespace-pre-wrap font-mono min-h-[100px] border border-border">
                            {generateCitation(format)}
                        </pre>
                        <button
                            onClick={handleCopy}
                            className="absolute top-2 right-2 p-1.5 bg-background border border-border rounded-md shadow-sm hover:bg-gray-50 transition-colors"
                            title={t('copy')}
                        >
                            {copied ? (
                                <Check className="w-4 h-4 text-green-500" />
                            ) : (
                                <Copy className="w-4 h-4 text-gray-500" />
                            )}
                        </button>
                    </div>

                    <p className="mt-4 text-xs text-muted-foreground">
                        {t('citationDisclaimer')}
                    </p>
                </div>
            </div>
        </>
    )
}
