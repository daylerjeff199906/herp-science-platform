-- ============================================
-- ENUMS
-- ============================================

-- Enum para visibilidad de registros
CREATE TYPE public.visibility_status AS ENUM ('public', 'trusted', 'private');

-- Enum para estado de educación
CREATE TYPE public.education_status AS ENUM ('in_progress', 'completed', 'dropped');

-- Enum para nivel de idioma
CREATE TYPE public.language_level AS ENUM (
    'native',
    'fluent', 
    'advanced',
    'intermediate',
    'basic'
);

-- ============================================
-- TABLAS
-- ============================================

-- Tabla de historial de empleo
CREATE TABLE public.employment_history (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    organization text NOT NULL,
    city text NULL,
    region_state text NULL,
    country text NULL,
    department text NULL,
    role text NOT NULL,
    start_date date NOT NULL,
    end_date date NULL,
    is_current boolean NOT NULL DEFAULT false,
    scope text NULL,
    visibility visibility_status NOT NULL DEFAULT 'public',
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT employment_history_pkey PRIMARY KEY (id),
    CONSTRAINT employment_history_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE,
    CONSTRAINT check_dates CHECK (
        (end_date IS NULL OR end_date >= start_date) AND
        (is_current = true OR end_date IS NOT NULL)
    )
) TABLESPACE pg_default;

-- Tabla de educación
CREATE TABLE public.education (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    institution text NOT NULL,
    city text NULL,
    region_state text NULL,
    country text NULL,
    title text NOT NULL,
    field_of_study text NULL,
    status education_status NOT NULL DEFAULT 'completed',
    start_date date NULL,
    end_date date NULL,
    is_current boolean NOT NULL DEFAULT false,
    scope text NULL,
    visibility visibility_status NOT NULL DEFAULT 'public',
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT education_pkey PRIMARY KEY (id),
    CONSTRAINT education_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE,
    CONSTRAINT check_education_dates CHECK (
        (end_date IS NULL OR end_date >= start_date) AND
        (is_current = true OR status = 'in_progress' OR end_date IS NOT NULL)
    )
) TABLESPACE pg_default;

-- Tabla de idiomas
CREATE TABLE public.languages (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    language text NOT NULL,
    level language_level NOT NULL DEFAULT 'basic',
    is_native boolean NOT NULL DEFAULT false,
    visibility visibility_status NOT NULL DEFAULT 'public',
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT languages_pkey PRIMARY KEY (id),
    CONSTRAINT languages_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE,
    CONSTRAINT unique_user_language UNIQUE (user_id, language)
) TABLESPACE pg_default;

-- Tabla de redes sociales
CREATE TABLE public.social_links (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    title text NOT NULL,
    url text NOT NULL,
    platform text NULL,
    visibility visibility_status NOT NULL DEFAULT 'public',
    is_verified boolean NOT NULL DEFAULT false,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT social_links_pkey PRIMARY KEY (id),
    CONSTRAINT social_links_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE,
    CONSTRAINT valid_url CHECK (url ~* '^https?://')
) TABLESPACE pg_default;

-- Tabla de actividades profesionales
CREATE TABLE public.professional_activities (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    organization text NOT NULL,
    city text NULL,
    region_state text NULL,
    country text NULL,
    activity_type text NOT NULL,
    role text NOT NULL,
    start_date date NOT NULL,
    end_date date NULL,
    is_current boolean NOT NULL DEFAULT false,
    scope text NULL,
    visibility visibility_status NOT NULL DEFAULT 'public',
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT professional_activities_pkey PRIMARY KEY (id),
    CONSTRAINT professional_activities_user_id_fkey FOREIGN KEY (user_id) REFERENCES profiles(id) ON DELETE CASCADE,
    CONSTRAINT check_activity_dates CHECK (
        (end_date IS NULL OR end_date >= start_date) AND
        (is_current = true OR end_date IS NOT NULL)
    )
) TABLESPACE pg_default;

-- ============================================
-- ÍNDICES
-- ============================================

CREATE INDEX idx_employment_user_id ON public.employment_history(user_id);
CREATE INDEX idx_employment_visibility ON public.employment_history(visibility);
CREATE INDEX idx_education_user_id ON public.education(user_id);
CREATE INDEX idx_education_visibility ON public.education(visibility);
CREATE INDEX idx_languages_user_id ON public.languages(user_id);
CREATE INDEX idx_languages_visibility ON public.languages(visibility);
CREATE INDEX idx_social_links_user_id ON public.social_links(user_id);
CREATE INDEX idx_social_links_visibility ON public.social_links(visibility);
CREATE INDEX idx_professional_activities_user_id ON public.professional_activities(user_id);
CREATE INDEX idx_professional_activities_visibility ON public.professional_activities(visibility);

-- ============================================
-- TRIGGER PARA UPDATED_AT
-- ============================================

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_employment_history_updated_at
    BEFORE UPDATE ON public.employment_history
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_education_updated_at
    BEFORE UPDATE ON public.education
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_languages_updated_at
    BEFORE UPDATE ON public.languages
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_social_links_updated_at
    BEFORE UPDATE ON public.social_links
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_professional_activities_updated_at
    BEFORE UPDATE ON public.professional_activities
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================
-- POLÍTICAS RLS (Row Level Security)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.employment_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.education ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_links ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.professional_activities ENABLE ROW LEVEL SECURITY;

-- Políticas para employment_history
CREATE POLICY "Users can view own employment" ON public.employment_history
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own employment" ON public.employment_history
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own employment" ON public.employment_history
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own employment" ON public.employment_history
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para education
CREATE POLICY "Users can view own education" ON public.education
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own education" ON public.education
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own education" ON public.education
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own education" ON public.education
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para languages
CREATE POLICY "Users can view own languages" ON public.languages
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own languages" ON public.languages
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own languages" ON public.languages
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own languages" ON public.languages
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para social_links
CREATE POLICY "Users can view own social links" ON public.social_links
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own social links" ON public.social_links
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own social links" ON public.social_links
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own social links" ON public.social_links
    FOR DELETE USING (auth.uid() = user_id);

-- Políticas para professional_activities
CREATE POLICY "Users can view own activities" ON public.professional_activities
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activities" ON public.professional_activities
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own activities" ON public.professional_activities
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own activities" ON public.professional_activities
    FOR DELETE USING (auth.uid() = user_id);
