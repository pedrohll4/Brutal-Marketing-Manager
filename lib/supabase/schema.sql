-- ==============================================================================
-- BRUTAL MARKETING MANAGER - BANCO DE DADOS POSTGRESQL / SUPABASE (IDEMPOTENTE)
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

-- 3. TABELA DE PERFIS DE USUÁRIO (Vinculado ao auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    role user_role_type NOT NULL DEFAULT 'EMPLOYEE',
    avatar_url TEXT,
    phone TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TABELA DE CLIENTES
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    name TEXT NOT NULL,
    company_name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
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

-- 5. TABELA DE FUNCIONÁRIOS
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID UNIQUE REFERENCES public.profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    avatar_url TEXT,
    role_title TEXT NOT NULL,
    department TEXT NOT NULL,
    status TEXT DEFAULT 'ACTIVE',
    can_manage_finance BOOLEAN DEFAULT FALSE,
    can_manage_clients BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

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

-- 7. TABELA DE TAREFAS / CONTEÚDOS (KANBAN)
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
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 8. TABELA DE COMENTÁRIOS DAS TAREFAS
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
    created_at TIMESTAMPTZ DEFAULT NOW(),
    approved_at TIMESTAMPTZ
);

-- 11. TABELA DE FATURAS E PAGAMENTOS
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

-- 12. TABELA DE RELATÓRIOS MENSAIS
CREATE TABLE IF NOT EXISTS public.monthly_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE CASCADE,
    month INT NOT NULL,
    year INT NOT NULL,
    contracted_videos INT DEFAULT 0,
    used_videos INT DEFAULT 0,
    extra_videos INT DEFAULT 0,
    total_videos INT DEFAULT 0,
    contracted_photos INT DEFAULT 0,
    used_photos INT DEFAULT 0,
    extra_photos INT DEFAULT 0,
    total_photos INT DEFAULT 0,
    base_amount NUMERIC(12, 2) NOT NULL,
    extras_amount NUMERIC(12, 2) DEFAULT 0.00,
    total_amount NUMERIC(12, 2) NOT NULL,
    campaigns_completed INT DEFAULT 0,
    tasks_completed INT DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 13. TABELA DE NOTIFICAÇÕES
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    role_target TEXT DEFAULT 'ALL',
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    type TEXT DEFAULT 'SYSTEM',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.monthly_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Helper Function para buscar o papel do usuário autenticado
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS user_role_type AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Helper Function para buscar o client_id do cliente autenticado
CREATE OR REPLACE FUNCTION public.get_current_client_id()
RETURNS UUID AS $$
  SELECT id FROM public.clients WHERE profile_id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Limpar policies antigas se existirem
DROP POLICY IF EXISTS "Admin e Owner possuem acesso total a Clientes" ON public.clients;
DROP POLICY IF EXISTS "Clientes veem apenas seu próprio cadastro" ON public.clients;
DROP POLICY IF EXISTS "Acesso a campanhas por papel" ON public.campaigns;
DROP POLICY IF EXISTS "Acesso a tarefas por papel" ON public.tasks;
DROP POLICY IF EXISTS "Acesso a financeiro por papel" ON public.invoices;
DROP POLICY IF EXISTS "Acesso a solicitações por papel" ON public.service_requests;

-- Policies para Clientes (CLIENT só vê seus próprios registros)
CREATE POLICY "Admin e Owner possuem acesso total a Clientes"
ON public.clients FOR ALL
USING (public.get_current_user_role() IN ('OWNER', 'ADMIN', 'EMPLOYEE'));

CREATE POLICY "Clientes veem apenas seu próprio cadastro"
ON public.clients FOR SELECT
USING (profile_id = auth.uid());

-- Policies para Campanhas
CREATE POLICY "Acesso a campanhas por papel"
ON public.campaigns FOR ALL
USING (
  public.get_current_user_role() IN ('OWNER', 'ADMIN', 'EMPLOYEE') OR
  client_id = public.get_current_client_id()
);

-- Policies para Tarefas
CREATE POLICY "Acesso a tarefas por papel"
ON public.tasks FOR ALL
USING (
  public.get_current_user_role() IN ('OWNER', 'ADMIN', 'EMPLOYEE') OR
  (client_id = public.get_current_client_id() AND status IN ('CLIENT_REVIEW', 'APPROVED', 'PUBLISHED'))
);

-- Policies para Invoices / Faturas
CREATE POLICY "Acesso a financeiro por papel"
ON public.invoices FOR ALL
USING (
  public.get_current_user_role() IN ('OWNER', 'ADMIN') OR
  client_id = public.get_current_client_id()
);

-- Policies para Solicitações de Serviço
CREATE POLICY "Acesso a solicitações por papel"
ON public.service_requests FOR ALL
USING (
  public.get_current_user_role() IN ('OWNER', 'ADMIN', 'EMPLOYEE') OR
  client_id = public.get_current_client_id()
);
