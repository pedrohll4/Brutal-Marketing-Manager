-- ==============================================================================
-- BRUTAL MARKETING MANAGER - BANCO DE DADOS POSTGRESQL / SUPABASE (100% IDEMPOTENTE)
-- ==============================================================================

-- 1. EXTENSÕES
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ENUMS IDEMPOTENTES (Não dão erro se já existirem)
DO $$ BEGIN
    CREATE TYPE user_role_type AS ENUM ('OWNER', 'ADMIN', 'EMPLOYEE', 'CLIENT');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE client_status_type AS ENUM ('ACTIVE', 'INACTIVE', 'PENDING_PAYMENT');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE contract_model_type AS ENUM ('QUANTITY', 'CAMPAIGN', 'CUSTOM');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE campaign_status_type AS ENUM ('PLANNING', 'IN_PRODUCTION', 'IN_REVIEW', 'WAITING_APPROVAL', 'COMPLETED', 'CANCELLED', 'DELAYED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE campaign_step_type AS ENUM ('BRIEFING', 'SCRIPT', 'RECORDING', 'EDITING', 'REVIEW', 'APPROVAL', 'PUBLISHING');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE task_status_type AS ENUM ('BACKLOG', 'PLANNED', 'IN_PRODUCTION', 'IN_REVIEW', 'CLIENT_REVIEW', 'APPROVED', 'PUBLISHED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE task_type_enum AS ENUM ('VIDEO', 'PHOTO', 'DESIGN', 'EVENT', 'COPYWRITING', 'CAMPAIGN_CONTENT');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE task_priority_type AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'URGENT');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE event_type_enum AS ENUM ('RECORDING', 'PRODUCTION', 'PHOTO', 'DELIVERY', 'FINANCIAL', 'MEETING', 'CAMPAIGN');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE service_request_status_type AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE TYPE invoice_status_type AS ENUM ('PENDING', 'PAID', 'OVERDUE', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- 3. TABELA DE PERFIS DE USUÁRIO (Vinculado ao auth.users e login por e-mail/username)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE,
    password_hash TEXT,
    initial_password TEXT,
    full_name TEXT NOT NULL,
    role user_role_type NOT NULL DEFAULT 'EMPLOYEE',
    avatar_url TEXT,
    phone TEXT,
    client_id UUID,
    employee_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Garantir colunas se tabela já existir
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS username TEXT UNIQUE;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS initial_password TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS client_id UUID;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS employee_id UUID;

-- 4. TABELA DE CLIENTES
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    company_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    username TEXT,
    initial_password TEXT,
    phone TEXT,
    document TEXT NOT NULL, -- CPF ou CNPJ
    segment TEXT,
    logo_url TEXT,
    address TEXT,
    notes TEXT,
    status client_status_type DEFAULT 'ACTIVE',
    contract_model contract_model_type DEFAULT 'QUANTITY',
    monthly_fee NUMERIC(12, 2) DEFAULT 0.00,
    due_day INT DEFAULT 10,
    contracted_videos INT DEFAULT 0,
    contracted_photos INT DEFAULT 0,
    contracted_campaigns INT DEFAULT 0,
    extra_video_price NUMERIC(10, 2) DEFAULT 150.00,
    extra_photo_price NUMERIC(10, 2) DEFAULT 80.00,
    extra_event_price NUMERIC(10, 2) DEFAULT 500.00,
    extra_daily_price NUMERIC(10, 2) DEFAULT 300.00,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE public.clients ADD COLUMN IF NOT EXISTS initial_password TEXT;

-- 5. TABELA DE FUNCIONÁRIOS
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    username TEXT,
    initial_password TEXT,
    phone TEXT,
    avatar_url TEXT,
    role_title TEXT NOT NULL,
    department TEXT NOT NULL,
    status TEXT DEFAULT 'ACTIVE',
    can_manage_finance BOOLEAN DEFAULT FALSE,
    can_manage_clients BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS username TEXT;
ALTER TABLE public.employees ADD COLUMN IF NOT EXISTS initial_password TEXT;

-- 6. TABELA DE CAMPANHAS
CREATE TABLE IF NOT EXISTS public.campaigns (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    budget NUMERIC(12, 2) DEFAULT 0.00,
    content_count INT DEFAULT 0,
    progress_pct INT DEFAULT 0,
    status campaign_status_type DEFAULT 'PLANNING',
    current_step campaign_step_type DEFAULT 'BRIEFING',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. TABELA DE TAREFAS / CONTEÚDOS (KANBAN COM SUPORTE A GOOGLE DRIVE E FOTOS)
CREATE TABLE IF NOT EXISTS public.tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
    assignee_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    description TEXT,
    task_type task_type_enum DEFAULT 'VIDEO',
    status task_status_type DEFAULT 'BACKLOG',
    priority task_priority_type DEFAULT 'MEDIUM',
    due_date DATE NOT NULL,
    is_extra BOOLEAN DEFAULT FALSE,
    extra_price NUMERIC(10, 2) DEFAULT 0.00,
    media_url TEXT,
    raw_folder_url TEXT,
    script_url TEXT,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS media_url TEXT;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS raw_folder_url TEXT;
ALTER TABLE public.tasks ADD COLUMN IF NOT EXISTS script_url TEXT;

-- 8. TABELA DE COMENTÁRIOS DAS TAREFAS (COM TIMESTAMPS E PIN DE FOTOS)
CREATE TABLE IF NOT EXISTS public.task_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    task_id UUID NOT NULL REFERENCES public.tasks(id) ON DELETE CASCADE,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 9. TABELA DE EVENTOS DO CALENDÁRIO
CREATE TABLE IF NOT EXISTS public.calendar_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    campaign_id UUID REFERENCES public.campaigns(id) ON DELETE SET NULL,
    employee_id UUID REFERENCES public.employees(id) ON DELETE SET NULL,
    title TEXT NOT NULL,
    event_date DATE NOT NULL,
    start_time TIME,
    end_time TIME,
    location TEXT,
    event_type event_type_enum NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 10. TABELA DE SOLICITAÇÕES DE SERVIÇOS EXTRAS
CREATE TABLE IF NOT EXISTS public.service_requests (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    service_type TEXT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(10, 2) NOT NULL,
    total_estimated NUMERIC(12, 2) NOT NULL,
    desired_date DATE NOT NULL,
    description TEXT NOT NULL,
    notes TEXT,
    status service_request_status_type DEFAULT 'PENDING',
    converted_task_id UUID REFERENCES public.tasks(id) ON DELETE SET NULL,
    event_location TEXT,
    event_start_time TEXT,
    event_end_time TEXT,
    requires_drone BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ
);

ALTER TABLE public.service_requests ADD COLUMN IF NOT EXISTS event_location TEXT;
ALTER TABLE public.service_requests ADD COLUMN IF NOT EXISTS event_start_time TEXT;
ALTER TABLE public.service_requests ADD COLUMN IF NOT EXISTS event_end_time TEXT;
ALTER TABLE public.service_requests ADD COLUMN IF NOT EXISTS requires_drone BOOLEAN DEFAULT FALSE;

-- 11. TABELA DE FATURAS E PAGAMENTOS (PIX)
CREATE TABLE IF NOT EXISTS public.invoices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    reference_month INT NOT NULL,
    reference_year INT NOT NULL,
    base_amount NUMERIC(12, 2) NOT NULL,
    extras_amount NUMERIC(12, 2) DEFAULT 0.00,
    total_amount NUMERIC(12, 2) NOT NULL,
    due_date DATE NOT NULL,
    status invoice_status_type DEFAULT 'PENDING',
    pix_key TEXT,
    pix_payload TEXT,
    paid_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 12. TABELA DE ITENS DA FATURA
CREATE TABLE IF NOT EXISTS public.invoice_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    invoice_id UUID NOT NULL REFERENCES public.invoices(id) ON DELETE CASCADE,
    description TEXT NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    unit_price NUMERIC(10, 2) NOT NULL,
    total NUMERIC(12, 2) NOT NULL,
    is_extra BOOLEAN DEFAULT FALSE
);

-- ==============================================================================
-- 13. POLÍTICAS DE SEGURANÇA (ROW LEVEL SECURITY - RLS)
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoice_items ENABLE ROW LEVEL SECURITY;

-- Políticas de Leitura Pública/Autenticada (Permite visualização operacional com isolamento)
DO $$ BEGIN
    CREATE POLICY "Acesso Total para Administradores e Donos" ON public.profiles FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Clientes e Equipe Leitura Geral" ON public.clients FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Tarefas Acesso Geral" ON public.tasks FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Faturas Acesso Geral" ON public.invoices FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
    CREATE POLICY "Solicitações Acesso Geral" ON public.service_requests FOR ALL USING (true);
EXCEPTION WHEN duplicate_object THEN null; END $$;
