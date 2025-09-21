import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import api from '../../services/api';
import { TECNICAS, TIPO_ACAO_ID, MOTIVOS_PONTO } from '../../constants/jogo';

const ButtonAtleta = ({ atleta, onClick, isSelecionado, corTime }) => (
  <button
    onClick={onClick}
    className={`w-full h-full text-lg md:text-2xl font-bold rounded-lg transition-all duration-200 ease-in-out transform hover:scale-105 focus:outline-none relative shadow-md
      ${corTime === 'blue' ? 'bg-blue-800/80 hover:bg-blue-700' : 'bg-red-800/80 hover:bg-red-700'}
      ${isSelecionado ? 'ring-4 ring-yellow-400 scale-105' : 'ring-2 ring-gray-700'}
    `}
  >
    {isSelecionado && <div className="absolute inset-0 bg-black/30 rounded-lg"></div>}
    <span className="relative z-10">{atleta.nome_atleta}</span>
  </button>
);

const DisplayQuadra = ({ activeZone, onClickZona }) => {
  const renderZona = (side, numeroZona) => {
    const isSelecionado = activeZone?.side === side && activeZone?.zona === numeroZona;
    return (
      <div
        key={`${side}-${numeroZona}`}
        onClick={() => onClickZona({ side, zona: numeroZona })}
        className={`relative flex items-center justify-center cursor-pointer transition-all duration-150 ease-in-out border border-white/40 text-gray-800 font-bold text-xl md:text-2xl rounded-sm ${isSelecionado ? 'bg-sky-500/80 text-white shadow-lg' : 'hover:bg-sky-500/30'}`}
      >
        {numeroZona}
        {isSelecionado && <div className="absolute inset-0 border-4 border-white rounded-sm animate-pulse"></div>}
      </div>
    );
  };
  return (
    <div className="w-full h-full bg-yellow-500 bg-opacity-80 rounded-xl p-2 md:p-3 flex flex-row relative shadow-lg overflow-hidden">
      <div className="absolute left-1/2 top-0 h-full w-0.5 bg-white z-10 -translate-x-1/2"></div>
      <div className="flex-1 h-full grid grid-cols-2 grid-rows-3 gap-1 md:gap-2 p-1 relative z-0">
        {[5, 4, 6, 3, 1, 2].map(zona => renderZona('A', zona))}
      </div>
      <div className="h-full w-1.5 bg-gray-600 relative z-0"></div>
      <div className="flex-1 h-full grid grid-cols-2 grid-rows-3 gap-1 md:gap-2 p-1 relative z-0">
        {[2, 1, 3, 6, 4, 5].map(zona => renderZona('B', zona))}
      </div>
    </div>
  );
};


const ModalPonto = ({ timeVencedor, onClose, onFinalize }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 p-6 rounded-xl shadow-2xl w-full max-w-md space-y-4">
        <h3 className={`text-2xl font-bold text-center ${timeVencedor === 'A' ? 'text-blue-400' : 'text-red-400'}`}>
          Ponto para a Dupla {timeVencedor}
        </h3>
        <p className="text-center text-gray-300">Selecione o motivo do ponto:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {MOTIVOS_PONTO.map(motivo => (
            <button
              key={motivo.id}
              onClick={() => onFinalize(motivo.id)}
              className="btn-primary text-base py-3"
            >
              {motivo.descricao}
            </button>
          ))}
        </div>
        <button onClick={onClose} className="btn-secondary w-full mt-2">
          Cancelar
        </button>
      </div>
    </div>
  );
};

