import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import NovaPartida from './pages/NovaPartida'
// Crie e importe a página de Notação quando estiver pronta
// import Notacao from './pages/Notacao';

function App() {
  return (
    <BrowserRouter>
      {/* 
        Com a remoção do Header, cada página agora é responsável
        pelo seu próprio layout de ponta a ponta.
      */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="dashboard" element={<Dashboard />} />
        {/* 
          As rotas para as páginas de "Nova Partida" e "Análise" podem ser adicionadas aqui.
          Ex: <Route path="/new-match" element={<NewMatch />} />
        */}
        <Route path="/nova-partida" element={<NovaPartida />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;