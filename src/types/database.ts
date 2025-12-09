// Database Schema Types - CQuatro Manager

export interface Cliente {
  id_cliente: string;
  cpf_cnpj: string;
  nome_razao_social: string;
  contato_principal: string;
  created_at?: string;
}

export interface TituloDivida {
  id_titulo: string;
  id_cliente: string;
  valor_original: number;
  data_vencimento: string;
  dias_atraso: number;
  status_atual: 'Em Aberto' | 'Enviado CQuatro' | 'Pago' | 'Negociado';
  created_at?: string;
}

export interface HistoricoEnvio {
  id_envio: string;
  id_titulo: string;
  data_envio: string;
  lote_envio: string;
  created_at?: string;
}

export interface Pagamento {
  id_pagamento: string;
  id_titulo: string;
  valor_pago: number;
  data_pagamento: string;
  origem: 'Recuperado CQuatro' | 'Pago na Loja' | 'Negociação' | 'Outros';
  created_at?: string;
}

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
