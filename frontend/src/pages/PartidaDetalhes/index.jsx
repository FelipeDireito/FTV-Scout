import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MapaCalorUnificado from '../../components/MapaCalorUnificado';
import { getPartidaById } from '../../services/partidas';
import { 
  getEstatisticasCompletasDupla,
  getEstatisticasAtleta
} from '../../services/estatisticas';

function PartidaDetalhes() {
  const { id } = useParams();
  const navigate = useNavigate();
  const mapaCalorRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [partida, setPartida] = useState(null);
  const [duplaA, setDuplaA] = useState(null);
  const [duplaB, setDuplaB] = useState(null);
  const [atletasA, setAtletasA] = useState([]);
  const [atletasB, setAtletasB] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadPartidaData();
  }, [id]);

  const loadPartidaData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Buscar dados da partida
      const partidaData = await getPartidaById(id);
      setPartida(partidaData);

      // Buscar estatísticas completas de cada dupla para esta partida específica
      const [statsA, statsB] = await Promise.all([
        getEstatisticasCompletasDupla(partidaData.dupla_a_id, id),
        getEstatisticasCompletasDupla(partidaData.dupla_b_id, id)
      ]);

      setDuplaA(statsA);
      setDuplaB(statsB);

      // Buscar estatísticas individuais de cada atleta
      if (statsA?.atletas_ids) {
        const atletasStatsA = await Promise.all(
          statsA.atletas_ids.map(atletaId => getEstatisticasAtleta(atletaId, id))
        );
        setAtletasA(atletasStatsA);
      }

      if (statsB?.atletas_ids) {
        const atletasStatsB = await Promise.all(
          statsB.atletas_ids.map(atletaId => getEstatisticasAtleta(atletaId, id))
        );
        setAtletasB(atletasStatsB);
      }

    } catch (err) {
      console.error('Erro ao carregar dados da partida:', err);
      setError('Erro ao carregar dados da partida');
    } finally {
      setLoading(false);
    }
  };

  const scrollToMapaCalor = () => {
    mapaCalorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  if (loading) {
    return (
      <div className="container mx-auto p-4 md:p-8 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#00A3FF] mx-auto mb-4"></div>
          <p className="text-gray-400 text-lg">Carregando dados da partida...</p>
        </div>
      </div>
    );
  }

  if (error || !partida) {
    return (
      <div className="container mx-auto p-4 md:p-8 min-h-screen">
        <div className="bg-red-900/20 border border-red-500 rounded-xl p-6 text-center">
          <p className="text-red-400 text-lg">{error || 'Partida não encontrada'}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="mt-4 px-6 py-2 bg-[#00A3FF] text-white rounded-lg hover:bg-[#0082cc] transition-colors"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  const vencedorId = partida.dupla_vencedora_id;
  const duplaAVenceu = vencedorId === partida.dupla_a_id;
  const duplaBVenceu = vencedorId === partida.dupla_b_id;

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen">
      {/* Header */}
      <header className="mb-8">
        <button 
          onClick={() => navigate('/dashboard')}
          className="text-[#00A3FF] hover:text-[#0082cc] font-medium mb-4 inline-flex items-center gap-2 transition-colors duration-200"
        >
          ← Voltar ao Dashboard
        </button>
        <h1 className="text-4xl md:text-5xl font-bold text-gray-200 mb-2">
          {partida.nome_partida}
        </h1>
        <p className="text-lg text-gray-400">
          {new Date(partida.data_hora).toLocaleDateString('pt-BR', {
            day: '2-digit',
            month: 'long',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}
        </p>
      </header>

      {/* Placar Minimalista */}
      <section className="mb-8">
        <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-lg">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {/* Dupla A */}
            <div className="flex-1 text-center">
              <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                {duplaA?.nome_dupla || 'Dupla A'}
              </h3>
              <p className="text-xs md:text-sm text-gray-400 mb-2">
                {duplaA?.atletas?.join(' & ') || ''}
              </p>
              <div className={`text-4xl md:text-5xl font-bold ${duplaAVenceu ? 'text-green-400' : 'text-[#00A3FF]'}`}>
                {partida.placar_final_dupla_a ?? '-'}
              </div>
            </div>

            {/* VS */}
            <div className="px-4 md:px-8">
              <div className="text-2xl md:text-3xl font-bold text-gray-500">×</div>
            </div>

            {/* Dupla B */}
            <div className="flex-1 text-center">
              <h3 className="text-lg md:text-xl font-bold text-white mb-1">
                {duplaB?.nome_dupla || 'Dupla B'}
              </h3>
              <p className="text-xs md:text-sm text-gray-400 mb-2">
                {duplaB?.atletas?.join(' & ') || ''}
              </p>
              <div className={`text-4xl md:text-5xl font-bold ${duplaBVenceu ? 'text-green-400' : 'text-[#00A3FF]'}`}>
                {partida.placar_final_dupla_b ?? '-'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparação de Desempenho - Por Atleta */}
      <section className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl font-bold text-white">📊 Desempenho Individual</h2>
          <button
            onClick={scrollToMapaCalor}
            className="px-4 py-2 bg-[#00A3FF] hover:bg-[#0082cc] text-white font-medium rounded-lg transition-colors duration-200 flex items-center gap-2"
          >
            <span>🎯</span>
            <span className="hidden md:inline">Ver Mapas de Calor</span>
            <span className="md:hidden">Mapas</span>
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Dupla A - Atletas */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#00A3FF] mb-4">
              {duplaA?.nome_dupla || 'Dupla A'}
              {duplaAVenceu && <span className="ml-2 text-yellow-400">🏆</span>}
            </h3>
            {atletasA.map((atleta, index) => (
              <AtletaStatsCard key={index} atleta={atleta} />
            ))}
          </div>

          {/* Dupla B - Atletas */}
          <div className="space-y-4">
            <h3 className="text-xl font-bold text-[#00A3FF] mb-4">
              {duplaB?.nome_dupla || 'Dupla B'}
              {duplaBVenceu && <span className="ml-2 text-yellow-400">🏆</span>}
            </h3>
            {atletasB.map((atleta, index) => (
              <AtletaStatsCard key={index} atleta={atleta} />
            ))}
          </div>
        </div>
      </section>

      {/* Análise Tática - Mapa de Calor Unificado */}
      <section ref={mapaCalorRef} className="mb-8 scroll-mt-8">
        <MapaCalorUnificado 
          duplaA={duplaA} 
          duplaB={duplaB} 
          partidaId={id} 
        />
      </section>
    </div>
  );
}

// Componente auxiliar para exibir estatísticas de um atleta
function AtletaStatsCard({ atleta }) {
  if (!atleta) return null;

  return (
    <div className="bg-[#1E1E1E] rounded-xl p-5 shadow-lg">
      <h4 className="text-lg font-bold text-white mb-4">{atleta.nome_atleta}</h4>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-[#2a2a2a] rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-[#00A3FF]">{atleta.total_pontos ?? 0}</div>
          <div className="text-xs text-gray-400 mt-1">Pontos</div>
        </div>
        
        <div className="bg-[#2a2a2a] rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-400">{atleta.total_aces ?? 0}</div>
          <div className="text-xs text-gray-400 mt-1">Aces</div>
        </div>
        
        <div className="bg-[#2a2a2a] rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-yellow-400">{atleta.total_pontos_ataque ?? 0}</div>
          <div className="text-xs text-gray-400 mt-1">Ataques</div>
        </div>
        
        <div className="bg-[#2a2a2a] rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-red-400">{atleta.total_erros ?? 0}</div>
          <div className="text-xs text-gray-400 mt-1">Erros</div>
        </div>
      </div>
    </div>
  );
}

export default PartidaDetalhes;
