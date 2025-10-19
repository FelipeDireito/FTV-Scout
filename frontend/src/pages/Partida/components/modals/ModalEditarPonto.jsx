import { useState } from 'react';
import { MOTIVOS_PONTO } from '../../../../constants/jogo';

const ModalEditarPonto = ({ ponto, onClose, onSave }) => {
  const [motivoPontoId, setMotivoPontoId] = useState(ponto?.motivo_ponto_id || '');

  if (!ponto) return null;

  const handleSave = () => {
    if (motivoPontoId !== ponto.motivo_ponto_id) {
      onSave(ponto.ponto_id, motivoPontoId);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh]">
        <div className="flex-shrink-0 p-4 sm:p-5 border-b border-gray-700/60">
          <h3 className="text-xl sm:text-2xl font-bold text-center text-yellow-400">
            Editar Motivo do Ponto
          </h3>
        </div>

        <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-4">
          <p className="text-center text-gray-300">Selecione o novo motivo do ponto:</p>
          <div className="grid grid-cols-1 gap-3">
            {MOTIVOS_PONTO.map(motivo => (
              <button
                key={motivo.id}
                onClick={() => setMotivoPontoId(motivo.id)}
                className={`py-3 px-4 rounded-lg text-base font-medium transition-all ${
                  motivoPontoId === motivo.id
                    ? 'bg-yellow-600 text-white ring-2 ring-yellow-400'
                    : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                }`}
              >
                {motivo.descricao}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-shrink-0 p-4 sm:p-5 border-t border-gray-700/60">
          <div className="flex justify-center gap-3">
            <button onClick={onClose} className="btn-secondary px-6 py-2.5">
              Cancelar
            </button>
            <button onClick={handleSave} className="btn-primary px-6 py-2.5">
              Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEditarPonto;
