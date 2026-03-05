export interface FormField {
    id: string;
    type: 'text' | 'textarea' | 'select' | 'boolean' | 'url' | 'email' | 'number';
    label: string;
    required?: boolean;
    placeholder?: string;
    options?: string[];
}

export interface DynamicFormProps {
    schema: FormField[];
    onSubmit: (data: Record<string, any>) => void;
    isLoading?: boolean;
}
