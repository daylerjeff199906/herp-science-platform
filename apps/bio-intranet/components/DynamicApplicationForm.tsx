'use client';

import React, { useState, useEffect } from 'react';
import { FormField, DynamicFormProps } from '@/types/forms';
import { Paperclip, X, Loader2, UploadCloud, ExternalLink } from 'lucide-react';

export default function DynamicApplicationForm({
    schema,
    onSubmit,
    isLoading = false,
    initialData = {},
    onFileUploadSuccess,
    onFileRemoved
}: DynamicFormProps) {
    // Estado para guardar las respuestas del usuario
    const [formData, setFormData] = useState<Record<string, any>>(initialData);
    const [uploadingFields, setUploadingFields] = useState<Record<string, boolean>>({});

    // Cargar datos iniciales cuando cambien de forma asíncrona
    useEffect(() => {
        if (initialData && Object.keys(initialData).length > 0) {
            setFormData((prev) => ({
                ...prev,
                ...initialData
            }));
        }
    }, [initialData]);

    const handleChange = (id: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleUploadFile = async (id: string, file: File | undefined) => {
        if (!file) return;

        setUploadingFields((prev) => ({ ...prev, [id]: true }));
        try {
            const formDataUpload = new FormData();
            formDataUpload.append('file', file);
            formDataUpload.append('folder', 'applications');

            const res = await fetch('/api/r2/upload', {
                method: 'POST',
                body: formDataUpload,
            });

            if (!res.ok) {
                const err = await res.json();
                throw new Error(err.error || 'Error al subir archivo');
            }

            const data = await res.json();
            handleChange(id, data.url);

            // Notificar al padre para guardar progreso
            if (onFileUploadSuccess) {
                onFileUploadSuccess(id, data.url, file);
            }
        } catch (error: any) {
            console.error('Error uploading file:', error);
            alert(error.message || 'Error al subir el archivo. Inténtelo de nuevo.');
        } finally {
            setUploadingFields((prev) => ({ ...prev, [id]: false }));
        }
    };

    const handleRemoveFile = async (id: string) => {
        const url = formData[id];
        if (!url) return;

        handleChange(id, null); // Clear immediately in UI

        // Notificar al padre para quitar del historial
        if (onFileRemoved) {
            onFileRemoved(id, url);
        }

        try {
            await fetch('/api/r2/delete', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ url }),
            });
        } catch (error) {
            console.error('Error deleting file from server:', error);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Verificar si hay campos subiendo
        const isStillUploading = Object.values(uploadingFields).some(Boolean);
        if (isStillUploading) {
            alert('Por favor, espere a que terminen de subirse los archivos.');
            return;
        }
        onSubmit(formData);
    };

    const renderField = (field: FormField) => {
        switch (field.type) {
            case 'select':
                return (
                    <select
                        id={field.id}
                        required={field.required}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-background text-foreground"
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        value={formData[field.id] || ''}
                    >
                        <option value="" disabled>Selecciona una opción</option>
                        {field.options?.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                        ))}
                    </select>
                );

            case 'textarea':
                return (
                    <textarea
                        id={field.id}
                        required={field.required}
                        placeholder={field.placeholder}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-background text-foreground"
                        rows={4}
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        value={formData[field.id] || ''}
                    />
                );

            case 'boolean':
                return (
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id={field.id}
                            required={field.required}
                            className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                            onChange={(e) => handleChange(field.id, e.target.checked)}
                            checked={formData[field.id] || false}
                        />
                        <label htmlFor={field.id} className="text-sm text-gray-700 dark:text-gray-300">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                    </div>
                );

            case 'file':
                return (
                    <div className="space-y-2">
                        {formData[field.id] ? (
                            <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/30 border-muted">
                                <div className="flex items-center space-x-2 truncate">
                                    <Paperclip className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                    <span className="text-sm truncate max-w-[200px] font-medium">{formData[field.id].split('/').pop() || 'Archivo subido'}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <a href={formData[field.id]} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-muted rounded-md text-muted-foreground hover:text-foreground transition-colors">
                                        <ExternalLink className="h-4 w-4" />
                                    </a>
                                    <button
                                        type="button"
                                        onClick={() => handleRemoveFile(field.id)}
                                        className="p-1.5 hover:bg-red-50 hover:text-red-500 rounded-md text-muted-foreground transition-colors"
                                    >
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="relative border-2 border-dashed border-muted-foreground/30 rounded-lg p-6 hover:border-primary/50 hover:bg-muted/10 transition-all text-center cursor-pointer group">
                                <input
                                    type="file"
                                    id={field.id}
                                    required={field.required && !formData[field.id]}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    onChange={(e) => handleUploadFile(field.id, e.target.files?.[0])}
                                    disabled={uploadingFields[field.id]}
                                />
                                {uploadingFields[field.id] ? (
                                    <div className="flex flex-col items-center">
                                        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                                        <span className="text-xs text-muted-foreground mt-1">Subiendo...</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center group-hover:transform group-hover:scale-105 transition-transform">
                                        <UploadCloud className="h-6 w-6 text-muted-foreground group-hover:text-primary transition-colors mb-1" />
                                        <span className="text-xs text-muted-foreground font-medium">Haga clic o arrastre para subir</span>
                                        <span className="text-[10px] text-muted-foreground/60 mt-0.5">Formatos soportados: PDF, Docs, Imágenes</span>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                );

            default:
                return (
                    <input
                        type={field.type}
                        id={field.id}
                        required={field.required}
                        placeholder={field.placeholder}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-background text-foreground"
                        onChange={(e) => handleChange(field.id, e.target.value)}
                        value={formData[field.id] || ''}
                    />
                );
        }
    };

    const isUploadingAny = Object.values(uploadingFields).some(Boolean);

    return (
        <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-4xl mt-4">
            {schema.map((field) => (
                <div key={field.id} className="flex flex-col space-y-1">
                    {field.type !== 'boolean' && (
                        <label htmlFor={field.id} className="text-sm font-medium">
                            {field.label} {field.required && <span className="text-red-500">*</span>}
                        </label>
                    )}
                    {renderField(field)}
                </div>
            ))}

            <button
                type="submit"
                disabled={isLoading || isUploadingAny}
                className="w-full py-2 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-md transition-colors disabled:opacity-50 mt-4 flex justify-center items-center"
            >
                {isLoading ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> {isLoading ? 'Enviando...' : 'Enviar Postulación'}</>
                ) : isUploadingAny ? (
                    <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Subiendo archivos...</>
                ) : (
                    'Enviar Postulación'
                )}
            </button>
        </form>
    );
}
