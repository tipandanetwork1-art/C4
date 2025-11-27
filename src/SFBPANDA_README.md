# SFBPanda - ERP Financeiro Corporativo

## 📊 Visão Geral

**SFBPanda** é um sistema completo de gestão financeira corporativa, projetado para empresas de telecomunicações e serviços recorrentes. O sistema oferece controle total sobre base ativa de clientes, projeção de receitas (MRR), gestão de inadimplência e análise financeira avançada.

## 🎨 Design & Estética

- **Visual:** Enterprise SaaS profissional, inspirado em plataformas como Stripe e sistemas bancários modernos
- **Layout:** Arquitetura de informação densa mas organizada, com cards em background cinza claro (#F8FAFC)
- **Tipografia:** Sans-serif limpa (Inter/Roboto) com hierarquia por peso
- **Cores:**
  - **Primary:** Deep Corporate Blue (#0F52BA) - Branding e ações principais
  - **Secondary:** Lighter Blue (#3B82F6) - Highlights
  - **Success:** Emerald Green (#10B981) - Receitas e sucesso
  - **Warning:** Amber Yellow (#F59E0B) - Alertas e riscos
  - **Danger:** Rose Red (#E11D48) - Dívidas e ações críticas

## 🏗️ Estrutura do Sistema

### 1. Dashboard Estratégico
Tela principal com visão executiva:
- **KPIs Principais:** MRR, Receita Projetada, Ticket Médio, Taxa de Inadimplência
- **Gráficos:**
  - Fluxo de Receita Real vs. Projetado (linha)
  - Saúde da Base Ativa (donut)
  - Curva de Inadimplência por Aging (barras)
- **Atalhos Rápidos:** Importação CSV, registro de despesas, fila de cobrança

### 2. Base Ativa
Gerenciamento completo da carteira de clientes:
- Lista detalhada de todos os clientes
- Filtros por status (Ativo, Em Atraso, Suspenso)
- Dados de contrato, plano e valor mensal
- Exportação de dados
- Cálculo automático de MRR

### 3. Financeiro
Controle de fluxo de caixa e análise financeira:
- Receitas e despesas mensais
- Lucro líquido e margem
- Distribuição de despesas por categoria
- Transações recentes
- Gráficos de cashflow e breakdown de custos

### 4. Inadimplência
Módulo completo de gestão de cobrança (evoluído do CQuatro Manager):
- **Abas:** Visão Geral, Fila de Envio (CQuatro), Recuperados, Conferência Manual
- **Tabela Avançada:**
  - Seleção múltipla (bulk actions)
  - Aging colorido (30+, 60+, 90+ dias)
  - Status de envio para cobrança externa
  - Múltiplos títulos por cliente
- **Ações em Massa:** Enviar clientes selecionados para cobrança externa

### 5. Relatórios
Geração e exportação de relatórios:
- Modelos pré-configurados (Receitas, Base Ativa, Cashflow, Inadimplência)
- Múltiplos formatos (PDF, Excel, CSV)
- Relatórios agendados (automação)
- Histórico de geração

### 6. Configurações
Administração do sistema:
- Gerenciamento de usuários e permissões
- Status de integrações n8n
- Configurações de banco de dados
- Segurança e auditoria (2FA, logs)
- Preferências gerais e notificações

## 🔌 Integrações

### N8N Workflow Automation
- Sincronização automática com IXC ERP
- Webhooks de cobrança
- Automação de relatórios
- Status em tempo real no dashboard

### IXC ERP
- Importação de base de clientes
- Sincronização de títulos a receber
- Atualização de status de pagamento

## 💾 Estrutura de Dados

### Entidades Principais:
1. **Clientes** - Cadastro único com ID IXC, CPF/CNPJ, plano, valor mensal
2. **Títulos** - Boletos/dívidas individuais com aging automático
3. **Transações** - Receitas e despesas categorizadas
4. **Histórico de Envios** - Controle de envio para cobrança externa
5. **Pagamentos** - Registro de baixas e recuperações

## 📈 KPIs e Métricas

### Dashboard Principal:
- **MRR (Monthly Recurring Revenue):** Receita recorrente mensal
- **Receita Projetada:** Baseada em contratos ativos
- **Ticket Médio:** Valor médio por cliente
- **Taxa de Inadimplência:** Percentual e valor total em atraso
- **Curva de Aging:** Distribuição de dívidas por tempo

### Financeiro:
- **Lucro Líquido:** Receitas - Despesas
- **Margem de Lucro:** Percentual de lucratividade
- **Fluxo de Caixa:** Saldo disponível
- **Despesas por Categoria:** Breakdown detalhado

## 🚀 Funcionalidades Avançadas

### Conferência Manual
- Cole listas de CPFs/Títulos do Excel
- Verificação automática contra base de dados
- Identificação de status (Pago, Em Cobrança, Disponível)

### Bulk Actions
- Seleção múltipla de clientes inadimplentes
- Envio em massa para cobrança externa
- Exportação de lotes

### Relatórios Agendados
- Geração automática em horários configurados
- Envio por email
- Múltiplos formatos de saída

## 🛡️ Segurança

- Autenticação de dois fatores (2FA)
- Logs de auditoria completos
- Controle de acesso por perfil
- Backup automático do banco de dados

## 🎯 Público-Alvo

- Empresas de telecomunicações
- Provedores de internet (ISP)
- Empresas com modelo de negócio recorrente (SaaS)
- Departamentos financeiros corporativos
- Empresas de cobrança e recuperação de crédito

## 📦 Tecnologias

- **Frontend:** React + TypeScript
- **Styling:** Tailwind CSS
- **Charts:** Recharts
- **Icons:** Lucide React
- **Automation:** n8n
- **ERP Integration:** IXC API

## 🎨 Componentes UI

Todos os componentes seguem o design system enterprise:
- Cards com shadows sutis
- Badges coloridos por status/categoria
- Tabelas com hover states
- Gráficos interativos
- Filtros e buscas avançadas
- Estados de loading e sincronização

---

**Versão:** 1.0  
**Última Atualização:** Novembro 2024  
**Status:** Production Ready (Frontend + Mock Data)

Para implementação completa com banco de dados e integrações reais, conecte ao Supabase e configure as credenciais da API IXC conforme documentação técnica.
