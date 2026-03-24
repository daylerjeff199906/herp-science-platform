-- SQL Script para inicializar la base de datos de la Fonoteca
-- NOTA: Este script debe ser ejecutado en el proyecto de Supabase para "DB Fonoteca".

-- Habilitar extensiones requeridas
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- 1. TABLA DE ESPECIES / TAXONOMÍA
-- ==========================================
CREATE TABLE especies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    nombre_cientifico TEXT UNIQUE NOT NULL,
    nombre_comun TEXT,
    familia TEXT,
    orden TEXT,
    clase TEXT,
    reino TEXT DEFAULT 'Animalia',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indices para busquedas taxonomicas rapidas
CREATE INDEX idx_especies_nombre_cientifico ON especies(nombre_cientifico);
CREATE INDEX idx_especies_nombre_comun ON especies(nombre_comun);

-- ==========================================
-- 2. TABLA DE REGISTROS DE AUDIO
-- ==========================================
CREATE TABLE audios (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    especie_id UUID REFERENCES especies(id) ON DELETE RESTRICT, -- Restrict para no borrar audios si borramos especie
    archivo_url TEXT NOT NULL, -- URL de bucket de Supabase Storage u otro (R2)
    formato VARCHAR(10) NOT NULL, -- wav, mp3, etc.
    duracion_segundos NUMERIC(10,2),
    tamaño_bytes BIGINT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audios_especie_id ON audios(especie_id);

-- ==========================================
-- 3. TABLA DE METADATOS (Grabación)
-- ==========================================
CREATE TABLE metadatos (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    audio_id UUID UNIQUE REFERENCES audios(id) ON DELETE CASCADE, -- 1:1 con Audio
    fecha_grabacion TIMESTAMP WITH TIME ZONE,
    coordenadas_gps POINT, -- Latitud y longitud. Tambien podria ser JSONB o dos floats.
    equipo_utilizado TEXT,
    clima TEXT,
    
    -- NOTA IMPORTANTE: investigador_id no tiene FK porque la tabla de Auth está en "bio-intranet".
    -- Se controla la validacion a nivel aplicación (Next.js server-side).
    investigador_id UUID NOT NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_metadatos_audio_id ON metadatos(audio_id);
CREATE INDEX idx_metadatos_investigador_id ON metadatos(investigador_id);

-- ==========================================
-- 4. POLÍTICAS DE SEGURIDAD (RLS)
-- ==========================================
ALTER TABLE especies ENABLE ROW LEVEL SECURITY;
ALTER TABLE audios ENABLE ROW LEVEL SECURITY;
ALTER TABLE metadatos ENABLE ROW LEVEL SECURITY;

-- Dado que el Auth reside en otro proyecto de Supabase (bio-intranet),
-- no podemos usar auth.uid() directamente en esta base de datos porque el auth.users estará vacío.
-- Existen dos enfoques para la seguridad:
--
-- Enfoque A: Delegar TODA la seguridad a nivel capa de Servidor de Next.js (Middleware)
--            Se usa la Service Role o una politica estática donde Next verifica la sesión 
--            antes de consultar la BD.
--
-- Enfoque B: Si queremos usar RLS en el Cliente directo de Fonoteca, el backend de Next.js
--            debe firmar un token de acceso dedicado para Fonoteca o similar.
-- 
-- Para este script, definimos políticas estáticas de lectura pública si se desea y 
-- acceso para acciones admin mediante permisos autorizados.

-- Ejemplo de politica donde cualquiera puede leer especies:
CREATE POLICY "Lectura pública de especies" ON especies FOR SELECT USING (true);
CREATE POLICY "Lectura pública de audios" ON audios FOR SELECT USING (true);
CREATE POLICY "Lectura pública de metadatos" ON metadatos FOR SELECT USING (true);

-- Politicas CRUD para investigadores/admins (Actualmente se validarán desde middleware de Next.js)
-- Para que el cliente directa pueda escribir con RLS, necesitan sincronizarse o autenticarse en ambas.
-- Dejamos habilitada la protección base para requerir roles via middleware.
