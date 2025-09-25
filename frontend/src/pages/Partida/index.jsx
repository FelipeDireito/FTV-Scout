import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import api from '../../services/api';
import { TECNICAS, TIPO_ACAO_ID, MOTIVOS_PONTO } from '../../constants/jogo';

const ButtonAtleta = ({ atleta, onClick, isSelecionado, corTime, disabled, isRallyStarted, onSaqueClick }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full h-full rounded-lg transition-all duration-200 ease-in-out transform focus:outline-none relative shadow-md flex flex-col items-center justify-center p-2 gap-1
      ${isSelecionado ? 'ring-4 ring-yellow-400 scale-105' : 'ring-2 ring-gray-700'}
      ${disabled ? 'bg-gray-700 text-gray-500 cursor-not-allowed' : `${corTime === 'blue' ? 'bg-blue-800/80 hover:bg-blue-700' : 'bg-red-800/80 hover:bg-red-700'} hover:scale-105`}
    `}
  >
    {isSelecionado && <div className="absolute inset-0 bg-black/30 rounded-lg"></div>}

    <span className="relative z-10 font-bold text-base sm:text-lg md:text-xl truncate w-full text-center">
      {atleta.nome_atleta}
    </span>

    {!isRallyStarted && !disabled && (
      <div
        onClick={(e) => {
          e.stopPropagation();
          onSaqueClick(atleta);
        }}
        className="relative z-20 bg-white text-black font-bold rounded-full shadow-lg hover:bg-gray-200 transition-colors cursor-pointer
                  text-xs py-1 px-3
                  sm:text-sm sm:py-1.5 sm:px-4"
        role="button"
        aria-label={`Registrar Saque para ${atleta.nome_atleta}`}
      >
        Saque
      </div>
    )}
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


const ModalPonto = ({ timeVencedor, onClose, onFinalizar }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md flex flex-col max-h-[90vh]">
        <div className="flex-shrink-0 p-4 sm:p-5 border-b border-gray-700/60">
          <h3 className={`text-xl sm:text-2xl font-bold text-center ${timeVencedor === 'A' ? 'text-blue-400' : 'text-red-400'}`}>
            Ponto para a Dupla {timeVencedor}
          </h3>
        </div>

        <div className="flex-grow overflow-y-auto p-4 sm:p-6 space-y-4">
          <p className="text-center text-gray-300">Selecione o motivo do ponto:</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {MOTIVOS_PONTO.map(motivo => (
              <button
                key={motivo.id}
                onClick={() => onFinalizar(motivo.id)}
                className="btn-primary text-base py-2 sm:py-3"
              >
                {motivo.descricao}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-shrink-0 p-4 sm:p-5 border-t border-gray-700/60">
          <button onClick={onClose} className="btn-secondary w-full py-2 sm:py-3">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

const ModalVoltarPonto = ({ onClose, onFinalizar }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md flex flex-col">
        <div className="p-6 border-b border-gray-700">
          <h3 className="text-2xl font-bold text-center text-yellow-400">
            Voltar Último Ponto?
          </h3>
        </div>

        <div className="p-6 space-y-4">
          <p className="text-center text-gray-300">
            Tem certeza que deseja excluir o último ponto registrado?
          </p>
          <p className="text-center text-sm text-red-400 font-semibold">
            Esta ação não pode ser desfeita.
          </p>
        </div>

        <div className="p-4 bg-gray-900/50 rounded-b-xl">
          <div className="flex justify-center gap-4">
            <button onClick={onClose} className="btn-secondary px-8 py-3">Cancelar</button>
            <button onClick={onFinalizar} className="btn-primary bg-red-600 hover:bg-red-700 px-8 py-3">Confirmar e Excluir</button>
          </div>
        </div>
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


const ModalFinalizarPartida = ({ score, pontos, partida, onClose, onFinalizar }) => {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-2 sm:p-4 lg:p-8">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md sm:max-w-lg lg:max-w-xl flex flex-col max-h-[90vh]">
        <div className="flex-shrink-0 p-4 sm:p-5 lg:p-6 border-b border-gray-700/60">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center text-white">Finalizar Partida?</h2>
        </div>

        <div className="flex-grow overflow-y-auto p-4 sm:p-6 lg:p-8 space-y-4">
          <div className="text-center bg-gray-900 p-3 sm:p-4 rounded-lg">
            <p className="text-base sm:text-lg text-gray-400">Placar Final</p>
            <div>
              <span className="text-5xl sm:text-6xl lg:text-7xl font-black text-blue-400 tracking-tighter">{score.a}</span>
              <span className="text-3xl sm:text-4xl lg:text-5xl font-light text-gray-500 mx-2 sm:mx-4">-</span>
              <span className="text-5xl sm:text-6xl lg:text-7xl font-black text-red-400 tracking-tighter">{score.b}</span>
            </div>
          </div>

          <div className="bg-gray-900/50 rounded-lg p-2 sm:p-3 hidden sm:block">
            <h3 className="text-sm sm:text-base font-semibold text-gray-300 mb-2 text-center">Resumo dos Pontos</h3>
            <div className="overflow-y-auto max-h-24 sm:max-h-32 lg:max-h-48 pr-2 text-xs sm:text-sm">
              {pontos && pontos.length > 0 ? (
                <table className="w-full text-left">
                  <thead className="text-xs uppercase text-gray-400 border-b border-gray-700">
                    <tr>
                      <th className="py-1 px-2">Ponto</th>
                      <th className="py-1 px-2">Dupla</th>
                      <th className="py-1 px-2">Motivo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pontos.map((ponto, index) => (
                      <tr key={index} className="border-b border-gray-800 hover:bg-gray-800/50">
                        <td className="py-1 px-2">{ponto.numero_ponto_partida || index + 1}</td>
                        <td className="py-1 px-2">
                          {ponto.dupla_vencedora_id ? (
                            <span className={ponto.dupla_vencedora_id === partida.dupla_a_id ? "text-blue-400" : "text-red-400"}>
                              {ponto.dupla_vencedora_id === partida.dupla_a_id ? "A" : "B"}
                            </span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </td>
                        <td className="py-1 px-2">{MOTIVOS_PONTO.find(m => m.id === ponto.motivo_ponto_id)?.descricao}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-center text-gray-500 py-4">Nenhum ponto registrado ainda.</p>
              )}
            </div>
          </div>

          {/* Para telas pequenas */}
          <div className="bg-gray-900/50 rounded-lg p-3 sm:hidden">
            <p className="text-center text-gray-300 py-2 text-sm">
              {pontos && pontos.length > 0
                ? `${pontos.length} ${pontos.length === 1 ? 'ponto registrado' : 'pontos registrados'}`
                : "Nenhum ponto registrado ainda"}
            </p>
          </div>

          <p className="text-center text-sm sm:text-base text-gray-300 !mt-5">
            Ao confirmar, a partida será encerrada.
          </p>
        </div>

        <div className="flex-shrink-0 p-4 sm:p-5 lg:p-6 border-t border-gray-700/60">
          <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
            <button onClick={onClose} className="btn-secondary px-6 py-2 sm:px-8 sm:py-3 text-base lg:text-lg lg:px-10">
              Cancelar
            </button>
            <button onClick={onFinalizar} className="btn-primary bg-green-600 hover:bg-green-700 px-6 py-2 sm:px-8 sm:py-3 text-base lg:text-lg lg:px-10">
              Confirmar e Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};


function Partida() {
  const location = useLocation();
  const navigate = useNavigate();

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
  const [logMessage, setLogMessage] = useState("Selecione um atleta para iniciar o rally.");
  const [rallyId, setRallyId] = useState(uuidv4());
  const [acoesRally, setAcoesRally] = useState([]);
  const [isModalPontoOpen, setIsPontoModalOpen] = useState(false);
  const [timeVencedorForModal, setTimeVencedorForModal] = useState(null);
  const [isModalFinalizarOpen, setIsModalFinalizarOpen] = useState(false);
  const [pontosPartida, setPontosPartida] = useState([]);
  const [isModalVoltarPontoOpen, setIsModalVoltarPontoOpen] = useState(false);
  const [pontoPendente, setPontoPendente] = useState(null);

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

  const abrirModalFinalizacao = async () => {
    try {
      setLogMessage("Carregando resumo da partida...");

      const response = await api.get(`/pontuacao/${partida.partida_id}`);

      setPontosPartida(response.data);
      setIsModalFinalizarOpen(true);

      setLogMessage("Selecione um atleta e uma técnica para iniciar o rally.");
    } catch (error) {
      console.error("Erro ao buscar pontos da partida:", error);
      setLogMessage("Erro ao carregar resumo da partida.");

      setIsModalFinalizarOpen(true);
    }
  };

  const fecharModalFinalizacao = () => {
    setIsModalFinalizarOpen(false);
  };

  const handleFinalizarPartida = async () => {
    const patchPartida = {
      partida_id: partida.partida_id,
      dupla_vencedora_id: score.a > score.b ? partida.dupla_a_id : partida.dupla_b_id,
      placar_final_dupla_a: score.a,
      placar_final_dupla_b: score.b,
    };

    try {
      setIsModalFinalizarOpen(false);

      await api.patch(`/partidas/${partida.partida_id}`, patchPartida);
      console.log("Partida finalizada: ", patchPartida);

      navigate('/');

    } catch (error) {
      console.error("Erro ao finalizar a partida:", error);
      alert("Falha ao finalizar a partida.");
    }
  }

  const abrirModalVoltarPonto = async () => {
    setIsModalVoltarPontoOpen(true);
  };

  const fecharModalVoltarPonto = async () => {
    setIsModalVoltarPontoOpen(false)
  }

  const handleVoltarPonto = async () => {
    try {
      setLogMessage("Excluindo último ponto...");

      const response = await api.delete(`/pontuacao/voltar_ponto/${partida.partida_id}`);
      const pontoExcluido = response.data;
      console.log(pontoExcluido)

      if (pontoExcluido && pontoExcluido.dupla_vencedora_id) {
        const timePonto = pontoExcluido.dupla_vencedora_id === partida.dupla_a_id ? 'a' : 'b';

        setScore(prev => {
          const newScore = prev[timePonto] > 0 ? prev[timePonto] - 1 : 0;
          return { ...prev, [timePonto]: newScore };
        });

        setAcoesRally([]);
        setRallyId(uuidv4());
        setLogMessage("Último ponto removido. Novo rally.");
      } else {
        alert("Não há pontos registrados para serem removidos.");
      }
    } catch (error) {
      console.error("Erro ao voltar o ponto:", error);
      alert("Falha ao remover o último ponto. Verifique o console para mais detalhes.");
    } finally {
      setIsModalVoltarPontoOpen(false);
    }
  };

  const handleSelecionarTecnica = async (tecnicaId) => {
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
      posicao_quadra: activeZone?.zona
    };


    try {
      console.log("--- SIMULANDO ENVIO DE AÇÃO PARA API ---");
      console.log(JSON.stringify(acaoData, null, 2));

      const resposta = await api.post('/pontuacao/acao', acaoData);
      const acaoSalva = resposta.data;
      console.log("Ação registrada com sucesso!", acaoSalva);

      setAcoesRally(prev => [...prev, acaoSalva]);

      const tecnicaName = TECNICAS.find(t => t.id === tecnicaId)?.nome;
      setLogMessage(`Ação registrada: ${atletaSelecionado.nome_atleta.split(' ')[0]} (${tecnicaName})`);

      setAtletaSelecionado(null);
      setActiveZone(null);

    } catch (error) {
      console.error("Erro ao registrar ação na API:", error);
      alert("Falha ao registrar a ação.");
    }
  };

  const handleSaque = async (atleta) => {
    if (acoesRally.length > 0) return;

    const acaoData = {
      rally_id: rallyId,
      atleta_id: atleta.atleta_id,
      tipo_acao_id: TIPO_ACAO_ID.SAQUE,
      tecnica_acao_id: 6,
      posicao_quadra: null
    };

    try {
      setLogMessage(`Registrando Saque para ${atleta.nome_atleta.split(' ')[0]}...`);
      const resposta = await api.post('/pontuacao/acao', acaoData);
      const acaoSalva = resposta.data;

      setAcoesRally(prev => [...prev, acaoSalva]);

      const tecnicaName = TECNICAS.find(t => t.id === 6)?.nome;
      setLogMessage(`Saque registrado: ${atleta.nome_atleta.split(' ')[0]} (${tecnicaName})`);

      setAtletaSelecionado(null);
      setActiveZone(null);
    } catch (error) {
      console.error("Erro ao registrar saque rápido:", error);
      alert("Falha ao registrar o saque rápido.");
      setLogMessage("Selecione um atleta para iniciar o rally.");
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

  const handleFinalizarPonto = async (motivoPontoId, zonaFornecida = null) => {
    const timeVencedor = pontoPendente ? pontoPendente.timeVencedor : timeVencedorForModal;
    const duplaVencedoraId = timeVencedor === 'A' ? partida.dupla_a_id : partida.dupla_b_id;

    const lastAction = acoesRally[acoesRally.length - 1];

    const motivosExigemZona = [3, 5]; // "Ataque" e "Saque/Ace"

    if (motivosExigemZona.includes(motivoPontoId) && !lastAction.posicao_quadra && !zonaFornecida) {
      setPontoPendente({ timeVencedor, motivoPontoId });
      setIsPontoModalOpen(false);
      setLogMessage(`PONTO: Selecione na quadra ONDE a bola caiu.`);
      return;
    }

    let atletaPontoId = null;
    let atletaErroId = null;

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
      await api.post('/pontuacao/ponto', pointData);

      setScore(prev => ({ ...prev, [timeVencedor.toLowerCase()]: prev[timeVencedor.toLowerCase()] + 1 }));
      setLogMessage(`Ponto para a Dupla ${timeVencedor}! Novo rally.`);

      setAcoesRally([]);
      setRallyId(uuidv4());
    } catch (error) {
      console.error("Erro ao finalizar o ponto:", error);
      alert("Falha ao registrar o ponto.");
    } finally {
      setIsPontoModalOpen(false);
      setPontoPendente(null);
      setActiveZone(null);
    }
  };

  const handleSelecionarZona = async (zonaInfo) => {
    if (pontoPendente) {
      const lastAction = acoesRally[acoesRally.length - 1];

      try {
        setLogMessage("Atualizando ação com a zona...");

        const patchData = {
          posicao_quadra: zonaInfo.zona,
        };

        // console.log(patchData, lastAction.acao_id)
        await api.patch(`/pontuacao/acao/${lastAction.acao_id}`, patchData);

        const acoesAtualizadas = [...acoesRally];
        acoesAtualizadas[acoesAtualizadas.length - 1] = { ...lastAction, ...patchData };
        setAcoesRally(acoesAtualizadas);

        await handleFinalizarPonto(pontoPendente.motivoPontoId, zonaInfo);

      } catch (error) {
        console.error("Erro ao atualizar a ação com a zona:", error);
        alert("Não foi possível atualizar a localização da ação.");
        setPontoPendente(null);
      }

    } else {
      setActiveZone(zonaInfo);
      setLogMessage(`Zona ${zonaInfo.zona} (${zonaInfo.side}) selecionada.`);
    }
  };


  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">
      {isModalPontoOpen && <ModalPonto timeVencedor={timeVencedorForModal} onClose={() => setIsPontoModalOpen(false)} onFinalizar={handleFinalizarPonto} />}
      {isModalFinalizarOpen && <ModalFinalizarPartida score={score} pontos={pontosPartida} partida={partida} onClose={fecharModalFinalizacao} onFinalizar={handleFinalizarPartida} />}
      {isModalVoltarPontoOpen && <ModalVoltarPonto onClose={fecharModalVoltarPonto} onFinalizar={handleVoltarPonto} />}

      <header className="grid grid-cols-3 items-center p-2 md:p-4 bg-black/30 shadow-lg relative z-20">
        <div className="text-left hidden md:block">
          <h2 className="text-lg md:text-2xl font-bold text-blue-400">DUPLA A</h2>
          <p className="text-xs md:text-sm text-gray-300 truncate">{duplas.a1.nome_atleta} / {duplas.a2.nome_atleta}</p>
        </div>
        <div className="text-center col-span-3 md:col-span-1">
          <h1 className="text-lg md:text-2xl font-bold hidden md:block">{partida.nome_partida}</h1>
          <div className="flex justify-center items-center">
            <button onClick={() => openPointModal('A')} className="text-xl md:text-2xl bg-gray-700 rounded-full w-7 h-7 md:w-8 md:h-8 flex items-center justify-center hover:bg-blue-600 transition-colors">+</button>
            <span className="text-4xl md:text-7xl font-black tracking-tighter mx-2 md:mx-4">{score.a}</span>
            <span className="text-2xl md:text-5xl font-light text-gray-500">-</span>
            <span className="text-4xl md:text-7xl font-black tracking-tighter mx-2 md:mx-4">{score.b}</span>
            <button onClick={() => openPointModal('B')} className="text-xl md:text-2xl bg-gray-700 rounded-full w-7 h-7 md:w-8 md:h-8 flex items-center justify-center hover:bg-red-600 transition-colors">+</button>
          </div>
        </div>
        <div className="text-right hidden md:block">
          <h2 className="text-lg md:text-2xl font-bold text-red-400">DUPLA B</h2>
          <p className="text-xs md:text-sm text-gray-300 truncate">{duplas.b1.nome_atleta} / {duplas.b2.nome_atleta}</p>
        </div>
      </header>

      <main className="flex-1 flex flex-col md:flex-row p-2 md:p-4 gap-2 md:gap-4 overflow-hidden">
        <div className="flex md:flex-col justify-around gap-2 md:gap-4 md:w-[15%] h-16 md:h-full">
          <ButtonAtleta atleta={duplas.a1} onClick={() => setAtletaSelecionado(duplas.a1)} isSelecionado={atletaSelecionado?.atleta_id === duplas.a1.atleta_id} corTime="blue" disabled={!!pontoPendente} isRallyStarted={acoesRally.length > 0} onSaqueClick={handleSaque} />
          <ButtonAtleta atleta={duplas.a2} onClick={() => setAtletaSelecionado(duplas.a2)} isSelecionado={atletaSelecionado?.atleta_id === duplas.a2.atleta_id} corTime="blue" disabled={!!pontoPendente} isRallyStarted={acoesRally.length > 0} onSaqueClick={handleSaque} />
        </div>

        <div className="flex-grow flex flex-col gap-3 min-h-0">
          <div className="flex-grow min-h-0">
            <DisplayQuadra activeZone={activeZone} onClickZona={handleSelecionarZona} />
          </div>
          <div className="h-1/3 min-h-[150px] hidden md:flex">
            <RallyLog actions={acoesRally} getAtletaById={getAtletaById} />
          </div>
        </div>

        <div className="flex md:flex-col justify-around gap-2 md:gap-4 md:w-[15%] h-16 md:h-full">
          <ButtonAtleta atleta={duplas.b1} onClick={() => setAtletaSelecionado(duplas.b1)} isSelecionado={atletaSelecionado?.atleta_id === duplas.b1.atleta_id} corTime="red" disabled={!!pontoPendente} isRallyStarted={acoesRally.length > 0} onSaqueClick={handleSaque} />
          <ButtonAtleta atleta={duplas.b2} onClick={() => setAtletaSelecionado(duplas.b2)} isSelecionado={atletaSelecionado?.atleta_id === duplas.b2.atleta_id} corTime="red" disabled={!!pontoPendente} isRallyStarted={acoesRally.length > 0} onSaqueClick={handleSaque} />
        </div>
      </main>

      <footer className="bg-black/30 p-3 shadow-lg space-y-3">
        <div className="flex justify-center gap-2 md:gap-3 flex-wrap">
          {TECNICAS.map(tecnica => (
            <button key={tecnica.id} onClick={() => handleSelecionarTecnica(tecnica.id)} className="btn-acao">
              {tecnica.nome}
            </button>
          ))}
        </div>
        <div className="flex items-center justify-between">
          <button className="btn-secondary py-2 px-4 text-sm" onClick={abrirModalVoltarPonto}>Voltar Ponto</button>
          <div className="flex-grow text-center text-sm text-gray-400 mx-2">
            <span className="font-mono bg-gray-800 px-3 py-1 rounded">{logMessage}</span>
          </div>
          <button className="btn-secondary py-2 px-4 text-sm" onClick={abrirModalFinalizacao}>FINALIZAR</button>
        </div>
      </footer>
    </div>
  );
}

export default Partida;
