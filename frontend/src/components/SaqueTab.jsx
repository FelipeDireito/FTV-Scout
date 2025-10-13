import { useState, useEffect } from 'react';
import { getEstatisticasSaqueAtleta, getMapaCalorAtleta } from '../services/estatisticas';
import MapaCalorQuadra from './MapaCalorQuadra';

/**
 * Aba de análise de Saque
 */
function SaqueTab({ atletaId, partidaId = null }) {
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
        getEstatisticasSaqueAtleta(atletaId, partidaId),
        getMapaCalorAtleta(atletaId, 1, partidaId) // 1 = ID do tipo de ação "Saque"
      ]);
      setStats(statsData);
      setMapaCalor(mapaData);
    } catch (error) {
      console.error('Erro ao carregar dados de saque:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12 gap-4">
        <div className="w-12 h-12 border-4 border-gray-700 border-t-[#00A3FF] rounded-full animate-spin"></div>
        <p className="text-gray-400">Carregando dados de saque...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Nenhum dado de saque disponível</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Estatísticas de Saque */}
      <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-lg">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span>⚡</span>
          Estatísticas de Saque
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#2a2a2a] rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">Tentativas</p>
            <p className="text-3xl font-bold text-white">{stats.tentativas}</p>
          </div>
          <div className="bg-[#2a2a2a] rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">Aces</p>
            <p className="text-3xl font-bold text-green-500">{stats.aces}</p>
          </div>
          <div className="bg-[#2a2a2a] rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">Erros</p>
            <p className="text-3xl font-bold text-red-500">{stats.erros}</p>
          </div>
          <div className="bg-[#2a2a2a] rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">Aproveitamento</p>
            <p className="text-3xl font-bold text-[#00A3FF]">{stats.aproveitamento.toFixed(1)}%</p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-blue-900/30 rounded-lg p-4 border-l-4 border-[#00A3FF]">
            <p className="text-sm text-gray-400 mb-1">Eficiência</p>
            <p className="text-2xl font-bold text-white">{stats.eficiencia.toFixed(2)}%</p>
            <p className="text-xs text-gray-500 mt-1">
              (Aces - Erros) / Tentativas × 100
            </p>
          </div>
          <div className="bg-[#2a2a2a] rounded-lg p-4">
            <p className="text-sm text-gray-400 mb-1">Taxa de Ace</p>
            <p className="text-2xl font-bold text-white">
              {stats.tentativas > 0 ? ((stats.aces / stats.tentativas) * 100).toFixed(1) : '0'}%
            </p>
            <p className="text-xs text-gray-500 mt-1">Aces por tentativa</p>
          </div>
        </div>
      </div>

      {/* Mapa de Calor */}
      <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-lg">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span>🗺️</span>
          Mapa de Calor - Saque
        </h3>
        
        <MapaCalorQuadra data={mapaCalor} />
      </div>
    </div>
  );
}

export default SaqueTab;
