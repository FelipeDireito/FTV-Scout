import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import AnalisePartida from './pages/AnalisePartida';
import NovaPartida from './pages/NovaPartida'
import SelecionarDuplas from './pages/SelecionarDuplas';
import Partida from './pages/Partida';
import EstatisticasGerais from './pages/EstatisticasGerais';
import HistoricoAtleta from './pages/HistoricoAtleta';
import PWABadge from '../PWABadge';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/analise/:partidaId" element={<AnalisePartida />} />
        <Route path="/nova-partida" element={<NovaPartida />} />
        <Route path="/selecionar-duplas" element={<SelecionarDuplas />} />
        <Route path="/partida" element={<Partida />} />
        <Route path="/estatisticas-gerais" element={<EstatisticasGerais />} />
        <Route path="/historico-atleta" element={<HistoricoAtleta />} />
      </Routes>
      <PWABadge />
    </BrowserRouter>
  );
}

export default App;