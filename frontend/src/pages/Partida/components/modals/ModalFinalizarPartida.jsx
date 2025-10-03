import { MOTIVOS_PONTO } from '../../../../constants/jogo';

const ModalFinalizarPartida = ({ score, pontos, partida, onClose, onFinalizar }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2 sm:p-4 lg:p-8">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md sm:max-w-lg lg:max-w-xl flex flex-col max-h-[90vh]">
        <div className="flex-shrink-0 p-4 sm:p-5 lg:p-6 border-b border-gray-700/60">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-white">Finalizar Partida?</h2>
        </div>

        <div className="flex-grow overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-4">
          <div className="text-center bg-gray-900 p-3 sm:p-4 rounded-lg">
            <p className="text-base sm:text-lg text-gray-400">Placar Final</p>
            <div>
              <span className="text-5xl sm:text-6xl lg:text-7xl font-black text-blue-400 tracking-tighter">{score.a}</span>
              <span className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-500 mx-2 sm:mx-4">-</span>
              <span className="text-5xl sm:text-6xl lg:text-7xl font-black text-red-400 tracking-tighter">{score.b}</span>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-2 sm:p-3 hidden sm:block">
            <h3 className="text-sm sm:text-base font-semibold text-gray-300 mb-2 text-center">Resumo dos Pontos</h3>
            <div className="overflow-y-auto max-h-24 sm:max-h-32 lg:max-h-48 pr-2 text-xs sm:text-sm">
              {pontos && pontos.length > 0 ? (
                <table className="w-full text-left">
                  <thead className="text-xs uppercase text-gray-400 border-b border-gray-700">
                    <tr>
                      <th className="py-1 px-2">Ponto</th>
                      <th className="py-1 px-2">Dupla</th>
                      <th className="py-1 px-2">Motivo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pontos.map((ponto, index) => (
                      <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50">
                        <td className="py-1 px-2">{ponto.numero_ponto_partida || index + 1}</td>
                        <td className="py-1 px-2">
                          {ponto.dupla_vencedora_id ? (
                            <span className={ponto.dupla_vencedora_id === partida.dupla_a_id ? "text-blue-400" : "text-red-400"}>
                              {ponto.dupla_vencedora_id === partida.dupla_a_id ? "A" : "B"}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-1 px-2">{MOTIVOS_PONTO.find(m => m.id === ponto.motivo_ponto_id)?.descricao}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center text-gray-500 py-4">Nenhum ponto registrado ainda.</p>
              )}
            </div>
          </div>

          {/* Para telas pequenas */}
          <div className="bg-gray-900/50 rounded-lg p-3 sm:hidden">
            <p className="text-center text-gray-300 py-2 text-sm">
              {pontos && pontos.length > 0
                ? `${pontos.length} ${pontos.length === 1 ? 'ponto registrado' : 'pontos registrados'}`
                : "Nenhum ponto registrado ainda"}
            </p>
          </div>

          <p className="text-center text-sm sm:text-base text-gray-300 !mt-5">
            Ao confirmar, a partida será encerrada.
          </p>
        </div>

        <div className="flex-shrink-0 p-4 sm:p-5 lg:p-6 border-t border-gray-700/60">
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <button onClick={onClose} className="btn-secondary px-6 py-2 sm:px-8 sm:py-3 text-base lg:text-lg lg:px-10">
              Cancelar
            </button>
            <button onClick={onFinalizar} className="btn-primary bg-green-600 hover:bg-green-700 px-6 py-2 sm:px-8 sm:py-3 text-base lg:text-lg lg:px-10">
              Confirmar e Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalFinalizarPartida;
