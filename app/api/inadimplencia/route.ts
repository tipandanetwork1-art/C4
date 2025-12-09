import { NextResponse } from 'next/server';
import https from 'https';

const IXC_CONFIG = {
  baseUrl:
    process.env.IXC_API_BASE_URL ?? 'https://191.7.184.11/webservice/v1',
  token:
    process.env.IXC_API_TOKEN ??
    '339:500a9bb5ece76c8648cd4c47da81b48c71734ff1d46f525b5a31f2f45bd81d84',
};

const IXC_FETCH_PAGE_SIZE = Math.max(
  parseInt(process.env.IXC_API_FETCH_RP ?? '200', 10),
  50
);

const DATA_CORTE_INICIO = new Date(2024, 0, 1, 0, 0, 0, 0);
const CACHE_TTL_MS = Math.max(
  60_000,
  parseInt(process.env.INAD_CLIENTES_CACHE_TTL_MS ?? '300000', 10)
);
const CLIENTE_FETCH_BATCH = Math.max(
  5,
  parseInt(process.env.IXC_CLIENTE_BATCH ?? '10', 10)
);
const CLIENTE_DETALHE_CACHE_TTL_MS = Math.max(
  5 * 60_000,
  parseInt(process.env.INAD_CLIENTE_DETAIL_CACHE_TTL_MS ?? '900000', 10)
);

type IXCTitulo = {
  id: string;
  id_cliente: string;
  cliente_nome?: string;
  cliente?: string;
  nome_razao?: string;
  razao?: string;
  cpf_cnpj?: string;
  cnpj_cpf?: string;
  documento?: string;
  contrato?: string;
  contrato_id?: string;
  id_contrato?: string;
  descricao?: string;
  periodo_cobranca?: string;
  referencia?: string;
  data_emissao?: string;
  emissao?: string;
  data_vencimento?: string;
  vencimento?: string;
  valor?: string;
  valor_aberto?: string;
  valor_total?: string;
  status?: string;
  status_boleto?: string;
  protestado?: string | number;
  foi_protestado?: string | number | boolean;
  endereco?: string;
  logradouro?: string;
  numero?: string;
  num?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  municipio?: string;
  estado?: string;
  uf?: string;
  cep?: string;
  telefone?: string;
  telefone1?: string;
  telefone2?: string;
  celular?: string;
  fone?: string;
  email?: string;
  email_principal?: string;
  email_contato?: string;
  obs?: string;
};

type IXCCliente = {
  id: string;
  nome?: string;
  fantasia?: string;
  cliente?: string;
  nome_razao_social?: string;
  nome_razao?: string;
  razao?: string;
  razao_social?: string;
  cpf_cnpj?: string;
  cpf?: string;
  cnpj?: string;
  cnpj_cpf?: string;
  email?: string;
  email_principal?: string;
  email_contato?: string;
  email_cobranca?: string;
  telefone?: string;
  telefone1?: string;
  telefone2?: string;
  telefone_contato?: string;
  celular?: string;
  celular_contato?: string;
  fone?: string;
  fone_contato?: string;
  telefone_celular?: string;
  telefone_comercial?: string;
  whatsapp?: string;
  endereco?: string;
  logradouro?: string;
  numero?: string;
  num?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  municipio?: string;
  estado?: string;
  uf?: string;
  cep?: string;
  obs?: string;
};

interface ApiResponse {
  success: boolean;
  clientes: NormalizedClient[];
  syncedAt: string;
  syncing: boolean;
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  error?: string;
}

interface NormalizedClient {
  id: string;
  idCliente: string;
  cliente: string;
  razaoSocial: string;
  cpfCnpj: string;
  email: string;
  endereco: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
  telefone: string;
  idBoleto: string;
  emissao: string;
  vencimento: string;
  descricaoCobranca: string;
  statusBoleto: string;
  diasAtraso: number;
  valorTotal: number;
  foiProtestado: string;
  contrato: string;
  statusEnvio: 'Não Enviado' | 'Em Cobrança Externa' | 'Aguardando Retorno';
  titulos: string[];
}

function parseDataBruta(value?: string): Date | null {
  if (!value) return null;
  const trimmed = value.trim();
  if (!trimmed) return null;

  try {
    if (trimmed.includes('/')) {
      const [dia, mes, ano] = trimmed.split('/');
      const parsed = new Date(
        parseInt(ano, 10),
        parseInt(mes, 10) - 1,
        parseInt(dia, 10)
      );
      return Number.isNaN(parsed.getTime()) ? null : parsed;
    }

    const parsed = new Date(trimmed);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  } catch {
    return null;
  }
}

