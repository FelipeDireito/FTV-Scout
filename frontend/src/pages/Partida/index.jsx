import  { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import api from '../../services/api';
import { TECNICAS, TIPO_ACAO_ID } from '../../constants/jogo';
import useFalaParaTexto from '../../hooks/useFalaParaTexto';
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
  const [ultimoRally, setUltimoRally] = useState([]);
  const [isModalPontoOpen, setIsPontoModalOpen] = useState(false);
  const [timeVencedorForModal, setTimeVencedorForModal] = useState(null);
  const [isModalFinalizarOpen, setIsModalFinalizarOpen] = useState(false);
  const [pontosPartida, setPontosPartida] = useState([]);
  const [isModalVoltarPontoOpen, setIsModalVoltarPontoOpen] = useState(false);
  const [pontoPendente, setPontoPendente] = useState(null);
  const [acaoParaEditar, setAcaoParaEditar] = useState(null);

  const [sidebarPosition, setSidebarPosition] = useState('right');
  // Fala para texto
  const { texto, startEscutando, stopEscutando, isEscutando, setTexto } = useFalaParaTexto({ continuous: true });
  const [isMicFeatureEnabled, setIsMicFeatureEnabled] = useState(true);

  useEffect(() => {
    const rallyEmAndamento = acoesRally.length > 0;

    if (isMicFeatureEnabled && rallyEmAndamento && !isEscutando) {
      startEscutando();
    } else if ((!isMicFeatureEnabled || !rallyEmAndamento) && isEscutando) {
      stopEscutando();
    }
  }, [acoesRally, isMicFeatureEnabled, isEscutando, startEscutando, stopEscutando]);

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

        setUltimoRally([]);
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

  const handleSelecionarTecnica = useCallback(async (tecnicaId) => {
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
      posicao_quadra_origem: activeZone?.zona
    };


    try {
      const resposta = await api.post('/pontuacao/acao', acaoData);
      const acaoSalva = resposta.data;
      console.log("Ação registrada com sucesso!", acaoSalva);

      if (acoesRally.length > 0 && acaoSalva.posicao_quadra_origem) {
        const ultimaAcao = acoesRally[acoesRally.length - 1];
        const updateDataDestino = {
          posicao_quadra_destino: acaoSalva.posicao_quadra_origem
        };

        try {
          const respostaPatch = await api.patch(`/pontuacao/acao/${ultimaAcao.acao_id}`, updateDataDestino);
          const ultimaAcaoAtualizada = respostaPatch.data;

          setAcoesRally(prevAcoes =>
            prevAcoes.map(acao =>
              acao.acao_id === ultimaAcao.acao_id ? ultimaAcaoAtualizada : acao
            )
          );

        } catch (patchError) {
          console.error("Erro ao atualizar ação com destino:", patchError);
        }
      }

      setAcoesRally(prev => [...prev, acaoSalva]);

      const tecnicaName = TECNICAS.find(t => t.id === tecnicaId)?.nome;
      setLogMessage(`Ação registrada: ${atletaSelecionado.nome_atleta.split(' ')[0]} (${tecnicaName})`);

      setAtletaSelecionado(null);
      setActiveZone(null);

    } catch (error) {
      console.error("Erro ao registrar ação na API:", error);
      alert("Falha ao registrar a ação.");
    }
  }, [atletaSelecionado, acoesRally, rallyId, activeZone, getTimeAtleta]);

  useEffect(() => {

    if (texto && atletaSelecionado) {
      const textoLimpo = texto.trim().toLowerCase().replace('.', '');
      const tecnicaEncontrada = TECNICAS.find(t => t.nome.toLowerCase() === textoLimpo);

      if (tecnicaEncontrada) {
        console.log(`Voz para ${atletaSelecionado.nome_atleta}: ${tecnicaEncontrada.nome}`);
        setLogMessage(`Voz: ${atletaSelecionado.nome_atleta.split(' ')[0]} -> ${tecnicaEncontrada.nome}`);
        handleSelecionarTecnica(tecnicaEncontrada.id);
      } else {
        console.log(`Comando de voz não reconhecido: "${texto}"`);
        setLogMessage(`Comando não reconhecido: "${texto}"`);
        setTimeout(() => setLogMessage("Selecione um atleta e uma técnica..."), 2500);
      }


      setTexto('');
    }
  }, [texto, atletaSelecionado, setTexto, handleSelecionarTecnica]);

  const handleSaque = async (atleta) => {
    if (acoesRally.length > 0) return;

    const acaoData = {
      rally_id: rallyId,
      atleta_id: atleta.atleta_id,
      tipo_acao_id: TIPO_ACAO_ID.SAQUE,
      tecnica_acao_id: 12,
      posicao_quadra_origem: null
    };

    try {
      setLogMessage(`Registrando Saque para ${atleta.nome_atleta.split(' ')[0]}...`);
      const resposta = await api.post('/pontuacao/acao', acaoData);
      const acaoSalva = resposta.data;

      setAcoesRally(prev => [...prev, acaoSalva]);

      const tecnicaName = TECNICAS.find(t => t.id === 12)?.nome;
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

  const handleFinalizarPonto = async (motivoPontoId, zonaFornecida = null, rallyActions = acoesRally) => {
    const timeVencedor = pontoPendente ? pontoPendente.timeVencedor : timeVencedorForModal;
    const duplaVencedoraId = timeVencedor === 'A' ? partida.dupla_a_id : partida.dupla_b_id;

    const lastAction = rallyActions[rallyActions.length - 1];
    let rallyActionsAtualizado = [...rallyActions];

    const motivosExigemZona = [3, 5]; // "Ataque" e "Saque/Ace"

    if (motivosExigemZona.includes(motivoPontoId) && !zonaFornecida) {
      setPontoPendente({ timeVencedor, motivoPontoId });
      setIsPontoModalOpen(false);
      setLogMessage(`PONTO: Selecione na quadra ONDE a bola caiu.`);
      return;
    }

    if (motivosExigemZona.includes(motivoPontoId) && zonaFornecida) {
      try {
        setLogMessage("Atualizando destino da ação...");
        const updateData = {
          posicao_quadra_destino: zonaFornecida.zona
        };

        const response = await api.patch(`/pontuacao/acao/${lastAction.acao_id}`, updateData);
        const acaoAtualizada = response.data;

        rallyActionsAtualizado[rallyActionsAtualizado.length - 1] = acaoAtualizada;

      } catch (error) {
        console.error("Erro ao atualizar o destino da ação:", error);
        alert("Falha ao salvar a zona de destino da ação. O ponto não foi registrado.");
        setPontoPendente(null);
        setIsPontoModalOpen(false);
        return;
      }
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

      setUltimoRally(rallyActionsAtualizado);
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
      await handleFinalizarPonto(pontoPendente.motivoPontoId, zonaInfo, acoesRally);
    } else {
      setActiveZone(zonaInfo);
      setLogMessage(`Zona ${zonaInfo.zona} (${zonaInfo.side}) selecionada.`);
    }
  };

  const handleAbrirModalEdicao = (acao) => {
    setAcaoParaEditar(acao);
  };

  const handleSalvarEdicaoAcao = async (acaoId, updateData) => {
    try {
      setLogMessage("Salvando alterações na ação...");
      const response = await api.patch(`/pontuacao/acao/${acaoId}`, updateData);
      const acaoAtualizada = response.data;

      setUltimoRally(prev =>
        prev.map(a => (a.acao_id === acaoId ? acaoAtualizada : a))
      );

      setLogMessage("Ação atualizada com sucesso.");
    } catch (error) {
      console.error("Erro ao atualizar a ação:", error);
      alert("Falha ao atualizar a ação.");
      setLogMessage("Erro ao salvar. Tente novamente.");
    } finally {
      setAcaoParaEditar(null);
    }
  };

  const toggleSidebarPosition = () => {
    setSidebarPosition(prev => (prev === 'right' ? 'left' : 'right'));
  };


  return (
    <div className="flex flex-col h-screen bg-gray-900 text-white font-sans">
      {isModalPontoOpen && <ModalPonto timeVencedor={timeVencedorForModal} onClose={() => setIsPontoModalOpen(false)} onFinalizar={handleFinalizarPonto} />}
      {isModalFinalizarOpen && <ModalFinalizarPartida score={score} pontos={pontosPartida} partida={partida} onClose={fecharModalFinalizacao} onFinalizar={handleFinalizarPartida} />}
      {isModalVoltarPontoOpen && <ModalVoltarPonto onClose={fecharModalVoltarPonto} onFinalizar={handleVoltarPonto} />}
      {acaoParaEditar && <ModalEditarAcao
        acao={acaoParaEditar}
        onClose={() => setAcaoParaEditar(null)}
        onSave={handleSalvarEdicaoAcao}
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
          onSelectTecnica={handleSelecionarTecnica}
          onTogglePosition={toggleSidebarPosition}
          position={sidebarPosition}
          className={sidebarPosition === 'right' ? 'order-last' : ''}
        />

        <main className="flex-1 flex flex-col md:flex-row p-2 md:p-4 gap-2 md:gap-4 overflow-hidden">
          <div className="flex md:flex-col justify-around gap-2 md:gap-4 md:w-[15%] h-16 md:h-full">
            <ButtonAtleta atleta={duplas.a1} onClick={() => setAtletaSelecionado(duplas.a1)} isSelecionado={atletaSelecionado?.atleta_id === duplas.a1.atleta_id} corTime="blue" disabled={!!pontoPendente} isRallyStarted={acoesRally.length > 0} onSaqueClick={handleSaque} />
            <ButtonAtleta atleta={duplas.a2} onClick={() => setAtletaSelecionado(duplas.a2)} isSelecionado={atletaSelecionado?.atleta_id === duplas.a2.atleta_id} corTime="blue" disabled={!!pontoPendente} isRallyStarted={acoesRally.length > 0} onSaqueClick={handleSaque} />
          </div>

          <div className="flex-grow flex flex-col gap-3 min-h-0">
            <div className="flex-grow min-h-0">
              <DisplayQuadra activeZone={activeZone} onClickZona={handleSelecionarZona} />
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
            <ButtonAtleta atleta={duplas.b1} onClick={() => setAtletaSelecionado(duplas.b1)} isSelecionado={atletaSelecionado?.atleta_id === duplas.b1.atleta_id} corTime="red" disabled={!!pontoPendente} isRallyStarted={acoesRally.length > 0} onSaqueClick={handleSaque} />
            <ButtonAtleta atleta={duplas.b2} onClick={() => setAtletaSelecionado(duplas.b2)} isSelecionado={atletaSelecionado?.atleta_id === duplas.b2.atleta_id} corTime="red" disabled={!!pontoPendente} isRallyStarted={acoesRally.length > 0} onSaqueClick={handleSaque} />
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
          <button className="btn-secondary py-2 px-4 text-sm" onClick={abrirModalFinalizacao}>FINALIZAR</button>
        </div>
      </footer>
    </div>
  );
}

export default Partida;
