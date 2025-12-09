import { NextResponse } from 'next/server';
import https from 'https';

const IXC_CONFIG = {
  baseUrl:
    process.env.IXC_API_BASE_URL ?? 'https://191.7.184.11/webservice/v1',
  token:
    process.env.IXC_API_TOKEN ??
    '339:500a9bb5ece76c8648cd4c47da81b48c71734ff1d46f525b5a31f2f45bd81d84',
};

const IXC_FETCH_PAGE_SIZE =
  globalThis.__IXC_DASHBOARD_PAGE_SIZE__ ||
  (globalThis.__IXC_DASHBOARD_PAGE_SIZE__ = Math.max(
    parseInt(process.env.IXC_API_FETCH_RP ?? '200', 10),
    50
  ));

type IXCTitulo = {
  data_emissao?: string;
  data_vencimento?: string;
  pagamento_data?: string;
  credito_data?: string;
  baixa_data?: string;
  valor?: string;
  valor_total?: string;
  valor_recebido?: string;
  valor_aberto?: string;
};

type IxcFilter = {
  field: string;
  type?: string;
  comparison?: string;
  value: string;
};

interface FluxoResponse {
  success: boolean;
  totalValor: number;
  totalRecebido: number;
  totalEmAberto: number;
  taxaAberto: number;
  periodo: {
    inicio: string;
    fim: string;
  };
  registrosConsiderados: number;
  syncing: boolean;
  error?: string;
}
type FluxoResumoData = {
  totalValor: number;
  totalRecebido: number;
  totalEmAberto: number;
  taxaAberto: number;
  periodo: {
    inicio: string;
    fim: string;
  };
  registrosConsiderados: number;
};

type FluxoCacheEntry = {
  data: FluxoResumoData | null;
  updatedAt: number;
  loadingPromise?: Promise<FluxoResumoData>;
};

type FluxoCacheStore = Record<string, FluxoCacheEntry>;

const FLUXO_CACHE_TTL_MS = Math.max(
  60_000,
  parseInt(process.env.DASHBOARD_FLUXO_CACHE_TTL_MS ?? '180000', 10)
);

function parseNumber(value: unknown, fallback = 0): number {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (typeof value === 'string') {
    const parsed = Number(value.replace(',', '.'));
    return Number.isFinite(parsed) ? parsed : fallback;
  }
  return fallback;
}

function formatIsoDate(date: Date): string {
  const ano = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const dia = String(date.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

function parseDataBruta(value?: string): Date | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  try {
    if (trimmed.includes('/')) {
      const [dia, mes, ano] = trimmed.split('/');
      const parsed = new Date(
        Number(ano),
        Number(mes) - 1,
        Number(dia),
        0,
        0,
        0,
        0
      );
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    }
    const parsed = new Date(trimmed);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  } catch {
    return null;
  }
}

function obterDataReferencia(
  titulo: IXCTitulo,
  interpretacao: StatusInterpretacao
): Date | null {
  if (interpretacao === 'RECEBIDO') {
    return (
      parseDataBruta(titulo.pagamento_data) ??
      parseDataBruta(titulo.baixa_data) ??
      parseDataBruta(titulo.credito_data) ??
      parseDataBruta(titulo.data_vencimento) ??
      parseDataBruta(titulo.data_emissao) ??
      null
    );
  }

  return (
    parseDataBruta(titulo.data_vencimento) ??
    parseDataBruta(titulo.data_emissao) ??
    null
  );
}

function estaDentroDoPeriodo(
  titulo: IXCTitulo,
  dataInicio: Date,
  dataFim: Date,
  interpretacao: StatusInterpretacao
): boolean {
  const referencia = obterDataReferencia(titulo, interpretacao);
  if (!referencia) return false;
  return referencia >= dataInicio && referencia <= dataFim;
}

function makeIxcRequest(
  endpoint: string,
  body: Record<string, unknown>
): Promise<any> {
  const payload = JSON.stringify(body);
  const authToken = Buffer.from(IXC_CONFIG.token).toString('base64');
  const agent = new https.Agent({ rejectUnauthorized: false });

  return new Promise((resolve, reject) => {
    const req = https.request(
      `${IXC_CONFIG.baseUrl}/${endpoint}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Basic ${authToken}`,
          ixcsoft: 'listar',
          'Content-Length': Buffer.byteLength(payload),
        },
        agent,
      },
      (res) => {
        let raw = '';
        res.on('data', (chunk) => {
          raw += chunk;
        });
        res.on('end', () => {
          if (res.statusCode && res.statusCode >= 400) {
            return reject(
              new Error(
                `IXC retornou ${res.statusCode}: ${raw.substring(0, 200)}`
              )
            );
          }

          try {
            resolve(JSON.parse(raw));
          } catch (error) {
            reject(
              new Error(
                `Erro ao parsear resposta do IXC: ${
                  error instanceof Error ? error.message : error
                } - Corpo: ${raw.substring(0, 200)}`
              )
            );
          }
        });
      }
    );

    req.on('error', (error) => reject(error));
    req.write(payload);
    req.end();
  });
}

