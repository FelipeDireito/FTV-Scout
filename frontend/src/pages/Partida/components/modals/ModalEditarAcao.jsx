import { useState } from 'react';
import { TECNICAS } from '../../../../constants/jogo';

const ModalEditarAcao = ({ acao, onClose, onSave, getAtletaById, atletas }) => {
  const [tecnicaId, setTecnicaId] = useState(acao?.tecnica_acao_id || '');
  const [zonaOrigem, setZonaOrigem] = useState(acao?.posicao_quadra_origem || '');
  const [zonaDestino, setZonaDestino] = useState(acao?.posicao_quadra_destino || '');
  const [atletaId, setAtletaId] = useState(acao?.atleta_id || '');

  if (!acao) return null;

  const atleta = getAtletaById(atletaId);

  const handleSave = () => {
    const updateData = {};
    if (tecnicaId !== acao.tecnica_acao_id) {
      updateData.tecnica_acao_id = tecnicaId;
    }
    if (zonaOrigem !== acao.posicao_quadra_origem) {
      updateData.posicao_quadra_origem = zonaOrigem === '' ? null : Number(zonaOrigem);
    }
    if (zonaDestino !== acao.posicao_quadra_destino) {
      updateData.posicao_quadra_destino = zonaDestino === '' ? null : Number(zonaDestino);
    }
    if (atletaId !== acao.atleta_id){
      updateData.atleta_id = atletaId;
    }

    if (Object.keys(updateData).length > 0) {
      onSave(acao.acao_id, updateData);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md flex flex-col max-h-[95vh] sm:max-h-[90vh]">
        <div className="p-4 sm:p-6 border-b border-gray-700">
          <h3 className="text-xl sm:text-2xl font-bold text-center text-yellow-400">
            Editar Ação
          </h3>
          {atleta && <p className="text-center text-gray-300 mt-1 text-sm sm:text-base">Atleta: {atleta.nome_atleta}</p>}
        </div>

        <div className="p-4 sm:p-6 space-y-4 sm:space-y-6 overflow-y-auto">
          <div>
            <label htmlFor="atleta-select" className="block mb-2 text-xs sm:text-sm font-medium text-gray-300">Atleta:</label>
            <select
              id="atleta-select"
              value={atletaId}
              onChange={(e) => setAtletaId(Number(e.target.value))}
              className="bg-gray-700 border border-gray-600 text-white text-base sm:text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 sm:p-3"
            >
              {atletas.map(a => <option key={a.atleta_id} value={a.atleta_id}>{a.nome_atleta}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="tecnica-select" className="block mb-2 text-xs sm:text-sm font-medium text-gray-300">Técnica da Ação</label>
            <select
              id="tecnica-select"
              value={tecnicaId}
              onChange={(e) => setTecnicaId(Number(e.target.value))}
              className="bg-gray-700 border border-gray-600 text-white text-base sm:text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 sm:p-3"
            >
              {TECNICAS.map(t => <option key={t.id} value={t.id}>{t.nome}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="zona-origem-select" className="block mb-2 text-xs sm:text-sm font-medium text-gray-300">Posição de Origem da Ação (Opcional)</label>
            <select
              id="zona-origem-select"
              value={zonaOrigem}
              onChange={(e) => setZonaOrigem(e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white text-base sm:text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 sm:p-3"
            >
              <option value="">N/A</option>
              {[1, 2, 3, 4, 5, 6].map(z => <option key={z} value={z}>Zona {z}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="zona-destino-select" className="block mb-2 text-xs sm:text-sm font-medium text-gray-300">Posição de Destino da Ação (Opcional)</label>
            <select
              id="zona-destino-select"
              value={zonaDestino}
              onChange={(e) => setZonaDestino(e.target.value)}
              className="bg-gray-700 border border-gray-600 text-white text-base sm:text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 sm:p-3"
            >
              <option value="">N/A</option>
              {[1, 2, 3, 4, 5, 6].map(z => <option key={z} value={z}>Zona {z}</option>)}
            </select>
          </div>
        </div>

        <div className="p-3 sm:p-4 bg-gray-900/50 rounded-b-xl">
          <div className="flex justify-center gap-2 sm:gap-4">
            <button onClick={onClose} className="btn-secondary px-4 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base">Cancelar</button>
            <button onClick={handleSave} className="btn-primary px-4 sm:px-8 py-2.5 sm:py-3 text-sm sm:text-base">Salvar</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalEditarAcao;
