import { useState } from 'react';

/**
 * Componente de Mapa de Calor para visualizar fluxos origem→destino na quadra
 */
function MapaCalor({ dados, tipo = 'ataque' }) {
  const [posicaoSelecionada, setPosicaoSelecionada] = useState(null);

  if (!dados || !dados.fluxos || dados.fluxos.length === 0) {
    return (
      <div className="bg-[#2a2a2a] border-2 border-dashed border-gray-700 rounded-xl p-12 text-center">
        <p className="text-lg text-gray-400">Sem dados de mapa de calor disponíveis</p>
      </div>
    );
  }

  // Agrupar fluxos por destino para calcular totais
  const fluxosPorDestino = {};
  const fluxosPorOrigem = {};
  
  dados.fluxos.forEach(fluxo => {
    // Por destino
    if (!fluxosPorDestino[fluxo.posicao_destino]) {
      fluxosPorDestino[fluxo.posicao_destino] = {
        total_acoes: 0,
        pontos: 0,
        erros: 0,
        eficiencia: 0
      };
    }
    fluxosPorDestino[fluxo.posicao_destino].total_acoes += fluxo.total_acoes;
    fluxosPorDestino[fluxo.posicao_destino].pontos += fluxo.pontos;
    fluxosPorDestino[fluxo.posicao_destino].erros += fluxo.erros;

    // Por origem
    if (fluxo.posicao_origem > 0) {
      if (!fluxosPorOrigem[fluxo.posicao_origem]) {
        fluxosPorOrigem[fluxo.posicao_origem] = {
          total_acoes: 0
        };
      }
      fluxosPorOrigem[fluxo.posicao_origem].total_acoes += fluxo.total_acoes;
    }
  });

  // Calcular eficiência por destino
  Object.keys(fluxosPorDestino).forEach(pos => {
    const data = fluxosPorDestino[pos];
    data.eficiencia = data.total_acoes > 0 
      ? ((data.pontos - data.erros) / data.total_acoes) * 100 
      : 0;
  });

  // Função para obter cor baseada na eficiência
  const getCorPorEficiencia = (eficiencia) => {
    if (eficiencia >= 60) return 'bg-green-500/80';
    if (eficiencia >= 40) return 'bg-yellow-500/80';
    if (eficiencia >= 20) return 'bg-orange-500/80';
    return 'bg-red-500/80';
  };

  // Função para obter intensidade baseada no total de ações
  const getIntensidade = (totalAcoes, maxAcoes) => {
    const percentual = (totalAcoes / maxAcoes) * 100;
    if (percentual >= 75) return 'opacity-100';
    if (percentual >= 50) return 'opacity-75';
    if (percentual >= 25) return 'opacity-50';
    return 'opacity-30';
  };

  const maxAcoesDestino = Math.max(...Object.values(fluxosPorDestino).map(d => d.total_acoes), 1);
  const maxAcoesOrigem = Math.max(...Object.values(fluxosPorOrigem).map(d => d.total_acoes), 1);

  // Renderizar posição da quadra
  const renderPosicao = (numero, tipo = 'destino') => {
    const dados = tipo === 'destino' ? fluxosPorDestino[numero] : fluxosPorOrigem[numero];
    
    if (!dados) {
      return (
        <div className="bg-gray-800/30 rounded-lg p-3 md:p-4 text-center border-2 border-gray-700/50">
          <div className="text-xl md:text-2xl font-bold text-gray-600">{numero}</div>
          <div className="text-xs text-gray-600 mt-1">0 ações</div>
        </div>
      );
    }

    const maxAcoes = tipo === 'destino' ? maxAcoesDestino : maxAcoesOrigem;
    const intensidade = getIntensidade(dados.total_acoes, maxAcoes);
    const cor = tipo === 'destino' ? getCorPorEficiencia(dados.eficiencia) : 'bg-blue-500/80';

    return (
      <div
        className={`${cor} ${intensidade} rounded-lg p-3 md:p-4 text-center border-2 border-white/20 cursor-pointer hover:scale-105 transition-transform duration-200 hover:border-white/50`}
        onClick={() => setPosicaoSelecionada({ numero, tipo, dados })}
      >
        <div className="text-xl md:text-2xl font-bold text-white">{numero}</div>
        <div className="text-xs md:text-sm text-white/90 mt-1">{dados.total_acoes}x</div>
        {tipo === 'destino' && (
          <div className="text-xs text-white/80 mt-0.5">{dados.eficiencia.toFixed(0)}%</div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Legenda */}
      <div className="bg-[#2a2a2a] rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">Legenda:</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-gray-300">Alta (&gt;60%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-gray-300">Média (40-60%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span className="text-gray-300">Baixa (20-40%)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-gray-300">Crítica (&lt;20%)</span>
          </div>
        </div>
      </div>

      {/* Quadras */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quadra Adversária (Destino) */}
        <div className="bg-[#1E1E1E] rounded-xl p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-bold text-white mb-4 text-center">
            🎯 Quadra Adversária (Destino)
          </h3>
          <div className="grid grid-cols-3 gap-2 md:gap-3 mb-2">
            {[1, 2, 3].map(num => renderPosicao(num, 'destino'))}
          </div>
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            {[4, 5, 6].map(num => renderPosicao(num, 'destino'))}
          </div>
          <div className="mt-3 text-center">
            <div className="inline-block bg-gray-800 px-4 py-1 rounded-full">
              <span className="text-xs text-gray-400">═══ REDE ═══</span>
            </div>
          </div>
        </div>

        {/* Quadra Aliada (Origem) */}
        <div className="bg-[#1E1E1E] rounded-xl p-4 md:p-6">
          <h3 className="text-lg md:text-xl font-bold text-white mb-4 text-center">
            🏐 Quadra Aliada (Origem)
          </h3>
          <div className="mt-3 text-center mb-2">
            <div className="inline-block bg-gray-800 px-4 py-1 rounded-full">
              <span className="text-xs text-gray-400">═══ REDE ═══</span>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 md:gap-3 mb-2">
            {[1, 2, 3].map(num => renderPosicao(num, 'origem'))}
          </div>
          <div className="grid grid-cols-3 gap-2 md:gap-3">
            {[4, 5, 6].map(num => renderPosicao(num, 'origem'))}
          </div>
        </div>
      </div>

      {/* Detalhes da Posição Selecionada */}
      {posicaoSelecionada && (
        <div className="bg-[#1E1E1E] rounded-xl p-6 border-2 border-[#00A3FF]">
          <div className="flex justify-between items-start mb-4">
            <h3 className="text-xl font-bold text-white">
              {posicaoSelecionada.tipo === 'destino' ? '🎯' : '🏐'} Posição {posicaoSelecionada.numero}
              {posicaoSelecionada.tipo === 'destino' ? ' (Destino)' : ' (Origem)'}
            </h3>
            <button
              onClick={() => setPosicaoSelecionada(null)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-[#2a2a2a] rounded-lg p-4">
              <p className="text-sm text-gray-400 mb-1">Total de Ações</p>
              <p className="text-2xl font-bold text-white">{posicaoSelecionada.dados.total_acoes}</p>
            </div>
            {posicaoSelecionada.tipo === 'destino' && (
              <>
                <div className="bg-[#2a2a2a] rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">Pontos</p>
                  <p className="text-2xl font-bold text-green-500">{posicaoSelecionada.dados.pontos}</p>
                </div>
                <div className="bg-[#2a2a2a] rounded-lg p-4">
                  <p className="text-sm text-gray-400 mb-1">Erros</p>
                  <p className="text-2xl font-bold text-red-500">{posicaoSelecionada.dados.erros}</p>
                </div>
                <div className="bg-blue-900/30 rounded-lg p-4 border-l-4 border-[#00A3FF]">
                  <p className="text-sm text-gray-400 mb-1">Eficiência</p>
                  <p className="text-2xl font-bold text-white">{posicaoSelecionada.dados.eficiencia.toFixed(1)}%</p>
                </div>
              </>
            )}
          </div>

          {/* Fluxos detalhados para esta posição */}
          {posicaoSelecionada.tipo === 'destino' && (
            <div className="mt-6">
              <h4 className="text-lg font-semibold text-white mb-3">Fluxos para esta posição:</h4>
              <div className="space-y-2">
                {dados.fluxos
                  .filter(f => f.posicao_destino === posicaoSelecionada.numero)
                  .sort((a, b) => b.total_acoes - a.total_acoes)
                  .map((fluxo, idx) => (
                    <div key={idx} className="bg-[#2a2a2a] rounded-lg p-3 flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <span className="text-blue-400 font-semibold">
                          {fluxo.posicao_origem > 0 ? `Pos ${fluxo.posicao_origem}` : 'Sem origem'}
                        </span>
                        <span className="text-gray-500">→</span>
                        <span className="text-[#00A3FF] font-semibold">Pos {fluxo.posicao_destino}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <span className="text-gray-400">{fluxo.total_acoes}x</span>
                        <span className="text-green-500">{fluxo.pontos}pts</span>
                        <span className="text-red-500">{fluxo.erros}err</span>
                        <span className="text-white font-semibold">{fluxo.eficiencia.toFixed(1)}%</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Insights */}
      <div className="bg-[#1E1E1E] rounded-xl p-6">
        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
          <span>💡</span>
          Insights
        </h3>
        <div className="space-y-3">
          {(() => {
            const melhorDestino = Object.entries(fluxosPorDestino)
              .sort((a, b) => b[1].eficiencia - a[1].eficiencia)[0];
            const piorDestino = Object.entries(fluxosPorDestino)
              .sort((a, b) => a[1].eficiencia - b[1].eficiencia)[0];
            const maisUsadoDestino = Object.entries(fluxosPorDestino)
              .sort((a, b) => b[1].total_acoes - a[1].total_acoes)[0];

            return (
              <>
                {melhorDestino && (
                  <div className="flex items-start gap-3 text-sm">
                    <span className="text-green-500">✓</span>
                    <p className="text-gray-300">
                      <span className="font-semibold text-white">Melhor posição:</span> Posição {melhorDestino[0]} 
                      ({melhorDestino[1].eficiencia.toFixed(1)}% de eficiência, {melhorDestino[1].total_acoes} ações)
                    </p>
                  </div>
                )}
                {piorDestino && (
                  <div className="flex items-start gap-3 text-sm">
                    <span className="text-red-500">✗</span>
                    <p className="text-gray-300">
                      <span className="font-semibold text-white">Evitar:</span> Posição {piorDestino[0]} 
                      ({piorDestino[1].eficiencia.toFixed(1)}% de eficiência, {piorDestino[1].total_acoes} ações)
                    </p>
                  </div>
                )}
                {maisUsadoDestino && (
                  <div className="flex items-start gap-3 text-sm">
                    <span className="text-blue-500">ℹ</span>
                    <p className="text-gray-300">
                      <span className="font-semibold text-white">Zona mais atacada:</span> Posição {maisUsadoDestino[0]} 
                      ({maisUsadoDestino[1].total_acoes} ações, {((maisUsadoDestino[1].total_acoes / dados.total_acoes) * 100).toFixed(1)}% do total)
                    </p>
                  </div>
                )}
              </>
            );
          })()}
        </div>
      </div>
    </div>
  );
}

export default MapaCalor;
