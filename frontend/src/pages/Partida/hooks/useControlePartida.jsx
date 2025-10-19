import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import api from '../../../services/api';

export const useControlePartida = (partida, duplas, initialScore = { a: 0, b: 0 }) => {
  const navigate = useNavigate();

  const [score, setScore] = useState(initialScore);
  const [pontosPartida, setPontosPartida] = useState([]);
  const [isModalFinalizarOpen, setIsModalFinalizarOpen] = useState(false);
  const [isModalVoltarPontoOpen, setIsModalVoltarPontoOpen] = useState(false);
  const [acaoParaEditar, setAcaoParaEditar] = useState(null);
  const [pontoParaEditar, setPontoParaEditar] = useState(null);

  useEffect(() => {
    const restoreScore = async () => {
      try {
        const response = await api.get(`/pontuacao/${partida.partida_id}`);
        const pontos = response.data;
        
        if (pontos && pontos.length > 0) {
          const scoreA = pontos.filter(p => p.dupla_vencedora_id === partida.dupla_a_id).length;
          const scoreB = pontos.filter(p => p.dupla_vencedora_id === partida.dupla_b_id).length;
          setScore({ a: scoreA, b: scoreB });
        }
      } catch (error) {
        console.error("Erro ao restaurar placar:", error);
      }
    };

    restoreScore();
  }, [partida.partida_id, partida.dupla_a_id, partida.dupla_b_id]);

  const abrirModalFinalizacao = async (setLogMessage) => {
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
  };

  const abrirModalVoltarPonto = () => {
    setIsModalVoltarPontoOpen(true);
  };

  const fecharModalVoltarPonto = () => {
    setIsModalVoltarPontoOpen(false);
  };

  const handleVoltarPonto = async (setLogMessage, onRallyReset) => {
    try {
      setLogMessage("Excluindo último ponto...");
      const response = await api.delete(`/pontuacao/voltar_ponto/${partida.partida_id}`);
      const pontoExcluido = response.data;
      console.log(pontoExcluido);

      if (pontoExcluido && pontoExcluido.dupla_vencedora_id) {
        const timePonto = pontoExcluido.dupla_vencedora_id === partida.dupla_a_id ? 'a' : 'b';
        setScore(prev => {
          const newScore = prev[timePonto] > 0 ? prev[timePonto] - 1 : 0;
          return { ...prev, [timePonto]: newScore };
        });
        onRallyReset();
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

  const handleAbrirModalEdicao = (acao) => {
    setAcaoParaEditar(acao);
  };

  const handleSalvarEdicaoAcao = async (acaoId, updateData, setLogMessage, onAcaoAtualizada) => {
    try {
      setLogMessage("Salvando alterações na ação...");
      const response = await api.patch(`/pontuacao/acao/${acaoId}`, updateData);
      const acaoAtualizada = response.data;
      onAcaoAtualizada(acaoAtualizada);
      setLogMessage("Ação atualizada com sucesso.");
    } catch (error) {
      console.error("Erro ao atualizar a ação:", error);
      alert("Falha ao atualizar a ação.");
      setLogMessage("Erro ao salvar. Tente novamente.");
    } finally {
      setAcaoParaEditar(null);
    }
  };

  const handleAbrirModalEdicaoPonto = async (motivoPontoId) => {
    if (!motivoPontoId) {
      setPontoParaEditar(null);
      return;
    }
    
    try {
      const response = await api.get(`/pontuacao/${partida.partida_id}`);
      const pontos = response.data;
      
      if (pontos && pontos.length > 0) {
        const ultimoPonto = pontos[pontos.length - 1];
        setPontoParaEditar({ ...ultimoPonto, motivo_ponto_id: motivoPontoId });
      }
    } catch (error) {
      console.error("Erro ao buscar último ponto:", error);
      alert("Falha ao carregar o ponto para edição.");
    }
  };

  const handleSalvarEdicaoPonto = async (pontoId, motivoPontoId, setLogMessage, onMotivoPontoAtualizado) => {
    try {
      setLogMessage("Salvando alterações no motivo do ponto...");
      const response = await api.patch(`/pontuacao/ponto/${pontoId}`, { motivo_ponto_id: motivoPontoId });
      const pontoAtualizado = response.data;
      console.log("Ponto atualizado:", pontoAtualizado);
      onMotivoPontoAtualizado(motivoPontoId);
      setLogMessage("Motivo do ponto atualizado com sucesso.");
    } catch (error) {
      console.error("Erro ao atualizar o motivo do ponto:", error);
      alert("Falha ao atualizar o motivo do ponto.");
      setLogMessage("Erro ao salvar. Tente novamente.");
    } finally {
      setPontoParaEditar(null);
    }
  };

  return {
    score,
    setScore,
    pontosPartida,
    isModalFinalizarOpen,
    isModalVoltarPontoOpen,
    acaoParaEditar,
    pontoParaEditar,
    abrirModalFinalizacao,
    fecharModalFinalizacao,
    handleFinalizarPartida,
    abrirModalVoltarPonto,
    fecharModalVoltarPonto,
    handleVoltarPonto,
    handleAbrirModalEdicao,
    handleSalvarEdicaoAcao,
    handleAbrirModalEdicaoPonto,
    handleSalvarEdicaoPonto,
  };
};