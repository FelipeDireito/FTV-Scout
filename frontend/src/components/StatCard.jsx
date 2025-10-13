/**
 * Card para exibir uma estatística individual
 */
function StatCard({ title, value, subtitle, icon, color = 'primary' }) {
  const colorClasses = {
    primary: 'border-l-blue-500',
    success: 'border-l-green-500',
    warning: 'border-l-orange-500',
    danger: 'border-l-red-500',
    info: 'border-l-purple-500'
  };

  return (
    <div className={`bg-[#1E1E1E] rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-200 hover:-translate-y-1 flex items-center gap-4 border-l-4 ${colorClasses[color]}`}>
      {icon && <div className="text-4xl opacity-80">{icon}</div>}
      <div className="flex-1">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">{title}</h3>
        <p className="text-3xl font-bold text-white">{value}</p>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

export default StatCard;
