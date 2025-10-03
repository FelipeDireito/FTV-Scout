const ButtonAtleta = ({ atleta, onClick, isSelecionado, corTime, disabled, isRallyStarted, onSaqueClick }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full h-full rounded-lg transition-all duration-200 ease-in-out transform focus:outline-none relative shadow-md flex flex-col items-center justify-center p-2 gap-1
      ${isSelecionado ? 'ring-4 ring-yellow-400 scale-105' : 'ring-2 ring-gray-700'}
      ${disabled ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : `${corTime === 'blue' ? 'bg-blue-800/80 hover:bg-blue-700' : 'bg-red-800/80 hover:bg-red-700'} hover:scale-105`}
    `}
  >
    {isSelecionado && <div className="absolute inset-0 bg-black/30 rounded-lg"></div>}

    <span className="relative z-10 font-bold text-base sm:text-lg md:text-xl truncate w-full text-center">
      {atleta.nome_atleta}
    </span>

    {!isRallyStarted && !disabled && (
      <div
        onClick={(e) => {
          e.stopPropagation();
          onSaqueClick(atleta);
        }}
        className="relative z-20 bg-white text-black font-bold rounded-full shadow-lg hover:bg-gray-200 transition-colors cursor-pointer
                  text-xs py-1 px-3
                  sm:text-sm sm:py-1.5 sm:px-4"
        role="button"
        aria-label={`Registrar Saque para ${atleta.nome_atleta}`}
      >
        Saque
      </div>
    )}
  </button>
);

export default ButtonAtleta;
