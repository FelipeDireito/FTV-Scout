import { useEffect, useRef } from 'react';
import { TECNICAS } from '../../../constants/jogo'

const RallyLog = ({ actions, getAtletaById, isRallyActive, onActionClick }) => {
  const getTecnicaNome = (id) => TECNICAS.find(t => t.id === id)?.nome || 'N/A';
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollTop = container.scrollHeight;
    }
  }, [actions]);

  const titulo = isRallyActive ? 'Rally Atual' : 'Último Rally';
  const corTitulo = isRallyActive ? 'text-gray-300' : 'text-yellow-600';

  return (
    <div className="flex-grow bg-gray-800/50 rounded-lg p-3 flex flex-col">
      <h3 className={`text-lg font-semibold text-center mb-2 border-b border-gray-600 pb-2 ${corTitulo}`}>
        {titulo}
      </h3>
      <div ref={scrollContainerRef} className="flex-grow overflow-y-auto space-y-1 pr-2">
        {actions.length === 0 ? (
          <p className="text-gray-500 text-center mt-4">Aguardando o saque...</p>
        ) : (
          actions.map((action, index) => (
            <div
              key={action.acao_id || index}
              onClick={() => !isRallyActive && onActionClick && onActionClick(action)}
              className={`bg-gray-900/70 p-2 rounded-md text-sm ${!isRallyActive ? 'cursor-pointer hover:bg-gray-700/70' : ''}`}
            >
              <span className="font-bold text-sky-400">{index + 1}. </span>
              <span className="font-semibold">{getAtletaById(action.atleta_id)?.nome_atleta.split(' ')[0]}</span>
              <span className="text-gray-400"> - {getTecnicaNome(action.tecnica_acao_id)}</span>
              <span className="text-gray-400">
                {action.posicao_quadra_origem && ` - Zona ${action.posicao_quadra_origem}`}
                {action.posicao_quadra_destino && ` ➔ Zona ${action.posicao_quadra_destino}`}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default RallyLog;
