import { TECNICAS } from '../../../constants/jogo';

const AcoesSidebar = ({ 
  onSelectTecnica, 
  onTogglePosition, 
  position, 
  className = '',
  disabled = false
}) => {
  return (
    <div className={`bg-black/30 p-2 flex flex-col gap-2 ${className}`}>
      <button
        onClick={onTogglePosition}
        className="text-xs text-gray-400 hover:text-white hover:bg-gray-700 rounded p-1 transition-colors"
        title={position === 'right' ? 'Mover para a esquerda' : 'Mover para a direita'}
      >
        {position === 'right' ? '←' : '→'}
      </button>
      <div className="flex-grow grid grid-cols-2 gap-2">
        {TECNICAS.map(tecnica => (
          tecnica.id === 12 ? null :
            <button
              key={tecnica.id}
              onClick={() => onSelectTecnica(tecnica.id)}
              disabled={disabled}
              className={`btn-acao h-full text-xs rounded-lg px-0 transition-colors
                ${disabled 
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                  : 'bg-slate-800 text-white hover:bg-slate-700'
                }`}
            >
              {tecnica.nome}
            </button>
        ))}
      </div>
    </div>
  );
};

export default AcoesSidebar;
