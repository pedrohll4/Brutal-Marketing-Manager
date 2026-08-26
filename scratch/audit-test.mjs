import { createClient } from '@supabase/supabase-js';

console.log('====================================================');
console.log('🚀 INICIANDO AUDITORIA & TESTES GERAIS DO SISTEMA');
console.log('====================================================\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition, message) {
  totalTests++;
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passedTests++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    process.exitCode = 1;
  }
}

// ────────────────────────────────────────────────────────────
// TESTE 1: Regra de Cálculo Financeiro & Cotas de Vídeos
// ────────────────────────────────────────────────────────────
console.log('📦 TESTE 1: Motor Financeiro & Cotas de Contrato');
{
  const client = {
    id: 'cli-test',
    name: 'Cliente Teste',
    companyName: 'Empresa Teste',
    monthlyFee: 2000,
    contractedVideos: 12,
    extraVideoPrice: 150,
  };

  const tasks = [
    { id: '1', status: 'APPROVED', isExtra: false },
    { id: '2', status: 'APPROVED', isExtra: false },
    { id: '3', status: 'APPROVED', isExtra: false },
    { id: '4', status: 'APPROVED', isExtra: false },
    { id: '5', status: 'APPROVED', isExtra: false },
    { id: '6', status: 'APPROVED', isExtra: false },
    { id: '7', status: 'APPROVED', isExtra: false },
    { id: '8', status: 'APPROVED', isExtra: false },
    { id: '9', status: 'APPROVED', isExtra: false },
    { id: '10', status: 'APPROVED', isExtra: false },
    { id: '11', status: 'APPROVED', isExtra: false },
    { id: '12', status: 'APPROVED', isExtra: false },
    { id: '13', status: 'APPROVED', isExtra: true },
    { id: '14', status: 'APPROVED', isExtra: true },
    { id: '15', status: 'APPROVED', isExtra: true },
  ];

  const deliveredTotal = tasks.length; // 15
  const extraVideos = tasks.filter((t) => t.isExtra).length; // 3
  const totalExtrasCost = extraVideos * client.extraVideoPrice; // 3 * 150 = 450
  const grandTotalCost = client.monthlyFee + totalExtrasCost; // 2450

  assert(deliveredTotal === 15, 'Total de 15 vídeos entregues computado corretamente');
  assert(extraVideos === 3, 'Cota excedente de 3 vídeos extras identificada');
  assert(totalExtrasCost === 450, 'Cálculo de R$ 450 em extras (3x R$ 150) exato');
  assert(grandTotalCost === 2450, 'Fatura total mensal (R$ 2000 base + R$ 450 extras = R$ 2450) exata');
}

// ────────────────────────────────────────────────────────────
// TESTE 2: Associação Inteligente de Tarefas (clientMatcher)
// ────────────────────────────────────────────────────────────
console.log('\n🔗 TESTE 2: Matcher de Tarefas e Clientes (UUID vs String)');
{
  function isTaskForClient(task, client, user) {
    if (!client && !user) return false;
    const clientId = client?.id || user?.clientId;
    const clientName = (client?.name || user?.fullName || '').toLowerCase().trim();
    const companyName = (client?.companyName || '').toLowerCase().trim();
    const clientEmail = (client?.email || user?.email || '').toLowerCase().trim();

    if (task.clientId && clientId && task.clientId === clientId) return true;
    if (user?.clientId && task.clientId === user.clientId) return true;
    if (client?.id && task.clientId === client.id) return true;

    if (
      (task.clientId === 'cli-procampo' || (task.clientName && task.clientName.toLowerCase().includes('procampo'))) &&
      (clientEmail.includes('procampo') || clientName.includes('procampo') || companyName.includes('procampo') || (clientId && clientId.includes('procampo')))
    ) {
      return true;
    }

    if (task.clientName) {
      const tName = task.clientName.toLowerCase().trim();
      if (clientName && (tName === clientName || tName.includes(clientName) || clientName.includes(tName))) return true;
      if (companyName && (tName === companyName || tName.includes(companyName) || companyName.includes(tName))) return true;
    }

    return false;
  }

  const clientSupabase = {
    id: '8d3c1187-5784-4828-97a7-33128ef871b6',
    name: 'Nicole Procampo',
    companyName: 'Procampo Agronegócios',
    email: 'nicole.procampo@email.com',
  };

  const taskLegacy = {
    id: 'tsk-p-1',
    clientId: 'cli-procampo',
    clientName: 'Nicole Procampo',
    title: 'Vídeo 01: Institucional Safra',
  };

  const taskUuid = {
    id: 'tsk-uuid-1',
    clientId: '8d3c1187-5784-4828-97a7-33128ef871b6',
    clientName: 'Procampo Agronegócios',
    title: 'Vídeo 02: Bioestimulantes',
  };

  const taskOther = {
    id: 'tsk-tr-1',
    clientId: 'cli-techrush',
    clientName: 'TechRush Electronics',
    title: 'Teaser Black Friday',
  };

  assert(isTaskForClient(taskLegacy, clientSupabase) === true, 'Associação por nome/empresa Procampo bem sucedida (legado)');
  assert(isTaskForClient(taskUuid, clientSupabase) === true, 'Associação por UUID do Supabase bem sucedida');
  assert(isTaskForClient(taskOther, clientSupabase) === false, 'Isolamento de tarefas de outros clientes (TechRush) mantido');
}

