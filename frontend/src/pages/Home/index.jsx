import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../../services/api';

function Home() {
  const [partidasRecentes, setPartidasRecentes] = useState([]);
  const [loadingPartidas, setLoadingPartidas] = useState(true);
  const [errorPartidas, setErrorPartidas] = useState(null);

  useEffect(() => {
    const fetchPartidas = async () => {
      setLoadingPartidas(true);
      setErrorPartidas(null);
      try {
        const resp = await api.get('/partidas/recentes');
        const partidas = resp.data.map(p => ({
          ...p,
          nome_duplas: `${p.dupla_a.nome_dupla} vs. ${p.dupla_b.nome_dupla}`,
          data_partida: p.data_hora,
        }));
        setPartidasRecentes(partidas);
      } catch (err) {
        console.error('Erro ao carregar partidas:', err);
        setErrorPartidas('Erro ao carregar partidas');
      } finally {
        setLoadingPartidas(false);
      }
    };
    fetchPartidas();
  }, []);
  return (
    <div className="container mx-auto p-4 md:p-8 flex flex-col min-h-screen">
      <h1 className="text-4xl md:text-5xl font-bold my-8 text-center md:text-left text-gray-200">FTV Scout</h1>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
        <div className="flex flex-col items-center justify-center gap-6">
          <Link to="/nova-partida"
            className="w-full max-w-sm text-center bg-[#00A3FF] hover:bg-[#0082cc] font-bold uppercase text-white transition-all duration-200 text-2xl px-12 py-6 rounded-xl shadow-lg shadow-blue-500/20 hover:-translate-y-0.5"
          >
            + NOVA PARTIDA
          </Link>

          <Link to="/dashboard"
            className="w-full max-w-sm text-center bg-gray-700 hover:bg-gray-600 font-bold uppercase text-white transition-all duration-200 text-2xl px-12 py-6 rounded-xl shadow-lg hover:-translate-y-0.5"
          >
            Análise de Partidas
          </Link>
        </div>

        <div className="hidden md:flex flex-col">
          <h2 className="text-2xl font-semibold mb-4 text-gray-300">Partidas Recentes</h2>
          <div className="space-y-4 overflow-y-auto pr-2">
            {loadingPartidas ? (
              <div className="text-gray-400">Carregando...</div>
            ) : errorPartidas ? (
              <div className="text-red-400">{errorPartidas}</div>
            ) : partidasRecentes.length === 0 ? (
              <div className="text-gray-400">Nenhuma partida encontrada</div>
            ) : (
              partidasRecentes.map((partida) => (
                <Link
                  key={partida.partida_id}
                  to={`/analise/${partida.partida_id}`}
                  className="bg-[#1E1E1E] p-4 rounded-lg cursor-pointer hover:bg-[#2a2a2a] transition-colors block"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-bold text-lg">{partida.nome_partida || `Partida #${partida.partida_id}`}</h3>
                      <p className="text-gray-400">{(partida.nome_duplas || partida.duplas_vs || '')}</p>
                    </div>
                    {partida.placar_final_dupla_a !== null && partida.placar_final_dupla_b !== null && (
                      <span className="text-sm font-semibold text-gray-300 bg-gray-700 px-2 py-1 rounded ml-3">
                        {partida.placar_final_dupla_a} x {partida.placar_final_dupla_b}
                      </span>
                    )}
                  </div>
                  <p className="text-right text-sm text-gray-500 mt-2">{partida.data_partida ? new Date(partida.data_partida).toLocaleDateString() : ''}</p>
                </Link>
              ))
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