function formatarDataPtBr(value?: string): string {
  const parsed = parseDataBruta(value);
  if (!parsed) return '-';
  const dia = String(parsed.getDate()).padStart(2, '0');
  const mes = String(parsed.getMonth() + 1).padStart(2, '0');
  const ano = parsed.getFullYear();
  return `${dia}-${mes}-${ano}`;
}

function calcularDiasAtraso(dataVencimento?: string): number {
  try {
    const vencimento = parseDataBruta(dataVencimento);
    if (!vencimento) return 0;

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    vencimento.setHours(0, 0, 0, 0);
    const diff = hoje.getTime() - vencimento.getTime();
    const dias = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return dias > 0 ? dias : 0;
  } catch (err) {
    console.error('Erro ao calcular dias de atraso:', err);
    return 0;
  }
}

function obterDataReferencia(titulo: IXCTitulo): Date | null {
  return (
    parseDataBruta(
      titulo.data_vencimento ??
        titulo.vencimento ??
        titulo.data_emissao ??
        titulo.emissao
    ) ?? null
  );
}

function estaDentroDoPeriodo(
  titulo: IXCTitulo,
  dataInicio: Date,
  dataFim: Date
): boolean {
  const referencia = obterDataReferencia(titulo);
  if (!referencia) return false;
  return referencia >= dataInicio && referencia <= dataFim;
}

type ClientesCacheStore = {
  clientes: NormalizedClient[];
  updatedAt: number;
  loadingPromise?: Promise<NormalizedClient[]>;
};

type ClienteDetalheCacheEntry = {
  data: IXCCliente;
  updatedAt: number;
};

type ClienteDetalheCacheStore = Record<string, ClienteDetalheCacheEntry>;

function getClientesCacheStore(): ClientesCacheStore {
  const globalAny = globalThis as typeof globalThis & {
    __INAD_CLIENTES_CACHE__?: ClientesCacheStore;
    __INAD_CLIENTE_DETAILS_CACHE__?: ClienteDetalheCacheStore;
  };

  if (!globalAny.__INAD_CLIENTES_CACHE__) {
    globalAny.__INAD_CLIENTES_CACHE__ = {
      clientes: [],
      updatedAt: 0,
      loadingPromise: undefined,
    };
  }

  return globalAny.__INAD_CLIENTES_CACHE__;
}

function getClienteDetalheCacheStore(): ClienteDetalheCacheStore {
  const globalAny = globalThis as typeof globalThis & {
    __INAD_CLIENTE_DETAILS_CACHE__?: ClienteDetalheCacheStore;
  };

  if (!globalAny.__INAD_CLIENTE_DETAILS_CACHE__) {
    globalAny.__INAD_CLIENTE_DETAILS_CACHE__ = {};
  }

  return globalAny.__INAD_CLIENTE_DETAILS_CACHE__;
}

function parseNumber(value: unknown, fallback: number): number {
  const parsed = typeof value === 'string' ? Number(value) : value;
  return Number.isFinite(parsed) ? Number(parsed) : fallback;
}

function normalizeIdValue(value: unknown): string | null {
  if (value === undefined || value === null) return null;
  if (typeof value === 'number') return String(value);
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : null;
  }
  return null;
}

