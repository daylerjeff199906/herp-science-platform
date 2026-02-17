-- ============================================
-- ACTUALIZAR TABLA PROFILES
-- ============================================

-- Añadir campos adicionales a profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS birth_date date NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS dedication text NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS areas_of_interest text[] NULL DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS expertise_areas text[] NULL DEFAULT '{}';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS research_interests text NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS current_position text NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS phone text NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS website text NULL;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS location text NULL;

-- Eliminar birth_year ya que ahora usamos birth_date
ALTER TABLE public.profiles DROP COLUMN IF EXISTS birth_year;

-- ============================================
-- ENUM PARA DEDICACIÓN
-- ============================================

CREATE TYPE public.dedication_type AS ENUM (
    'full_time',
    'part_time',
    'freelance',
    'student',
    'researcher',
    'professor',
    'other'
);

-- Añadir constraint para dedication si queremos usar el enum
-- ALTER TABLE public.profiles ALTER COLUMN dedication TYPE dedication_type USING dedication::dedication_type;

-- ============================================
-- TABLA DE CATEGORÍAS DE INTERÉS
-- ============================================

CREATE TABLE public.interest_categories (
    id uuid NOT NULL DEFAULT gen_random_uuid(),
    name text NOT NULL UNIQUE,
    name_es text NULL,
    description text NULL,
    description_es text NULL,
    created_at timestamp with time zone NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT interest_categories_pkey PRIMARY KEY (id)
) TABLESPACE pg_default;

-- Insertar categorías de ejemplo
INSERT INTO public.interest_categories (name, name_es, description, description_es) VALUES
('Conservation Biology', 'Biología de la Conservación', 'Study of biodiversity and conservation efforts', 'Estudio de la biodiversidad y esfuerzos de conservación'),
('Ecology', 'Ecología', 'Study of organisms and their environment', 'Estudio de organismos y su entorno'),
('Genetics', 'Genética', 'Study of genes and heredity', 'Estudio de genes y herencia'),
('Evolution', 'Evolución', 'Study of evolutionary processes', 'Estudio de procesos evolutivos'),
('Taxonomy', 'Taxonomía', 'Classification of organisms', 'Clasificación de organismos'),
('Climate Change', 'Cambio Climático', 'Study of climate change impacts', 'Estudio de impactos del cambio climático'),
('Marine Biology', 'Biología Marina', 'Study of marine organisms', 'Estudio de organismos marinos'),
('Microbiology', 'Microbiología', 'Study of microorganisms', 'Estudio de microorganismos'),
('Botany', 'Botánica', 'Study of plants', 'Estudio de plantas'),
('Zoology', 'Zoología', 'Study of animals', 'Estudio de animales'),
('Herpetology', 'Herpetología', 'Study of reptiles and amphibians', 'Estudio de reptiles y anfibios'),
('Ornithology', 'Ornitología', 'Study of birds', 'Estudio de aves'),
('Entomology', 'Entomología', 'Study of insects', 'Estudio de insectos'),
('Mycology', 'Micología', 'Study of fungi', 'Estudio de hongos');

