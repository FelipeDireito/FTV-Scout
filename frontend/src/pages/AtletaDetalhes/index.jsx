import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import Tabs from '../../components/Tabs';
import AtaqueTab from '../../components/AtaqueTab';
import SaqueTab from '../../components/SaqueTab';
import DefesaTab from '../../components/DefesaTab';
import { getEstatisticasAtleta } from '../../services/estatisticas';
import api from '../../services/api';

function AtletaDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [atleta, setAtleta] = useState(null);
  const [estatisticas, setEstatisticas] = useState(null);

  useEffect(() => {
    loadAtletaData();
  }, [id]);

  const loadAtletaData = async () => {
    try {
      setLoading(true);

      // Buscar dados do atleta
      const atletaResponse = await api.get(`/atletas/${id}`);
      setAtleta(atletaResponse.data);

      // Buscar estatísticas
      const stats = await getEstatisticasAtleta(id);
      setEstatisticas(stats);

    } catch (error) {
      console.error('Erro ao carregar dados do atleta:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-8 min-h-screen">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="w-12 h-12 border-4 border-gray-700 border-t-[#00A3FF] rounded-full animate-spin"></div>
          <p className="text-gray-400">Carregando dados do atleta...</p>
        </div>
      </div>
    );
  }

  if (!atleta || !estatisticas) {
    return (
      <div className="container mx-auto p-4 md:p-8 min-h-screen">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-xl text-gray-400">❌ Atleta não encontrado</p>
          <button 
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-[#00A3FF] hover:bg-[#0082cc] text-white font-semibold rounded-lg transition-colors duration-200"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen">
      {/* Header */}
      <header className="mb-8">
        <button 
          onClick={() => navigate('/dashboard')}
          className="text-[#00A3FF] hover:text-[#0082cc] font-medium mb-4 inline-flex items-center gap-2 transition-colors duration-200"
        >
          ← Voltar
        </button>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-200 mb-2">{atleta.nome_atleta}</h1>
        <p className="text-lg text-gray-400">Análise Completa de Desempenho</p>
      </header>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <StatCard
          title="Total de Pontos"
          value={estatisticas?.total_pontos ?? 0}
          subtitle={`${estatisticas?.total_partidas ?? 0} partidas`}
          icon="🎯"
          color="primary"
        />
        <StatCard
          title="Aces"
          value={estatisticas?.total_aces ?? 0}
          subtitle="Pontos de saque"
          icon="⚡"
          color="success"
        />
        <StatCard
          title="Pontos de Ataque"
          value={estatisticas?.total_pontos_ataque ?? 0}
          subtitle={`${(estatisticas?.aproveitamento_geral ?? 0).toFixed(1)}% aproveitamento`}
          icon="💥"
          color="warning"
        />
        <StatCard
          title="Eficiência Geral"
          value={`${(estatisticas?.eficiencia_geral ?? 0).toFixed(1)}%`}
          subtitle={`${estatisticas?.total_erros ?? 0} erros`}
          icon="📊"
          color="info"
        />
      </section>

      {/* Estatísticas Detalhadas */}
      <section className="mb-8">
        <div className="bg-[#1E1E1E] rounded-xl p-6 md:p-8 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6">📋 Estatísticas Detalhadas</h2>
          
          <div className="grid gap-3">
            <div className="flex justify-between items-center p-3 rounded-lg bg-[#2a2a2a]">
              <span className="text-base text-gray-400 font-medium">Partidas Jogadas:</span>
              <span className="text-lg font-bold text-white">{estatisticas?.total_partidas ?? 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-[#2a2a2a]">
              <span className="text-base text-gray-400 font-medium">Vitórias:</span>
              <span className="text-lg font-bold text-green-500">{estatisticas?.total_vitorias ?? 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-[#2a2a2a]">
              <span className="text-base text-gray-400 font-medium">Derrotas:</span>
              <span className="text-lg font-bold text-red-500">{estatisticas?.total_derrotas ?? 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-[#2a2a2a]">
              <span className="text-base text-gray-400 font-medium">% de Vitórias:</span>
              <span className="text-lg font-bold text-white">{(estatisticas?.percentual_vitorias ?? 0).toFixed(1)}%</span>
            </div>
            
            <div className="flex justify-between items-center p-3 rounded-lg bg-[#2a2a2a] mt-4 border-t-2 border-gray-700 pt-6">
              <span className="text-base text-gray-400 font-medium">Total de Pontos:</span>
              <span className="text-lg font-bold text-white">{estatisticas?.total_pontos ?? 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-[#2a2a2a]">
              <span className="text-base text-gray-400 font-medium">Pontos de Ataque:</span>
              <span className="text-lg font-bold text-white">{estatisticas?.total_pontos_ataque ?? 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-[#2a2a2a]">
              <span className="text-base text-gray-400 font-medium">Aces:</span>
              <span className="text-lg font-bold text-white">{estatisticas?.total_aces ?? 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-[#2a2a2a]">
              <span className="text-base text-gray-400 font-medium">Total de Erros:</span>
              <span className="text-lg font-bold text-red-500">{estatisticas?.total_erros ?? 0}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 rounded-lg bg-[#2a2a2a] mt-4 border-t-2 border-gray-700 pt-6">
              <span className="text-base text-gray-400 font-medium">Aproveitamento Geral:</span>
              <span className="text-lg font-bold text-white">{(estatisticas?.aproveitamento_geral ?? 0).toFixed(2)}%</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-[#2a2a2a]">
              <span className="text-base text-gray-400 font-medium">Eficiência Geral:</span>
              <span className="text-lg font-bold text-white">{(estatisticas?.eficiencia_geral ?? 0).toFixed(2)}%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Abas de Análise Detalhada */}
      <section className="mt-8">
        <Tabs
          tabs={[
            {
              label: '💥 Ataque',
              content: <AtaqueTab atletaId={id} />
            },
            {
              label: '⚡ Saque',
              content: <SaqueTab atletaId={id} />
            },
            {
              label: '🛡️ Defesa',
              content: <DefesaTab atletaId={id} />
            }
          ]}
        />
      </section>
    </div>
  );
}

export default AtletaDetalhes;
