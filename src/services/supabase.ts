import { createClient } from '@supabase/supabase-js';

// 1. Busca as chaves que você configurou no arquivo .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// 2. Verificação de segurança: Se as chaves não existirem, avisa no console
if (!supabaseUrl || !supabaseKey) {
  throw new Error('ERRO: As variáveis de ambiente do Supabase não foram encontradas. Verifique se o arquivo .env.local está na raiz do projeto e com as chaves corretas.');
}

// 3. Cria e exporta a conexão pronta para ser usada nas telas
export const supabase = createClient(supabaseUrl, supabaseKey);