import { useState, useEffect } from 'react';

const MapaCalorQuadra = ({ data, ladoAtual = 'A' }) => {
  const [selectedFluxo, setSelectedFluxo] = useState(null);
  const [fluxoDestacado, setFluxoDestacado] = useState(null);

  if (!data || !data.fluxos || data.fluxos.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-400">Sem dados de mapa de calor para exibir</p>
      </div>
    );
  }

  // Calcular intensidade para cores
  const maxAcoes = Math.max(...data.fluxos.map(f => f.total_acoes), 1);
  
  // Agrupar fluxos por posição de origem e destino
  const fluxosPorPosicao = {};
  data.fluxos.forEach(fluxo => {
    const key = `${fluxo.posicao_origem}-${fluxo.posicao_destino}`;
    fluxosPorPosicao[key] = fluxo;
  });

  // Função para obter cor baseada na eficiência
  const getCorEficiencia = (eficiencia) => {
    if (eficiencia >= 50) return 'bg-green-500';
    if (eficiencia >= 25) return 'bg-yellow-500';
    if (eficiencia >= 0) return 'bg-orange-500';
    return 'bg-red-500';
  };

  // Função para obter intensidade baseada no total de ações
  const getIntensidade = (totalAcoes) => {
    const ratio = totalAcoes / maxAcoes;
    if (ratio >= 0.7) return 'opacity-90';
    if (ratio >= 0.4) return 'opacity-60';
    if (ratio >= 0.2) return 'opacity-40';
    return 'opacity-20';
  };

  // Determinar se zona é origem ou destino no fluxo destacado
  const getZonaRole = (numeroZona, lado) => {
    if (!fluxoDestacado) return null;
    
    // Lado A = esquerda, Lado B = direita
    const isLadoOrigem = (ladoAtual === 'A' && lado === 'A') || (ladoAtual === 'B' && lado === 'B');
    const isLadoDestino = (ladoAtual === 'A' && lado === 'B') || (ladoAtual === 'B' && lado === 'A');
    
    if (isLadoOrigem && numeroZona === fluxoDestacado.posicao_origem) return 'origem';
    if (isLadoDestino && numeroZona === fluxoDestacado.posicao_destino) return 'destino';
    return null;
  };

  // Calcular path da seta SVG entre origem e destino
  const calcularPathSeta = () => {
    if (!fluxoDestacado) return '';
    
    try {
      // Determinar qual lado é origem e qual é destino
      const ladoOrigem = ladoAtual === 'A' ? 'A' : 'B';
      const ladoDestino = ladoAtual === 'A' ? 'B' : 'A';
      
      const elemOrigem = document.getElementById(`zona-${ladoOrigem}-${fluxoDestacado.posicao_origem}`);
      const elemDestino = document.getElementById(`zona-${ladoDestino}-${fluxoDestacado.posicao_destino}`);
      
      if (!elemOrigem || !elemDestino) return '';
      
      const rectOrigem = elemOrigem.getBoundingClientRect();
      const rectDestino = elemDestino.getBoundingClientRect();
      const container = elemOrigem.closest('.bg-yellow-600\\/80');
      if (!container) return '';
      const containerRect = container.getBoundingClientRect();
      
      // Calcular posições relativas ao container
      const x1 = rectOrigem.left + rectOrigem.width / 2 - containerRect.left;
      const y1 = rectOrigem.top + rectOrigem.height / 2 - containerRect.top;
      const x2 = rectDestino.left + rectDestino.width / 2 - containerRect.left;
      const y2 = rectDestino.top + rectDestino.height / 2 - containerRect.top;
      
      // Criar curva suave
      const midX = (x1 + x2) / 2;
      const curveOffset = 30;
      
      return `M ${x1} ${y1} Q ${midX} ${y1 - curveOffset}, ${x2} ${y2}`;
    } catch (error) {
      console.error('Erro ao calcular path da seta:', error);
      return '';
    }
  };

  // Renderizar zona da quadra
  const renderZona = (numeroZona, lado) => {
    // Encontrar todos os fluxos que envolvem esta zona
    const fluxosOrigem = data.fluxos.filter(f => f.posicao_origem === numeroZona);
    const fluxosDestino = data.fluxos.filter(f => f.posicao_destino === numeroZona);
    
    const totalAcoesOrigem = fluxosOrigem.reduce((sum, f) => sum + f.total_acoes, 0);
    const totalAcoesDestino = fluxosDestino.reduce((sum, f) => sum + f.total_acoes, 0);
    const totalAcoes = totalAcoesOrigem + totalAcoesDestino;

    // Calcular eficiência média da zona
    let eficienciaMedia = 0;
    if (fluxosOrigem.length > 0 || fluxosDestino.length > 0) {
      const somaEficiencia = [...fluxosOrigem, ...fluxosDestino].reduce((sum, f) => sum + f.eficiencia, 0);
      eficienciaMedia = somaEficiencia / (fluxosOrigem.length + fluxosDestino.length);
    }

    const temDados = totalAcoes > 0;
    const corBase = temDados ? getCorEficiencia(eficienciaMedia) : 'bg-gray-700';
    const intensidade = temDados ? getIntensidade(totalAcoes) : 'opacity-30';
    
    // Verificar se esta zona está no fluxo destacado
    const zonaRole = getZonaRole(numeroZona, lado);
    const isDestacada = zonaRole !== null;
    const isOutraZona = fluxoDestacado && !isDestacada;

    return (
      <div
        key={`${lado}-${numeroZona}`}
        id={`zona-${lado}-${numeroZona}`}
        className={`relative flex flex-col items-center justify-center transition-all duration-300 border rounded-sm ${corBase} ${intensidade} hover:scale-105 hover:z-10 cursor-pointer
          ${isDestacada ? 'z-20 scale-110' : ''}
          ${isOutraZona ? 'opacity-30' : ''}
          ${zonaRole === 'origem' ? 'border-4 border-blue-400 shadow-lg shadow-blue-400/50 animate-pulse' : ''}
          ${zonaRole === 'destino' ? 'border-4 border-green-400 shadow-lg shadow-green-400/50 animate-pulse' : ''}
          ${!isDestacada && !isOutraZona ? 'border-white/40' : ''}
        `}
        onClick={() => setSelectedFluxo({ zona: numeroZona, lado, fluxosOrigem, fluxosDestino })}
      >
        {/* Badge de Origem/Destino */}
        {zonaRole === 'origem' && (
          <div className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
            🎯
          </div>
        )}
        {zonaRole === 'destino' && (
          <div className="absolute -top-2 -right-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
            📍
          </div>
        )}
        
        <div className="text-white font-bold text-xl md:text-2xl drop-shadow-lg">
          {numeroZona}
        </div>
        {temDados && (
          <div className="text-white text-xs font-semibold mt-1 drop-shadow">
            {totalAcoes}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-4">
      {/* Legenda */}
      <div className="bg-[#2a2a2a] rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">📊 Legenda</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded"></div>
            <span className="text-gray-300">Eficiência ≥ 50%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded"></div>
            <span className="text-gray-300">Eficiência 25-49%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-orange-500 rounded"></div>
            <span className="text-gray-300">Eficiência 0-24%</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded"></div>
            <span className="text-gray-300">Eficiência &lt; 0%</span>
          </div>
        </div>
        <p className="text-xs text-gray-400 mt-2">
          * Intensidade da cor indica volume de ações. Clique nas zonas para ver detalhes.
        </p>
      </div>

      {/* Quadra Espelhada */}
      <div className="bg-yellow-600/80 rounded-xl p-3 md:p-4 relative shadow-lg overflow-visible">
        {/* Linha da Rede */}
        <div className="absolute left-1/2 top-0 h-full w-1 bg-white/80 z-10 -translate-x-1/2 shadow-lg"></div>
        
        {/* SVG Overlay para Setas */}
        {fluxoDestacado && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-30" style={{ overflow: 'visible' }}>
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="10"
                refX="9"
                refY="3"
                orient="auto"
              >
                <polygon points="0 0, 10 3, 0 6" fill="#00A3FF" />
              </marker>
            </defs>
            <path
              d={calcularPathSeta()}
              stroke="#00A3FF"
              strokeWidth={Math.max(3, Math.min(8, fluxoDestacado.total_acoes / 3))}
              fill="none"
              markerEnd="url(#arrowhead)"
              className="animate-dash"
              strokeDasharray="10,5"
            />
          </svg>
        )}
        
        <div className="flex flex-row gap-2">
          {/* Lado Esquerdo (Time A) */}
          <div className="flex-1 relative">
            <div className="text-center mb-2">
              <span className="text-white font-bold text-sm md:text-base drop-shadow-lg">
                {ladoAtual === 'A' ? 'Time A (Origem)' : 'Time B (Destino)'}
              </span>
            </div>
            <div className="grid grid-cols-2 grid-rows-3 gap-1 md:gap-2 aspect-[2/3]">
              {[5, 4, 6, 3, 1, 2].map(zona => renderZona(zona, 'A'))}
            </div>
          </div>

          {/* Rede Central */}
          <div className="w-2 bg-gray-800 relative z-0 rounded"></div>

          {/* Lado Direito (Time B) - Espelhado */}
          <div className="flex-1 relative">
            <div className="text-center mb-2">
              <span className="text-white font-bold text-sm md:text-base drop-shadow-lg">
                {ladoAtual === 'A' ? 'Time B (Destino)' : 'Time A (Origem)'}
              </span>
            </div>
            <div className="grid grid-cols-2 grid-rows-3 gap-1 md:gap-2 aspect-[2/3]">
              {[2, 1, 3, 6, 4, 5].map(zona => renderZona(zona, 'B'))}
            </div>
          </div>
        </div>
      </div>

      {/* Lista de Fluxos Clicáveis */}
      {data.fluxos.length > 0 && (
        <div className="bg-[#2a2a2a] rounded-lg p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-semibold text-gray-300">
              🎯 Fluxos de Ações (clique para destacar)
            </h4>
            {fluxoDestacado && (
              <button
                onClick={() => setFluxoDestacado(null)}
                className="text-xs px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/30 rounded transition-colors"
              >
                Limpar Destaque
              </button>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
            {data.fluxos
              .sort((a, b) => b.total_acoes - a.total_acoes)
              .map((fluxo, idx) => (
                <button
                  key={idx}
                  onClick={() => setFluxoDestacado(fluxo)}
                  className={`text-left p-3 rounded-lg transition-all duration-200 ${
                    fluxoDestacado === fluxo
                      ? 'bg-[#00A3FF]/20 border-2 border-[#00A3FF]'
                      : 'bg-[#1E1E1E] border-2 border-transparent hover:border-gray-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-white font-medium text-sm">
                      {fluxo.posicao_origem} → {fluxo.posicao_destino}
                    </span>
                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                      fluxo.eficiencia >= 50 ? 'bg-green-500' :
                      fluxo.eficiencia >= 25 ? 'bg-yellow-500' :
                      fluxo.eficiencia >= 0 ? 'bg-orange-500' : 'bg-red-500'
                    } text-white`}>
                      {fluxo.eficiencia.toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex gap-3 text-xs text-gray-400">
                    <span>{fluxo.total_acoes} ações</span>
                    <span className="text-green-400">{fluxo.pontos} pts</span>
                    <span className="text-red-400">{fluxo.erros} err</span>
                  </div>
                </button>
              ))}
          </div>
        </div>
      )}

      {/* Detalhes do Fluxo Selecionado */}
      {selectedFluxo && (
        <div className="bg-[#2a2a2a] rounded-lg p-4 border-2 border-[#00A3FF]">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-lg font-bold text-white">
              📍 Zona {selectedFluxo.zona} - {selectedFluxo.lado === 'A' ? 'Time A' : 'Time B'}
            </h4>
            <button
              onClick={() => setSelectedFluxo(null)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Fluxos de Origem */}
          {selectedFluxo.fluxosOrigem.length > 0 && (
            <div className="mb-4">
              <h5 className="text-sm font-semibold text-[#00A3FF] mb-2">
                🎯 Saindo desta zona:
              </h5>
              <div className="space-y-2">
                {selectedFluxo.fluxosOrigem.map((fluxo, idx) => (
                  <div key={idx} className="bg-[#1E1E1E] rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">
                        Zona {fluxo.posicao_origem} → Zona {fluxo.posicao_destino}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        fluxo.eficiencia >= 50 ? 'bg-green-500' :
                        fluxo.eficiencia >= 25 ? 'bg-yellow-500' :
                        fluxo.eficiencia >= 0 ? 'bg-orange-500' : 'bg-red-500'
                      } text-white`}>
                        {fluxo.eficiencia.toFixed(1)}%
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-gray-400">Ações:</span>
                        <span className="text-white font-bold ml-1">{fluxo.total_acoes}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Pontos:</span>
                        <span className="text-green-400 font-bold ml-1">{fluxo.pontos}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Erros:</span>
                        <span className="text-red-400 font-bold ml-1">{fluxo.erros}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Fluxos de Destino */}
          {selectedFluxo.fluxosDestino.length > 0 && (
            <div>
              <h5 className="text-sm font-semibold text-[#00A3FF] mb-2">
                📥 Chegando nesta zona:
              </h5>
              <div className="space-y-2">
                {selectedFluxo.fluxosDestino.map((fluxo, idx) => (
                  <div key={idx} className="bg-[#1E1E1E] rounded p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-white font-medium">
                        Zona {fluxo.posicao_origem} → Zona {fluxo.posicao_destino}
                      </span>
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        fluxo.eficiencia >= 50 ? 'bg-green-500' :
                        fluxo.eficiencia >= 25 ? 'bg-yellow-500' :
                        fluxo.eficiencia >= 0 ? 'bg-orange-500' : 'bg-red-500'
                      } text-white`}>
                        {fluxo.eficiencia.toFixed(1)}%
                      </span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-gray-400">Ações:</span>
                        <span className="text-white font-bold ml-1">{fluxo.total_acoes}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Pontos:</span>
                        <span className="text-green-400 font-bold ml-1">{fluxo.pontos}</span>
                      </div>
                      <div>
                        <span className="text-gray-400">Erros:</span>
                        <span className="text-red-400 font-bold ml-1">{fluxo.erros}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedFluxo.fluxosOrigem.length === 0 && selectedFluxo.fluxosDestino.length === 0 && (
            <p className="text-gray-400 text-center py-4">
              Nenhum fluxo registrado para esta zona
            </p>
          )}
        </div>
      )}

      {/* Resumo Geral */}
      <div className="bg-[#2a2a2a] rounded-lg p-4">
        <h4 className="text-sm font-semibold text-gray-300 mb-3">📈 Resumo Geral</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#00A3FF]">{data.total_acoes}</div>
            <div className="text-xs text-gray-400">Total de Ações</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">
              {data.fluxos.reduce((sum, f) => sum + f.pontos, 0)}
            </div>
            <div className="text-xs text-gray-400">Pontos</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">
              {data.fluxos.reduce((sum, f) => sum + f.erros, 0)}
            </div>
            <div className="text-xs text-gray-400">Erros</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {data.fluxos.length}
            </div>
            <div className="text-xs text-gray-400">Fluxos Diferentes</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapaCalorQuadra;
