import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';
import api from '../../../services/api';
import { TIPO_ACAO_ID, TECNICAS } from '../../../constants/jogo';

export const useRallyLogica = (partida, duplas, definirSacadorInicial = null, atualizarSacadorAposPonto = null) => {
  const [rallyId, setRallyId] = useState(uuidv4());
  const [acoesRally, setAcoesRally] = useState([]);
  const [ultimoRally, setUltimoRally] = useState([]);
  const [motivoPontoUltimoRally, setMotivoPontoUltimoRally] = useState(null);
  const [atletaSelecionado, setAtletaSelecionado] = useState(null);
  const [activeZone, setActiveZone] = useState(null);
  const [pontoPendente, setPontoPendente] = useState(null);
  const [isModalPontoOpen, setIsPontoModalOpen] = useState(false);
  const [timeVencedorForModal, setTimeVencedorForModal] = useState(null);

  const getTimeAtleta = useCallback((atletaId) => {
    if (duplas.a1.atleta_id === atletaId || duplas.a2.atleta_id === atletaId) return 'A';
    if (duplas.b1.atleta_id === atletaId || duplas.b2.atleta_id === atletaId) return 'B';
    return null;
  }, [duplas]);

  const calcularProximoAtleta = useCallback((acaoRecemAdicionada, acoesAtuais) => {
    if (!acaoRecemAdicionada) return null;

    const timeAcaoAtual = getTimeAtleta(acaoRecemAdicionada.atleta_id);
    if (!timeAcaoAtual) return null;

    let acoesConsecutivasMesmoTime = 1;
    for (let i = acoesAtuais.length - 1; i >= 0; i--) {
      const acao = acoesAtuais[i];
      if (getTimeAtleta(acao.atleta_id) === timeAcaoAtual) {
        acoesConsecutivasMesmoTime++;
      } else {
        break;
      }
    }

    if (acoesConsecutivasMesmoTime >= 3) return null;

    const atletasDoTime = timeAcaoAtual === 'A'
      ? [duplas.a1, duplas.a2]
      : [duplas.b1, duplas.b2];

    return atletasDoTime.find(a => a.atleta_id !== acaoRecemAdicionada.atleta_id);
  }, [duplas, getTimeAtleta]);

  const handleSelecionarTecnica = useCallback(async (tecnicaId, setLogMessage) => {
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

      if (timeAtletaAtual !== timeUltimoJogador) {
        if (lastAction.tipo_acao_id === TIPO_ACAO_ID.SAQUE) {
          tipoAcaoId = TIPO_ACAO_ID.RECEPCAO;
        } else {
          tipoAcaoId = TIPO_ACAO_ID.DEFESA;
        }
      } else {
        if (lastAction.tipo_acao_id === TIPO_ACAO_ID.RECEPCAO || lastAction.tipo_acao_id === TIPO_ACAO_ID.DEFESA) {
          tipoAcaoId = TIPO_ACAO_ID.LEVANTAMENTO;
        } else {
          tipoAcaoId = TIPO_ACAO_ID.ATAQUE;
        }
      }
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

      if (acoesRally.length > 0) {
        const ultimaAcao = acoesRally[acoesRally.length - 1];
        const timeAtletaAtual = getTimeAtleta(acaoSalva.atleta_id);
        const timeUltimoJogador = getTimeAtleta(ultimaAcao.atleta_id);

        const updateData = {};

        if (acaoSalva.posicao_quadra_origem) {
          updateData.posicao_quadra_destino = acaoSalva.posicao_quadra_origem;
        }
        if (
          ultimaAcao.tipo_acao_id !== TIPO_ACAO_ID.ATAQUE &&
          timeAtletaAtual !== timeUltimoJogador &&
          ultimaAcao.tipo_acao_id !== TIPO_ACAO_ID.SAQUE) {
          updateData.tipo_acao_id = TIPO_ACAO_ID.ATAQUE;
        }

        if (Object.keys(updateData).length > 0) {
          try {
            const respostaPatch = await api.patch(`/pontuacao/acao/${ultimaAcao.acao_id}`, updateData);
            const ultimaAcaoAtualizada = respostaPatch.data;

            console.log("PATCH:", updateData)

            setAcoesRally(prevAcoes =>
              prevAcoes.map(acao =>
                acao.acao_id === ultimaAcao.acao_id ? ultimaAcaoAtualizada : acao
              )
            );
          } catch (patchError) {
            console.error("Erro ao atualizar ação com destino:", patchError);
          }
        }
      }

      setAcoesRally(prev => {
        const novasAcoes = [...prev, acaoSalva];

        const proximoAtleta = calcularProximoAtleta(acaoSalva, prev);
        if (proximoAtleta) {
          setAtletaSelecionado(proximoAtleta);
        } else {
          setAtletaSelecionado(null);
        }

        return novasAcoes;
      });

      const tecnicaName = TECNICAS.find(t => t.id === tecnicaId)?.nome;
      setLogMessage(`Ação registrada: ${atletaSelecionado.nome_atleta.split(' ')[0]} (${tecnicaName})`);

      setActiveZone(null);
    } catch (error) {
      console.error("Erro ao registrar ação na API:", error);
      alert("Falha ao registrar a ação.");
    }
  }, [atletaSelecionado, acoesRally, rallyId, activeZone, getTimeAtleta, calcularProximoAtleta]);

  const handleSaque = async (atleta, setLogMessage) => {
    if (acoesRally.length > 0) return;

    if (definirSacadorInicial) {
      definirSacadorInicial(atleta.atleta_id);
    }

    const acaoData = {
      rally_id: rallyId,
      atleta_id: atleta.atleta_id,
      tipo_acao_id: TIPO_ACAO_ID.SAQUE,
      tecnica_acao_id: 12,
      posicao_quadra_origem: null
    };

    try {
      console.log(acaoData)
      setLogMessage(`Registrando Saque para ${atleta.nome_atleta.split(' ')[0]}...`);
      const resposta = await api.post('/pontuacao/acao', acaoData);
      const acaoSalva = resposta.data;

      setAcoesRally(prev => {
        const novasAcoes = [...prev, acaoSalva];
        
        setAtletaSelecionado(null);

        return novasAcoes;
      });

      const tecnicaName = TECNICAS.find(t => t.id === 12)?.nome;
      setLogMessage(`Saque registrado: ${atleta.nome_atleta.split(' ')[0]} (${tecnicaName})`);

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

  const handleFinalizarPonto = async (motivoPontoId, setLogMessage, score, setScore, zonaFornecida = null, rallyActions = acoesRally) => {
    const timeVencedor = pontoPendente ? pontoPendente.timeVencedor : timeVencedorForModal;
    const duplaVencedoraId = timeVencedor === 'A' ? partida.dupla_a_id : partida.dupla_b_id;

    const lastAction = rallyActions[rallyActions.length - 1];
    let rallyActionsAtualizado = [...rallyActions];

    const motivosExigemZona = [3, 5]; // "Ataque" e "Saque/Ace"

    if (motivosExigemZona.includes(motivoPontoId) && !zonaFornecida) {
      if (activeZone) {
        zonaFornecida = activeZone;
      } else {
        const timeUltimaAcao = lastAction ? getTimeAtleta(lastAction.atleta_id) : null;
        const ladoDesabilitado = timeUltimaAcao;

        setPontoPendente({
          timeVencedor,
          motivoPontoId,
          ladoDesabilitado
        });
        setIsPontoModalOpen(false);
        setLogMessage(`PONTO: Selecione na quadra ONDE a bola caiu.`);
        return;
      }
    }

    if (motivosExigemZona.includes(motivoPontoId) && zonaFornecida) {
      try {
        setLogMessage("Atualizando destino da ação...");
        const updateData = {
          posicao_quadra_destino: zonaFornecida.zona
        };

        if (lastAction.tipo_acao_id !== TIPO_ACAO_ID.SAQUE) {
          updateData.tipo_acao_id = TIPO_ACAO_ID.ATAQUE;
        }

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
      console.log(pointData)
      await api.post('/pontuacao/ponto', pointData);
      setScore(prev => ({ ...prev, [timeVencedor.toLowerCase()]: prev[timeVencedor.toLowerCase()] + 1 }));
      setLogMessage(`Ponto para a Dupla ${timeVencedor}! Novo rally.`);

      if (atualizarSacadorAposPonto) {
        atualizarSacadorAposPonto(timeVencedor);
      }

      setUltimoRally(rallyActionsAtualizado);
      setMotivoPontoUltimoRally(motivoPontoId);
      setAcoesRally([]);
      setRallyId(uuidv4());
    } catch (error) {
      console.error("Erro ao finalizar o ponto:", error);
      alert("Falha ao registrar o ponto.");
    } finally {
      setIsPontoModalOpen(false);
      setPontoPendente(null);
      setActiveZone(null);
      setAtletaSelecionado(null);
    }
  };

  const handleSelecionarZona = async (zonaInfo, setLogMessage, score, setScore) => {
    if (pontoPendente) {
      await handleFinalizarPonto(pontoPendente.motivoPontoId, setLogMessage, score, setScore, zonaInfo, acoesRally);
    } else {
      setActiveZone(zonaInfo);
      setLogMessage(`Zona ${zonaInfo.zona} (${zonaInfo.side}) selecionada.`);
    }
  };


  const onRallyReset = () => {
    setUltimoRally([]);
    setMotivoPontoUltimoRally(null);
    setAcoesRally([]);
    setRallyId(uuidv4());
    setAtletaSelecionado(null);
    setActiveZone(null);
  };

  const onAcaoAtualizada = (acaoAtualizada) => {
    setUltimoRally(prev =>
      prev.map(a => (a.acao_id === acaoAtualizada.acao_id ? acaoAtualizada : a))
    );
  };

  const onMotivoPontoAtualizado = (novoMotivoPontoId) => {
    setMotivoPontoUltimoRally(novoMotivoPontoId);
  };

  const handleSelecionarPosicao = useCallback((posicao) => {
    setActiveZone({ zona: posicao, side: null });
  }, []);

  return {
    rallyId,
    acoesRally,
    ultimoRally,
    motivoPontoUltimoRally,
    atletaSelecionado,
    setAtletaSelecionado,
    activeZone,
    setActiveZone,
    pontoPendente,
    isModalPontoOpen,
    setIsPontoModalOpen,
    timeVencedorForModal,
    handleSelecionarTecnica,
    handleSaque,
    openPointModal,
    handleFinalizarPonto,
    handleSelecionarZona,
    handleSelecionarPosicao,
    onRallyReset,
    onAcaoAtualizada,
    onMotivoPontoAtualizado,
  };
};