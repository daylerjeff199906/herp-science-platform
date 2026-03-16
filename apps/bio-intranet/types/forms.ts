export interface FormField {
    id: string;
    type: 'text' | 'textarea' | 'select' | 'boolean' | 'url' | 'email' | 'number' | 'file';
    label: string;
    required?: boolean;
    placeholder?: string;
    options?: string[];
}

export interface DynamicFormProps {
    schema: FormField[];
    onSubmit: (data: Record<string, any>) => void;
    isLoading?: boolean;
    initialData?: Record<string, any>;
    onFileUploadSuccess?: (id: string, url: string, file: File) => void;
    onFileRemoved?: (id: string, url: string) => void;
}
