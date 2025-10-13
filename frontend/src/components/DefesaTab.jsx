import { useState, useEffect } from 'react';
import { getEstatisticasDefesaAtleta, getMapaCalorAtleta } from '../services/estatisticas';
import MapaCalorQuadra from './MapaCalorQuadra';

/**
 * Aba de análise de Defesa
 */
function DefesaTab({ atletaId, partidaId = null }) {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [mapaCalor, setMapaCalor] = useState(null);

  useEffect(() => {
    loadData();
  }, [atletaId, partidaId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsData, mapaData] = await Promise.all([
        getEstatisticasDefesaAtleta(atletaId, partidaId),
        getMapaCalorAtleta(atletaId, 3, partidaId) // 3 = ID do tipo de ação "Recepção/Defesa"
      ]);
      setStats(statsData);
      setMapaCalor(mapaData);
    } catch (error) {
      console.error('Erro ao carregar dados de defesa:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <div className="w-12 h-12 border-4 border-gray-700 border-t-[#00A3FF] rounded-full animate-spin"></div>
        <p className="text-gray-400">Carregando dados de defesa...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Nenhum dado de defesa disponível</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas de Defesa */}
      <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-lg">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span>🛡️</span>
          Estatísticas de Defesa
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-[#2a2a2a] rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">Tentativas</p>
            <p className="text-3xl font-bold text-white">{stats.tentativas}</p>
          </div>
          <div className="bg-[#2a2a2a] rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">Erros</p>
            <p className="text-3xl font-bold text-red-500">{stats.erros_que_viraram_ponto}</p>
          </div>
          <div className="bg-blue-900/30 rounded-lg p-4 border-l-4 border-[#00A3FF]">
            <p className="text-sm text-gray-400 mb-1">Eficiência Defensiva</p>
            <p className="text-3xl font-bold text-white">{stats.eficiencia_defensiva.toFixed(1)}%</p>
          </div>
        </div>

        <div className="mt-6 bg-[#2a2a2a] rounded-lg p-4">
          <p className="text-sm text-gray-400 mb-2">Análise</p>
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Defesas bem-sucedidas:</span>
              <span className="text-lg font-bold text-green-500">
                {stats.tentativas - stats.erros_que_viraram_ponto}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-300">Taxa de sucesso:</span>
              <span className="text-lg font-bold text-[#00A3FF]">
                {stats.tentativas > 0 
                  ? (((stats.tentativas - stats.erros_que_viraram_ponto) / stats.tentativas) * 100).toFixed(1)
                  : '0'}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Mapa de Calor */}
      <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-lg">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span>🗺️</span>
          Mapa de Calor - Defesa
        </h3>
        
        <MapaCalorQuadra data={mapaCalor} />
      </div>
    </div>
  );
}

export default DefesaTab;
