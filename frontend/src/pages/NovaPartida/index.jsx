import { Link } from 'react-router-dom';

function NovaPartida() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen text-white md:p-8 p-4">
      <div className="w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-8 text-white text-center">
          Configurar Nova Partida
        </h1>

        <form className="space-y-6">
          <div>
            <label htmlFor="match-name" className="block mb-2 text-sm font-medium text-gray-300">
              Nome da Partida / Evento
            </label>
            <input
              type="text"
              id="match-name"
              required
              className="bg-gray-700 border border-gray-600 text-white text-lg rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-4"
              placeholder="Ex: Semifinal Duplas A e B"
            />
          </div>

          <div className="mt-12 flex justify-end space-x-4">
            <Link to="/" className="bg-transparent border-2 border-gray-600 hover:bg-gray-700 text-gray-200 font-bold uppercase py-3 px-6 rounded-lg transition-colors">Cancelar</Link>
            <Link to="/selecionar-duplas" type="submit" className="bg-[#00A3FF] hover:bg-[#0082cc] font-bold uppercase text-white py-3 px-6 rounded-lg transition-colors shadow-lg shadow-blue-500/20">Avançar</Link>
          </div>
        </form>
      </div>
    </div>
  )
}

export default NovaPartida;