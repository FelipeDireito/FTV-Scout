import { useState, useEffect } from 'react';
import { getMapaCalorAtleta } from '../services/estatisticas';
import MapaCalorQuadra from './MapaCalorQuadra';

/**
 * Componente unificado de mapa de calor com seletores
 * Permite selecionar dupla, atleta e tipo de ação
 */
function MapaCalorUnificado({ duplaA, duplaB, partidaId }) {
  const [loading, setLoading] = useState(false);
  const [mapaCalor, setMapaCalor] = useState(null);
  
  // Estados de seleção
  const [duplaSelected, setDuplaSelected] = useState('A');
  const [atletaSelected, setAtletaSelected] = useState(null);
  const [tipoAcaoSelected, setTipoAcaoSelected] = useState(2); // 2 = Ataque por padrão
  const [visualizacaoTipo, setVisualizacaoTipo] = useState('dupla'); // 'dupla' ou 'atleta'

  // Inicializar seleção de atleta quando dupla mudar
  useEffect(() => {
    const dupla = duplaSelected === 'A' ? duplaA : duplaB;
    if (dupla?.atletas_ids && dupla.atletas_ids.length > 0) {
      setAtletaSelected(dupla.atletas_ids[0]);
    }
  }, [duplaSelected, duplaA, duplaB]);

  // Carregar mapa de calor quando seleção mudar
  useEffect(() => {
    if (atletaSelected && tipoAcaoSelected) {
      loadMapaCalor();
    }
  }, [atletaSelected, tipoAcaoSelected, visualizacaoTipo]);

  const loadMapaCalor = async () => {
    try {
      setLoading(true);
      
      if (visualizacaoTipo === 'dupla') {
        // Carregar mapas de ambos os atletas da dupla e combinar
        const dupla = duplaSelected === 'A' ? duplaA : duplaB;
        if (dupla?.atletas_ids && dupla.atletas_ids.length > 0) {
          const mapas = await Promise.all(
            dupla.atletas_ids.map(id => getMapaCalorAtleta(id, tipoAcaoSelected, partidaId))
          );
          
          // Combinar fluxos dos dois atletas
          const fluxosCombinados = combinarFluxos(mapas);
          setMapaCalor({
            nome: dupla.nome_dupla,
            tipo_acao_nome: getTipoAcaoNome(tipoAcaoSelected),
            total_acoes: fluxosCombinados.reduce((sum, f) => sum + f.total_acoes, 0),
            fluxos: fluxosCombinados
          });
        }
      } else {
        // Carregar mapa de um atleta específico
        const mapa = await getMapaCalorAtleta(atletaSelected, tipoAcaoSelected, partidaId);
        setMapaCalor(mapa);
      }
    } catch (error) {
      console.error('Erro ao carregar mapa de calor:', error);
      setMapaCalor(null);
    } finally {
      setLoading(false);
    }
  };

  // Combinar fluxos de múltiplos mapas
  const combinarFluxos = (mapas) => {
    const fluxosMap = {};
    
    mapas.forEach(mapa => {
      if (mapa?.fluxos) {
        mapa.fluxos.forEach(fluxo => {
          const key = `${fluxo.posicao_origem}-${fluxo.posicao_destino}`;
          if (fluxosMap[key]) {
            // Somar valores
            fluxosMap[key].total_acoes += fluxo.total_acoes;
            fluxosMap[key].pontos += fluxo.pontos;
            fluxosMap[key].erros += fluxo.erros;
            // Recalcular eficiência
            fluxosMap[key].eficiencia = 
              ((fluxosMap[key].pontos - fluxosMap[key].erros) / fluxosMap[key].total_acoes) * 100;
          } else {
            fluxosMap[key] = { ...fluxo };
          }
        });
      }
    });
    
    return Object.values(fluxosMap);
  };

  const getTipoAcaoNome = (id) => {
    const tipos = {
      1: 'Saque',
      2: 'Ataque',
      3: 'Recepção/Defesa'
    };
    return tipos[id] || 'Ação';
  };

  const getTipoAcaoIcon = (id) => {
    const icons = {
      1: '⚡',
      2: '💥',
      3: '🛡️'
    };
    return icons[id] || '🎯';
  };

  const duplaAtual = duplaSelected === 'A' ? duplaA : duplaB;

  return (
    <div className="space-y-6">
      {/* Seletores */}
      <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-bold text-white mb-6">🎯 Configurar Visualização</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Seletor de Dupla */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Time
            </label>
            <select
              value={duplaSelected}
              onChange={(e) => setDuplaSelected(e.target.value)}
              className="w-full px-4 py-2 bg-[#2a2a2a] text-white rounded-lg border-2 border-gray-700 focus:border-[#00A3FF] focus:outline-none transition-colors"
            >
              <option value="A">{duplaA?.nome_dupla || 'Dupla A'}</option>
              <option value="B">{duplaB?.nome_dupla || 'Dupla B'}</option>
            </select>
          </div>

          {/* Seletor de Tipo de Visualização */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Visualizar
            </label>
            <select
              value={visualizacaoTipo}
              onChange={(e) => setVisualizacaoTipo(e.target.value)}
              className="w-full px-4 py-2 bg-[#2a2a2a] text-white rounded-lg border-2 border-gray-700 focus:border-[#00A3FF] focus:outline-none transition-colors"
            >
              <option value="dupla">Dupla Completa</option>
              <option value="atleta">Atleta Individual</option>
            </select>
          </div>

          {/* Seletor de Atleta (apenas se visualização for individual) */}
          {visualizacaoTipo === 'atleta' && (
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Atleta
              </label>
              <select
                value={atletaSelected || ''}
                onChange={(e) => setAtletaSelected(Number(e.target.value))}
                className="w-full px-4 py-2 bg-[#2a2a2a] text-white rounded-lg border-2 border-gray-700 focus:border-[#00A3FF] focus:outline-none transition-colors"
              >
                {duplaAtual?.atletas_ids?.map((id, index) => (
                  <option key={id} value={id}>
                    {duplaAtual.atletas[index]}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Seletor de Tipo de Ação */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Tipo de Ação
            </label>
            <select
              value={tipoAcaoSelected}
              onChange={(e) => setTipoAcaoSelected(Number(e.target.value))}
              className="w-full px-4 py-2 bg-[#2a2a2a] text-white rounded-lg border-2 border-gray-700 focus:border-[#00A3FF] focus:outline-none transition-colors"
            >
              <option value={2}>💥 Ataque</option>
              <option value={1}>⚡ Saque</option>
              <option value={3}>🛡️ Defesa</option>
            </select>
          </div>
        </div>

        {/* Resumo da Seleção */}
        <div className="mt-4 p-4 bg-[#2a2a2a] rounded-lg border-l-4 border-[#00A3FF]">
          <p className="text-sm text-gray-300">
            <span className="font-semibold text-white">Visualizando:</span>{' '}
            {getTipoAcaoIcon(tipoAcaoSelected)}{' '}
            <span className="text-[#00A3FF] font-medium">
              {getTipoAcaoNome(tipoAcaoSelected)}
            </span>
            {' de '}
            <span className="text-[#00A3FF] font-medium">
              {visualizacaoTipo === 'dupla' 
                ? duplaAtual?.nome_dupla 
                : duplaAtual?.atletas[duplaAtual?.atletas_ids?.indexOf(atletaSelected)]
              }
            </span>
            {partidaId && (
              <span className="text-gray-400"> (nesta partida)</span>
            )}
          </p>
        </div>
      </div>

      {/* Mapa de Calor */}
      <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-lg">
        <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
          <span>🗺️</span>
          Mapa de Calor
        </h3>
        
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-4">
            <div className="w-12 h-12 border-4 border-gray-700 border-t-[#00A3FF] rounded-full animate-spin"></div>
            <p className="text-gray-400">Carregando mapa de calor...</p>
          </div>
        ) : (
          <MapaCalorQuadra data={mapaCalor} ladoAtual={duplaSelected} />
        )}
      </div>
    </div>
  );
}

export default MapaCalorUnificado;
