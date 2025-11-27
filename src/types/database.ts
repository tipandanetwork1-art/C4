// Database Schema Types - CQuatro Manager v2.0

// A. Tabela clientes (Cadastro Único)
export interface Cliente {
  id_cliente: string;
  id_ixc: string; // ID original do cliente no IXC
  cpf_cnpj: string; // Chave única
  nome_razao_social: string;
  contato_principal: string;
  created_at?: string;
}

// B. Tabela titulos_divida (O Financeiro)
export interface TituloDivida {
  id_titulo: string; // Número do boleto no IXC
  id_cliente: string;
  valor_original: number;
  data_vencimento: string;
  dias_atraso: number; // Calculado automaticamente
  status_atual: 'Em Aberto' | 'Enviado CQuatro' | 'Pago' | 'Negociado';
  created_at?: string;
}

// C. Tabela historico_envios (Controle CQuatro)
export interface HistoricoEnvio {
  id_envio: string;
  id_titulo: string;
  data_envio: string;
  lote_envio: string;
  created_at?: string;
}

// D. Tabela pagamentos (A Baixa)
export interface Pagamento {
  id_pagamento: string;
  id_titulo: string;
  valor_pago: number;
  data_pagamento: string;
  origem: 'Recuperado CQuatro' | 'Pago na Loja' | 'Negociação' | 'Outros';
  created_at?: string;
}

// Tipos auxiliares para o dashboard
export interface DashboardStats {
  novos_inadimplentes_7dias: number;
  carteira_elegivel_cobranca: number;
  atrasos_30_60_dias: number;
  atrasos_60_90_dias: number;
  atrasos_90_plus_dias: number;
  valor_total_carteira: number;
}

export interface TituloComCliente extends TituloDivida {
  cliente: Cliente;
}
