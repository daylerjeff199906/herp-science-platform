'use client';

import React, { useState } from 'react';
import { FormField, DynamicFormProps } from '@/types/forms';

export default function DynamicApplicationForm({ schema, onSubmit, isLoading = false }: DynamicFormProps) {
    // Estado para guardar las respuestas del usuario
    const [formData, setFormData] = useState<Record<string, any>>({});

    const handleChange = (id: string, value: any) => {
        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Aquí enviamos el JSON final al componente padre para que lo suba a la BD
        onSubmit(formData);
    };

    const renderField = (field: FormField) => {
        switch (field.type) {
            case 'select':
                return (
                    <select
                        id={field.id}
                        required={field.required}
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
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

            // Por defecto, tratamos text, url, etc. como inputs normales
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

    return (
        <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-2xl mt-4">
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
                disabled={isLoading}
                className="w-full py-2 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-md transition-colors disabled:opacity-50 mt-4"
            >
                {isLoading ? 'Enviando...' : 'Confirmar Inscripción'}
            </button>
        </form>
    );
}
