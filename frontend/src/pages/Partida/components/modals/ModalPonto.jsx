import { MOTIVOS_PONTO } from '../../../../constants/jogo';

const ModalPonto = ({ timeVencedor, onClose, onFinalizar }) => {
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
            {MOTIVOS_PONTO.map(motivo => (
              <button
                key={motivo.id}
                onClick={() => onFinalizar(motivo.id)}
                className="py-3 px-4 rounded-lg text-base font-medium transition-all bg-gray-700 text-gray-300 hover:bg-gray-600"
              >
                {motivo.descricao}
              </button>
            ))}
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
