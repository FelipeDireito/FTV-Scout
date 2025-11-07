import React from 'react';

const ResumoPartida = ({
  nomeDuplaA,
  nomeDuplaB,
  estatisticasDuplaA,
  estatisticasDuplaB
}) => {
  if (!estatisticasDuplaA || !estatisticasDuplaB) {
    return (
      <div className="bg-[#1E1E1E] rounded-xl p-6 border-2 border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4 text-center">
          Resumo da Partida
        </h3>
        <div className="text-center text-gray-400 py-4">Carregando estatísticas...</div>
      </div>
    );
  }

  const totalDuplaA = (estatisticasDuplaA.ataque_pontos || 0) +
    (estatisticasDuplaA.saque_aces || 0) +
    (estatisticasDuplaA.bloqueio_pontos || 0);

  const totalDuplaB = (estatisticasDuplaB.ataque_pontos || 0) +
    (estatisticasDuplaB.saque_aces || 0) +
    (estatisticasDuplaB.bloqueio_pontos || 0);

  const LinhaComparacao = ({ label, valorA, valorB, destaque = false }) => {
    const maxValor = Math.max(valorA, valorB);
    const percentualA = maxValor > 0 ? (valorA / maxValor) * 100 : 0;
    const percentualB = maxValor > 0 ? (valorB / maxValor) * 100 : 0;
    const empate = valorA === valorB;

    const getCorNumeroA = () => {
      if (destaque) return 'text-[#FFA500]';
      if (valorA > valorB) return 'text-[#00A3FF]';
      if (empate) return 'text-[#00A3FF]';
      return 'text-gray-100';
    };

    const getCorNumeroB = () => {
      if (destaque) return 'text-[#FFA500]';
      if (valorB > valorA) return 'text-[#00A3FF]';
      if (empate) return 'text-[#00A3FF]';
      return 'text-gray-100';
    };

    const getCorBarraA = () => {
      if (destaque) return 'bg-gradient-to-l from-[#FFA500] to-[#FF8C00]';
      if (valorA > valorB || empate) return 'bg-gradient-to-l from-[#00A3FF] to-[#0082cc]';
      return 'bg-gray-400';
    };

    const getCorBarraB = () => {
      if (destaque) return 'bg-gradient-to-r from-[#FFA500] to-[#FF8C00]';
      if (valorB > valorA || empate) return 'bg-gradient-to-r from-[#00A3FF] to-[#0082cc]';
      return 'bg-gray-400';
    };

    return (
      <div className="py-4 border-b border-gray-700 last:border-b-0">
        <div className="flex items-center justify-between mb-3">
          <div className={`text-right w-20 ${destaque ? 'text-2xl md:text-3xl font-black' : 'text-xl md:text-2xl font-bold'} ${getCorNumeroA()}`}>
            {valorA}
          </div>
          <div className={`flex-1 text-center ${destaque ? 'text-lg md:text-xl font-black text-[#FFA500] uppercase' : 'text-base md:text-lg font-bold text-white uppercase'}`}>
            {label}
          </div>
          <div className={`text-left w-20 ${destaque ? 'text-2xl md:text-3xl font-black' : 'text-xl md:text-2xl font-bold'} ${getCorNumeroB()}`}>
            {valorB}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-3 md:h-4 bg-gray-700 rounded-full overflow-hidden flex justify-end">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getCorBarraA()}`}
              style={{ width: `${percentualA}%` }}
            />
          </div>

          <div className="flex-1 h-3 md:h-4 bg-gray-700 rounded-full overflow-hidden flex justify-start">
            <div
              className={`h-full rounded-full transition-all duration-500 ${getCorBarraB()}`}
              style={{ width: `${percentualB}%` }}
            />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-[#1E1E1E] rounded-xl border-2 border-gray-700 overflow-hidden">
      <div className="bg-gradient-to-r from-[#2a2a2a] via-[#1E1E1E] to-[#2a2a2a] p-6 border-b-2 border-gray-700">
        <div className="flex items-center justify-between">
          <div className="flex-1 text-center">
            <h3 className="text-xl md:text-2xl font-black text-white">
              {nomeDuplaA}
            </h3>
          </div>

          <div className="flex-1 text-center">
            <h2 className="text-lg md:text-xl font-bold text-[#FFA500] uppercase tracking-wider">
              Pontos Totais
            </h2>
          </div>

          <div className="flex-1 text-center">
            <h3 className="text-xl md:text-2xl font-black text-white">
              {nomeDuplaB}
            </h3>
          </div>
        </div>
      </div>

      <div className="p-6 md:p-8">
        <LinhaComparacao
          label="Ataque"
          valorA={estatisticasDuplaA.ataque_pontos || 0}
          valorB={estatisticasDuplaB.ataque_pontos || 0}
        />

        <LinhaComparacao
          label="ACE"
          valorA={estatisticasDuplaA.saque_aces || 0}
          valorB={estatisticasDuplaB.saque_aces || 0}
        />

        <LinhaComparacao
          label="Bloqueio"
          valorA={estatisticasDuplaA.bloqueio_pontos || 0}
          valorB={estatisticasDuplaB.bloqueio_pontos || 0}
        />

        <LinhaComparacao
          label="Erros Adversário"
          valorA={estatisticasDuplaB.total_erros || 0}
          valorB={estatisticasDuplaA.total_erros || 0}
        />

        <LinhaComparacao
          label="Total"
          valorA={totalDuplaA + estatisticasDuplaB.total_erros}
          valorB={totalDuplaB + estatisticasDuplaA.total_erros}
          destaque={true}
        />
      </div>
    </div>
  );
};

export default ResumoPartida;
