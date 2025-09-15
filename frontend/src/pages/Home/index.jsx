import { Link } from 'react-router-dom';


function Home() {
  return (
    <div className="container mx-auto p-4 md:p-8 flex flex-col min-h-screen">
      <h1 className="text-4xl md:text-5xl font-bold my-8 text-center md:text-left text-gray-200">FTV Scout</h1>

      <main className="grid grid-cols-1 md:grid-cols-2 gap-8 flex-grow">
        <div className="flex flex-col items-center justify-center gap-6">
          <Link to="/nova-partida"
            className="w-full max-w-sm text-center bg-[#00A3FF] hover:bg-[#0082cc] font-bold uppercase text-white transition-all duration-200 text-2xl px-12 py-6 rounded-xl shadow-lg shadow-blue-500/20 hover:-translate-y-0.5"
          >
            + NOVA PARTIDA
          </Link>

          <Link to="/matches"
            className="w-full max-w-sm text-center bg-gray-700 hover:bg-gray-600 font-bold uppercase text-white transition-all duration-200 text-2xl px-12 py-6 rounded-xl shadow-lg hover:-translate-y-0.5"
          >
            Análise de Partidas
          </Link>
        </div>

        <div className="hidden md:flex flex-col">
          <h2 className="text-2xl font-semibold mb-4 text-gray-300">Partidas Recentes</h2>
          <div className="space-y-4 overflow-y-auto pr-2">
            <div className="bg-[#1E1E1E] p-4 rounded-lg cursor-pointer hover:bg-[#2a2a2a] transition-colors">
              <h3 className="font-bold text-lg">Final do Torneio de Verão</h3>
              <p className="text-gray-400">Leo/Felipe vs. Ajax/Victor</p>
              <p className="text-right text-sm text-gray-500 mt-2">07/09/2025</p>
            </div>
            <div className="bg-[#1E1E1E] p-4 rounded-lg cursor-pointer hover:bg-[#2a2a2a] transition-colors">
              <h3 className="font-bold text-lg">Treino Semanal A vs B</h3>
              <p className="text-gray-400">Ricardo/Beto vs. Giba/Nunes</p>
              <p className="text-right text-sm text-gray-500 mt-2">05/09/2025</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Home;
