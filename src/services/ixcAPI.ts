// IXC API Integration Service
import { Cliente, TituloDivida } from "../types/database";

// Configuração da API IXC
const IXC_API_CONFIG = {
  baseUrl: "YOUR_IXC_API_URL_HERE", // Ex: https://seu-dominio.ixcsoft.com.br/webservice/v1
  token: "YOUR_IXC_API_TOKEN_HERE",
};

// Mock data para desenvolvimento (substituir por chamadas reais da API)
export class IXCAPIService {
  // Endpoint: fn_areceber - Listar Títulos a Receber
  static async buscarTitulosAbertos(diasAtrasoMinimo: number = 30): Promise<TituloDivida[]> {
    console.log(
      `🔄 Sincronizando com IXC API (${IXC_API_CONFIG.baseUrl}) - Buscando títulos com ${diasAtrasoMinimo}+ dias de atraso...`,
    );

    // TODO: Implementar chamada real
    // const response = await fetch(`${IXC_API_CONFIG.baseUrl}/fn_areceber`, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${IXC_API_CONFIG.token}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     qtype: 'fn_areceber.status',
    //     query: 'Aberto',
    //     oper: '=',
    //     page: 1,
    //     rp: 100,
    //   }),
    // });

    // Mock data para demonstração
    return this.getMockTitulosAbertos(diasAtrasoMinimo);
  }

  // Endpoint: cliente - Listar Clientes
  static async buscarCliente(idIxc: string): Promise<Cliente | null> {
    console.log(`🔍 Buscando cliente ${idIxc} no IXC via ${IXC_API_CONFIG.baseUrl}...`);

    // TODO: Implementar chamada real
    // const response = await fetch(`${IXC_API_CONFIG.baseUrl}/cliente/${idIxc}`, {
    //   headers: {
    //     'Authorization': `Bearer ${IXC_API_CONFIG.token}`,
    //   },
    // });

    // Mock data
    return this.getMockCliente(idIxc);
  }

  // Calcular dias de atraso
  static calcularDiasAtraso(dataVencimento: string): number {
    const vencimento = new Date(dataVencimento);
    const hoje = new Date();
    const diffTime = hoje.getTime() - vencimento.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays > 0 ? diffDays : 0;
  }

  // Classificar por faixa de aging
  static classificarPorAging(diasAtraso: number): "0-30" | "30-60" | "60-90" | "90+" {
    if (diasAtraso < 30) return "0-30";
    if (diasAtraso < 60) return "30-60";
    if (diasAtraso < 90) return "60-90";
    return "90+";
  }

  // ========== MOCK DATA (Remover em produção) ==========

  private static getMockTitulosAbertos(diasAtrasoMinimo: number): TituloDivida[] {
    const mockTitulos: TituloDivida[] = [
      {
        id_titulo: "IXC-2024-001",
        id_cliente: "CLI-001",
        valor_original: 1250.0,
        data_vencimento: "2024-08-15",
        dias_atraso: 98,
        status_atual: "Em Aberto",
      },
      {
        id_titulo: "IXC-2024-002",
        id_cliente: "CLI-002",
        valor_original: 3400.0,
        data_vencimento: "2024-09-10",
        dias_atraso: 72,
        status_atual: "Em Aberto",
      },
      {
        id_titulo: "IXC-2024-003",
        id_cliente: "CLI-003",
        valor_original: 890.0,
        data_vencimento: "2024-10-20",
        dias_atraso: 32,
        status_atual: "Em Aberto",
      },
      {
        id_titulo: "IXC-2024-004",
        id_cliente: "CLI-004",
        valor_original: 5600.0,
        data_vencimento: "2024-09-25",
        dias_atraso: 57,
        status_atual: "Em Aberto",
      },
      {
        id_titulo: "IXC-2024-005",
        id_cliente: "CLI-005",
        valor_original: 2100.0,
        data_vencimento: "2024-07-30",
        dias_atraso: 114,
        status_atual: "Em Aberto",
      },
      {
        id_titulo: "IXC-2024-006",
        id_cliente: "CLI-006",
        valor_original: 1800.0,
        data_vencimento: "2024-11-05",
        dias_atraso: 16,
        status_atual: "Em Aberto",
      },
      {
        id_titulo: "IXC-2024-007",
        id_cliente: "CLI-007",
        valor_original: 7200.0,
        data_vencimento: "2024-08-28",
        dias_atraso: 85,
        status_atual: "Em Aberto",
      },
      {
        id_titulo: "IXC-2024-008",
        id_cliente: "CLI-008",
        valor_original: 950.0,
        data_vencimento: "2024-10-28",
        dias_atraso: 24,
        status_atual: "Em Aberto",
      },
    ];

    return mockTitulos.filter((t) => t.dias_atraso >= diasAtrasoMinimo);
  }

  private static getMockCliente(idIxc: string): Cliente {
    const mockClientes: Record<string, Cliente> = {
      "CLI-001": {
        id_cliente: "CLI-001",
        id_ixc: "IXC-1001",
        cpf_cnpj: "123.456.789-00",
        nome_razao_social: "João Silva",
        contato_principal: "(11) 98765-4321",
      },
      "CLI-002": {
        id_cliente: "CLI-002",
        id_ixc: "IXC-1002",
        cpf_cnpj: "987.654.321-00",
        nome_razao_social: "Maria Santos",
        contato_principal: "(21) 91234-5678",
      },
    };

    return (
      mockClientes[idIxc] || {
        id_cliente: idIxc,
        id_ixc: idIxc,
        cpf_cnpj: "N/A",
        nome_razao_social: "Cliente Desconhecido",
        contato_principal: "N/A",
      }
    );
  }
}