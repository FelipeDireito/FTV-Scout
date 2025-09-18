import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import NovaPartida from './pages/NovaPartida'
import SelecionarDuplas from './pages/SelecionarDuplas';
import Partida from './pages/Partida';
// Crie e importe a página de Notação quando estiver pronta
// import Notacao from './pages/Notacao';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="/nova-partida" element={<NovaPartida />} />
        <Route path="/selecionar-duplas" element={<SelecionarDuplas />} />
        <Route path="/partida" element={<Partida />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;