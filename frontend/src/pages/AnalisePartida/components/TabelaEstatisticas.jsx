import React, { useState } from 'react';

const TabelaEstatisticas = ({
  titulo,
  atletas,
  formatarPercentual
}) => {
  const [filtroAtivo, setFiltroAtivo] = useState('GERAL');

  if (!atletas || atletas.length === 0) {
    return (
      <div className="bg-[#1E1E1E] rounded-xl p-6 border-2 border-gray-700">
        <h3 className="text-xl font-bold text-white mb-4 text-center">
          {titulo}
        </h3>
        <div className="text-center text-gray-400 py-4">Sem estatísticas disponíveis</div>
      </div>
    );
  }

  const tabs = [
    { id: 'GERAL', label: 'GERAL' },
    { id: 'ATAQUE', label: 'ATAQUE' },
    { id: 'SAQUE', label: 'SAQUE' },
    { id: 'RECEPCAO', label: 'RECEPÇÃO' },
    { id: 'DEFESA', label: 'DEFESA' }
  ];

  // Função para renderizar as colunas baseadas no filtro ativo
  const renderColunas = () => {
    switch (filtroAtivo) {
      case 'GERAL':
        return (
          <>
            <th className="px-4 md:px-6 py-4 text-center text-sm md:text-base font-bold text-gray-300 uppercase tracking-wider">Pontos</th>
            <th className="px-4 md:px-6 py-4 text-center text-sm md:text-base font-bold text-gray-300 uppercase tracking-wider">Ataque</th>
            <th className="px-4 md:px-6 py-4 text-center text-sm md:text-base font-bold text-gray-300 uppercase tracking-wider">Saque</th>
            <th className="px-4 md:px-6 py-4 text-center text-sm md:text-base font-bold text-gray-300 uppercase tracking-wider">Erros</th>
            <th className="px-4 md:px-6 py-4 text-center text-sm md:text-base font-bold text-gray-300 uppercase tracking-wider">Aproveitamento %</th>
          </>
        );
      case 'ATAQUE':
        return (
          <>
            <th className="px-4 md:px-6 py-4 text-center text-sm md:text-base font-bold text-gray-300 uppercase tracking-wider">Tentativas</th>
            <th className="px-4 md:px-6 py-4 text-center text-sm md:text-base font-bold text-gray-300 uppercase tracking-wider">Pontos</th>
            <th className="px-4 md:px-6 py-4 text-center text-sm md:text-base font-bold text-gray-300 uppercase tracking-wider">Erros</th>
            <th className="px-4 md:px-6 py-4 text-center text-sm md:text-base font-bold text-gray-300 uppercase tracking-wider">Aproveitamento %</th>
            <th className="px-4 md:px-6 py-4 text-center text-sm md:text-base font-bold text-gray-300 uppercase tracking-wider">Eficiência %</th>
          </>
        );
      case 'SAQUE':
        return (
          <>
            <th className="px-4 md:px-6 py-4 text-center text-sm md:text-base font-bold text-gray-300 uppercase tracking-wider">Tentativas</th>
            <th className="px-4 md:px-6 py-4 text-center text-sm md:text-base font-bold text-gray-300 uppercase tracking-wider">Aces</th>
            <th className="px-4 md:px-6 py-4 text-center text-sm md:text-base font-bold text-gray-300 uppercase tracking-wider">Erros</th>
            <th className="px-4 md:px-6 py-4 text-center text-sm md:text-base font-bold text-gray-300 uppercase tracking-wider">Aproveitamento %</th>
          </>
        );
      case 'RECEPCAO':
        return (
          <>
            <th className="px-4 md:px-6 py-4 text-center text-sm md:text-base font-bold text-gray-300 uppercase tracking-wider">Tentativas</th>
            <th className="px-4 md:px-6 py-4 text-center text-sm md:text-base font-bold text-gray-300 uppercase tracking-wider">Erros</th>
            <th className="px-4 md:px-6 py-4 text-center text-sm md:text-base font-bold text-gray-300 uppercase tracking-wider">Aproveitamento %</th>
          </>
        );
      case 'DEFESA':
        return (
          <>
            <th className="px-4 md:px-6 py-4 text-center text-sm md:text-base font-bold text-gray-300 uppercase tracking-wider">Tentativas</th>
            <th className="px-4 md:px-6 py-4 text-center text-sm md:text-base font-bold text-gray-300 uppercase tracking-wider">Erros</th>
            <th className="px-4 md:px-6 py-4 text-center text-sm md:text-base font-bold text-gray-300 uppercase tracking-wider">Aproveitamento %</th>
          </>
        );
      default:
        return null;
    }
  };

  // Função para renderizar os valores das células baseadas no filtro ativo
  const renderValores = (estatisticas) => {
    const totalABS = (estatisticas.ataque_pontos || 0) + (estatisticas.saque_aces || 0);
    
    switch (filtroAtivo) {
      case 'GERAL':
        return (
          <>
            <td className="px-4 md:px-6 py-5 whitespace-nowrap text-center text-lg md:text-2xl text-gray-100 font-bold">{totalABS}</td>
            <td className="px-4 md:px-6 py-5 whitespace-nowrap text-center text-lg md:text-2xl text-blue-400 font-bold">{estatisticas.ataque_pontos || 0}</td>
            <td className="px-4 md:px-6 py-5 whitespace-nowrap text-center text-lg md:text-2xl text-blue-400 font-bold">{estatisticas.saque_aces || 0}</td>
            <td className="px-4 md:px-6 py-5 whitespace-nowrap text-center text-lg md:text-2xl text-red-400 font-bold">{estatisticas.total_erros || 0}</td>
            <td className="px-4 md:px-6 py-5 whitespace-nowrap text-center text-lg md:text-2xl text-green-400 font-bold">
              {formatarPercentual(
                totalABS > 0 
                  ? ((estatisticas.ataque_pontos || 0) + (estatisticas.saque_aces || 0) - (estatisticas.total_erros || 0)) / totalABS * 100 
                  : 0
              )}
            </td>
          </>
        );
      case 'ATAQUE':
        return (
          <>
            <td className="px-4 md:px-6 py-5 whitespace-nowrap text-center text-lg md:text-2xl text-gray-100 font-bold">{estatisticas.ataque_tentativas || 0}</td>
            <td className="px-4 md:px-6 py-5 whitespace-nowrap text-center text-lg md:text-2xl text-blue-400 font-bold">{estatisticas.ataque_pontos || 0}</td>
            <td className="px-4 md:px-6 py-5 whitespace-nowrap text-center text-lg md:text-2xl text-red-400 font-bold">{estatisticas.ataque_erros || 0}</td>
            <td className="px-4 md:px-6 py-5 whitespace-nowrap text-center text-lg md:text-2xl text-gray-100 font-bold">{formatarPercentual(estatisticas.ataque_aproveitamento)}</td>
            <td className="px-4 md:px-6 py-5 whitespace-nowrap text-center text-lg md:text-2xl text-green-400 font-bold">{formatarPercentual(estatisticas.ataque_eficiencia)}</td>
          </>
        );
      case 'SAQUE':
        return (
          <>
            <td className="px-4 md:px-6 py-5 whitespace-nowrap text-center text-lg md:text-2xl text-gray-100 font-bold">{estatisticas.saque_tentativas || 0}</td>
            <td className="px-4 md:px-6 py-5 whitespace-nowrap text-center text-lg md:text-2xl text-blue-400 font-bold">{estatisticas.saque_aces || 0}</td>
            <td className="px-4 md:px-6 py-5 whitespace-nowrap text-center text-lg md:text-2xl text-red-400 font-bold">{estatisticas.saque_erros || 0}</td>
            <td className="px-4 md:px-6 py-5 whitespace-nowrap text-center text-lg md:text-2xl text-gray-100 font-bold">{formatarPercentual(estatisticas.saque_aproveitamento)}</td>
          </>
        );
      case 'RECEPCAO':
        return (
          <>
            <td className="px-4 md:px-6 py-5 whitespace-nowrap text-center text-lg md:text-2xl text-gray-100 font-bold">{estatisticas.recepcao_tentativas || 0}</td>
            <td className="px-4 md:px-6 py-5 whitespace-nowrap text-center text-lg md:text-2xl text-red-400 font-bold">{estatisticas.recepcao_erros || 0}</td>
            <td className="px-4 md:px-6 py-5 whitespace-nowrap text-center text-lg md:text-2xl text-gray-100 font-bold">{formatarPercentual(estatisticas.recepcao_aproveitamento)}</td>
          </>
        );
      case 'DEFESA':
        return (
          <>
            <td className="px-4 md:px-6 py-5 whitespace-nowrap text-center text-lg md:text-2xl text-gray-100 font-bold">{estatisticas.defesa_tentativas || 0}</td>
            <td className="px-4 md:px-6 py-5 whitespace-nowrap text-center text-lg md:text-2xl text-red-400 font-bold">{estatisticas.defesa_erros || 0}</td>
            <td className="px-4 md:px-6 py-5 whitespace-nowrap text-center text-lg md:text-2xl text-gray-100 font-bold">{formatarPercentual(estatisticas.defesa_aproveitamento)}</td>
          </>
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-[#1E1E1E] rounded-xl border-2 border-gray-700 overflow-hidden">
      {/* Tabs de Filtro */}
      <div className="border-b border-gray-700">
        <div className="flex overflow-x-auto justify-center">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFiltroAtivo(tab.id)}
              className={`
                px-6 md:px-8 py-4 md:py-5 text-sm md:text-base font-bold whitespace-nowrap transition-colors
                ${filtroAtivo === tab.id
                  ? 'text-[#FFA500] border-b-3 border-[#FFA500] bg-[#2a2a2a]'
                  : 'text-gray-300 hover:text-white hover:bg-[#252525]'
                }
              `}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Tabela de Estatísticas */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-700">
          <thead className="bg-[#252525]">
            <tr>
              <th className="px-4 md:px-6 py-4 text-left text-sm md:text-base font-bold text-gray-300 uppercase tracking-wider">
                {titulo}
              </th>
              {renderColunas()}
            </tr>
          </thead>
          <tbody className="bg-[#1E1E1E] divide-y divide-gray-700">
            {atletas.map((atleta, index) => (
              <tr key={atleta.id || index} className="hover:bg-[#252525] transition-colors">
                <td className="px-4 md:px-6 py-5 whitespace-nowrap text-base md:text-lg font-bold text-white">
                  {atleta.nome}
                </td>
                {renderValores(atleta)}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default TabelaEstatisticas;
