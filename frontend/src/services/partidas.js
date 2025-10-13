import api from './api';

/**
 * Busca todas as partidas
 */
export const getPartidas = async () => {
  try {
    const response = await api.get('/partidas');
    return response.data;
  } catch (error) {
    console.error('Erro ao buscar partidas:', error);
    throw error;
  }
};

/**
 * Busca uma partida específica por ID
 */
export const getPartidaById = async (partidaId) => {
  try {
    const response = await api.get(`/partidas/${partidaId}`);
    return response.data;
  } catch (error) {
    console.error(`Erro ao buscar partida ${partidaId}:`, error);
    throw error;
  }
};
