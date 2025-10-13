import api from './api';

/**
 * Serviço para consumir endpoints de estatísticas
 */

// ============ ATLETA ============

export const getEstatisticasAtleta = async (atletaId, partidaId = null) => {
  const params = partidaId ? { partida_id: partidaId } : {};
  const response = await api.get(`/estatisticas/atleta/${atletaId}/resumo`, { params });
  return response.data;
};

export const getEstatisticasAtaqueAtleta = async (atletaId, partidaId = null) => {
  const params = partidaId ? { partida_id: partidaId } : {};
  const response = await api.get(`/estatisticas/atleta/${atletaId}/ataque`, { params });
  return response.data;
};

export const getEstatisticasSaqueAtleta = async (atletaId, partidaId = null) => {
  const params = partidaId ? { partida_id: partidaId } : {};
  const response = await api.get(`/estatisticas/atleta/${atletaId}/saque`, { params });
  return response.data;
};

export const getEstatisticasDefesaAtleta = async (atletaId, partidaId = null) => {
  const params = partidaId ? { partida_id: partidaId } : {};
  const response = await api.get(`/estatisticas/atleta/${atletaId}/defesa`, { params });
  return response.data;
};

export const getMapaCalorAtleta = async (atletaId, tipoAcaoId, partidaId = null) => {
  const params = { tipo_acao_id: tipoAcaoId };
  if (partidaId) params.partida_id = partidaId;
  const response = await api.get(`/estatisticas/atleta/${atletaId}/mapa-calor`, { params });
  return response.data;
};

// ============ DUPLA ============

export const getEstatisticasDupla = async (duplaId, partidaId = null) => {
  const params = partidaId ? { partida_id: partidaId } : {};
  const response = await api.get(`/estatisticas/dupla/${duplaId}/resumo`, { params });
  return response.data;
};

export const getEstatisticasAtaqueDupla = async (duplaId, partidaId = null) => {
  const params = partidaId ? { partida_id: partidaId } : {};
  const response = await api.get(`/estatisticas/dupla/${duplaId}/ataque`, { params });
  return response.data;
};

export const getEstatisticasSaqueDupla = async (duplaId, partidaId = null) => {
  const params = partidaId ? { partida_id: partidaId } : {};
  const response = await api.get(`/estatisticas/dupla/${duplaId}/saque`, { params });
  return response.data;
};

export const getEstatisticasDefesaDupla = async (duplaId, partidaId = null) => {
  const params = partidaId ? { partida_id: partidaId } : {};
  const response = await api.get(`/estatisticas/dupla/${duplaId}/defesa`, { params });
  return response.data;
};

export const getEstatisticasCompletasDupla = async (duplaId, partidaId = null) => {
  const params = partidaId ? { partida_id: partidaId } : {};
  const response = await api.get(`/estatisticas/dupla/${duplaId}/completo`, { params });
  return response.data;
};

// ============ RANKINGS ============

export const getTopAtletas = async (limit = 5) => {
  // Por enquanto, vamos buscar todos os atletas e ordenar no frontend
  // TODO: Criar endpoint específico de ranking no backend
  const response = await api.get('/atletas');
  return response.data;
};

export const getTopDuplas = async (limit = 5) => {
  // Por enquanto, vamos buscar todas as duplas e ordenar no frontend
  // TODO: Criar endpoint específico de ranking no backend
  const response = await api.get('/duplas');
  return response.data;
};
