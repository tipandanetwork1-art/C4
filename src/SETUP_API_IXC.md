# Guia de Integração API IXC - CQuatro Manager v2.0

## 📋 Visão Geral

Este guia explica como conectar o CQuatro Manager à API do IXC ERP para sincronização automática de dados de cobrança.

## 🔧 Passo 1: Obter Credenciais da API IXC

1. Acesse o painel administrativo do IXC
2. Navegue até: **Configurações → Webservice → Tokens de API**
3. Gere um novo token com as seguintes permissões:
   - ✅ Leitura de Clientes (`cliente`)
   - ✅ Leitura de Títulos a Receber (`fn_areceber`)
4. Copie o token gerado (será usado na próxima etapa)

## 🔌 Passo 2: Configurar as Credenciais no Sistema

Abra o arquivo `/services/ixcAPI.ts` e configure:

```typescript
const IXC_API_CONFIG = {
  baseUrl: 'https://seu-dominio.ixcsoft.com.br/webservice/v1',
  token: 'SEU_TOKEN_AQUI',
};
```

**⚠️ IMPORTANTE:** Nunca comite credenciais reais no código. Use variáveis de ambiente em produção.

## 📊 Passo 3: Endpoints Utilizados

### A. Listar Títulos a Receber (`fn_areceber`)

**Método:** POST  
**URL:** `{baseUrl}/fn_areceber`  
**Headers:**
```json
{
  "Authorization": "Bearer {token}",
  "Content-Type": "application/json"
}
```

**Body Exemplo:**
```json
{
  "qtype": "fn_areceber.status",
  "query": "Aberto",
  "oper": "=",
  "page": 1,
  "rp": 100
}
```

**Filtros Adicionais:**
- `data_vencimento`: Filtrar por data de vencimento
- `id_cliente`: Filtrar por cliente específico

### B. Buscar Cliente (`cliente`)

**Método:** GET  
**URL:** `{baseUrl}/cliente/{id_cliente}`  
**Headers:**
```json
{
  "Authorization": "Bearer {token}"
}
```

## 🗄️ Passo 4: Configurar o Banco de Dados

O sistema precisa de 4 tabelas principais:

### Tabela: `clientes`
```sql
CREATE TABLE clientes (
  id_cliente TEXT PRIMARY KEY,
  id_ixc TEXT UNIQUE NOT NULL,
  cpf_cnpj TEXT UNIQUE NOT NULL,
  nome_razao_social TEXT NOT NULL,
  contato_principal TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela: `titulos_divida`
```sql
CREATE TABLE titulos_divida (
  id_titulo TEXT PRIMARY KEY,
  id_cliente TEXT REFERENCES clientes(id_cliente),
  valor_original DECIMAL(10,2) NOT NULL,
  data_vencimento DATE NOT NULL,
  dias_atraso INTEGER,
  status_atual TEXT CHECK(status_atual IN ('Em Aberto', 'Enviado CQuatro', 'Pago', 'Negociado')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela: `historico_envios`
```sql
CREATE TABLE historico_envios (
  id_envio TEXT PRIMARY KEY,
  id_titulo TEXT REFERENCES titulos_divida(id_titulo),
  data_envio TIMESTAMP NOT NULL,
  lote_envio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Tabela: `pagamentos`
```sql
CREATE TABLE pagamentos (
  id_pagamento TEXT PRIMARY KEY,
  id_titulo TEXT REFERENCES titulos_divida(id_titulo),
  valor_pago DECIMAL(10,2) NOT NULL,
  data_pagamento DATE NOT NULL,
  origem TEXT CHECK(origem IN ('Recuperado CQuatro', 'Pago na Loja', 'Negociação', 'Outros')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## 🚀 Passo 5: Implementar a Sincronização Real

Substitua as funções mock em `/services/ixcAPI.ts`:

```typescript
static async buscarTitulosAbertos(diasAtrasoMinimo: number = 30): Promise<TituloDivida[]> {
  const response = await fetch(`${IXC_API_CONFIG.baseUrl}/fn_areceber`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${IXC_API_CONFIG.token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      qtype: 'fn_areceber.status',
      query: 'Aberto',
      oper: '=',
      page: 1,
      rp: 100,
    }),
  });

  const data = await response.json();
  
  // Processar e filtrar por dias de atraso
  return data.registros
    .map(titulo => ({
      id_titulo: titulo.id,
      id_cliente: titulo.id_cliente,
      valor_original: parseFloat(titulo.valor),
      data_vencimento: titulo.data_vencimento,
      dias_atraso: this.calcularDiasAtraso(titulo.data_vencimento),
      status_atual: 'Em Aberto' as const,
    }))
    .filter(t => t.dias_atraso >= diasAtrasoMinimo);
}
```

## ⏰ Passo 6: Automatizar a Sincronização

Adicione um cron job ou scheduled task para executar a sincronização periodicamente:

```typescript
// Exemplo: Sincronizar a cada 6 horas
setInterval(async () => {
  console.log('🔄 Iniciando sincronização automática...');
  await IXCAPIService.buscarTitulosAbertos(30);
}, 6 * 60 * 60 * 1000); // 6 horas em milissegundos
```

## 🔍 Passo 7: Testar a Integração

1. Clique no botão "Sincronizar IXC" no Radar Dashboard
2. Verifique o console do navegador para mensagens de log
3. Confirme que os títulos aparecem na tabela
4. Teste os filtros de aging (30-60, 60-90, 90+ dias)

## 📈 Fluxo de Dados Completo

```
IXC ERP API
    ↓
[Sincronização]
    ↓
Banco de Dados CQuatro
    ↓
[Cruzamento com Histórico]
    ↓
Dashboard Radar
    ↓
[Análise e Decisão]
    ↓
Envio para Cobrança CQuatro
```

## 🛡️ Segurança

- ✅ Use HTTPS para todas as chamadas de API
- ✅ Armazene tokens em variáveis de ambiente
- ✅ Implemente rate limiting
- ✅ Registre todas as sincronizações em log
- ✅ Use autenticação adequada no banco de dados

## 📞 Próximos Passos

1. ✅ Configurar credenciais da API IXC
2. ✅ Criar banco de dados (recomendamos Supabase)
3. ✅ Implementar funções reais da API
4. ✅ Testar sincronização
5. ✅ Importar dados legados (planilhas antigas)
6. ✅ Treinar equipe no novo sistema
7. ✅ Go-live!

---

**Suporte Técnico:** Para dúvidas sobre a API IXC, consulte a [documentação oficial do IXC](https://wiki.ixcsoft.com.br/).
