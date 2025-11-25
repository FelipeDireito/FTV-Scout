import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import api from '../../services/api';
import QuadraMapaCalorPosicoes from './QuadraMapaCalorPosicoes';
import TabelaEstatisticas from './components/TabelaEstatisticas';
import ResumoPartida from './components/ResumoPartida';

function AnalisePartida() {
  const { partidaId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const statePartida = location.state?.partida;
  const stateDuplas = location.state?.duplas;

  const [partida, setPartida] = useState(statePartida || null);
  const [duplas, setDuplas] = useState(stateDuplas || {});
  const [estatisticasDuplaA, setEstatisticasDuplaA] = useState(null);
  const [estatisticasDuplaB, setEstatisticasDuplaB] = useState(null);
  const [atletasDuplaA, setAtletasDuplaA] = useState([]);
  const [atletasDuplaB, setAtletasDuplaB] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [expandidoDuplaA, setExpandidoDuplaA] = useState(false);
  const [expandidoDuplaB, setExpandidoDuplaB] = useState(false);

  // Estados para Mapa de Calor
  const [abaAtiva, setAbaAtiva] = useState('resumo'); // 'resumo' | 'estatisticas' | 'individuais' | 'mapa-calor'
  const [duplaIndividualSelecionada, setDuplaIndividualSelecionada] = useState(null);
  const [duplaMapaSelecionada, setDuplaMapaSelecionada] = useState(null);
  const [atletaMapaSelecionado, setAtletaMapaSelecionado] = useState(null);
  const [tipoAcaoSelecionada, setTipoAcaoSelecionada] = useState(5); // 5=Ataque por padrão
  const [dadosMapaCalor, setDadosMapaCalor] = useState(null);
  const [loadingMapa, setLoadingMapa] = useState(false);

  useEffect(() => {
    const fetchPartida = async () => {
      try {
        setLoading(true);

        if (statePartida && statePartida.partida_id === parseInt(partidaId)) {
          setPartida(statePartida);

          if (!stateDuplas || Object.keys(stateDuplas).length === 0) {
            await fetchDuplasNomes(statePartida);
          }
        } else {
          const response = await api.get(`/partidas/${partidaId}`);
          setPartida(response.data);
          await fetchDuplasNomes(response.data);
        }
      } catch (err) {
        console.error('Erro ao carregar partida:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPartida();
  }, [partidaId]);

  useEffect(() => {
    if (partida && partida.dupla_a_id && partida.dupla_b_id) {
      fetchEstatisticas();
      setDuplaMapaSelecionada(partida.dupla_a_id);
      setDuplaIndividualSelecionada(partida.dupla_a_id);
    }
  }, [partida]);

  useEffect(() => {
    if (abaAtiva === 'mapa-calor' && atletaMapaSelecionado && tipoAcaoSelecionada) {
      fetchMapaCalor();
    }
  }, [atletaMapaSelecionado, tipoAcaoSelecionada, abaAtiva]);

  useEffect(() => {
    if (abaAtiva === 'individuais' && duplaIndividualSelecionada) {
      if (duplaIndividualSelecionada === partida?.dupla_a_id && atletasDuplaA.length === 0) {
        fetchAtletasDupla(partida.dupla_a_id, setAtletasDuplaA);
      } else if (duplaIndividualSelecionada === partida?.dupla_b_id && atletasDuplaB.length === 0) {
        fetchAtletasDupla(partida.dupla_b_id, setAtletasDuplaB);
      }
    }
  }, [abaAtiva, duplaIndividualSelecionada]);

  const fetchEstatisticas = async () => {
    try {
      setLoadingStats(true);

      const [statsA, statsB] = await Promise.all([
        api.get(`/estatisticas/dupla/${partida.dupla_a_id}/completo?partida_id=${partidaId}`),
        api.get(`/estatisticas/dupla/${partida.dupla_b_id}/completo?partida_id=${partidaId}`)
      ]);

      setEstatisticasDuplaA(statsA.data);
      setEstatisticasDuplaB(statsB.data);
    } catch (err) {
      console.error('Erro ao carregar estatísticas:', err);
    } finally {
      setLoadingStats(false);
    }
  };

  const fetchAtletasDupla = async (duplaId, setAtletas) => {
    try {
      const response = await api.get(`/estatisticas/dupla/${duplaId}/completo?partida_id=${partidaId}`);
      const dupla = response.data;

      if (dupla.atletas_ids && dupla.atletas_ids.length > 0) {
        const atletasStats = await Promise.all(
          dupla.atletas_ids.map(async (atletaId, index) => {
            try {
              const stats = await api.get(`/estatisticas/atleta/${atletaId}/completo?partida_id=${partidaId}`);
              return {
                id: atletaId,
                nome: dupla.atletas[index] || `Atleta ${atletaId}`,
                ...stats.data
              };
            } catch (err) {
              console.error(`Erro ao buscar atleta ${atletaId}:`, err);
              return {
                id: atletaId,
                nome: dupla.atletas[index] || `Atleta ${atletaId}`,
                total_pontos_ataque: 0,
                total_aces: 0,
                total_erros: 0
              };
            }
          })
        );

        setAtletas(atletasStats);
      }
    } catch (err) {
      console.error('Erro ao carregar atletas:', err);
    }
  };

  const fetchMapaCalor = async () => {
    try {
      setLoadingMapa(true);
      const response = await api.get(
        `/estatisticas/atleta/${atletaMapaSelecionado}/mapa-calor-posicoes?tipo_acao_id=${tipoAcaoSelecionada}&partida_id=${partidaId}`
      );
      setDadosMapaCalor(response.data);
    } catch (err) {
      console.error('Erro ao carregar mapa de ações:', err);
      setDadosMapaCalor(null);
    } finally {
      setLoadingMapa(false);
    }
  };

  const getAtletasDaDupla = (duplaId) => {
    if (!estatisticasDuplaA || !estatisticasDuplaB) return [];

    const dupla = duplaId === partida?.dupla_a_id ? estatisticasDuplaA : estatisticasDuplaB;
    if (!dupla.atletas_ids) return [];

    return dupla.atletas_ids.map((id, index) => ({
      id,
      nome: dupla.atletas[index] || `Atleta ${id}`
    }));
  };

  const fetchDuplasNomes = async (partidaData) => {
    const duplasMap = {};
    const duplasIds = [partidaData.dupla_a_id, partidaData.dupla_b_id].filter(Boolean);

    try {
      const promises = duplasIds.map(async (duplaId) => {
        try {
          const response = await api.get(`/duplas/${duplaId}`);
          duplasMap[duplaId] = response.data.nome_dupla || `Dupla ${duplaId}`;
        } catch (err) {
          console.error(`Erro ao buscar dupla ${duplaId}:`, err);
          duplasMap[duplaId] = `Dupla ${duplaId}`;
        }
      });

      await Promise.all(promises);
      setDuplas(duplasMap);
    } catch (err) {
      console.error('Erro ao buscar duplas:', err);
    }
  };

  const getNomePartida = () => {
    if (!partida) return '';
    return partida.nome_partida || 'Sem nome';
  };

  const getDuplasPartida = () => {
    if (!partida) return '';
    const duplaA = duplas[partida.dupla_a_id] || 'Dupla A';
    const duplaB = duplas[partida.dupla_b_id] || 'Dupla B';
    return `${duplaA} vs ${duplaB}`;
  };

  const getNomeDupla = (duplaId) => {
    return duplas[duplaId] || 'Carregando...';
  };

  const formatarPercentual = (valor) => {
    if (valor === null || valor === undefined) return '0%';
    return `${Math.round(valor)}%`;
  };

  const toggleExpandidoDuplaA = async () => {
    if (!expandidoDuplaA && atletasDuplaA.length === 0) {
      await fetchAtletasDupla(partida.dupla_a_id, setAtletasDuplaA);
    }
    setExpandidoDuplaA(!expandidoDuplaA);
  };

  const toggleExpandidoDuplaB = async () => {
    if (!expandidoDuplaB && atletasDuplaB.length === 0) {
      await fetchAtletasDupla(partida.dupla_b_id, setAtletasDuplaB);
    }
    setExpandidoDuplaB(!expandidoDuplaB);
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-xl text-gray-300">Carregando análise...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 min-h-screen flex flex-col">
      {/* Header com informações da partida */}
      <div className="relative mb-8">
        <button
          onClick={() => navigate(-1)}
          className="absolute left-0 top-0 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Voltar
        </button>

        <div className="pt-12 md:pt-0 text-center">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-200 mb-2">
            {getNomePartida()}
          </h1>
          <p className="text-lg md:text-xl text-gray-400">
            {getDuplasPartida()}
          </p>
        </div>
      </div>

      {/* Placar da Partida */}
      <div className="mb-6 flex justify-center">
        <div className="bg-[#1E1E1E] rounded-lg p-1 border border-gray-700 max-w-md w-full">
          <h2 className="text-center text-gray-400 text-xs uppercase mb-3">Placar Final</h2>
          <div className="flex items-center justify-center gap-6">
            {/* Dupla A */}
            <div className="text-center">
              <h3 className="text-sm md:text-base font-medium text-gray-300 mb-1 truncate max-w-[120px]">
                {getNomeDupla(partida?.dupla_a_id)}
              </h3>
              <div className={`text-4xl md:text-5xl font-bold ${partida?.dupla_vencedora_id === partida?.dupla_a_id ? 'text-[#00A3FF]' : 'text-gray-400'
                }`}>
                {partida?.placar_final_dupla_a || 0}
              </div>
            </div>

            {/* VS */}
            <div className="text-xl md:text-2xl font-bold text-gray-600">×</div>

            {/* Dupla B */}
            <div className="text-center">
              <h3 className="text-sm md:text-base font-medium text-gray-300 mb-1 truncate max-w-[120px]">
                {getNomeDupla(partida?.dupla_b_id)}
              </h3>
              <div className={`text-4xl md:text-5xl font-bold ${partida?.dupla_vencedora_id === partida?.dupla_b_id ? 'text-[#00A3FF]' : 'text-gray-400'
                }`}>
                {partida?.placar_final_dupla_b || 0}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs de Navegação */}
      <div className="mb-6">
        <div className="flex gap-2 border-b border-gray-700 justify-center flex-wrap">
          <button
            onClick={() => setAbaAtiva('resumo')}
            className={`px-4 md:px-6 py-3 font-semibold transition-all duration-200 ${abaAtiva === 'resumo'
              ? 'text-[#00A3FF] border-b-2 border-[#00A3FF]'
              : 'text-gray-400 hover:text-gray-300'
              }`}
          >
            Resumo
          </button>
          <button
            onClick={() => setAbaAtiva('estatisticas')}
            className={`px-4 md:px-6 py-3 font-semibold transition-all duration-200 ${abaAtiva === 'estatisticas'
              ? 'text-[#00A3FF] border-b-2 border-[#00A3FF]'
              : 'text-gray-400 hover:text-gray-300'
              }`}
          >
            Duplas
          </button>
          <button
            onClick={() => setAbaAtiva('individuais')}
            className={`px-4 md:px-6 py-3 font-semibold transition-all duration-200 ${abaAtiva === 'individuais'
              ? 'text-[#00A3FF] border-b-2 border-[#00A3FF]'
              : 'text-gray-400 hover:text-gray-300'
              }`}
          >
            Individuais
          </button>
          <button
            onClick={() => setAbaAtiva('mapa-calor')}
            className={`px-4 md:px-6 py-3 font-semibold transition-all duration-200 ${abaAtiva === 'mapa-calor'
              ? 'text-[#00A3FF] border-b-2 border-[#00A3FF]'
              : 'text-gray-400 hover:text-gray-300'
              }`}
          >
            Mapa de Ações
          </button>
        </div>
      </div>

      {/* Conteúdo: Resumo da Partida */}
      {abaAtiva === 'resumo' && (
        <>
          {loadingStats ? (
            <div className="text-center py-8">
              <div className="text-gray-400">Carregando estatísticas...</div>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white text-center mb-6">Resumo da Partida</h2>

              {/* Resumo Visual da Partida */}
              <ResumoPartida
                nomeDuplaA={getNomeDupla(partida?.dupla_a_id)}
                nomeDuplaB={getNomeDupla(partida?.dupla_b_id)}
                estatisticasDuplaA={estatisticasDuplaA}
                estatisticasDuplaB={estatisticasDuplaB}
              />
            </div>
          )}
        </>
      )}

      {/* Conteúdo: Estatísticas das Duplas */}
      {abaAtiva === 'estatisticas' && (
        <>
          {loadingStats ? (
            <div className="text-center py-8">
              <div className="text-gray-400">Carregando estatísticas...</div>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white text-center mb-6">Estatísticas das Duplas</h2>

              {/* Tabela de Estatísticas das Duplas */}
              <TabelaEstatisticas
                titulo="Dupla"
                atletas={[
                  {
                    id: partida?.dupla_a_id,
                    nome: getNomeDupla(partida?.dupla_a_id),
                    ...estatisticasDuplaA
                  },
                  {
                    id: partida?.dupla_b_id,
                    nome: getNomeDupla(partida?.dupla_b_id),
                    ...estatisticasDuplaB
                  }
                ].filter(dupla => dupla.nome)} // Filtra duplas válidas
                formatarPercentual={formatarPercentual}
              />
            </div>
          )}
        </>
      )}

      {/* Conteúdo: Estatísticas Individuais */}
      {abaAtiva === 'individuais' && (
        <>
          {loadingStats ? (
            <div className="text-center py-8">
              <div className="text-gray-400">Carregando estatísticas...</div>
            </div>
          ) : (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-white text-center mb-6">Estatísticas Individuais</h2>

              {/* Seletor de Dupla */}
              <div className="flex justify-center mb-6">
                <div className="bg-[#1E1E1E] rounded-lg p-1 border border-gray-700 inline-flex">
                  <button
                    onClick={() => {
                      setDuplaIndividualSelecionada(partida?.dupla_a_id);
                      if (atletasDuplaA.length === 0) {
                        fetchAtletasDupla(partida.dupla_a_id, setAtletasDuplaA);
                      }
                    }}
                    className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${duplaIndividualSelecionada === partida?.dupla_a_id
                      ? 'bg-[#00A3FF] text-white'
                      : 'text-gray-400 hover:text-gray-300'
                      }`}
                  >
                    {getNomeDupla(partida?.dupla_a_id)}
                  </button>
                  <button
                    onClick={() => {
                      setDuplaIndividualSelecionada(partida?.dupla_b_id);
                      if (atletasDuplaB.length === 0) {
                        fetchAtletasDupla(partida.dupla_b_id, setAtletasDuplaB);
                      }
                    }}
                    className={`px-6 py-2 rounded-lg font-semibold transition-all duration-200 ${duplaIndividualSelecionada === partida?.dupla_b_id
                      ? 'bg-[#00A3FF] text-white'
                      : 'text-gray-400 hover:text-gray-300'
                      }`}
                  >
                    {getNomeDupla(partida?.dupla_b_id)}
                  </button>
                </div>
              </div>

              {/* Tabela de Atletas */}
              {duplaIndividualSelecionada === partida?.dupla_a_id && (
                <>
                  {atletasDuplaA.length > 0 ? (
                    <TabelaEstatisticas
                      titulo="Atleta"
                      atletas={atletasDuplaA}
                      formatarPercentual={formatarPercentual}
                    />
                  ) : (
                    <div className="text-center text-gray-400 py-8">
                      Carregando atletas...
                    </div>
                  )}
                </>
              )}
              {duplaIndividualSelecionada === partida?.dupla_b_id && (
                <>
                  {atletasDuplaB.length > 0 ? (
                    <TabelaEstatisticas
                      titulo="Atleta"
                      atletas={atletasDuplaB}
                      formatarPercentual={formatarPercentual}
                    />
                  ) : (
                    <div className="text-center text-gray-400 py-8">
                      Carregando atletas...
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </>
      )}

      {/* Conteúdo: Mapa de Calor */}
      {abaAtiva === 'mapa-calor' && (
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-white text-center mb-6">Mapa de Ações</h2>

          {/* Filtros */}
          <div className="space-y-4">
            <div className="flex flex-wrap justify-center gap-4">
              {/* Seleção de Dupla */}
              <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Dupla</label>
                <select
                  value={duplaMapaSelecionada || ''}
                  onChange={(e) => {
                    setDuplaMapaSelecionada(parseInt(e.target.value));
                    setAtletaMapaSelecionado(null); // Resetar atleta ao mudar dupla
                    setDadosMapaCalor(null); // Resetar dados do mapa de calor
                  }}
                  className="bg-transparent text-white px-4 py-2 border-b-2 border-gray-600 focus:border-[#00A3FF] focus:outline-none transition-colors min-w-[180px]"
                >
                  <option value="" className="bg-[#2a2a2a]">Selecione uma dupla</option>
                  {partida && (
                    <>
                      <option value={partida.dupla_a_id} className="bg-[#2a2a2a]">{getNomeDupla(partida.dupla_a_id)}</option>
                      <option value={partida.dupla_b_id} className="bg-[#2a2a2a]">{getNomeDupla(partida.dupla_b_id)}</option>
                    </>
                  )}
                </select>
              </div>

              {/* Seleção de Atleta */}
              <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Atleta</label>
                <select
                  value={atletaMapaSelecionado || ''}
                  onChange={(e) => {
                    setAtletaMapaSelecionado(parseInt(e.target.value));
                    setDadosMapaCalor(null);
                  }}
                  disabled={!duplaMapaSelecionada}
                  className="bg-transparent text-white px-4 py-2 border-b-2 border-gray-600 focus:border-[#00A3FF] focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed min-w-[180px]"
                >
                  <option value="" className="bg-[#2a2a2a]">Selecione um atleta</option>
                  {duplaMapaSelecionada && getAtletasDaDupla(duplaMapaSelecionada).map(atleta => (
                    <option key={atleta.id} value={atleta.id} className="bg-[#2a2a2a]">{atleta.nome}</option>
                  ))}
                </select>
              </div>

              {/* Seleção de Tipo de Ação */}
              <div className="flex flex-col">
                <label className="text-xs font-medium text-gray-500 mb-1 uppercase tracking-wider">Técnica</label>
                <select
                  value={tipoAcaoSelecionada}
                  onChange={(e) => setTipoAcaoSelecionada(parseInt(e.target.value))}
                  className="bg-transparent text-white px-4 py-2 border-b-2 border-gray-600 focus:border-[#00A3FF] focus:outline-none transition-colors min-w-[180px]"
                >
                  <option value={5} className="bg-[#2a2a2a]">Ataque</option>
                  <option value={1} className="bg-[#2a2a2a]">Saque</option>
                  <option value={2} className="bg-[#2a2a2a]">Defesa</option>
                  <option value={7} className="bg-[#2a2a2a]">Recepção</option>
                </select>
              </div>
            </div>
          </div>

          {/* Quadra */}
          {loadingMapa ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#00A3FF] mx-auto mb-4"></div>
                <div className="text-gray-400">Carregando mapa de ações...</div>
              </div>
            </div>
          ) : dadosMapaCalor ? (
            <QuadraMapaCalorPosicoes dadosMapa={dadosMapaCalor} />
          ) : (
            <div className="text-center py-12 bg-[#1E1E1E] rounded-xl border-2 border-gray-700">
              <div className="text-gray-400 text-lg">
                Selecione um atleta e tipo de ação para visualizar o mapa de ações
              </div>
              <div className="text-gray-500 text-sm mt-2">
                Use os filtros acima para começar a análise
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AnalisePartida;