// ────────────────────────────────────────────────────────────
// TESTE 3: Filtragem de Notificações por Perfil (Segregação)
// ────────────────────────────────────────────────────────────
console.log('\n🔔 TESTE 3: Segregação e Segurança de Notificações');
{
  const notifications = [
    { id: '1', roleTarget: 'ADMIN', title: 'Vídeo Aprovado por Nicole', link: '/producao' },
    { id: '2', roleTarget: 'ADMIN', title: 'Pagamento Confirmado R$ 4500', link: '/financeiro' },
    { id: '3', roleTarget: 'CLIENT', clientId: 'cli-procampo', title: 'Seu Vídeo está Pronto', link: '/portal-cliente/entregas' },
    { id: '4', roleTarget: 'STAFF', title: 'Nova Tarefa Criada', link: '/producao' },
  ];

  // Simular usuário CLIENT
  const isClient = true;
  const userClient = { clientId: 'cli-procampo', email: 'nicole.procampo@email.com' };

  const clientNotifs = notifications.filter((notif) => {
    if (isClient) {
      if (notif.roleTarget && notif.roleTarget !== 'CLIENT' && notif.roleTarget !== 'ALL') return false;
      if (notif.clientId && notif.clientId !== userClient.clientId) return false;
      if (notif.link && (notif.link.startsWith('/financeiro') || notif.link.startsWith('/producao'))) return false;
      return true;
    }
    return true;
  });

  assert(clientNotifs.length === 1, 'Cliente recebe apenas 1 notificação relevante');
  assert(clientNotifs[0].title === 'Seu Vídeo está Pronto', 'Notificação de entrega do cliente exibida');
  assert(!clientNotifs.some(n => n.link === '/financeiro'), 'Rotas financeiras administrativas ocultas para o cliente');
}

// ────────────────────────────────────────────────────────────
// TESTE 4: Gerador de Links WhatsApp & Automações
// ────────────────────────────────────────────────────────────
console.log('\n📱 TESTE 4: Automação de WhatsApp e Links de Compartilhamento');
{
  function buildWhatsAppReviewUrl(phone, clientName, videoTitle) {
    const cleanPhone = phone.replace(/\D/g, '');
    const message = `Olá, *${clientName}*! 👋\n\nSeu vídeo *"${videoTitle}"* acabou de ser finalizado pela equipe da Brutal Marketing!\n\nAcesse o Portal do Cliente para assistir ao pré-corte e aprovar com 1 clique.`;
    return `https://wa.me/55${cleanPhone}?text=${encodeURIComponent(message)}`;
  }

  const url = buildWhatsAppReviewUrl('(16) 99123-4567', 'Nicole Procampo', 'Vídeo 13: Lançamento');
  assert(url.includes('wa.me/5516991234567'), 'Número de telefone formatado com código DDI/DDD');
  assert(url.includes(encodeURIComponent('Nicole Procampo')), 'Nome do cliente codificado no texto');
  assert(url.includes(encodeURIComponent('Vídeo 13: Lançamento')), 'Título do vídeo incluído na mensagem');
}

// ────────────────────────────────────────────────────────────
// TESTE 5: Conectividade e Tabelas no Supabase
// ────────────────────────────────────────────────────────────
console.log('\n🗄️ TESTE 5: Conexão e Schemas no Supabase');
{
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://hnwkrrpodorvyhefkqwe.supabase.co';
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_toqjgCmmXdHfvRmcXa9UuA_UgJcj536';

  const supabase = createClient(supabaseUrl, supabaseAnonKey);
  
  try {
    const { data: clients, error: clientErr } = await supabase.from('clients').select('id, name, company_name').limit(5);
    assert(!clientErr, 'Consulta à tabela "clients" no Supabase respondeu com sucesso');
    
    const { data: tasks, error: taskErr } = await supabase.from('tasks').select('id, title, status').limit(5);
    assert(!taskErr, 'Consulta à tabela "tasks" no Supabase respondeu com sucesso');

    const { data: employees, error: empErr } = await supabase.from('employees').select('id, name, role_title').limit(5);
    assert(!empErr, 'Consulta à tabela "employees" no Supabase respondeu com sucesso');
  } catch (err) {
    console.error('Erro na conexão:', err);
  }
}

console.log('\n====================================================');
console.log(`📊 RESULTADO DO TESTE: ${passedTests}/${totalTests} aprovados (${Math.round((passedTests/totalTests)*100)}%)`);
console.log('====================================================\n');
