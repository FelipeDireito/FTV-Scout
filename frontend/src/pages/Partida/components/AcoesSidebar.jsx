import { memo, useState } from 'react';
import { TECNICAS, TECNICAS_SIMPLIFICADAS } from '../../../constants/jogo';

const AcoesSidebar = memo(({ 
  onSelectTecnica, 
  onTogglePosition, 
  position, 
  className = '',
  disabled = false
}) => {
  const [modoSimplificado, setModoSimplificado] = useState(true);
  
  const tecnicasExibidas = modoSimplificado 
    ? TECNICAS_SIMPLIFICADAS 
    : TECNICAS.filter(t => t.id !== 12);

  return (
    <div className={`bg-black/30 p-2 flex flex-col gap-2 ${className}`}>
      <div className="flex gap-1">
        <button
          onClick={onTogglePosition}
          className="text-xs text-gray-400 hover:text-white hover:bg-gray-700 rounded p-1 transition-colors flex-1"
        >
          {position === 'right' ? '←' : '→'}
        </button>
        <button
          onClick={() => setModoSimplificado(prev => !prev)}
          className="text-xs text-gray-400 hover:text-white hover:bg-gray-700 rounded px-2 py-1 transition-colors"
        >
          {modoSimplificado ? '⊕' : '⊖'}
        </button>
      </div>
      <div className="flex-grow grid grid-cols-2 gap-2">
        {tecnicasExibidas.map(tecnica => (
          <button
            key={tecnica.id}
            onClick={() => onSelectTecnica(tecnica.id)}
            disabled={disabled}
            className={`btn-acao ${modoSimplificado ? 'col-span-2 py-6 text-lg' : 'py-4 text-xs'} font-semibold rounded-lg transition-colors
              ${disabled 
                ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
                : 'bg-slate-800 text-white hover:bg-slate-700 active:bg-slate-600'
              }`}
          >
            {tecnica.nome}
          </button>
        ))}
      </div>
    </div>
  );
});

export default AcoesSidebar;
