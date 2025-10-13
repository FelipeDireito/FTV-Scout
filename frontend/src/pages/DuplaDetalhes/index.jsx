import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import { getEstatisticasCompletasDupla } from '../../services/estatisticas';
import api from '../../services/api';

function DuplaDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [dupla, setDupla] = useState(null);
  const [estatisticas, setEstatisticas] = useState(null);

  useEffect(() => {
    loadDuplaData();
  }, [id]);

  const loadDuplaData = async () => {
    try {
      setLoading(true);

      // Buscar dados da dupla
      const duplaResponse = await api.get(`/duplas/${id}`);
      setDupla(duplaResponse.data);

      // Buscar estatísticas completas
      const stats = await getEstatisticasCompletasDupla(id);
      setEstatisticas(stats);

    } catch (error) {
      console.error('Erro ao carregar dados da dupla:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-8 min-h-screen">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="w-12 h-12 border-4 border-gray-700 border-t-[#00A3FF] rounded-full animate-spin"></div>
          <p className="text-gray-400">Carregando dados da dupla...</p>
        </div>
      </div>
    );
  }

  if (!dupla || !estatisticas) {
    return (
      <div className="container mx-auto p-4 md:p-8 min-h-screen">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <p className="text-xl text-gray-400">❌ Dupla não encontrada</p>
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
        <h1 className="text-4xl md:text-5xl font-bold text-gray-200 mb-2">{estatisticas?.nome_dupla ?? 'Dupla'}</h1>
        <p className="text-xl text-[#00A3FF] font-semibold mb-2">
          {estatisticas?.atletas?.join(' & ') ?? ''}
        </p>
        <p className="text-lg text-gray-400">Estatísticas Consolidadas da Dupla</p>
      </header>

      {/* Stats Cards - Resumo Geral */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-8">
        <StatCard
          title="Total de Pontos"
          value={estatisticas?.total_pontos ?? 0}
          subtitle={`${estatisticas?.total_partidas ?? 0} partidas`}
          icon="🎯"
          color="primary"
        />
        <StatCard
          title="Vitórias"
          value={`${(estatisticas?.percentual_vitorias ?? 0).toFixed(0)}%`}
          subtitle={`${estatisticas?.total_vitorias ?? 0}/${estatisticas?.total_partidas ?? 0} jogos`}
          icon="🏆"
          color="success"
        />
        <StatCard
          title="Aces"
          value={estatisticas?.total_aces ?? 0}
          subtitle="Pontos de saque"
          icon="⚡"
          color="warning"
        />
        <StatCard
          title="Pontos de Ataque"
          value={estatisticas?.total_pontos_ataque ?? 0}
          subtitle={`${estatisticas?.total_erros ?? 0} erros`}
          icon="💥"
          color="info"
        />
      </section>

      {/* Estatísticas por Categoria */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Ataque */}
        <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6 pb-4 border-b-2 border-gray-800">💥 Ataque</h2>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center p-3 rounded-lg bg-[#2a2a2a]">
              <span className="text-sm text-gray-400 font-medium">Tentativas</span>
              <span className="text-lg font-bold text-white">{estatisticas?.ataque_tentativas ?? 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-[#2a2a2a]">
              <span className="text-sm text-gray-400 font-medium">Pontos</span>
              <span className="text-lg font-bold text-green-500">{estatisticas?.ataque_pontos ?? 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-[#2a2a2a]">
              <span className="text-sm text-gray-400 font-medium">Erros</span>
              <span className="text-lg font-bold text-red-500">{estatisticas?.ataque_erros ?? 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-blue-900/30 border-l-3 border-l-blue-500">
              <span className="text-sm text-gray-400 font-medium">Aproveitamento</span>
              <span className="text-lg font-bold text-white">{(estatisticas?.ataque_aproveitamento ?? 0).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-blue-900/30 border-l-3 border-l-blue-500">
              <span className="text-sm text-gray-400 font-medium">Eficiência</span>
              <span className="text-lg font-bold text-white">{(estatisticas?.ataque_eficiencia ?? 0).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Saque */}
        <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6 pb-4 border-b-2 border-gray-800">⚡ Saque</h2>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center p-3 rounded-lg bg-[#2a2a2a]">
              <span className="text-sm text-gray-400 font-medium">Tentativas</span>
              <span className="text-lg font-bold text-white">{estatisticas?.saque_tentativas ?? 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-[#2a2a2a]">
              <span className="text-sm text-gray-400 font-medium">Aces</span>
              <span className="text-lg font-bold text-green-500">{estatisticas?.saque_aces ?? 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-[#2a2a2a]">
              <span className="text-sm text-gray-400 font-medium">Erros</span>
              <span className="text-lg font-bold text-red-500">{estatisticas?.saque_erros ?? 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-blue-900/30 border-l-3 border-l-blue-500">
              <span className="text-sm text-gray-400 font-medium">Aproveitamento</span>
              <span className="text-lg font-bold text-white">{(estatisticas?.saque_aproveitamento ?? 0).toFixed(1)}%</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-blue-900/30 border-l-3 border-l-blue-500">
              <span className="text-sm text-gray-400 font-medium">Eficiência</span>
              <span className="text-lg font-bold text-white">{(estatisticas?.saque_eficiencia ?? 0).toFixed(1)}%</span>
            </div>
          </div>
        </div>

        {/* Defesa */}
        <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-lg">
          <h2 className="text-2xl font-bold text-white mb-6 pb-4 border-b-2 border-gray-800">🛡️ Defesa</h2>
          <div className="flex flex-col gap-3">
            <div className="flex justify-between items-center p-3 rounded-lg bg-[#2a2a2a]">
              <span className="text-sm text-gray-400 font-medium">Tentativas</span>
              <span className="text-lg font-bold text-white">{estatisticas?.defesa_tentativas ?? 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-[#2a2a2a]">
              <span className="text-sm text-gray-400 font-medium">Erros</span>
              <span className="text-lg font-bold text-red-500">{estatisticas?.defesa_erros ?? 0}</span>
            </div>
            <div className="flex justify-between items-center p-3 rounded-lg bg-blue-900/30 border-l-3 border-l-blue-500">
              <span className="text-sm text-gray-400 font-medium">Eficiência Defensiva</span>
              <span className="text-lg font-bold text-white">{(estatisticas?.defesa_eficiencia ?? 0).toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </section>

      {/* Placeholder para futuras funcionalidades */}
      <section className="mt-8">
        <div className="bg-[#2a2a2a] border-2 border-dashed border-gray-700 rounded-xl p-12 text-center">
          <p className="text-lg text-gray-400">🚧 Em breve: Comparação entre atletas e Análise Tática com Mapas de Calor</p>
        </div>
      </section>
    </div>
  );
}

export default DuplaDetalhes;
