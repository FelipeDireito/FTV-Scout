import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../../services/api';
import TabelaEstatisticas from '../AnalisePartida/components/TabelaEstatisticas';

function EstatisticasGerais() {
  const location = useLocation();
  const navigate = useNavigate();
  const { tipo, id, nome } = location.state || {};
  
  const [estatisticas, setEstatisticas] = useState(null);
  const [historico, setHistorico] = useState([]);
  const [statsVitorias, setStatsVitorias] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingHistorico, setLoadingHistorico] = useState(true);
  const [loadingVitorias, setLoadingVitorias] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!tipo || !id) {
      setError('Informações incompletas');
      setLoading(false);
      return;
    }

    const fetchEstatisticas = async () => {
      try {
        setLoading(true);
        setError(null);

        if (tipo === 'dupla') {
          const response = await api.get(`/estatisticas/dupla/${id}/completo`);
          setEstatisticas(response.data);
        } else if (tipo === 'atleta') {
          const response = await api.get(`/estatisticas/atleta/${id}/completo`);
          setEstatisticas({
            id: id,
            nome: nome,
            ...response.data
          });
        }
      } catch (err) {
        console.error('Erro ao carregar estatísticas:', err);
        setError('Não foi possível carregar as estatísticas');
      } finally {
        setLoading(false);
      }
    };

    fetchEstatisticas();
  }, [tipo, id, nome]);

  useEffect(() => {
    if (!tipo || !id) {
      setLoadingHistorico(false);
      return;
    }

    const fetchHistorico = async () => {
      try {
        setLoadingHistorico(true);
        
        if (tipo === 'dupla') {
          const response = await api.get(`/estatisticas/dupla/${id}/historico-partidas`);
          setHistorico(response.data);
        } else if (tipo === 'atleta') {
          const response = await api.get(`/estatisticas/atleta/${id}/historico-partidas`);
          setHistorico(response.data);
        }
      } catch (err) {
        console.error('Erro ao carregar histórico:', err);
        setHistorico([]);
      } finally {
        setLoadingHistorico(false);
      }
    };

    fetchHistorico();
  }, [tipo, id]);

  useEffect(() => {
    if (!tipo || !id) {
      setLoadingVitorias(false);
      return;
    }

    const fetchEstatisticasVitorias = async () => {
      try {
        setLoadingVitorias(true);
        
        if (tipo === 'dupla') {
          const response = await api.get(`/estatisticas/dupla/${id}/estatisticas-vitorias`);
          setStatsVitorias(response.data);
        } else if (tipo === 'atleta') {
          const response = await api.get(`/estatisticas/atleta/${id}/estatisticas-vitorias`);
          setStatsVitorias(response.data);
        }
      } catch (err) {
        console.error('Erro ao carregar estatísticas de vitórias:', err);
        setStatsVitorias(null);
      } finally {
        setLoadingVitorias(false);
      }
    };

    fetchEstatisticasVitorias();
  }, [tipo, id]);

  const formatarPercentual = (valor) => {
    if (valor === null || valor === undefined) return '0%';
    return `${Number(valor).toFixed(1)}%`;
  };

  return (
    <div className="container mx-auto p-4 min-h-screen">
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

        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-200 pt-12 md:pt-0">
          Estatísticas Gerais - {nome}
        </h1>
        <p className="text-center text-gray-400 mt-2">
          {tipo === 'dupla' ? 'Todas as partidas da dupla' : 'Todas as partidas do atleta'}
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#00A3FF]"></div>
        </div>
      ) : error ? (
        <div className="bg-red-500/10 border border-red-500 rounded-lg p-6 text-center">
          <p className="text-red-400 font-semibold">{error}</p>
        </div>
      ) : (
        <div className="space-y-24">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-gray-200 mb-6 text-center">Estatísticas Gerais</h2>
            {tipo === 'dupla' ? (
              <TabelaEstatisticas
                titulo="Dupla"
                atletas={[{ id: id, nome: nome, ...estatisticas }]}
                formatarPercentual={formatarPercentual}
              />
            ) : (
              <TabelaEstatisticas
                titulo="Atleta"
                atletas={[estatisticas]}
                formatarPercentual={formatarPercentual}
              />
            )}
          </div>

          <div className="pt-8">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-200 mb-4 text-center">Histórico de Partidas</h2>
            
            {loadingVitorias ? (
              <div className="flex justify-center items-center py-4 mb-6">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#00A3FF]"></div>
              </div>
            ) : statsVitorias && (
              <div className="flex flex-wrap items-center justify-center gap-8 mb-8 py-4">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400 uppercase tracking-wide">Total:</span>
                  <span className="text-3xl font-black text-[#00A3FF]">{statsVitorias.total_partidas}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400 uppercase tracking-wide">Vitórias:</span>
                  <span className="text-3xl font-black text-green-400">{statsVitorias.vitorias}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400 uppercase tracking-wide">Derrotas:</span>
                  <span className="text-3xl font-black text-red-400">{statsVitorias.derrotas}</span>
                </div>
                
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-400 uppercase tracking-wide">Taxa de Vitórias:</span>
                  <span className="text-3xl font-black text-yellow-400">{statsVitorias.percentual_vitorias}%</span>
                </div>
              </div>
            )}
            
            {loadingHistorico ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#00A3FF]"></div>
              </div>
            ) : historico.length === 0 ? (
              <div className="bg-[#1E1E1E] border-2 border-gray-700 rounded-xl p-8 text-center">
                <p className="text-gray-400">Nenhuma partida encontrada no histórico</p>
              </div>
            ) : (
              <div className="bg-[#1E1E1E] border-2 border-gray-700 rounded-xl overflow-hidden">
                <div className="hidden md:grid md:grid-cols-12 gap-4 bg-gradient-to-r from-[#00A3FF]/20 to-[#00A3FF]/10 px-6 py-4 border-b border-gray-700">
                  <div className="col-span-3 text-xs font-bold text-gray-300 uppercase tracking-wide">Partida</div>
                  <div className="col-span-2 text-xs font-bold text-gray-300 uppercase tracking-wide text-center">Placar</div>
                  <div className="col-span-1 text-xs font-bold text-gray-300 uppercase tracking-wide text-center">Resultado</div>
                  <div className="col-span-5 text-xs font-bold text-gray-300 uppercase tracking-wide text-center">Estatísticas</div>
                  <div className="col-span-1 text-xs font-bold text-gray-300 uppercase tracking-wide text-center">Análise</div>
                </div>

                <div className="divide-y divide-gray-700">
                  {historico.map((partida, index) => (
                    <div
                      key={partida.partida_id}
                      className={`grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-5 hover:bg-gray-800/50 transition-colors duration-200 ${
                        index % 2 === 0 ? 'bg-[#1E1E1E]' : 'bg-[#252525]'
                      }`}
                    >
                      <div className="col-span-1 md:col-span-3">
                        <h3 className="text-base font-bold text-white mb-1">{partida.nome_partida}</h3>
                        <p className="text-sm text-gray-400">vs {partida.dupla_adversaria}</p>
                      </div>

                      <div className="col-span-1 md:col-span-2 flex items-center md:justify-center">
                        <span className="text-xl font-bold text-white">
                          {partida.placar_a} - {partida.placar_b}
                        </span>
                      </div>

                      <div className="col-span-1 md:col-span-1 flex items-center md:justify-center">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold text-xs ${
                          partida.vitoria 
                            ? 'bg-green-500/20 text-green-400 border-2 border-green-500/50' 
                            : 'bg-red-500/20 text-red-400 border-2 border-red-500/50'
                        }`}>
                          {partida.vitoria ? 'V' : 'D'}
                        </span>
                      </div>

                      <div className="col-span-1 md:col-span-5 flex items-center justify-center gap-6">
                        <div className="text-center">
                          <div className="text-2xl font-bold text-gray-100">{partida.ataque_pontos + partida.saque_aces}</div>
                          <div className="text-xs text-gray-500 uppercase tracking-wide">Pontos</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400">{partida.ataque_pontos}</div>
                          <div className="text-xs text-gray-500 uppercase tracking-wide">Ataques</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-green-400">{partida.saque_aces}</div>
                          <div className="text-xs text-gray-500 uppercase tracking-wide">Aces</div>
                        </div>
                        <div className="text-center">
                          <div className="text-2xl font-bold text-red-400">{partida.total_erros}</div>
                          <div className="text-xs text-gray-500 uppercase tracking-wide">Erros</div>
                        </div>
                      </div>

                      <div className="col-span-1 md:col-span-1 flex items-center justify-center">
                        <button
                          onClick={() => navigate(`/analise/${partida.partida_id}`)}
                          className="bg-[#00A3FF] hover:bg-[#0082cc] text-white p-2 rounded-lg transition-colors duration-200"
                          title="Ver Partida"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default EstatisticasGerais;
