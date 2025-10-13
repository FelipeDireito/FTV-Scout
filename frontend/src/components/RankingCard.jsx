import { useNavigate } from 'react-router-dom';

/**
 * Card para exibir ranking de atletas ou duplas
 */
function RankingCard({ title, items, type = 'atleta', onViewAll }) {
  const navigate = useNavigate();

  const handleItemClick = (id) => {
    if (type === 'atleta') {
      navigate(`/atleta/${id}`);
    } else {
      navigate(`/dupla/${id}`);
    }
  };

  const getMedalEmoji = (position) => {
    switch (position) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '';
    }
  };

  return (
    <div className="bg-[#1E1E1E] rounded-xl p-6 shadow-lg">
      <div className="mb-6 pb-4 border-b-2 border-gray-800">
        <h3 className="text-xl font-bold text-white flex items-center gap-2">
          <span>🏆</span>
          {title}
        </h3>
      </div>
      
      <div className="flex flex-col gap-3">
        {items.length === 0 ? (
          <p className="text-center text-gray-500 py-8 italic">Nenhum dado disponível</p>
        ) : (
          items.map((item, index) => (
            <div
              key={item.id}
              className="flex items-center gap-4 p-3 rounded-lg transition-all duration-200 cursor-pointer hover:bg-[#2a2a2a] hover:translate-x-1"
              onClick={() => handleItemClick(item.id)}
            >
              <span className="text-xl font-bold text-gray-400 min-w-8 text-center">
                {getMedalEmoji(index + 1) || `${index + 1}.`}
              </span>
              <span className="flex-1 text-base text-white font-medium">{item.name}</span>
              <span className="text-base font-bold text-[#00A3FF]">{item.value}</span>
            </div>
          ))
        )}
      </div>

      {onViewAll && (
        <button 
          className="w-full mt-4 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm font-semibold text-[#00A3FF] transition-colors duration-200"
          onClick={onViewAll}
        >
          Ver Ranking Completo
        </button>
      )}
    </div>
  );
}

export default RankingCard;
