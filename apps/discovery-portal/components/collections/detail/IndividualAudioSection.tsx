'use client'

import React from 'react'
import { IndividualDetails } from '@repo/shared-types'
import { useTranslations } from 'next-intl'
import { Play, Pause, Volume2 } from 'lucide-react'

interface IndividualAudioSectionProps {
    individual: IndividualDetails
}

export function IndividualAudioSection({ individual }: IndividualAudioSectionProps) {
    const t = useTranslations('Collections.Detail')
    const audios = individual.files.audios || []

    if (audios.length === 0) return null

    return (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
            <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center gap-2">
                <Volume2 className="w-5 h-5 text-gray-500" />
                {t('audioRecordings')}
            </h3>

            <div className="space-y-4">
                {audios.map((audio) => (
                    <div key={audio.id} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                        <div className="flex items-center justify-between mb-3">
                            <div className="text-sm font-medium text-gray-700 truncate max-w-[80%]">
                                {audio.note || `Audio ${audio.id}`}
                            </div>
                            <span className="text-xs text-gray-400 font-mono uppercase">
                                {audio.format}
                            </span>
                        </div>

                        {/* Native Audio Player with custom styling wrapper if needed, 
                            but standard HTML5 audio is usually robust enough for data display */}
                        <audio
                            controls
                            className="w-full h-10 accent-primary"
                            src={audio.name} // Assuming 'name' contains the URL
                            preload="metadata"
                        >
                            Your browser does not support the audio element.
                        </audio>

                        {/* Placeholder for Spectrogram/Histogram if specifically requested but data not available */}
                        {/* If we had spectrogram images, we would render them here */}
                        <div className="mt-3 h-16 bg-gray-200 rounded overflow-hidden relative opacity-50 flex items-center justify-center">
                            {/* Mock waveform visualization */}
                            <div className="flex items-end justify-center gap-0.5 h-full w-full px-2 py-2">
                                {Array.from({ length: 40 }).map((_, i) => (
                                    <div
                                        key={i}
                                        className="w-1 bg-gray-400 rounded-t-sm"
                                        style={{ height: `${Math.random() * 80 + 20}%` }}
                                    ></div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
