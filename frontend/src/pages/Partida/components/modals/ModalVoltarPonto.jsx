const ModalVoltarPonto = ({ onClose, onFinalizar }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-2xl font-bold text-center text-yellow-400">
            Voltar Último Ponto?
          </h3>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-center text-gray-300">
            Tem certeza que deseja excluir o último ponto registrado?
          </p>
          <p className="text-center text-sm text-red-400 font-semibold">
            Esta ação não pode ser desfeita.
          </p>
        </div>

        <div className="p-4 bg-gray-900/50 rounded-b-xl">
          <div className="flex justify-center gap-4">
            <button onClick={onClose} className="btn-secondary px-8 py-3">Cancelar</button>
            <button onClick={onFinalizar} className="btn-primary bg-red-600 hover:bg-red-700 px-8 py-3">Confirmar e Excluir</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalVoltarPonto;
