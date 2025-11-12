import { useState } from 'react';

const QuadraMapaCalorPosicoes = ({ dadosMapa }) => {
  const [posicaoSelecionada, setPosicaoSelecionada] = useState(null);
  console.log(dadosMapa)

  if (!dadosMapa || !dadosMapa.posicoes) {
    return (
      <div className="w-full h-96 bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl flex items-center justify-center border-2 border-gray-700">
        <p className="text-gray-400 text-lg">Selecione um atleta e tipo de ação</p>
      </div>
    );
  }

  const { lado_quadra, lado_destino, posicoes, tipo_acao_nome, tipo_acao_id } = dadosMapa;

  const ladoComAcoes = tipo_acao_id === 1 || tipo_acao_id === 5 ? lado_destino : lado_quadra;

  const mapaPosicoesStats = {};
  posicoes.forEach(pos => {
    mapaPosicoesStats[pos.posicao] = pos;
  });

  const maxAcoes = Math.max(...posicoes.map(p => p.total_acoes), 1);

  const getCorMapaCalor = (totalAcoes) => {
    const intensidade = Math.min(totalAcoes / maxAcoes, 1);

    const opacity = Math.max(0.92, intensidade);

    if (intensidade <= 0.33) {
      return `rgba(234, 179, 8, ${opacity})`;
    } else if (intensidade <= 0.66) {
      return `rgba(249, 115, 22, ${opacity})`;
    } else {
      return `rgba(239, 68, 68, ${opacity})`;
    }
  };

  const renderZona = (numeroZona, lado, nomeStatus) => {
    const stats = mapaPosicoesStats[numeroZona];
    const ladoCorreto = lado === ladoComAcoes;
    const temDados = stats && stats.total_acoes > 0 && ladoCorreto;
    const isSelecionada = posicaoSelecionada?.posicao === numeroZona && posicaoSelecionada?.lado === lado;

    let cor;
    if (temDados) {
      cor = getCorMapaCalor(stats.total_acoes);
    } else if (ladoCorreto) {
      cor = 'rgba(234, 179, 8, 0.15)';
    } else {
      cor = 'rgba(55, 65, 81, 0.2)';
    }

    return (
      <div
        key={`${lado}-${numeroZona}`}
        className={`relative flex flex-col items-center justify-center transition-all duration-300 ${temDados ? 'cursor-pointer' : 'cursor-default'
          }
          ${isSelecionada ? 'ring-4 ring-[#00A3FF] scale-105 z-10' : ''}
          ${temDados ? 'hover:scale-105 hover:shadow-2xl' : ''}
        `}
        style={{
          backgroundColor: cor,
          minHeight: '100px',
        }}
        onClick={() => temDados && setPosicaoSelecionada(isSelecionada ? null : { ...stats, lado })}
      >
        {/* Número da posição */}
        <div className={`font-bold text-3xl md:text-4xl drop-shadow-lg ${temDados ? 'text-white' : ladoCorreto ? 'text-gray-400' : 'text-gray-500'}`}>
          {numeroZona}
        </div>

        {/* Estatísticas básicas */}
        {temDados && (
          <div className="mt-2 text-center space-y-1">
            <div className="text-white text-sm md:text-base font-bold drop-shadow-lg">
              {stats.total_acoes} ações
            </div>
            {/* Indicador de eficiência */}
            <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${stats.eficiencia >= 50 ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
              stats.eficiencia >= 20 ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
                stats.eficiencia >= 0 ? 'bg-orange-500/20 text-orange-300 border border-orange-500/30' :
                  'bg-red-500/20 text-red-300 border border-red-500/30'
              }`}>
              {nomeStatus} {stats.eficiencia.toFixed(0)}%
            </div>
          </div>
        )}
      </div>
    );
  };

  const layoutQuadraLadoA = [5, 4, 6, 3, 1, 2];
  const layoutQuadraLadoB = [2, 1, 3, 6, 4, 5];

  const acoesAproveitamento = [2, 7];
  const isAproveitamento = acoesAproveitamento.includes(tipo_acao_id);
  const nomeStatus = isAproveitamento ? "aprv." : "efic.";
  const nomeStatusExtenso = isAproveitamento ? "Aproveitamento" : "Eficiência";

  return (
    <div className="w-full space-y-6">
      {/* Cabeçalho com informações do atleta */}
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-black text-white">
          {dadosMapa.nome} - {tipo_acao_nome}
        </h2>
        <div className="flex flex-wrap justify-center gap-6 md:gap-8">
          <div className="flex flex-col items-center">
            <span className="text-gray-400 text-sm md:text-base mb-1">Total de Ações</span>
            <span className="text-3xl md:text-4xl font-bold text-[#00A3FF]">{dadosMapa.total_acoes}</span>
          </div>
          {!isAproveitamento && (
            <div className="flex flex-col items-center">
              <span className="text-gray-400 text-sm md:text-base mb-1">Pontos</span>
              <span className="text-3xl md:text-4xl font-bold text-green-400">
                {dadosMapa.total_pontos}
              </span>
            </div>
          )}
          <div className="flex flex-col items-center">
            <span className="text-gray-400 text-sm md:text-base mb-1">Erros</span>
            <span className="text-3xl md:text-4xl font-bold text-red-400">{dadosMapa.total_erros}</span>
          </div>
        </div>
      </div>
      <div className="bg-blue-900/30 border-l-4 border-blue-400 rounded-r-lg px-4 py-3 mb-6 shadow-md">
        <div className="flex items-start">
          <svg className="h-5 w-5 text-blue-400 mt-0.5 mr-2 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
          <div>
            <p className="text-blue-50 text-sm leading-tight">
              Clique em qualquer quadrante para ver estatísticas detalhadas da posição. 
            </p>
          </div>
        </div>
      </div>

      {/* Quadra de Vôlei - Duas Quadras */}
      <div className="relative">
        <div className="w-full bg-gradient-to-br from-gray-900 to-black rounded-2xl p-4 md:p-8 shadow-2xl border-2 border-gray-800 overflow-hidden">

          {/* Grid da quadra completa */}
          <div className="flex flex-row gap-4 md:gap-6 min-h-[400px] md:min-h-[500px]">

            {/* Lado A */}
            <div className="flex-1 flex flex-col">
              {/* Título Lado A */}
              <div className="text-center mb-3 md:mb-4">
                <div className={`inline-block px-4 md:px-6 py-2 md:py-3 rounded-lg border-2 ${ladoComAcoes === 'A' ? 'bg-[#00A3FF]/20 border-[#00A3FF]' : 'bg-[#1E1E1E] border-gray-600'
                  }`}>
                  <span className="text-white font-bold text-base md:text-xl">
                    Lado A {lado_quadra === 'A'}
                  </span>
                </div>
              </div>

              {/* Grid 2x3 - Lado A */}
              <div className="flex-1 grid grid-cols-2 grid-rows-3 gap-0">
                {layoutQuadraLadoA.map(zona => renderZona(zona, 'A', nomeStatus))}
              </div>
            </div>

            {/* Rede Central */}
            <div className="relative flex flex-col items-center justify-center">
              <div className="w-1 md:w-2 h-full bg-gradient-to-b from-gray-500 via-white to-gray-500 rounded-full shadow-xl relative">
                <div className="absolute inset-0 bg-white/20 rounded-full"></div>
              </div>
              <div className="absolute top-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap">
                <span className="text-white font-bold text-xs md:text-sm bg-gray-800 px-3 py-1 rounded-full border border-gray-500">
                  REDE
                </span>
              </div>
            </div>

            {/* Lado B */}
            <div className="flex-1 flex flex-col">
              {/* Título Lado B */}
              <div className="text-center mb-3 md:mb-4">
                <div className={`inline-block px-4 md:px-6 py-2 md:py-3 rounded-lg border-2 ${ladoComAcoes === 'B' ? 'bg-[#00A3FF]/20 border-[#00A3FF]' : 'bg-[#1E1E1E] border-gray-600'
                  }`}>
                  <span className="text-white font-bold text-base md:text-xl">
                    Lado B {lado_quadra === 'B'}
                  </span>
                </div>
              </div>

              {/* Grid 2x3 - Lado B (espelhado) */}
              <div className="flex-1 grid grid-cols-2 grid-rows-3 gap-0">
                {layoutQuadraLadoB.map(zona => renderZona(zona, 'B', nomeStatus))}
              </div>

            </div>
          </div>
          <div className="mt-2 text-xs text-yellow-400 text-center">
            <svg className="inline-block w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            Apenas ações com posição registrada são consideradas.
          </div>
        </div>
      </div>

      {/* Legenda do Mapa de Calor */}
      <div className="flex justify-center">
        <div className="inline-flex items-center gap-6 bg-[#1E1E1E] rounded-xl px-6 py-4 border-2 border-gray-700">
          <span className="text-sm md:text-base text-gray-400 font-semibold">Intensidade:</span>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded" style={{ backgroundColor: 'rgba(234, 179, 8, 0.8)' }}></div>
            <span className="text-sm md:text-base text-gray-300">Baixa</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded" style={{ backgroundColor: 'rgba(249, 115, 22, 0.8)' }}></div>
            <span className="text-sm md:text-base text-gray-300">Média</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded" style={{ backgroundColor: 'rgba(239, 68, 68, 0.8)' }}></div>
            <span className="text-sm md:text-base text-gray-300">Alta</span>
          </div>
        </div>
      </div>



      {/* Detalhes da posição selecionada */}
      {posicaoSelecionada && (
        <div className="bg-gradient-to-br from-[#1E1E1E] to-[#2a2a2a] rounded-xl p-6 border-2 border-[#00A3FF] shadow-xl animate-fadeIn">
          <div className="flex justify-between items-start mb-4">
            <h4 className="text-xl md:text-2xl font-bold text-white">
              Posição {posicaoSelecionada.posicao} - Detalhes
            </h4>
            <button
              onClick={() => setPosicaoSelecionada(null)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="bg-[#2a2a2a] rounded-lg p-4 text-center">
              <div className="text-gray-400 text-sm mb-2">Total de Ações</div>
              <div className="text-3xl font-bold text-white">{posicaoSelecionada.total_acoes}</div>
            </div>

            <div className="bg-[#2a2a2a] rounded-lg p-4 text-center">
              <div className="text-gray-400 text-sm mb-2">Pontos</div>
              <div className="text-3xl font-bold text-green-400">{posicaoSelecionada.pontos}</div>
              <div className="text-xs text-gray-400 mt-1">{posicaoSelecionada.taxa_ponto.toFixed(1)}%</div>
            </div>

            <div className="bg-[#2a2a2a] rounded-lg p-4 text-center">
              <div className="text-gray-400 text-sm mb-2">Erros</div>
              <div className="text-3xl font-bold text-red-400">{posicaoSelecionada.erros}</div>
              <div className="text-xs text-gray-400 mt-1">{posicaoSelecionada.taxa_erro.toFixed(1)}%</div>
            </div>

            <div className="bg-[#2a2a2a] rounded-lg p-4 text-center">
              <div className="text-gray-400 text-sm mb-2">{nomeStatusExtenso}</div>
              <div className={`text-3xl font-bold ${posicaoSelecionada.eficiencia >= 50 ? 'text-green-400' :
                posicaoSelecionada.eficiencia >= 20 ? 'text-yellow-400' :
                  posicaoSelecionada.eficiencia >= 0 ? 'text-orange-400' :
                    'text-red-400'
                }`}>
                {posicaoSelecionada.eficiencia.toFixed(1)}%
              </div>
            </div>
          </div>

          {/* Ações neutras */}
          {posicaoSelecionada.acoes_neutras > 0 && (
            <div className="mt-4 bg-[#2a2a2a] rounded-lg p-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Ações Neutras (sem ponto/erro direto):</span>
                <span className="text-white font-bold text-lg">{posicaoSelecionada.acoes_neutras}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default QuadraMapaCalorPosicoes;
