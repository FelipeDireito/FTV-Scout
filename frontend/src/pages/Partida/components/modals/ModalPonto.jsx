import { MOTIVOS_PONTO, TIPO_ACAO_ID } from '../../../../constants/jogo';

const ModalPonto = ({ timeVencedor, onClose, onFinalizar, acoesRally, duplas }) => {

  const getTimeAtleta = (atletaId) => {
    if (duplas.a1.atleta_id === atletaId || duplas.a2.atleta_id === atletaId) return 'A';
    if (duplas.b1.atleta_id === atletaId || duplas.b2.atleta_id === atletaId) return 'B';
    return null;
  };

  const getMotivoValido = (motivoId) => {
    if (!acoesRally || acoesRally.length === 0) return true;

    const ultimaAcao = acoesRally[acoesRally.length - 1];
    const tipoUltimaAcao = ultimaAcao.tipo_acao_id;

    const timeUltimaAcao = getTimeAtleta(ultimaAcao.atleta_id);
    const pontoParaEquipeAtual = timeUltimaAcao === timeVencedor;

    if (tipoUltimaAcao === TIPO_ACAO_ID.SAQUE) {
      if (pontoParaEquipeAtual) {
        return motivoId === 5; // Ace
      } else {
        return motivoId === 1 || motivoId === 2; // Erros
      }
    }

    if (tipoUltimaAcao === TIPO_ACAO_ID.ATAQUE) {
      if (pontoParaEquipeAtual) {
        return motivoId === 3; // Ponto de ataque
      } else {
        return motivoId === 1 || motivoId === 2; // Erros
      }
    }

    if (pontoParaEquipeAtual) {
      return motivoId === 3 || motivoId === 4; // Ponto de ataque
    } else {
      return motivoId === 1 || motivoId === 2; // Erros
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh]">
        <div className="flex-shrink-0 p-4 sm:p-5 border-b border-gray-700/60">
          <h3 className={`text-xl sm:text-2xl font-bold text-center ${timeVencedor === 'A' ? 'text-blue-400' : 'text-red-400'}`}>
            Ponto para a Dupla {timeVencedor}
          </h3>
        </div>

        <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-4">
          <p className="text-center text-gray-300">Selecione o motivo do ponto:</p>
          <div className="grid grid-cols-1 gap-3">
            {MOTIVOS_PONTO.map(motivo => {
              const isValido = getMotivoValido(motivo.id);
              return (
                <button
                  key={motivo.id}
                  onClick={() => isValido && onFinalizar(motivo.id)}
                  disabled={!isValido}
                  className={`py-3 px-4 rounded-lg text-base font-medium transition-all ${isValido
                      ? 'bg-gray-700 text-gray-300 hover:bg-gray-600 cursor-pointer'
                      : 'bg-gray-800 text-gray-600 cursor-not-allowed opacity-50'
                    }`}
                >
                  {motivo.descricao}
                </button>
              );
            })}
          </div>
        </div>

        <div className="flex-shrink-0 p-4 sm:p-5 border-t border-gray-700/60">
          <button onClick={onClose} className="btn-secondary w-full py-2 sm:py-3">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalPonto;
