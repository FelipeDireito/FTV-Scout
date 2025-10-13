import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import NovaPartida from './pages/NovaPartida'
import SelecionarDuplas from './pages/SelecionarDuplas';
import Partida from './pages/Partida';
import AtletaDetalhes from './pages/AtletaDetalhes';
import DuplaDetalhes from './pages/DuplaDetalhes';
import PartidaDetalhes from './pages/PartidaDetalhes';
import PWABadge from '../PWABadge';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/atleta/:id" element={<AtletaDetalhes />} />
        <Route path="/dupla/:id" element={<DuplaDetalhes />} />
        <Route path="/partida-detalhes/:id" element={<PartidaDetalhes />} />
        <Route path="/nova-partida" element={<NovaPartida />} />
        <Route path="/selecionar-duplas" element={<SelecionarDuplas />} />
        <Route path="/partida" element={<Partida />} />
      </Routes>
      <PWABadge />
    </BrowserRouter>
  );
}

export default App;