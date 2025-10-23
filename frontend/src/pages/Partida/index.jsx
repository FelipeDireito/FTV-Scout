import { useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { TECNICAS } from '../../constants/jogo';
import useFalaParaTexto from '../../hooks/useFalaParaTexto';
import { useControlePartida } from './hooks/useControlePartida';
import { useRallyLogica } from './hooks/useRallyLogica';
import { useValidacaoEstados } from './hooks/useValidacaoEstados';
import { useSaqueAlternado } from './hooks/useSaqueAlternado';
import { usePartidaUI } from './hooks/usePartidaUI';
import { usePartidaHelpers } from './hooks/usePartidaHelpers';
import MicIcon from '../../components/MicIcon';
import ButtonAtleta from './components/ButtonAtleta';
import DisplayQuadra from './components/DisplayQuadra';
import RallyLog from './components/RallyLog';
import AcoesSidebar from './components/AcoesSidebar';
import PosicaoSidebar from './components/PosicaoSidebar';
import ModalPonto from './components/modals/ModalPonto';
import ModalVoltarPonto from './components/modals/ModalVoltarPonto';
import ModalEditarAcao from './components/modals/ModalEditarAcao';
import ModalEditarPonto from './components/modals/ModalEditarPonto';
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
  const [isMicFeatureEnabled, setIsMicFeatureEnabled] = useState(true);
  const { texto, startEscutando, stopEscutando, isEscutando, setTexto } = useFalaParaTexto({ continuous: true });

  const {
    score, setScore, pontosPartida, isModalFinalizarOpen, isModalVoltarPontoOpen, acaoParaEditar, pontoParaEditar,
    abrirModalFinalizacao, fecharModalFinalizacao, handleFinalizarPartida,
    abrirModalVoltarPonto, fecharModalVoltarPonto, handleVoltarPonto,
    handleAbrirModalEdicao, handleSalvarEdicaoAcao,
    handleAbrirModalEdicaoPonto, handleSalvarEdicaoPonto
  } = useControlePartida(partida, duplas);

  const {
    definirSacadorInicial,
    atualizarSacadorAposPonto,
    voltarSacador,
    ehSacadorAtual
  } = useSaqueAlternado(duplas);

  const {
    acoesRally, ultimoRally, motivoPontoUltimoRally, atletaSelecionado, setAtletaSelecionado,
    activeZone, pontoPendente, isModalPontoOpen, setIsPontoModalOpen, timeVencedorForModal,
    handleSelecionarTecnica, handleSaque, openPointModal, handleFinalizarPonto,
    handleSelecionarZona, handleSelecionarPosicao, onRallyReset, onAcaoAtualizada, onMotivoPontoAtualizado
  } = useRallyLogica(partida, duplas, definirSacadorInicial, atualizarSacadorAposPonto);

  const { getTimeAtleta, getAtletaById } = usePartidaHelpers(duplas);

  const {
    sidebarPosition,
    ladosInvertidos,
    toggleSidebarPosition,
    toggleLadosQuadra,
    duplasVisuais,
    placarVisual
  } = usePartidaUI(duplas, score);

  const validacoes = useValidacaoEstados({
    acoesRally,
    atletaSelecionado,
    pontoPendente,
    getTimeAtleta,
    score,
  });

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
      {isModalPontoOpen && <ModalPonto timeVencedor={timeVencedorForModal} onClose={() => setIsPontoModalOpen(false)} onFinalizar={(motivoId) => handleFinalizarPonto(motivoId, setLogMessage, score, setScore)} acoesRally={acoesRally} duplas={duplas} />}
      {isModalFinalizarOpen && <ModalFinalizarPartida score={score} pontos={pontosPartida} partida={partida} onClose={fecharModalFinalizacao} onFinalizar={handleFinalizarPartida} />}
      {isModalVoltarPontoOpen && <ModalVoltarPonto onClose={fecharModalVoltarPonto} onFinalizar={() => { handleVoltarPonto(setLogMessage, onRallyReset); voltarSacador(); }} />}
      {acaoParaEditar && <ModalEditarAcao
        acao={acaoParaEditar}
        onClose={() => handleAbrirModalEdicao(null)}
        onSave={(id, data) => handleSalvarEdicaoAcao(id, data, setLogMessage, onAcaoAtualizada)}
        getAtletaById={getAtletaById}
        atletas={(() => {
          const timeAcao = getTimeAtleta(acaoParaEditar.atleta_id);
          return timeAcao === 'A' ? [duplas.a1, duplas.a2] : [duplas.b1, duplas.b2];
        })()}
      />}
      {pontoParaEditar && <ModalEditarPonto
        ponto={pontoParaEditar}
        onClose={() => handleAbrirModalEdicaoPonto(null)}
        onSave={(pontoId, motivoPontoId) => handleSalvarEdicaoPonto(pontoId, motivoPontoId, setLogMessage, onMotivoPontoAtualizado)}
      />}

      <header className="grid grid-cols-3 items-center p-2 md:p-4 bg-black/30 shadow-lg relative z-20">
        <div className="text-left hidden md:block">
          <h2 className={`text-lg md:text-2xl font-bold ${duplasVisuais.esquerda.cor === 'blue' ? 'text-blue-400' : 'text-red-400'}`}>
            DUPLA {duplasVisuais.esquerda.dupla}
          </h2>
          <p className="text-xs md:text-sm text-gray-300 truncate">
            {duplasVisuais.esquerda.atletas[0].nome_atleta} / {duplasVisuais.esquerda.atletas[1].nome_atleta}
          </p>
        </div>
        <div className="text-center col-span-3 md:col-span-1">
          <h1 className="text-lg md:text-2xl font-bold hidden md:block">{partida.nome_partida}</h1>
          <div className="flex justify-center items-center">
            <button
              onClick={() => openPointModal(duplasVisuais.esquerda.dupla)}
              disabled={validacoes.botaoPontoDesabilitado}
              className={`text-xl md:text-2xl rounded-full w-7 h-7 md:w-14 md:h-10 flex items-center justify-center transition-colors
                ${validacoes.botaoPontoDesabilitado
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  : `bg-gray-700 hover:bg-${duplasVisuais.esquerda.cor === 'blue' ? 'blue' : 'red'}-600`}`}
            >
              ✚
            </button>
            <span className="text-4xl md:text-7xl font-black tracking-tighter mx-2 md:mx-4">{placarVisual.esquerda}</span>
            <span className="text-2xl md:text-5xl font-light text-gray-500">-</span>
            <span className="text-4xl md:text-7xl font-black tracking-tighter mx-2 md:mx-4">{placarVisual.direita}</span>
            <button
              onClick={() => openPointModal(duplasVisuais.direita.dupla)}
              disabled={validacoes.botaoPontoDesabilitado}
              className={`text-xl md:text-2xl rounded-full w-7 h-7 md:w-14 md:h-10 flex items-center justify-center transition-colors
                ${validacoes.botaoPontoDesabilitado
                  ? 'bg-gray-800 text-gray-600 cursor-not-allowed'
                  : `bg-gray-700 hover:bg-${duplasVisuais.direita.cor === 'blue' ? 'blue' : 'red'}-600`}`}
            >
              ✚
            </button>
          </div>
        </div>
        <div className="text-right flex flex-col items-end gap-2">
          <div className="hidden md:block">
            <h2 className={`text-lg md:text-2xl font-bold ${duplasVisuais.direita.cor === 'blue' ? 'text-blue-400' : 'text-red-400'}`}>
              DUPLA {duplasVisuais.direita.dupla}
            </h2>
            <p className="text-xs md:text-sm text-gray-300 truncate">
              {duplasVisuais.direita.atletas[0].nome_atleta} / {duplasVisuais.direita.atletas[1].nome_atleta}
            </p>
          </div>
          <button
            onClick={toggleLadosQuadra}
            className="bg-gray-700 hover:bg-gray-600 text-white text-xs py-1.5 px-3 rounded transition-colors flex items-center gap-2"
            title="Inverter lados da quadra"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
            <span className="hidden md:inline">Inverter Lados</span>
          </button>
        </div>
      </header>

      <div className="flex-1 flex flex-row overflow-hidden">
        <AcoesSidebar
          onSelectTecnica={(tecnicaId) => handleSelecionarTecnica(tecnicaId, setLogMessage)}
          onTogglePosition={toggleSidebarPosition}
          position={sidebarPosition}
          className={sidebarPosition === 'left' ? 'order-first' : 'order-last'}
          disabled={validacoes.tecnicaDesabilitada}
        />

        <main className="flex-1 flex flex-col md:flex-row p-2 md:p-4 gap-2 md:gap-4 overflow-hidden order-2">
          <div className="flex md:flex-col justify-around gap-2 md:gap-4 md:w-[15%] h-16 md:h-full">
            <ButtonAtleta
              atleta={duplasVisuais.esquerda.atletas[0]}
              onClick={() => setAtletaSelecionado(duplasVisuais.esquerda.atletas[0])}
              isSelecionado={atletaSelecionado?.atleta_id === duplasVisuais.esquerda.atletas[0].atleta_id}
              corTime={duplasVisuais.esquerda.cor}
              disabled={validacoes.atletaDesabilitado}
              isRallyStarted={acoesRally.length > 0}
              onSaqueClick={(atleta) => handleSaque(atleta, setLogMessage)}
              disabledSaque={validacoes.saqueDesabilitado}
              ehSacadorAtual={ehSacadorAtual(duplasVisuais.esquerda.atletas[0].atleta_id)}
            />
            <ButtonAtleta
              atleta={duplasVisuais.esquerda.atletas[1]}
              onClick={() => setAtletaSelecionado(duplasVisuais.esquerda.atletas[1])}
              isSelecionado={atletaSelecionado?.atleta_id === duplasVisuais.esquerda.atletas[1].atleta_id}
              corTime={duplasVisuais.esquerda.cor}
              disabled={validacoes.atletaDesabilitado}
              isRallyStarted={acoesRally.length > 0}
              onSaqueClick={(atleta) => handleSaque(atleta, setLogMessage)}
              disabledSaque={validacoes.saqueDesabilitado}
              ehSacadorAtual={ehSacadorAtual(duplasVisuais.esquerda.atletas[1].atleta_id)}
            />
          </div>

          <div className="flex-grow flex flex-col gap-3 min-h-0">
            <div className="flex-grow min-h-0">
              <DisplayQuadra
                activeZone={activeZone}
                onClickZona={(zonaInfo) => handleSelecionarZona(zonaInfo, setLogMessage, score, setScore)}
                disabled={validacoes.validacaoZona.desabilitado}
                obrigatorio={validacoes.validacaoZona.obrigatorio}
                isZonaDesabilitada={validacoes.isZonaDesabilitada}
                ladosInvertidos={ladosInvertidos}
              />
            </div>
            <div className="h-1/3 min-h-[100px] hidden md:flex">
              <RallyLog
                actions={acoesRally.length > 0 ? acoesRally : ultimoRally}
                isRallyActive={acoesRally.length > 0}
                getAtletaById={getAtletaById}
                getTimeAtleta={getTimeAtleta}
                motivoPonto={acoesRally.length > 0 ? null : motivoPontoUltimoRally}
                onActionClick={handleAbrirModalEdicao}
                onMotivoPontoClick={motivoPontoUltimoRally ? () => handleAbrirModalEdicaoPonto(motivoPontoUltimoRally) : null}
              />
            </div>
          </div>

          <div className="flex md:flex-col justify-around gap-2 md:gap-4 md:w-[15%] h-16 md:h-full">
            <ButtonAtleta
              atleta={duplasVisuais.direita.atletas[0]}
              onClick={() => setAtletaSelecionado(duplasVisuais.direita.atletas[0])}
              isSelecionado={atletaSelecionado?.atleta_id === duplasVisuais.direita.atletas[0].atleta_id}
              corTime={duplasVisuais.direita.cor}
              disabled={validacoes.atletaDesabilitado}
              isRallyStarted={acoesRally.length > 0}
              onSaqueClick={(atleta) => handleSaque(atleta, setLogMessage)}
              disabledSaque={validacoes.saqueDesabilitado}
              ehSacadorAtual={ehSacadorAtual(duplasVisuais.direita.atletas[0].atleta_id)}
            />
            <ButtonAtleta
              atleta={duplasVisuais.direita.atletas[1]}
              onClick={() => setAtletaSelecionado(duplasVisuais.direita.atletas[1])}
              isSelecionado={atletaSelecionado?.atleta_id === duplasVisuais.direita.atletas[1].atleta_id}
              corTime={duplasVisuais.direita.cor}
              disabled={validacoes.atletaDesabilitado}
              isRallyStarted={acoesRally.length > 0}
              onSaqueClick={(atleta) => handleSaque(atleta, setLogMessage)}
              disabledSaque={validacoes.saqueDesabilitado}
              ehSacadorAtual={ehSacadorAtual(duplasVisuais.direita.atletas[1].atleta_id)}
            />
          </div>
        </main>

        <PosicaoSidebar
          onSelectPosicao={handleSelecionarPosicao}
          posicaoAtual={activeZone?.zona}
          className={sidebarPosition === 'left' ? 'order-last' : 'order-first'}
          disabled={!atletaSelecionado}
        />
      </div>

      <footer className="bg-black/30 p-3 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <button
            className="btn-secondary py-2 px-4 text-sm"
            onClick={abrirModalVoltarPonto}
            disabled={validacoes.botaoVoltarPontoDesabilitado}
          >
            Voltar Ponto
          </button>
          <div className="flex-grow text-center text-sm text-gray-400 mx-2">
            <span className="font-mono bg-gray-800 px-3 py-1 rounded">{logMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setIsMicFeatureEnabled(prev => !prev)}
            className={`p-3 rounded-full transition-colors relative ${isEscutando ? 'bg-red-600 animate-pulse' : 'bg-gray-700 hover:bg-gray-600'}`}
          >
            <MicIcon className={`h-6 w-6 ${isMicFeatureEnabled ? 'text-white' : 'text-gray-400'}`} />
          </button>
          <button
            className="btn-secondary py-2 px-4 text-sm"
            onClick={() => abrirModalFinalizacao(setLogMessage)}
            disabled={validacoes.botaoFinalizarPartidaDesabilitado}
          >
            FINALIZAR
          </button>
        </div>
      </footer>
    </div>
  );
}

export default Partida;
