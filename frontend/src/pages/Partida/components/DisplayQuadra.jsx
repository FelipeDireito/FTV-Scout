import { memo } from 'react';

const DisplayQuadra = memo(({
  activeZone,
  onClickZona,
  disabled = false,
  obrigatorio = false,
  isZonaDesabilitada = () => false,
  ladosInvertidos = false
}) => {
  const renderZona = (side, numeroZona) => {
    const isSelecionado = activeZone?.side === side && activeZone?.zona === numeroZona;

    const sideParaValidacao = ladosInvertidos ? (side === 'A' ? 'B' : 'A') : side;
    const zonaDesabilitada = isZonaDesabilitada(sideParaValidacao);
    const isDisabled = disabled || zonaDesabilitada;

    return (
      <div
        key={`${side}-${numeroZona}`}
        onClick={() => !isDisabled && onClickZona({ side, zona: numeroZona })}
        className={`relative flex items-center justify-center transition-all duration-150 ease-in-out border text-gray-800 font-bold text-xl md:text-2xl rounded-sm
          ${isDisabled ? 'cursor-not-allowed opacity-30  bg-gray-700' : 'cursor-pointer border-white/40'}
          ${obrigatorio && !zonaDesabilitada ? 'border-yellow-400 border-2 animate-pulse' : ''}
          ${isSelecionado ? 'bg-sky-500/80 text-white shadow-lg' : isDisabled ? 'hover:bg-transparent' : 'hover:bg-sky-500/30'}
        `}
      >
        {numeroZona}
        {isSelecionado && <div className="absolute inset-0 border-4 border-white rounded-sm animate-pulse"></div>}
      </div>
    );
  };
  return (
    <div className="w-full h-full bg-yellow-500 bg-opacity-80 rounded-xl p-2 md:p-3 flex flex-row relative shadow-lg overflow-hidden">
      <div className="absolute left-1/2 top-0 h-full w-0.5 bg-white z-10 -translate-x-1/2"></div>
      <div className="flex-1 h-full grid grid-cols-2 grid-rows-3 gap-1 md:gap-2 p-1 relative z-0">
        {[5, 4, 6, 3, 1, 2].map(zona => renderZona('A', zona))}
      </div>
      <div className="h-full w-1.5 bg-gray-600 relative z-0"></div>
      <div className="flex-1 h-full grid grid-cols-2 grid-rows-3 gap-1 md:gap-2 p-1 relative z-0">
        {[2, 1, 3, 6, 4, 5].map(zona => renderZona('B', zona))}
      </div>
    </div>
  );
});

export default DisplayQuadra;
