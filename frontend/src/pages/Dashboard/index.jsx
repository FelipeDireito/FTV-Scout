import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import StatCard from '../../components/StatCard';
import RankingCard from '../../components/RankingCard';
import { getTopAtletas, getTopDuplas, getEstatisticasAtleta, getEstatisticasDupla } from '../../services/estatisticas';
import { getPartidas } from '../../services/partidas';

function Dashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [topAtletas, setTopAtletas] = useState([]);
  const [topDuplas, setTopDuplas] = useState([]);
  const [partidas, setPartidas] = useState([]);
  const [partidaSelecionada, setPartidaSelecionada] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [estatisticasGerais, setEstatisticasGerais] = useState({
    totalPontos: 0,
    totalAces: 0,
    aproveitamentoMedio: 0,
    eficienciaMedio: 0
  });

  useEffect(() => {
    loadDashboardData();
  }, []);

  // Fechar dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showDropdown && !event.target.closest('.relative')) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showDropdown]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // Buscar atletas, duplas e partidas
      const [atletas, duplas, partidasData] = await Promise.all([
        getTopAtletas(),
        getTopDuplas(),
        getPartidas()
      ]);

      setPartidas(partidasData);

      // Buscar estatísticas de cada atleta
      const atletasComStats = await Promise.all(
        atletas.map(async (atleta) => {
          try {
            const stats = await getEstatisticasAtleta(atleta.atleta_id);
            return {
              id: atleta.atleta_id,
              name: atleta.nome_atleta,
              value: `${stats.total_pontos} pts`,
              pontos: stats.total_pontos,
              aces: stats.total_aces,
              aproveitamento: stats.aproveitamento_geral,
              eficiencia: stats.eficiencia_geral
            };
          } catch (error) {
            console.error(`Erro ao buscar stats do atleta ${atleta.atleta_id}:`, error);
            return {
              id: atleta.atleta_id,
              name: atleta.nome_atleta,
              value: '0 pts',
              pontos: 0,
              aces: 0,
              aproveitamento: 0,
              eficiencia: 0
            };
          }
        })
      );

      // Buscar estatísticas de cada dupla
      const duplasComStats = await Promise.all(
        duplas.map(async (dupla) => {
          try {
            const stats = await getEstatisticasDupla(dupla.dupla_id);
            const percentual = (stats.total_vitorias / stats.total_partidas) * 100  ?? 0;
            return {
              id: dupla.dupla_id,
              name: dupla.nome_dupla,
              value: `${percentual.toFixed(0)}% vit`,
              vitorias: stats?.total_vitorias ?? 0,
              percentual: percentual
            };
          } catch (error) {
            console.error(`Erro ao buscar stats da dupla ${dupla.dupla_id}:`, error);
            return {
              id: dupla.dupla_id,
              name: dupla.nome_dupla,
              value: '0% vit',
              vitorias: 0,
              percentual: 0
            };
          }
        })
      );

      // Ordenar e pegar top 5
      const top5Atletas = atletasComStats
        .sort((a, b) => b.pontos - a.pontos)
        .slice(0, 5);

      const top5Duplas = duplasComStats
        .sort((a, b) => b.percentual - a.percentual)
        .slice(0, 5);

      setTopAtletas(top5Atletas);
      setTopDuplas(top5Duplas);

      // Calcular estatísticas gerais
      const totalPontos = atletasComStats.reduce((sum, a) => sum + a.pontos, 0);
      const totalAces = atletasComStats.reduce((sum, a) => sum + a.aces, 0);
      const aproveitamentoMedio = atletasComStats.length > 0
        ? atletasComStats.reduce((sum, a) => sum + a.aproveitamento, 0) / atletasComStats.length
        : 0;
      const eficienciaMedio = atletasComStats.length > 0
        ? atletasComStats.reduce((sum, a) => sum + a.eficiencia, 0) / atletasComStats.length
        : 0;

      setEstatisticasGerais({
        totalPontos,
        totalAces,
        aproveitamentoMedio,
        eficienciaMedio
      });

    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-8 min-h-screen">
        <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
          <div className="w-12 h-12 border-4 border-gray-700 border-t-[#00A3FF] rounded-full animate-spin"></div>
          <p className="text-gray-400">Carregando estatísticas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen">
      <header className="mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-200 mb-2">📊 Dashboard</h1>
        <p className="text-lg text-gray-400">Estatísticas consolidadas do torneio</p>
      </header>

      {/* Busca por Partida */}
      <section className="mb-8">
        <div className="bg-[#1E1E1E] rounded-xl p-4 md:p-6 shadow-lg">
          <label className="block text-sm font-medium text-gray-300 mb-3">
            🔍 Filtrar por Partida
          </label>
          
          <div className="relative">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowDropdown(true);
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder="Digite o nome da partida..."
              className="w-full px-4 py-3 bg-[#2a2a2a] text-white rounded-lg border-2 border-gray-700 focus:border-[#00A3FF] focus:outline-none transition-colors duration-200 text-base"
            />
            
            {/* Dropdown de Partidas */}
            {showDropdown && (
              <div className="absolute z-10 w-full mt-2 bg-[#2a2a2a] border-2 border-gray-700 rounded-lg shadow-xl max-h-64 overflow-y-auto">
                {/* Opção para limpar filtro */}
                <button
                  onClick={() => {
                    setPartidaSelecionada(null);
                    setSearchTerm('');
                    setShowDropdown(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-[#3a3a3a] transition-colors duration-150 border-b border-gray-700 text-gray-400 hover:text-white"
                >
                  <span className="font-medium">📊 Todas as Partidas</span>
                  <span className="block text-xs text-gray-500 mt-1">Remover filtro</span>
                </button>
                
                {/* Lista de Partidas Filtradas */}
                {partidas
                  .filter(partida => 
                    partida.nome_partida.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((partida) => (
                    <button
                      key={partida.partida_id}
                      onClick={() => {
                        setPartidaSelecionada(partida);
                        setSearchTerm(partida.nome_partida);
                        setShowDropdown(false);
                      }}
                      className={`w-full px-4 py-3 text-left hover:bg-[#3a3a3a] transition-colors duration-150 border-b border-gray-800 last:border-b-0 ${
                        partidaSelecionada?.partida_id === partida.partida_id 
                          ? 'bg-[#00A3FF]/10 border-l-4 border-l-[#00A3FF]' 
                          : ''
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <span className="font-medium text-white block">
                            {partida.nome_partida}
                          </span>
                          <span className="text-xs text-gray-400 mt-1 block">
                            {new Date(partida.data_hora).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: '2-digit',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        {partidaSelecionada?.partida_id === partida.partida_id && (
                          <span className="text-[#00A3FF] ml-2">✓</span>
                        )}
                      </div>
                    </button>
                  ))}
                
                {/* Mensagem quando não há resultados */}
                {partidas.filter(partida => 
                  partida.nome_partida.toLowerCase().includes(searchTerm.toLowerCase())
                ).length === 0 && (
                  <div className="px-4 py-6 text-center text-gray-400">
                    <p className="text-sm">Nenhuma partida encontrada</p>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* Partida Selecionada - Badge e Ações */}
          {partidaSelecionada && (
            <div className="mt-4 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-gray-400">Partida selecionada:</span>
                <div className="inline-flex items-center gap-2 bg-[#00A3FF]/20 border border-[#00A3FF]/50 rounded-full px-3 py-1">
                  <span className="text-sm font-medium text-[#00A3FF]">
                    {partidaSelecionada.nome_partida}
                  </span>
                  <button
                    onClick={() => {
                      setPartidaSelecionada(null);
                      setSearchTerm('');
                    }}
                    className="text-[#00A3FF] hover:text-white transition-colors duration-150"
                    aria-label="Remover filtro"
                  >
                    ✕
                  </button>
                </div>
              </div>
              
              {/* Botão Ver Detalhes */}
              <button
                onClick={() => navigate(`/partida-detalhes/${partidaSelecionada.partida_id}`)}
                className="w-full md:w-auto px-6 py-3 bg-[#00A3FF] hover:bg-[#0082cc] text-white font-semibold rounded-lg transition-colors duration-200 flex items-center justify-center gap-2"
              >
                <span>📊</span>
                <span>Ver Análise Completa da Partida</span>
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Rankings */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <RankingCard
          title="Top 5 Atletas"
          items={topAtletas}
          type="atleta"
        />
        <RankingCard
          title="Top 5 Duplas"
          items={topDuplas}
          type="dupla"
        />
      </section>
    </div>
  );
}

export default Dashboard;
