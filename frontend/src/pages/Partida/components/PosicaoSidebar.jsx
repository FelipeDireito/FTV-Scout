import { memo, useMemo, useCallback } from 'react';

const PosicaoButton = memo(({ posicao, isSelected, onClick, disabled }) => {
  const handleClick = useCallback(() => {
    onClick(posicao);
  }, [onClick, posicao]);

  const buttonClass = useMemo(() => {
    const baseClass = 'btn-acao py-6 text-lg font-bold rounded-lg transition-all duration-150 relative';
    const stateClass = disabled 
      ? 'bg-gray-700 text-gray-500 cursor-not-allowed' 
      : isSelected
        ? 'bg-green-600 text-white shadow-lg ring-2 ring-green-400'
        : 'bg-slate-800 text-white hover:bg-slate-700 active:bg-slate-600';
    return `${baseClass} ${stateClass}`;
  }, [isSelected, disabled]);

  return (
    <button
      onClick={handleClick}
      disabled={disabled}
      className={buttonClass}
    >
      {posicao}
      {isSelected && (
        <div className="absolute inset-0 border-2 border-white rounded-lg animate-pulse pointer-events-none"></div>
      )}
    </button>
  );
});

PosicaoButton.displayName = 'PosicaoButton';

const PosicaoSidebar = memo(({ 
  onSelectPosicao, 
  posicaoAtual,
  className = '',
  disabled = false,
  quadraEspelhada = false
}) => {
  const posicoes = quadraEspelhada 
    ? [2, 1, 3, 6, 4, 5] 
    : [5, 4, 6, 3, 1, 2];

  return (
    <div className={`bg-black/30 p-2 flex flex-col gap-2 ${className}`}>
      <div className="text-center text-xs text-gray-400 font-semibold py-1">
        POSIÇÃO DO ATLETA
      </div>
      <div className="flex-grow grid grid-cols-2 grid-rows-3 gap-2">
        {posicoes.map(pos => (
          <PosicaoButton
            key={pos}
            posicao={pos}
            isSelected={posicaoAtual === pos}
            onClick={onSelectPosicao}
            disabled={disabled}
          />
        ))}
      </div>
    </div>
  );
});

PosicaoSidebar.displayName = 'PosicaoSidebar';

export default PosicaoSidebar;