const RallyLog = ({ actions, getAtletaById }) => {
  const getTecnicaNome = (id) => TECNICAS.find(t => t.id === id)?.nome || 'N/A';

  const scrollContainerRef = useRef(null);

  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;

      container.scrollTop = container.scrollHeight;
    }
  }, [actions]);

  return (
    <div className="flex-grow bg-gray-800/50 rounded-lg p-3 flex flex-col">
      <h3 className="text-lg font-semibold text-center text-gray-300 mb-2 border-b border-gray-600 pb-2">Rally Atual</h3>
      <div ref={scrollContainerRef} className="flex-grow overflow-y-auto space-y-1 pr-2">
        {actions.length === 0 ? (
          <p className="text-gray-500 text-center mt-4">Aguardando o saque...</p>
        ) : (
          actions.map((action, index) => (
            <div key={index} className="bg-gray-900/70 p-2 rounded-md text-sm">
              <span className="font-bold text-sky-400">{index + 1}. </span>
              <span className="font-semibold">{getAtletaById(action.atleta_id)?.nome_atleta.split(' ')[0]}</span>
              <span className="text-gray-400"> - {getTecnicaNome(action.tecnica_acao_id)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};



function Partida() {
  const location = useLocation();
  // const navigate = useNavigate();

  const { partida, duplas } = location.state || {
    partida: { partida_id: 1, nome_partida: 'Partida Teste', dupla_a_id: 1, dupla_b_id: 2 },
    duplas: {
      a1: { atleta_id: 1, nome_atleta: 'Atleta A1' }, a2: { atleta_id: 2, nome_atleta: 'Atleta A2' },
      b1: { atleta_id: 3, nome_atleta: 'Atleta B1' }, b2: { atleta_id: 4, nome_atleta: 'Atleta B2' },
    }
  };

  const [score, setScore] = useState({ a: 0, b: 0 });
  const [atletaSelecionado, setAtletaSelecionado] = useState(null);
  const [activeZone, setActiveZone] = useState(null);
  const [logMessage, setLogMessage] = useState("Selecione um atleta e uma técnica para iniciar o rally.");
  const [rallyId, setRallyId] = useState(uuidv4());
  const [acoesRally, setAcoesRally] = useState([]);
  const [isModalPontoOpen, setIsPontoModalOpen] = useState(false);
  const [timeVencedorForModal, setTimeVencedorForModal] = useState(null);

  const getTimeAtleta = (atletaId) => {
    if (duplas.a1.atleta_id === atletaId || duplas.a2.atleta_id === atletaId) return 'A';
    if (duplas.b1.atleta_id === atletaId || duplas.b2.atleta_id === atletaId) return 'B';
    return null;
  };

  const getAtletaById = (atletaId) => {
    for (const key in duplas) {
      if (duplas[key].atleta_id === atletaId) {
        return duplas[key];
      }
    }
    return null;
  }

  const handleFinalizarPartida = async () => {
    const patchPartida = {
      partida_id: partida.partida_id,
      dupla_vencedora_id: score.a > score.b ? partida.dupla_a_id : partida.dupla_b_id,
      placar_final_dupla_a: score.a,
      placar_final_dupla_b: score.b,
    };

    try {
      await api.patch(`/partidas/${partida.partida_id}`, patchPartida);
      console.log("Partida finalizada: ", patchPartida);

    } catch (error) {
      console.error("Erro ao finalizar a partida:", error);
      alert("Falha ao finalizar a partida.");
    }
  }

  const handleSelectTecnica = async (tecnicaId) => {
    if (!atletaSelecionado) {
      setLogMessage("ERRO: Selecione um JOGADOR primeiro!");
      setTimeout(() => setLogMessage("Selecione um atleta e uma técnica..."), 2000);
      return;
    }

    let tipoAcaoId = 0;
    const tamanhoRally = acoesRally.length;

    if (tamanhoRally === 0) {
      tipoAcaoId = TIPO_ACAO_ID.SAQUE;
    } else {
      const lastAction = acoesRally[tamanhoRally - 1];
      const timeAtletaAtual = getTimeAtleta(atletaSelecionado.atleta_id);
      const timeUltimoJogador = getTimeAtleta(lastAction.atleta_id);
      tipoAcaoId = (timeAtletaAtual !== timeUltimoJogador)
        ? TIPO_ACAO_ID.RECEPCAO_DEFESA
        : TIPO_ACAO_ID.LEVANTAMENTO;
    }

    const acaoData = {
      rally_id: rallyId,
      atleta_id: atletaSelecionado.atleta_id,
      tipo_acao_id: tipoAcaoId,
      tecnica_acao_id: tecnicaId,
    };


    try {
      console.log("--- SIMULANDO ENVIO DE AÇÃO PARA API ---");
      console.log(JSON.stringify(acaoData, null, 2));
      await api.post('/pontuacao/acao', acaoData);
      console.log("Ação registrada com sucesso!");

      setAcoesRally(prev => [...prev, acaoData]);
      const tecnicaName = TECNICAS.find(t => t.id === tecnicaId)?.nome;
      setLogMessage(`Ação registrada: ${atletaSelecionado.nome_atleta.split(' ')[0]} (${tecnicaName})`);
      setAtletaSelecionado(null);

    } catch (error) {
      console.error("Erro ao registrar ação na API:", error);
      alert("Falha ao registrar a ação.");
    }
  };

  const openPointModal = (timeVencedor) => {
    if (acoesRally.length === 0) {
      alert("Inicie o rally registrando uma ação (saque) antes de pontuar.");
      return;
    }
    setTimeVencedorForModal(timeVencedor);
    setIsPontoModalOpen(true);
  };

  const handleFinalizarPointo = async (motivoPontoId) => {
    const duplaVencedoraId = timeVencedorForModal === 'A' ? partida.dupla_a_id : partida.dupla_b_id;

    let atletaPontoId = null;
    let atletaErroId = null;

    const lastAction = acoesRally[acoesRally.length - 1];

    if (lastAction) {
      const lastPlayerId = lastAction.atleta_id;

      const motivoPonto = [3, 4, 5];
      const motivoErro = [1, 2];

      if (motivoPonto.includes(motivoPontoId)) {
        atletaPontoId = lastPlayerId;
      } else if (motivoErro.includes(motivoPontoId)) {
        atletaErroId = lastPlayerId;
      }
    }

    const pointData = {
      rally_id: rallyId,
      partida_id: partida.partida_id,
      dupla_vencedora_id: duplaVencedoraId,
      motivo_ponto_id: motivoPontoId,
      numero_ponto_partida: score.a + score.b + 1,
      atleta_ponto_id: atletaPontoId,
      atleta_erro_id: atletaErroId,
    };

    try {
      console.log("--- SIMULANDO ENVIO DE PONTO PARA API ---");
      console.log(JSON.stringify(pointData, null, 2));
      await api.post('/pontuacao/ponto', pointData);
      console.log("Ponto registrado com sucesso!", pointData);

      setScore(prev => ({ ...prev, [timeVencedorForModal.toLowerCase()]: prev[timeVencedorForModal.toLowerCase()] + 1 }));
      setLogMessage(`Ponto para a Dupla ${timeVencedorForModal}! Novo rally.`);

      setAcoesRally([]);
      setRallyId(uuidv4());

    } catch (error) {
      console.error("Erro ao finalizar o ponto:", error);
      alert("Falha ao registrar o ponto.");
    } finally {
      setIsPontoModalOpen(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">
      {isModalPontoOpen && <ModalPonto timeVencedor={timeVencedorForModal} onClose={() => setIsPontoModalOpen(false)} onFinalize={handleFinalizarPointo} />}

      <header className="grid grid-cols-3 items-center p-4 bg-black/30 shadow-lg relative z-20">
        <div className="text-left">
          <h2 className="text-lg md:text-2xl font-bold text-blue-400">DUPLA A</h2>
          <p className="text-xs md:text-sm text-gray-300 truncate">{duplas.a1.nome_atleta} / {duplas.a2.nome_atleta}</p>
        </div>
        <div className="text-center">
          <h1 className="text-lg md:text-2xl font-bold">{partida.nome_partida}</h1>
          <div className="flex justify-center items-center">
            <button onClick={() => openPointModal('A')} className="text-2xl bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center hover:bg-blue-600 transition-colors">+</button>
            <span className="text-5xl md:text-7xl font-black tracking-tighter mx-2 md:mx-4">{score.a}</span>
            <span className="text-3xl md:text-5xl font-light text-gray-500">-</span>
            <span className="text-5xl md:text-7xl font-black tracking-tighter mx-2 md:mx-4">{score.b}</span>
            <button onClick={() => openPointModal('B')} className="text-2xl bg-gray-700 rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors">+</button>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-lg md:text-2xl font-bold text-red-400">DUPLA B</h2>
          <p className="text-xs md:text-sm text-gray-300 truncate">{duplas.b1.nome_atleta} / {duplas.b2.nome_atleta}</p>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row p-3 md:p-4 gap-3 md:gap-4 overflow-y-auto">
        <div className="flex md:flex-col justify-around gap-3 md:gap-4 md:w-[15%] h-20 md:h-full">
          <ButtonAtleta atleta={duplas.a1} onClick={() => setAtletaSelecionado(duplas.a1)} isSelecionado={atletaSelecionado?.atleta_id === duplas.a1.atleta_id} corTime="blue" />
          <ButtonAtleta atleta={duplas.a2} onClick={() => setAtletaSelecionado(duplas.a2)} isSelecionado={atletaSelecionado?.atleta_id === duplas.a2.atleta_id} corTime="blue" />
        </div>

        <div className="flex-grow flex flex-col gap-3 min-h-0">
          <div className="flex-grow min-h-0">
            <DisplayQuadra activeZone={activeZone} onClickZona={setActiveZone} />
          </div>
          <div className="h-1/3 min-h-[150px] flex">
            <RallyLog actions={acoesRally} getAtletaById={getAtletaById} />
          </div>
        </div>

        <div className="flex md:flex-col justify-around gap-3 md:gap-4 md:w-[15%] h-20 md:h-full">
          <ButtonAtleta atleta={duplas.b1} onClick={() => setAtletaSelecionado(duplas.b1)} isSelecionado={atletaSelecionado?.atleta_id === duplas.b1.atleta_id} corTime="red" />
          <ButtonAtleta atleta={duplas.b2} onClick={() => setAtletaSelecionado(duplas.b2)} isSelecionado={atletaSelecionado?.atleta_id === duplas.b2.atleta_id} corTime="red" />
        </div>
      </main>

      <footer className="bg-black/30 p-3 shadow-lg space-y-3">
        <div className="flex justify-center gap-2 md:gap-3 flex-wrap">
          {TECNICAS.map(tecnica => (
            <button key={tecnica.id} onClick={() => handleSelectTecnica(tecnica.id)} className="btn-acao">
              {tecnica.nome}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <button className="btn-secondary py-2 px-4 text-sm">DESFAZER</button>
          <div className="flex-grow text-center text-sm text-gray-400 mx-2">
            <span className="font-mono bg-gray-800 px-3 py-1 rounded">{logMessage}</span>
          </div>
          <button className="btn-secondary py-2 px-4 text-sm" onClick={() => handleFinalizarPartida()}  >FINALIZAR</button>
        </div>
      </footer>
    </div>
  );
}

export default Partida;

