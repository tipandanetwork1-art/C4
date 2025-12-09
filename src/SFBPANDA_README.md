# SFBPanda - ERP Financeiro Corporativo

## Visão Geral

**SFBPanda** é uma plataforma de gestão financeira para empresas de telecomunicações e serviços recorrentes. O sistema oferece controle da base ativa de clientes, projeção de receitas, gestão de inadimplência e análises executivas.

## Principais Módulos

- **Dashboard Estratégico**: KPIs (MRR, ticket médio, taxa de inadimplência) e atalhos rápidos.
- **Base Ativa**: Lista de clientes, filtros por status e cálculo automático de MRR.
- **Financeiro**: Fluxo de caixa, lucro, despesas por categoria e gráfico de cashflow.
- **Inadimplência**: Abas (Visão Geral, Fila de Envio, Recuperados, Conferência Manual), seleção em massa e aging colorido.
- **Relatórios**: Modelos pré-configurados (Receitas, Cashflow, Inadimplência) e exportação em PDF/Excel/CSV.
- **Configurações**: Usuários, integrações internas, banco de dados, segurança e preferências gerais.

## Integrações

- **n8n Workflow Automation**
  - Sincronização automática com fontes externas
  - Webhooks de cobrança
  - Automação de relatórios
  - Status em tempo real no dashboard

## Estrutura de Dados

1. **Clientes** – Cadastro único com CPF/CNPJ, plano e valor mensal
2. **Títulos** – Boletos/dívidas com aging automático
3. **Transações** – Receitas e despesas categorizadas
4. **Histórico de Envios** – Controle de envio para cobrança externa
5. **Pagamentos** – Registro de baixas e recuperações

## Tecnologias

- **Frontend**: React + TypeScript
- **Estilização**: Tailwind CSS
- **Gráficos**: Recharts
- **Ícones**: Lucide React
- **Automação**: n8n
- **Integrações externas**: APIs personalizadas

## Estado Atual

- Versão: 1.0
- Última atualização: Novembro/2024
- Status: Frontend com dados mock

Para integração completa com serviços reais, configure as credenciais necessárias via Supabase ou outra fonte de dados oficial.
