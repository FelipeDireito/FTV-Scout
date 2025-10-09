import { useMemo, useCallback } from 'react';

export const useValidacaoEstados = ({
  acoesRally = [],
  atletaSelecionado = null,
  pontoPendente = null,
  activeZone = null,
  score = { a: 0, b: 0 },
}) => {

  const rallyEmAndamento = acoesRally.length > 0;

  const aguardandoZonaPonto = !!pontoPendente;

  const validacaoAtleta = useMemo(() => {
    if (aguardandoZonaPonto) {
      return {
        desabilitado: true,
        motivo: 'Complete o registro do ponto selecionando onde a bola caiu'
      };
    }

    return {
      desabilitado: false,
      motivo: null
    };
  }, [aguardandoZonaPonto]);


  const validacaoSaque = useMemo(() => {
    if (rallyEmAndamento) {
      return {
        desabilitado: true,
        motivo: 'Rally já está em andamento'
      };
    }

    if (aguardandoZonaPonto) {
      return {
        desabilitado: true,
        motivo: 'Complete o registro do ponto primeiro'
      };
    }

    return {
      desabilitado: false,
      motivo: null
    };
  }, [rallyEmAndamento, aguardandoZonaPonto]);


  const validacaoTecnica = useMemo(() => {
    if (aguardandoZonaPonto) {
      return {
        desabilitado: true,
        motivo: 'Complete o registro do ponto selecionando onde a bola caiu'
      };
    }

    if (!atletaSelecionado && !activeZone) {
      return {
        desabilitado: true,
        motivo: 'Selecione um atleta ou uma zona na quadra primeiro'
      };
    }

    if (!atletaSelecionado) {
      return {
        desabilitado: true,
        motivo: 'Selecione um atleta'
      };
    }

    return {
      desabilitado: false,
      motivo: null
    };
  }, [atletaSelecionado, activeZone, aguardandoZonaPonto]);


  const validacaoZona = useMemo(() => {
    if (aguardandoZonaPonto) {
      return {
        desabilitado: false,
        obrigatorio: true,
        motivo: 'Selecione onde a bola caiu para finalizar o ponto',
        ladoDesabilitado: pontoPendente?.ladoDesabilitado || null
      };
    }

    return {
      desabilitado: false,
      obrigatorio: false,
      motivo: null,
      ladoDesabilitado: null
    };
  }, [aguardandoZonaPonto, pontoPendente]);


  const validacaoBotaoPonto = useMemo(() => {
    if (!rallyEmAndamento) {
      return {
        desabilitado: true,
        motivo: 'Inicie o rally antes de pontuar'
      };
    }

    if (aguardandoZonaPonto) {
      return {
        desabilitado: true,
        motivo: 'Complete o registro do ponto pendente'
      };
    }

    return {
      desabilitado: false,
      motivo: null
    };
  }, [rallyEmAndamento, aguardandoZonaPonto]);

  const validacaoVoltarPonto = useMemo(() => {
    if (rallyEmAndamento) {
      return {
        desabilitado: true,
        motivo: 'Finalize o rally atual antes de voltar um ponto'
      };
    }

    if (aguardandoZonaPonto) {
      return {
        desabilitado: true,
        motivo: 'Complete o registro do ponto pendente primeiro'
      };
    }

    if (score.a === 0 && score.b === 0) {
      return {
        desabilitado: true,
        motivo: 'Não há pontos para voltar'
      };
    }

    return {
      desabilitado: false,
      motivo: null
    };
  }, [rallyEmAndamento, aguardandoZonaPonto, score]);


  const validacaoFinalizarPartida = useMemo(() => {
    if (rallyEmAndamento) {
      return {
        desabilitado: true,
        motivo: 'Finalize o rally atual antes de encerrar a partida'
      };
    }

    if (aguardandoZonaPonto) {
      return {
        desabilitado: true,
        motivo: 'Complete o registro do ponto pendente primeiro'
      };
    }

    return {
      desabilitado: false,
      motivo: null
    };
  }, [rallyEmAndamento, aguardandoZonaPonto]);


  const isZonaDesabilitada = useCallback((side) => {
    if (!aguardandoZonaPonto) return false;

    const ladoDesabilitado = pontoPendente?.ladoDesabilitado;
    if (!ladoDesabilitado) return false;

    return side === ladoDesabilitado;
  }, [aguardandoZonaPonto, pontoPendente]);

  return {
    rallyEmAndamento,
    aguardandoZonaPonto,

    validacaoAtleta,
    validacaoSaque,
    validacaoTecnica,
    validacaoZona,
    validacaoBotaoPonto,
    validacaoVoltarPonto,
    validacaoFinalizarPartida,

    isZonaDesabilitada,
  };
};
