import { useState } from 'react';

/**
 * Componente de Tabs reutilizável
 */
function Tabs({ tabs, defaultTab = 0 }) {
  const [activeTab, setActiveTab] = useState(defaultTab);

  return (
    <div className="w-full">
      {/* Tab Headers */}
      <div className="flex gap-2 border-b-2 border-gray-800 mb-6 overflow-x-auto">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            className={`px-6 py-3 font-semibold transition-all duration-200 whitespace-nowrap ${
              activeTab === index
                ? 'text-[#00A3FF] border-b-2 border-[#00A3FF] -mb-[2px]'
                : 'text-gray-400 hover:text-gray-200'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {tabs[activeTab]?.content}
      </div>
    </div>
  );
}

export default Tabs;
