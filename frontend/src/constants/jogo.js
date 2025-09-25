// Enums

export const TIPOS_ACOES = [
  { id: 1, nome: "Saque" },
  { id: 2, nome: "Recepção/Defesa" },
  { id: 3, nome: "Levantamento" },
  { id: 4, nome: "1º Toque de Correção" },
  { id: 5, nome: "Ataque" },
  { id: 6, nome: "Bloqueio" },
];

// Helper para buscar o ID pelo nome, como: TIPO_ACAO_ID.SAQUE, TIPO_ACAO_ID.RECEPCAO_DEFESA, etc.
export const TIPO_ACAO_ID = TIPOS_ACOES.reduce((acc, acao) => {
  const key = acao.nome.toUpperCase().replace(/Ç/g, 'C').replace(/Ã/g, 'A').replace(/º/g, '').replace('/', '_');
  acc[key] = acao.id;
  return acc;
}, {});

export const TECNICAS = [
  { id: 1, nome: "Cabeça" },
  { id: 2, nome: "Ombro" },
  { id: 3, nome: "Peito" },
  { id: 4, nome: "Coxa" },
  { id: 5, nome: "Peito do Pé" },
  { id: 6, nome: "Chapa do Pé" },
  { id: 7, nome: "Chaleira" },
  { id: 8, nome: "Bicicleta" },
  { id: 9, nome: "Shark" },
  { id: 10, nome: "Voo do Águia" },
  { id: 11, nome: "Defesa Baixa (slide)" },
];

export const MOTIVOS_PONTO = [
  { id: 1, descricao: "Erro não forçado" },
  { id: 2, descricao: "Erro forçado" },
  { id: 3, descricao: "Ponto de ataque" },
  { id: 4, descricao: "Ponto de bloqueio" },
  { id: 5, descricao: "Ponto de ace" },
];