function extractNumber(...values: unknown[]): number | null {
  for (const value of values) {
    if (value === undefined || value === null) continue;
    const parsed =
      typeof value === 'string' ? Number(value) : Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return null;
}

function normalizeTexto(value: unknown, fallback = '-'): string {
  if (value === undefined || value === null) return fallback;
  if (typeof value === 'string') {
    const trimmed = value.trim();
    return trimmed.length > 0 ? trimmed : fallback;
  }
  if (typeof value === 'number' || typeof value === 'boolean') {
    return String(value);
  }
  return fallback;
}

function escolherTextoDisponivel(
  atual: string,
  ...novos: (unknown | undefined)[]
): string {
  for (const valor of novos) {
    const candidato = normalizeTexto(valor, '');
    if (candidato) {
      return candidato;
    }
  }
  return atual;
}

function parseBooleanLike(value: unknown): boolean | null {
  if (value === undefined || value === null) return null;
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return value !== 0;
  if (typeof value === 'string') {
    const normalized = value.trim().toLowerCase();
    if (['1', 'true', 'sim', 's'].includes(normalized)) return true;
    if (['0', 'false', 'nao', 'não', 'n'].includes(normalized)) return false;
  }
  return null;
}

function formatIsoDate(date: Date): string {
  const ano = date.getFullYear();
  const mes = String(date.getMonth() + 1).padStart(2, '0');
  const dia = String(date.getDate()).padStart(2, '0');
  return `${ano}-${mes}-${dia}`;
}

async function fetchClientesDetalhados(
  ids: string[]
): Promise<Record<string, IXCCliente>> {
  const normalizados = ids
    .map((id) => normalizeIdValue(id))
    .filter((id): id is string => Boolean(id));
  const uniqueIds = Array.from(new Set(normalizados));

  if (uniqueIds.length === 0) {
    return {};
  }

  const detalhes: Record<string, IXCCliente> = {};

  for (let i = 0; i < uniqueIds.length; i += CLIENTE_FETCH_BATCH) {
    const batch = uniqueIds.slice(i, i + CLIENTE_FETCH_BATCH);
    const resultados = await Promise.allSettled(
      batch.map((id) =>
        makeIxcRequest('cliente', {
          qtype: 'cliente.id',
          query: id,
          oper: '=',
          page: 1,
          rp: 1,
          sortname: 'cliente.id',
          sortorder: 'desc',
        })
      )
    );

    resultados.forEach((resultado, index) => {
      if (resultado.status === 'fulfilled') {
        const resposta = resultado.value;
        const registros = Array.isArray(resposta?.registros)
          ? resposta.registros
          : [];
        const registro = registros[0];
        if (registro) {
          const chave =
            normalizeIdValue(registro.id) ??
            normalizeIdValue(batch[index]) ??
            null;
          if (chave) {
            detalhes[chave] = registro;
          }
        }
      } else {
        const idFalho = batch[index];
        console.error(
          `Erro ao buscar dados do cliente ${idFalho}:`,
          resultado.reason
        );
      }
    });
  }

  return detalhes;
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

function normalizeClientes(registros: IXCTitulo[]): NormalizedClient[] {
  return registros.map((titulo, index) => {
    const valor = parseNumber(
      titulo.valor_aberto ?? titulo.valor ?? titulo.valor_total ?? 0,
      0
    );
    const dataVencimento = titulo.data_vencimento ?? titulo.vencimento;
    const diasAtraso = calcularDiasAtraso(dataVencimento);
    const rawDocumento =
      titulo.documento ??
      titulo.id ??
      titulo.contrato ??
      `DOC-${titulo.id ?? index + 1}`;

    const idBoleto = normalizeTexto(
      rawDocumento,
      `DOC-${titulo.id ?? index + 1}`
    );

    const clienteNome =
      titulo.cliente_nome ??
      titulo.cliente ??
      titulo.nome_razao ??
      `Cliente ${titulo.id_cliente ?? index + 1}`;

    const razaoSocial =
      titulo.nome_razao ??
      titulo.razao ??
      titulo.cliente_nome ??
      clienteNome;

    const endereco =
      titulo.endereco ??
      titulo.logradouro ??
      '-';

    const telefone =
      titulo.telefone ??
      titulo.telefone1 ??
      titulo.telefone2 ??
      titulo.celular ??
      titulo.fone ??
      '-';

    const emissaoFormatada = formatarDataPtBr(
      titulo.data_emissao ?? titulo.emissao
    );
    const vencimentoFormatado = formatarDataPtBr(dataVencimento);

    const observacaoTitulo = (() => {
      const obs = titulo.obs ?? null;
      if (typeof obs === 'string') {
        const trimmed = obs.trim();
        return trimmed.length > 0 ? trimmed : null;
      }
      return null;
    })();

    const descricaoCobranca =
      observacaoTitulo ??
      titulo.descricao ??
      titulo.periodo_cobranca ??
      titulo.referencia ??
      '-';

    const statusBoleto =
      titulo.status ??
      titulo.status_boleto ??
      '-';

    const boolProtestado = parseBooleanLike(
      titulo.foi_protestado ?? titulo.protestado
    );

    return {
      id: titulo.id ?? idBoleto ?? `registro-${index}`,
      idCliente: normalizeTexto(
        titulo.id_cliente ?? `cliente-${index + 1}`
      ),
      cliente: normalizeTexto(clienteNome),
      razaoSocial: normalizeTexto(razaoSocial),
      cpfCnpj: normalizeTexto(
        titulo.cpf_cnpj ?? titulo.cnpj_cpf ?? 'N/A',
        'N/A'
      ),
      email: normalizeTexto(
        titulo.email ?? titulo.email_principal ?? titulo.email_contato
      ),
      endereco: normalizeTexto(endereco),
      numero: normalizeTexto(titulo.numero ?? titulo.num ?? ''),
      complemento: normalizeTexto(titulo.complemento ?? ''),
      bairro: normalizeTexto(titulo.bairro ?? ''),
      cidade: normalizeTexto(titulo.cidade ?? titulo.municipio ?? ''),
      estado: normalizeTexto(titulo.estado ?? titulo.uf ?? ''),
      cep: normalizeTexto(titulo.cep ?? ''),
      telefone: normalizeTexto(telefone),
      idBoleto,
      emissao: emissaoFormatada,
      vencimento: vencimentoFormatado,
      descricaoCobranca: normalizeTexto(descricaoCobranca),
      statusBoleto: normalizeTexto(statusBoleto),
      diasAtraso,
      valorTotal: valor,
      foiProtestado:
        boolProtestado === null ? 'Indefinido' : boolProtestado ? 'Sim' : 'Não',
      contrato: normalizeTexto(
        titulo.contrato ?? titulo.contrato_id ?? titulo.id_contrato ?? '-'
      ),
      statusEnvio: 'Não Enviado',
      titulos: [idBoleto],
    };
  });
}

function aplicarDetalhesCliente(
  cliente: NormalizedClient,
  detalhe?: IXCCliente
): void {
  if (!detalhe) return;

  cliente.cliente = escolherTextoDisponivel(
    cliente.cliente,
    detalhe.nome,
    detalhe.fantasia,
    detalhe.cliente,
    detalhe.nome_razao,
    detalhe.nome_razao_social,
    detalhe.razao
  );
  cliente.razaoSocial = escolherTextoDisponivel(
    cliente.razaoSocial,
    detalhe.razao,
    detalhe.razao_social,
    detalhe.nome_razao_social,
    detalhe.nome
  );
  cliente.cpfCnpj = escolherTextoDisponivel(
    cliente.cpfCnpj,
    detalhe.cpf_cnpj,
    detalhe.cnpj,
    detalhe.cpf,
    detalhe.cnpj_cpf
  );
  cliente.email = escolherTextoDisponivel(
    cliente.email,
    detalhe.email,
    detalhe.email_principal,
    detalhe.email_contato,
    detalhe.email_cobranca
  );
  cliente.endereco = escolherTextoDisponivel(
    cliente.endereco,
    detalhe.endereco,
    detalhe.logradouro
  );
  cliente.numero = escolherTextoDisponivel(
    cliente.numero,
    detalhe.numero,
    detalhe.num
  );
  cliente.complemento = escolherTextoDisponivel(
    cliente.complemento,
    detalhe.complemento
  );
  cliente.bairro = escolherTextoDisponivel(
    cliente.bairro,
    detalhe.bairro
  );
  cliente.cidade = escolherTextoDisponivel(
    cliente.cidade,
    detalhe.cidade,
    detalhe.municipio
  );
  cliente.estado = escolherTextoDisponivel(
    cliente.estado,
    detalhe.estado,
    detalhe.uf
  );
  cliente.cep = escolherTextoDisponivel(cliente.cep, detalhe.cep);
  cliente.descricaoCobranca = escolherTextoDisponivel(
    cliente.descricaoCobranca,
    detalhe.obs
  );
  cliente.telefone = escolherTextoDisponivel(
    cliente.telefone,
    detalhe.telefone,
    detalhe.telefone1,
    detalhe.telefone2,
    detalhe.telefone_contato,
    detalhe.fone,
    detalhe.fone_contato,
    detalhe.celular,
    detalhe.celular_contato,
    detalhe.telefone_celular,
    detalhe.telefone_comercial,
    detalhe.whatsapp
  );
}

async function enriquecerClientesComDetalhes(
  clientes: NormalizedClient[]
): Promise<void> {
  if (clientes.length === 0) return;
  const cache = getClienteDetalheCacheStore();
  const agora = Date.now();
  const idsPendentes = new Set<string>();

  for (const cliente of clientes) {
    const id = normalizeIdValue(cliente.idCliente);
    if (!id) continue;
    const entry = cache[id];
    if (entry && agora - entry.updatedAt <= CLIENTE_DETALHE_CACHE_TTL_MS) {
      aplicarDetalhesCliente(cliente, entry.data);
      continue;
    }
    idsPendentes.add(id);
  }

  if (idsPendentes.size === 0) {
    return;
  }

  const detalhes = await fetchClientesDetalhados(Array.from(idsPendentes));
  const atualizadoEm = Date.now();

  Object.entries(detalhes).forEach(([id, detalhe]) => {
    cache[id] = { data: detalhe, updatedAt: atualizadoEm };
  });

  for (const cliente of clientes) {
    const id = normalizeIdValue(cliente.idCliente);
    if (!id) continue;
    const detalhe = detalhes[id];
    if (detalhe) {
      aplicarDetalhesCliente(cliente, detalhe);
    }
  }
}

async function carregarClientesNormalizados(
  dataInicio: Date,
  dataFim: Date
): Promise<NormalizedClient[]> {
  const titulosFiltrados: IXCTitulo[] = [];
  let ixcPage = 1;
  let totalPagesIXC = 1;
  let ultimaPagina = false;
  let possuiTotalInformado = false;

  while (!ultimaPagina && ixcPage <= totalPagesIXC) {
    const filtros = [
      {
        field: 'fn_areceber.data_vencimento',
        type: 'date',
        comparison: 'between',
        value: `${formatIsoDate(dataInicio)}|${formatIsoDate(dataFim)}`,
      },
    ];

    const resposta = await makeIxcRequest('fn_areceber', {
      qtype: 'fn_areceber.status',
      query: 'A',
      oper: '=',
      page: ixcPage,
      rp: IXC_FETCH_PAGE_SIZE,
      sortname: 'fn_areceber.data_vencimento',
      sortorder: 'desc',
      filters: filtros,
    });

    const registrosPagina: IXCTitulo[] = Array.isArray(
      resposta?.registros
    )
      ? resposta.registros
      : [];

    const filtrados = registrosPagina.filter((titulo) =>
      estaDentroDoPeriodo(titulo, dataInicio, dataFim)
    );

    titulosFiltrados.push(...filtrados);

    const totalResp = extractNumber(
      resposta?.total,
      resposta?.total_registros,
      resposta?.totalItems,
      resposta?.total_items,
      resposta?.pagination?.total,
      resposta?.pagination?.total_registros
    );

    if (totalResp !== null) {
      totalPagesIXC = Math.max(
        1,
        Math.ceil(totalResp / IXC_FETCH_PAGE_SIZE)
      );
      possuiTotalInformado = true;
    }

    if (
      registrosPagina.length < IXC_FETCH_PAGE_SIZE ||
      (possuiTotalInformado && ixcPage >= totalPagesIXC)
    ) {
      ultimaPagina = true;
    }

    const todosAntesDoInicio = registrosPagina.every((titulo) => {
      const referencia = obterDataReferencia(titulo);
      return referencia !== null && referencia < dataInicio;
    });
    if (todosAntesDoInicio) {
      ultimaPagina = true;
    }

    ixcPage += 1;
  }

  return normalizeClientes(titulosFiltrados);
}

function iniciarAtualizacaoClientes(
  cache: ClientesCacheStore
): Promise<NormalizedClient[]> {
  const inicio = new Date();
  const basePromise = carregarClientesNormalizados(DATA_CORTE_INICIO, inicio)
    .then((clientesAtualizados) => {
      cache.clientes = clientesAtualizados;
      cache.updatedAt = Date.now();
      return clientesAtualizados;
    })
    .catch((error) => {
      console.error('Erro ao atualizar cache de clientes:', error);
      throw error;
    });

  let wrappedPromise: Promise<NormalizedClient[]>;
  wrappedPromise = basePromise.finally(() => {
    if (cache.loadingPromise === wrappedPromise) {
      cache.loadingPromise = undefined;
    }
  });

  cache.loadingPromise = wrappedPromise;
  // Attach a noop catch to avoid unhandled rejections when rodando em background.
  void wrappedPromise.catch(() => undefined);
  return wrappedPromise;
}

async function obterClientesComCache(
  agora: Date,
  forceRefresh = false
): Promise<{ clientes: NormalizedClient[]; syncing: boolean }> {
  const cache = getClientesCacheStore();
  const expirado = agora.getTime() - cache.updatedAt > CACHE_TTL_MS;
  const precisaAtualizar =
    forceRefresh || expirado || cache.clientes.length === 0;

  if (!precisaAtualizar) {
    return { clientes: cache.clientes, syncing: false };
  }

  const promise = cache.loadingPromise ?? iniciarAtualizacaoClientes(cache);

  if (cache.clientes.length === 0) {
    const atualizados = await promise;
    return { clientes: atualizados, syncing: false };
  }

  if (forceRefresh || expirado) {
    return { clientes: cache.clientes, syncing: true };
  }

  return { clientes: cache.clientes, syncing: false };
}

function filtrarClientesPorTermo(
  clientes: NormalizedClient[],
  termo?: string
): NormalizedClient[] {
  const search = termo?.trim().toLowerCase();
  if (!search) return clientes;

  return clientes.filter((cliente) => {
    if (cliente.cliente.toLowerCase().includes(search)) return true;
    if (cliente.razaoSocial.toLowerCase().includes(search)) return true;
    if (cliente.cpfCnpj.toLowerCase().includes(search)) return true;
    if (cliente.idCliente.toLowerCase().includes(search)) return true;
    if (cliente.idBoleto.toLowerCase().includes(search)) return true;
    if (cliente.descricaoCobranca.toLowerCase().includes(search)) return true;
    if (cliente.statusBoleto.toLowerCase().includes(search)) return true;
    if (cliente.contrato.toLowerCase().includes(search)) return true;
    if (cliente.email.toLowerCase().includes(search)) return true;
    return cliente.titulos.some((titulo) =>
      titulo.toLowerCase().includes(search)
    );
  });
}

export async function GET(request: Request): Promise<NextResponse<ApiResponse>> {
  try {
    const { searchParams } = new URL(request.url);
    const page = Math.max(parseNumber(searchParams.get('page'), 1), 1);
    const perPage = Math.max(parseNumber(searchParams.get('rp'), 15), 1);
    const rawSearch = searchParams.get('search');
    const searchTerm = rawSearch ? rawSearch.trim() : '';
    const agora = new Date();
    const forceRefresh = searchParams.get('refresh') === '1';
    const { clientes: clientesBase, syncing } = await obterClientesComCache(
      agora,
      forceRefresh
    );

    if (searchTerm) {
      const matches = filtrarClientesPorTermo(clientesBase, searchTerm);
      const totalFiltrados = matches.length;
      const totalPaginasFiltradas = Math.max(
        1,
        Math.ceil(totalFiltrados / perPage)
      );
      const paginaNormalizada = Math.min(page, totalPaginasFiltradas);
      const inicio = (paginaNormalizada - 1) * perPage;
      const clientesPagina = matches.slice(inicio, inicio + perPage);
      await enriquecerClientesComDetalhes(clientesPagina);

      return NextResponse.json({
        success: true,
        clientes: clientesPagina,
        syncedAt: new Date().toISOString(),
        syncing,
        page: paginaNormalizada,
        perPage,
        total: totalFiltrados,
        totalPages: totalPaginasFiltradas,
      });
    }

    const totalFiltrados = clientesBase.length;
    const totalPagesFiltrados = Math.max(
      1,
      Math.ceil(totalFiltrados / perPage)
    );
    const paginaNormalizada = Math.min(page, totalPagesFiltrados);
    const inicio = (paginaNormalizada - 1) * perPage;
    const clientesFiltrados = clientesBase.slice(
      inicio,
      inicio + perPage
    );
    await enriquecerClientesComDetalhes(clientesFiltrados);

    return NextResponse.json({
      success: true,
      clientes: clientesFiltrados,
      syncedAt: new Date().toISOString(),
      syncing,
      page: paginaNormalizada,
      perPage,
      total: totalFiltrados,
      totalPages: totalPagesFiltrados,
    });
  } catch (error) {
    console.error('Erro ao consultar a API do IXC:', error);
    const message =
      error instanceof Error ? error.message : 'Falha ao consultar a API do IXC';
    return NextResponse.json(
      {
        success: false,
        clientes: [],
        syncedAt: new Date().toISOString(),
        syncing: false,
        page: 1,
        perPage: 15,
        total: 0,
        totalPages: 1,
        error: message,
      },
      { status: 502 }
    );
  }
}
