import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { TECNICAS } from '../../constants/jogo';
import useFalaParaTexto from '../../hooks/useFalaParaTexto';
import { useControlePartida } from './hooks/useControlePartida';
import { useRallyLogica } from './hooks/useRallyLogica';
import MicIcon from '../../components/MicIcon';
import ButtonAtleta from './components/ButtonAtleta';
import DisplayQuadra from './components/DisplayQuadra';
import RallyLog from './components/RallyLog';
import AcoesSidebar from './components/AcoesSidebar';
import ModalPonto from './components/modals/ModalPonto';
import ModalVoltarPonto from './components/modals/ModalVoltarPonto';
import ModalEditarAcao from './components/modals/ModalEditarAcao';
import ModalFinalizarPartida from './components/modals/ModalFinalizarPartida';


function Partida() {
  const location = useLocation();
  const { partida, duplas } = location.state || {
    partida: { partida_id: 1, nome_partida: 'Partida Teste', dupla_a_id: 1, dupla_b_id: 2 },
    duplas: {
      a1: { atleta_id: 1, nome_atleta: 'Atleta A1' }, a2: { atleta_id: 2, nome_atleta: 'Atleta A2' },
      b1: { atleta_id: 3, nome_atleta: 'Atleta B1' }, b2: { atleta_id: 4, nome_atleta: 'Atleta B2' },
    }
  };

  const [logMessage, setLogMessage] = useState("Selecione um atleta para iniciar o rally.");
  const [sidebarPosition, setSidebarPosition] = useState('right');
  const [isMicFeatureEnabled, setIsMicFeatureEnabled] = useState(true);
  const { texto, startEscutando, stopEscutando, isEscutando, setTexto } = useFalaParaTexto({ continuous: true });

  const {
    score, setScore, pontosPartida, isModalFinalizarOpen, isModalVoltarPontoOpen, acaoParaEditar,
    abrirModalFinalizacao, fecharModalFinalizacao, handleFinalizarPartida,
    abrirModalVoltarPonto, fecharModalVoltarPonto, handleVoltarPonto,
    handleAbrirModalEdicao, handleSalvarEdicaoAcao
  } = useControlePartida(partida, duplas);

  const {
    acoesRally, ultimoRally, atletaSelecionado, setAtletaSelecionado,
    activeZone, pontoPendente, isModalPontoOpen, setIsPontoModalOpen, timeVencedorForModal,
    handleSelecionarTecnica, handleSaque, openPointModal, handleFinalizarPonto,
    handleSelecionarZona, onRallyReset, onAcaoAtualizada
  } = useRallyLogica(partida, duplas);

  const getAtletaById = useCallback((atletaId) => {
    for (const key in duplas) {
      if (duplas[key].atleta_id === atletaId) return duplas[key];
    }
    return null;
  }, [duplas]);

  const toggleSidebarPosition = () => {
    setSidebarPosition(prev => (prev === 'right' ? 'left' : 'right'));
  };

  useEffect(() => {
    const rallyEmAndamento = acoesRally.length > 0;
    if (isMicFeatureEnabled && rallyEmAndamento && !isEscutando) {
      startEscutando();
    } else if ((!isMicFeatureEnabled || !rallyEmAndamento) && isEscutando) {
      stopEscutando();
    }
  }, [acoesRally, isMicFeatureEnabled, isEscutando, startEscutando, stopEscutando]);


  useEffect(() => {
    if (texto && atletaSelecionado) {
      const textoLimpo = texto.trim().toLowerCase().replace('.', '');
      const tecnicaEncontrada = TECNICAS.find(t => t.nome.toLowerCase() === textoLimpo);
      if (tecnicaEncontrada) {
        console.log(`Voz para ${atletaSelecionado.nome_atleta}: ${tecnicaEncontrada.nome}`);
        setLogMessage(`Voz: ${atletaSelecionado.nome_atleta.split(' ')[0]} -> ${tecnicaEncontrada.nome}`);
        handleSelecionarTecnica(tecnicaEncontrada.id, setLogMessage);
      } else {
        console.log(`Comando de voz não reconhecido: "${texto}"`);
        setLogMessage(`Comando não reconhecido: "${texto}"`);
        setTimeout(() => setLogMessage("Selecione um atleta e uma técnica..."), 2500);
      }
      setTexto('');
    }
  }, [texto, atletaSelecionado, setTexto, handleSelecionarTecnica, setLogMessage]);


  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">
      {isModalPontoOpen && <ModalPonto timeVencedor={timeVencedorForModal} onClose={() => setIsPontoModalOpen(false)} onFinalizar={(motivoId) => handleFinalizarPonto(motivoId, setLogMessage, score, setScore)} />}
      {isModalFinalizarOpen && <ModalFinalizarPartida score={score} pontos={pontosPartida} partida={partida} onClose={fecharModalFinalizacao} onFinalizar={handleFinalizarPartida} />}
      {isModalVoltarPontoOpen && <ModalVoltarPonto onClose={fecharModalVoltarPonto} onFinalizar={() => handleVoltarPonto(setLogMessage, onRallyReset)} />}
      {acaoParaEditar && <ModalEditarAcao
        acao={acaoParaEditar}
        onClose={() => handleAbrirModalEdicao(null)}
        onSave={(id, data) => handleSalvarEdicaoAcao(id, data, setLogMessage, onAcaoAtualizada)}
        getAtletaById={getAtletaById}
      />}

      <header className="grid grid-cols-3 items-center p-2 md:p-4 bg-black/30 shadow-lg relative z-20">
        <div className="text-left hidden md:block">
          <h2 className="text-lg md:text-2xl font-bold text-blue-400">DUPLA A</h2>
          <p className="text-xs md:text-sm text-gray-300 truncate">{duplas.a1.nome_atleta} / {duplas.a2.nome_atleta}</p>
        </div>
        <div className="text-center col-span-3 md:col-span-1">
          <h1 className="text-lg md:text-2xl font-bold hidden md:block">{partida.nome_partida}</h1>
          <div className="flex justify-center items-center">
            <button onClick={() => openPointModal('A')} className="text-xl md:text-2xl bg-gray-700 rounded-full w-7 h-7 md:w-14 md:h-10 flex items-center justify-center hover:bg-blue-600 transition-colors">✚</button>
            <span className="text-4xl md:text-7xl font-black tracking-tighter mx-2 md:mx-4">{score.a}</span>
            <span className="text-2xl md:text-5xl font-light text-gray-500">-</span>
            <span className="text-4xl md:text-7xl font-black tracking-tighter mx-2 md:mx-4">{score.b}</span>
            <button onClick={() => openPointModal('B')} className="text-xl md:text-2xl bg-gray-700 rounded-full w-7 h-7 md:w-14 md:h-10 flex items-center justify-center hover:bg-red-600 transition-colors">✚</button>
          </div>
        </div>
        <div className="text-right hidden md:block">
          <h2 className="text-lg md:text-2xl font-bold text-red-400">DUPLA B</h2>
          <p className="text-xs md:text-sm text-gray-300 truncate">{duplas.b1.nome_atleta} / {duplas.b2.nome_atleta}</p>
        </div>
      </header>

      <div className="flex-1 flex flex-row overflow-hidden">
        <AcoesSidebar
          onSelectTecnica={(tecnicaId) => handleSelecionarTecnica(tecnicaId, setLogMessage)}
          onTogglePosition={toggleSidebarPosition}
          position={sidebarPosition}
          className={sidebarPosition === 'right' ? 'order-last' : ''}
        />

        <main className="flex-1 flex flex-col md:flex-row p-2 md:p-4 gap-2 md:gap-4 overflow-hidden">
          <div className="flex md:flex-col justify-around gap-2 md:gap-4 md:w-[15%] h-16 md:h-full">
            <ButtonAtleta atleta={duplas.a1} onClick={() => setAtletaSelecionado(duplas.a1)} isSelecionado={atletaSelecionado?.atleta_id === duplas.a1.atleta_id} corTime="blue" disabled={!!pontoPendente} isRallyStarted={acoesRally.length > 0} onSaqueClick={(atleta) => handleSaque(atleta, setLogMessage)} />
            <ButtonAtleta atleta={duplas.a2} onClick={() => setAtletaSelecionado(duplas.a2)} isSelecionado={atletaSelecionado?.atleta_id === duplas.a2.atleta_id} corTime="blue" disabled={!!pontoPendente} isRallyStarted={acoesRally.length > 0} onSaqueClick={(atleta) => handleSaque(atleta, setLogMessage)} />
          </div>

          <div className="flex-grow flex flex-col gap-3 min-h-0">
            <div className="flex-grow min-h-0">
              <DisplayQuadra activeZone={activeZone} onClickZona={(zonaInfo) => handleSelecionarZona(zonaInfo, setLogMessage, score, setScore)} />
            </div>
            <div className="h-1/3 min-h-[100px] hidden md:flex">
              <RallyLog
                actions={acoesRally.length > 0 ? acoesRally : ultimoRally}
                isRallyActive={acoesRally.length > 0}
                getAtletaById={getAtletaById}
                onActionClick={handleAbrirModalEdicao}
              />
            </div>
          </div>

          <div className="flex md:flex-col justify-around gap-2 md:gap-4 md:w-[15%] h-16 md:h-full">
            <ButtonAtleta atleta={duplas.b1} onClick={() => setAtletaSelecionado(duplas.b1)} isSelecionado={atletaSelecionado?.atleta_id === duplas.b1.atleta_id} corTime="red" disabled={!!pontoPendente} isRallyStarted={acoesRally.length > 0} onSaqueClick={(atleta) => handleSaque(atleta, setLogMessage)} />
            <ButtonAtleta atleta={duplas.b2} onClick={() => setAtletaSelecionado(duplas.b2)} isSelecionado={atletaSelecionado?.atleta_id === duplas.b2.atleta_id} corTime="red" disabled={!!pontoPendente} isRallyStarted={acoesRally.length > 0} onSaqueClick={(atleta) => handleSaque(atleta, setLogMessage)} />
          </div>
        </main>
      </div>

      <footer className="bg-black/30 p-3 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <button className="btn-secondary py-2 px-4 text-sm" onClick={abrirModalVoltarPonto}>Voltar Ponto</button>
          <div className="flex-grow text-center text-sm text-gray-400 mx-2">
            <span className="font-mono bg-gray-800 px-3 py-1 rounded">{logMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setIsMicFeatureEnabled(prev => !prev)}
            className={`p-3 rounded-full transition-colors relative ${isEscutando ? 'bg-red-600 animate-pulse' : 'bg-gray-700 hover:bg-gray-600'}`}
            title={isMicFeatureEnabled ? "Desativar comandos de voz" : "Ativar comandos de voz"}
          >
            <MicIcon className={`h-6 w-6 ${isMicFeatureEnabled ? 'text-white' : 'text-gray-400'}`} />
          </button>
          <button className="btn-secondary py-2 px-4 text-sm" onClick={() => abrirModalFinalizacao(setLogMessage)}>FINALIZAR</button>
        </div>
      </footer>
    </div>
  );
}

export default Partida;
