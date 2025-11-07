import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';

function Dashboard() {
  const [partidas, setPartidas] = useState([]);
  const [partidaSelecionada, setPartidaSelecionada] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dropdownAberto, setDropdownAberto] = useState(false);
  const [duplas, setDuplas] = useState({});
  const [buscaTexto, setBuscaTexto] = useState('');
  const [loadingDuplas, setLoadingDuplas] = useState(false);
  const dropdownRef = useRef(null);

  // Estados para atletas
  const [atletas, setAtletas] = useState([]);
  const [atletaSelecionado, setAtletaSelecionado] = useState(null);
  const [dropdownAtletaAberto, setDropdownAtletaAberto] = useState(false);
  const [buscaAtleta, setBuscaAtleta] = useState('');
  const [loadingAtletas, setLoadingAtletas] = useState(false);
  const dropdownAtletaRef = useRef(null);

  // Estados para duplas (seleção)
  const [todasDuplas, setTodasDuplas] = useState([]);
  const [duplaSelecionada, setDuplaSelecionada] = useState(null);
  const [dropdownDuplaAberto, setDropdownDuplaAberto] = useState(false);
  const [buscaDupla, setBuscaDupla] = useState('');
  const [loadingTodasDuplas, setLoadingTodasDuplas] = useState(false);
  const dropdownDuplaRef = useRef(null);

  useEffect(() => {
    const fetchPartidas = async () => {
      try {
        setLoading(true);
        const response = await api.get('/partidas');
        console.log(response.data)
        setPartidas(response.data);
        setError(null);

        await fetchDuplasNomes(response.data);
      } catch (err) {
        console.error('Erro ao carregar partidas:', err);
        setError('Não foi possível carregar as partidas');
      } finally {
        setLoading(false);
      }
    };

    fetchPartidas();
    fetchAtletas();
    fetchTodasDuplas();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownAberto(false);
      }
      if (dropdownAtletaRef.current && !dropdownAtletaRef.current.contains(event.target)) {
        setDropdownAtletaAberto(false);
      }
      if (dropdownDuplaRef.current && !dropdownDuplaRef.current.contains(event.target)) {
        setDropdownDuplaAberto(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchDuplasNomes = async (partidasData) => {
    setLoadingDuplas(true);
    const duplasMap = {};
    const duplasIds = new Set();

    partidasData.forEach(partida => {
      if (partida.dupla_a_id) duplasIds.add(partida.dupla_a_id);
      if (partida.dupla_b_id) duplasIds.add(partida.dupla_b_id);
    });

    try {
      const promises = Array.from(duplasIds).map(async (duplaId) => {
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
    } finally {
      setLoadingDuplas(false);
    }
  };

  const fetchAtletas = async () => {
    try {
      setLoadingAtletas(true);
      const response = await api.get('/atletas');
      setAtletas(response.data);
    } catch (err) {
      console.error('Erro ao carregar atletas:', err);
    } finally {
      setLoadingAtletas(false);
    }
  };

  const fetchTodasDuplas = async () => {
    try {
      setLoadingTodasDuplas(true);
      const response = await api.get('/duplas');
      setTodasDuplas(response.data);
    } catch (err) {
      console.error('Erro ao carregar duplas:', err);
    } finally {
      setLoadingTodasDuplas(false);
    }
  };

  const handleSelecionarPartida = (partida) => {
    setPartidaSelecionada(partida);
    setDropdownAberto(false);
    setBuscaTexto('');
  };

  const getDuplasPartida = (partida) => {
    if (!partida) return '';
    const duplaA = duplas[partida.dupla_a_id] || "Sem dupla A";
    const duplaB = duplas[partida.dupla_b_id] || "Sem dupla B";
    return `${duplaA} vs ${duplaB}`;
  };

  const getNomePartida = (partida) => {
    if (!partida) return '';
    const nomePartida = partida.nome_partida || "Sem nome";
    return nomePartida
  };

  const partidasFiltradas = partidas.filter(partida => {
    if (!buscaTexto) return true;

    const textoLower = buscaTexto.toLowerCase();
    const nomePartida = getNomePartida(partida).toLowerCase();
    const nomeDuplas = getDuplasPartida(partida).toLowerCase();

    return nomePartida.includes(textoLower) || nomeDuplas.includes(textoLower);
  });

  const atletasFiltrados = atletas.filter(atleta => {
    if (!buscaAtleta) return true;
    return atleta.nome_atleta.toLowerCase().includes(buscaAtleta.toLowerCase());
  });

  const duplasFiltradas = todasDuplas.filter(dupla => {
    if (!buscaDupla) return true;
    return dupla.nome_dupla.toLowerCase().includes(buscaDupla.toLowerCase());
  });

  return (
    <div className="container mx-auto p-4 min-h-screen flex flex-col">
      <div className="relative mb-8">
        <Link
          to="/"
          className="absolute left-0 top-0 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center gap-2 font-medium"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          Voltar
        </Link>

        <h1 className="text-3xl md:text-4xl font-bold text-center text-gray-200 pt-12 md:pt-0">
          Análise de Partidas
        </h1>
      </div>

      <div className="w-full max-w-2xl mx-auto mt-12">
        <label className="block text-gray-200 text-xl md:text-2xl font-bold mb-4 text-center">
          Partida Específica
        </label>

        <div className="flex gap-3 justify-center">
          <div className="relative w-full max-w-xl" ref={dropdownRef}>
            <div className="relative">
              <input
                type="text"
                value={buscaTexto}
                onChange={(e) => {
                  setBuscaTexto(e.target.value);
                  setDropdownAberto(true);
                }}
                onFocus={() => setDropdownAberto(true)}
                placeholder={
                  loading ? 'Carregando partidas...' :
                    loadingDuplas ? 'Carregando nomes das duplas...' :
                      partidaSelecionada ?
                        `${getNomePartida(partidaSelecionada)} - ${getDuplasPartida(partidaSelecionada)}` :
                        'Digite para buscar por nome da partida ou duplas...'
                }
                className="w-full bg-[#1E1E1E] text-white px-4 py-4 pr-10 rounded-l-lg border-2 border-r-0 border-gray-700 focus:border-[#00A3FF] focus:outline-none transition-colors duration-200"
                disabled={loading}
              />
              <button
                onClick={() => setDropdownAberto(!dropdownAberto)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                type="button"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-5 w-5 transition-transform duration-200 ${dropdownAberto ? 'rotate-180' : ''}`}
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            {dropdownAberto && !loading && (
              <div className="absolute z-10 w-full mt-2 bg-[#1E1E1E] border-2 border-gray-700 rounded-lg shadow-xl max-h-80 overflow-y-auto">
                {error ? (
                  <div className="p-4 text-center text-red-400">
                    {error}
                  </div>
                ) : partidasFiltradas.length === 0 ? (
                  <div className="p-4 text-center text-gray-400">
                    {buscaTexto ? 'Nenhuma partida encontrada com esse termo' : 'Nenhuma partida encontrada'}
                  </div>
                ) : (
                  partidasFiltradas.map((partida) => (
                    <button
                      key={partida.partida_id}
                      onClick={() => handleSelecionarPartida(partida)}
                      className="w-full p-4 text-left hover:bg-[#2a2a2a] transition-colors duration-150 border-b border-gray-800 last:border-b-0"
                    >
                      <div className="font-semibold text-white mb-1">
                        {getNomePartida(partida)}
                      </div>
                      <div className="text-sm text-gray-400">
                        {loadingDuplas ? 'Carregando duplas...' : getDuplasPartida(partida)}
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>

          <Link
            to={partidaSelecionada ? `/analise/${partidaSelecionada.partida_id}` : '#'}
            state={partidaSelecionada ? { partida: partidaSelecionada, duplas } : null}
            className={`flex items-center px-8 rounded-r-lg font-bold text-white transition-all duration-200 border-2 border-l-0 ${partidaSelecionada
              ? 'bg-[#00A3FF] hover:bg-[#0082cc] border-[#00A3FF] hover:border-[#0082cc] cursor-pointer'
              : 'bg-gray-600 border-gray-600 cursor-not-allowed opacity-50'
              }`}
            onClick={(e) => !partidaSelecionada && e.preventDefault()}
          >
            Ir
          </Link>
        </div>

        {/* Dropdown de seleção de atleta */}
        <div className="mt-16">
          <label className="block text-gray-200 text-xl md:text-2xl font-bold mb-4 text-center">
            Histórico Completo de Atleta
          </label>

          <div className="flex gap-3 justify-center">
            <div className="relative w-full max-w-xl" ref={dropdownAtletaRef}>
              <div className="relative">
                <input
                  type="text"
                  value={buscaAtleta}
                  onChange={(e) => {
                    setBuscaAtleta(e.target.value);
                    setDropdownAtletaAberto(true);
                  }}
                  onFocus={() => setDropdownAtletaAberto(true)}
                  placeholder={
                    loadingAtletas ? 'Carregando atletas...' :
                      atletaSelecionado ?
                        atletaSelecionado.nome_atleta :
                        'Digite para buscar um atleta...'
                  }
                  className="w-full bg-[#1E1E1E] text-white px-4 py-4 pr-10 rounded-l-lg border-2 border-r-0 border-gray-700 focus:border-[#00A3FF] focus:outline-none transition-colors duration-200"
                  disabled={loadingAtletas}
                />
                <button
                  onClick={() => setDropdownAtletaAberto(!dropdownAtletaAberto)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 transition-transform duration-200 ${dropdownAtletaAberto ? 'rotate-180' : ''}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {dropdownAtletaAberto && !loadingAtletas && (
                <div className="absolute z-10 w-full mt-2 bg-[#1E1E1E] border-2 border-gray-700 rounded-lg shadow-xl max-h-80 overflow-y-auto">
                  {atletasFiltrados.length === 0 ? (
                    <div className="p-4 text-center text-gray-400">
                      {buscaAtleta ? 'Nenhum atleta encontrado com esse termo' : 'Nenhum atleta encontrado'}
                    </div>
                  ) : (
                    atletasFiltrados.map((atleta) => (
                      <button
                        key={atleta.atleta_id}
                        onClick={() => {
                          setAtletaSelecionado(atleta);
                          setDropdownAtletaAberto(false);
                          setBuscaAtleta('');
                        }}
                        className="w-full p-4 text-left hover:bg-[#2a2a2a] transition-colors duration-150 border-b border-gray-800 last:border-b-0"
                      >
                        <div className="font-semibold text-white">
                          {atleta.nome_atleta}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <Link
              to={atletaSelecionado ? '/historico-atleta' : '#'}
              state={atletaSelecionado ? { id: atletaSelecionado.atleta_id, nome: atletaSelecionado.nome_atleta } : null}
              className={`flex items-center px-8 rounded-r-lg font-bold text-white transition-all duration-200 border-2 border-l-0 ${atletaSelecionado
                ? 'bg-[#00A3FF] hover:bg-[#0082cc] border-[#00A3FF] hover:border-[#0082cc] cursor-pointer'
                : 'bg-gray-600 border-gray-600 cursor-not-allowed opacity-50'
                }`}
              onClick={(e) => !atletaSelecionado && e.preventDefault()}
            >
              Ir
            </Link>
          </div>
        </div>

        {/* Dropdown de seleção de dupla */}
        <div className="mt-16">
          <label className="block text-gray-200 text-xl md:text-2xl font-bold mb-4 text-center">
            Histórico Completo de Dupla
          </label>

          <div className="flex gap-3 justify-center">
            <div className="relative w-full max-w-xl" ref={dropdownDuplaRef}>
              <div className="relative">
                <input
                  type="text"
                  value={buscaDupla}
                  onChange={(e) => {
                    setBuscaDupla(e.target.value);
                    setDropdownDuplaAberto(true);
                  }}
                  onFocus={() => setDropdownDuplaAberto(true)}
                  placeholder={
                    loadingTodasDuplas ? 'Carregando duplas...' :
                      duplaSelecionada ?
                        duplaSelecionada.nome_dupla :
                        'Digite para buscar uma dupla...'
                  }
                  className="w-full bg-[#1E1E1E] text-white px-4 py-4 pr-10 rounded-l-lg border-2 border-r-0 border-gray-700 focus:border-[#00A3FF] focus:outline-none transition-colors duration-200"
                  disabled={loadingTodasDuplas}
                />
                <button
                  onClick={() => setDropdownDuplaAberto(!dropdownDuplaAberto)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-300 transition-colors"
                  type="button"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 transition-transform duration-200 ${dropdownDuplaAberto ? 'rotate-180' : ''}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>

              {dropdownDuplaAberto && !loadingTodasDuplas && (
                <div className="absolute z-10 w-full mt-2 bg-[#1E1E1E] border-2 border-gray-700 rounded-lg shadow-xl max-h-80 overflow-y-auto">
                  {duplasFiltradas.length === 0 ? (
                    <div className="p-4 text-center text-gray-400">
                      {buscaDupla ? 'Nenhuma dupla encontrada com esse termo' : 'Nenhuma dupla encontrada'}
                    </div>
                  ) : (
                    duplasFiltradas.map((dupla) => (
                      <button
                        key={dupla.dupla_id}
                        onClick={() => {
                          setDuplaSelecionada(dupla);
                          setDropdownDuplaAberto(false);
                          setBuscaDupla('');
                        }}
                        className="w-full p-4 text-left hover:bg-[#2a2a2a] transition-colors duration-150 border-b border-gray-800 last:border-b-0"
                      >
                        <div className="font-semibold text-white">
                          {dupla.nome_dupla}
                        </div>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>

            <Link
              to={duplaSelecionada ? '/estatisticas-gerais' : '#'}
              state={duplaSelecionada ? { tipo: 'dupla', id: duplaSelecionada.dupla_id, nome: duplaSelecionada.nome_dupla } : null}
              className={`flex items-center px-8 rounded-r-lg font-bold text-white transition-all duration-200 border-2 border-l-0 ${duplaSelecionada
                ? 'bg-[#00A3FF] hover:bg-[#0082cc] border-[#00A3FF] hover:border-[#0082cc] cursor-pointer'
                : 'bg-gray-600 border-gray-600 cursor-not-allowed opacity-50'
                }`}
              onClick={(e) => !duplaSelecionada && e.preventDefault()}
            >
              Ir
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
