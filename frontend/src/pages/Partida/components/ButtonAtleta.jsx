import { memo } from 'react';

const ButtonAtleta = memo(({ 
  atleta, 
  onClick, 
  isSelecionado, 
  corTime, 
  disabled, 
  isRallyStarted, 
  onSaqueClick,
  disabledSaque = false,
  ehSacadorAtual = false,
  setLogMessage
}) => (
  <button
    onClick={(e) => {
      if (!isRallyStarted && !disabledSaque && (ehSacadorAtual || ehSacadorAtual === null)) {
        e.stopPropagation();
        onSaqueClick(atleta, setLogMessage);
      } else if (!disabled && typeof onClick === 'function') {
        onClick(e);
      }
    }}
    disabled={disabled || (!isRallyStarted && !disabledSaque && !(ehSacadorAtual || ehSacadorAtual === null))}
    className={`w-full h-full rounded-lg transition-all duration-200 ease-in-out transform focus:outline-none relative shadow-md flex flex-col items-center justify-center p-2 gap-1
      ${isSelecionado ? 'ring-4 ring-yellow-400 scale-105' : 'ring-2 ring-gray-700'}
      ${disabled ? 'bg-gray-700 text-gray-500 cursor-not-allowed' :
        `${corTime === 'blue' ? 'bg-blue-800/80 hover:bg-blue-700' : 'bg-red-800/80 hover:bg-red-700'} hover:scale-105`}
    `}
  >
    {isSelecionado && <div className="absolute inset-0 bg-black/30 rounded-lg"></div>}

    <span className="relative z-10 font-bold text-base sm:text-lg md:text-xl truncate w-full text-center">
      {atleta.nome_atleta}
    </span>

    {!isRallyStarted && !disabledSaque && (ehSacadorAtual || ehSacadorAtual === null) && (
      <div className="w-full mt-2 flex justify-center items-center">
        <div className="bg-white rounded-md px-4 py-2 w-4/5 flex justify-center items-center">
          <span className="text-black font-bold text-xs sm:text-sm">Saque</span>
        </div>
      </div>
    )}
  </button>
));

export default ButtonAtleta;
