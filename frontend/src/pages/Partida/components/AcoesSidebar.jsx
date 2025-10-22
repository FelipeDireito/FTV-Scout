import { memo, useState, useMemo, useCallback } from 'react';
import { TECNICAS, TECNICAS_SIMPLIFICADAS } from '../../../constants/jogo';

const TecnicaButton = memo(({ tecnica, onClick, disabled, modoSimplificado }) => {
  const handleClick = useCallback(() => {
    onClick(tecnica.id);
  }, [onClick, tecnica.id]);

  const buttonClass = useMemo(() => {
    const baseClass = 'btn-acao font-semibold rounded-lg transition-colors';
    const modeClass = modoSimplificado ? 'col-span-2 py-6 text-lg' : 'py-4 text-xs';
    const stateClass = disabled 
      ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
      : 'bg-slate-800 text-white hover:bg-slate-700 active:bg-slate-600';
    return `${baseClass} ${modeClass} ${stateClass}`;
  }, [modoSimplificado, disabled]);

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={buttonClass}
    >
      {tecnica.nome}
    </button>
  );
});

TecnicaButton.displayName = 'TecnicaButton';

const AcoesSidebar = memo(({ 
  onSelectTecnica, 
  onTogglePosition, 
  position, 
  className = '',
  disabled = false
}) => {
  const [modoSimplificado, setModoSimplificado] = useState(true);
  
  const tecnicasExibidas = useMemo(() => 
    modoSimplificado 
      ? TECNICAS_SIMPLIFICADAS 
      : TECNICAS.filter(t => t.id !== 12),
    [modoSimplificado]
  );

  const toggleModo = useCallback(() => {
    setModoSimplificado(prev => !prev);
  }, []);

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
          onClick={toggleModo}
          className="text-xs text-gray-400 hover:text-white hover:bg-gray-700 rounded px-2 py-1 transition-colors"
        >
          {modoSimplificado ? '⊕' : '⊖'}
        </button>
      </div>
      <div className="flex-grow grid grid-cols-2 gap-2">
        {tecnicasExibidas.map(tecnica => (
          <TecnicaButton
            key={tecnica.id}
            tecnica={tecnica}
            onClick={onSelectTecnica}
            disabled={disabled}
            modoSimplificado={modoSimplificado}
          />
        ))}
      </div>
    </div>
  );
});

export default AcoesSidebar;