function extractNumber(...values: unknown[]): number | null {
  for (const value of values) {
    if (value === undefined || value === null) continue;
    const parsed =
      typeof value === 'string'
        ? Number(value.replace(',', '.'))
        : Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return null;
}

type StatusInterpretacao = 'ABERTO' | 'RECEBIDO';

function montarFiltrosPeriodo(
  interpretacao: StatusInterpretacao,
  dataInicio: Date,
  dataFim: Date
): IxcFilter[] {
  const campo =
    interpretacao === 'RECEBIDO'
      ? 'fn_areceber.baixa_data'
      : 'fn_areceber.data_vencimento';

  return [
    {
      field: campo,
      type: 'date',
      comparison: 'between',
      value: `${formatIsoDate(dataInicio)}|${formatIsoDate(dataFim)}`,
    },
  ];
}

async function somarTitulosPorStatus(
  status: string,
  interpretacao: StatusInterpretacao,
  dataInicio: Date,
  dataFim: Date
): Promise<{
  totalValor: number;
  totalRecebido: number;
  totalEmAberto: number;
  registrosConsiderados: number;
}> {
  let totalValor = 0;
  let totalRecebido = 0;
  let totalEmAberto = 0;
  let registrosConsiderados = 0;

  let pagina = 1;
  const filtros = montarFiltrosPeriodo(interpretacao, dataInicio, dataFim);

  while (true) {
    const sortField =
      interpretacao === 'RECEBIDO'
        ? 'fn_areceber.baixa_data'
        : 'fn_areceber.data_vencimento';
    const resposta = await makeIxcRequest('fn_areceber', {
      qtype: 'fn_areceber.status',
      query: status,
      oper: '=',
      page: pagina,
      rp: IXC_FETCH_PAGE_SIZE,
      sortname: sortField,
      sortorder: 'desc',
      filters: filtros,
    });

    const registros: IXCTitulo[] = Array.isArray(resposta?.registros)
      ? resposta.registros
      : [];

    registros.forEach((titulo) => {
      if (!estaDentroDoPeriodo(titulo, dataInicio, dataFim, interpretacao)) {
        return;
      }

      const valorTotalBase = parseNumber(
        titulo.valor ?? titulo.valor_total ?? titulo.valor_recebido,
        0
      );

      if (interpretacao === 'ABERTO') {
        let valorRecebido = parseNumber(titulo.valor_recebido, 0);
        let valorAberto = parseNumber(titulo.valor_aberto, 0);

        if (!valorAberto && valorTotalBase && valorRecebido) {
          valorAberto = Math.max(0, valorTotalBase - valorRecebido);
        } else if (!valorRecebido && valorTotalBase && valorAberto) {
          valorRecebido = Math.max(0, valorTotalBase - valorAberto);
        }

        totalValor += valorTotalBase;
        totalRecebido += valorRecebido;
        totalEmAberto += valorAberto;
      } else {
        const recebido =
          parseNumber(
            titulo.valor_recebido ?? titulo.valor ?? titulo.valor_total,
            0
          ) || 0;

        totalValor += valorTotalBase || recebido;
        totalRecebido += recebido;
        totalEmAberto += 0;
      }

      registrosConsiderados += 1;
    });

    if (registros.length < IXC_FETCH_PAGE_SIZE) {
      break;
    }

    pagina += 1;
  }

  return {
    totalValor,
    totalRecebido,
    totalEmAberto,
    registrosConsiderados,
  };
}

async function carregarTotaisPeriodo(
  dataInicio: Date,
  dataFim: Date
): Promise<FluxoResumoData> {
  const statusConfig: Array<{ status: string; tipo: StatusInterpretacao }> = [
    { status: 'A', tipo: 'ABERTO' },
    { status: 'R', tipo: 'RECEBIDO' },
  ];

  let totalValor = 0;
  let totalRecebido = 0;
  let totalEmAberto = 0;
  let registrosConsiderados = 0;

  for (const config of statusConfig) {
    const totaisStatus = await somarTitulosPorStatus(
      config.status,
      config.tipo,
      dataInicio,
      dataFim
    );
    totalValor += totaisStatus.totalValor;
    totalRecebido += totaisStatus.totalRecebido;
    totalEmAberto += totaisStatus.totalEmAberto;
    registrosConsiderados += totaisStatus.registrosConsiderados;
  }

  return {
    totalValor,
    totalRecebido,
    totalEmAberto,
    registrosConsiderados,
    taxaAberto: totalValor > 0 ? totalEmAberto / totalValor : 0,
    periodo: {
      inicio: dataInicio.toISOString(),
      fim: dataFim.toISOString(),
    },
  };
}

function getFluxoCacheStore(): FluxoCacheStore {
  const globalAny = globalThis as typeof globalThis & {
    __DASHBOARD_FLUXO_CACHE__?: FluxoCacheStore;
  };

  if (!globalAny.__DASHBOARD_FLUXO_CACHE__) {
    globalAny.__DASHBOARD_FLUXO_CACHE__ = {};
  }

  return globalAny.__DASHBOARD_FLUXO_CACHE__;
}

function iniciarAtualizacaoFluxo(
  entry: FluxoCacheEntry,
  dataInicio: Date,
  dataFim: Date
): Promise<FluxoResumoData> {
  const promise = carregarTotaisPeriodo(dataInicio, dataFim)
    .then((resultado) => {
      entry.data = resultado;
      entry.updatedAt = Date.now();
      return resultado;
    })
    .catch((error) => {
      throw error;
    });

  entry.loadingPromise = promise.finally(() => {
    if (entry.loadingPromise === promise) {
      entry.loadingPromise = undefined;
    }
  });

  // Evita unhandled rejection quando retornamos dados antigos.
  entry.loadingPromise.catch(() => undefined);
  return entry.loadingPromise;
}

async function obterFluxoComCache(
  chavePeriodo: string,
  dataInicio: Date,
  dataFim: Date,
  forceRefresh = false
): Promise<{ data: FluxoResumoData; syncing: boolean }> {
  const store = getFluxoCacheStore();
  const entry =
    store[chavePeriodo] ??
    (store[chavePeriodo] = { data: null, updatedAt: 0 });

  const expirado = Date.now() - entry.updatedAt > FLUXO_CACHE_TTL_MS;
  const precisaAtualizar = forceRefresh || !entry.data || expirado;

  if (precisaAtualizar && !entry.loadingPromise) {
    iniciarAtualizacaoFluxo(entry, dataInicio, dataFim);
  }

  if (!entry.data || forceRefresh) {
    const dados = await (entry.loadingPromise ??
      iniciarAtualizacaoFluxo(entry, dataInicio, dataFim));
    return { data: dados, syncing: false };
  }

  // Já temos dados válidos; se estivermos atualizando em background,
  // retornamos informando que ainda está sincronizando.
  const sincronizando = Boolean(entry.loadingPromise && expirado);
  return { data: entry.data, syncing: sincronizando };
}

export async function GET(
  request: Request
): Promise<NextResponse<FluxoResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const agora = new Date();
    const mesParametro = parseInt(searchParams.get('mes') ?? '', 10);
    const anoParametro = parseInt(searchParams.get('ano') ?? '', 10);

    const mes = Number.isFinite(mesParametro)
      ? Math.min(Math.max(mesParametro, 1), 12)
      : agora.getMonth() + 1;
    const ano = Number.isFinite(anoParametro) ? anoParametro : agora.getFullYear();

    const dataInicio = new Date(ano, mes - 1, 1, 0, 0, 0, 0);
    const dataFim = new Date(ano, mes, 0, 23, 59, 59, 999);
    const periodoKey = `${ano}-${String(mes).padStart(2, '0')}`;
    const forceRefresh = searchParams.get('refresh') === '1';
    const { data: totais, syncing } = await obterFluxoComCache(
      periodoKey,
      dataInicio,
      dataFim,
      forceRefresh
    );

    return NextResponse.json({
      success: true,
      totalValor: totais.totalValor,
      totalRecebido: totais.totalRecebido,
      totalEmAberto: totais.totalEmAberto,
      taxaAberto: totais.taxaAberto,
      periodo: totais.periodo,
      registrosConsiderados: totais.registrosConsiderados,
      syncing,
    });
  } catch (error) {
    console.error('Erro ao calcular fluxo mensal:', error);
    return NextResponse.json(
      {
        success: false,
        totalValor: 0,
        totalRecebido: 0,
        totalEmAberto: 0,
        taxaAberto: 0,
        periodo: {
          inicio: new Date().toISOString(),
          fim: new Date().toISOString(),
        },
        registrosConsiderados: 0,
        syncing: false,
        error:
          error instanceof Error
            ? error.message
            : 'Falha ao consultar a API do IXC',
      },
      { status: 502 }
    );
  }
}
