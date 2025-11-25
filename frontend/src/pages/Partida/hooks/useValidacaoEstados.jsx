import { useMemo, useCallback } from 'react';

export const useValidacaoEstados = ({
  acoesRally = [],
  atletaSelecionado = null,
  pontoPendente = null,
  score = { a: 0, b: 0 },
}) => {

  const rallyEmAndamento = acoesRally.length > 0;
  const aguardandoZonaPonto = !!pontoPendente;

  const atletaDesabilitado = useMemo(() => {
    return aguardandoZonaPonto;
  }, [aguardandoZonaPonto]);

  const saqueDesabilitado = useMemo(() => {
    return rallyEmAndamento || aguardandoZonaPonto;
  }, [rallyEmAndamento, aguardandoZonaPonto]);

  const tecnicaDesabilitada = useMemo(() => {
    return aguardandoZonaPonto || !atletaSelecionado;
  }, [aguardandoZonaPonto, atletaSelecionado]);

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

  const botaoPontoDesabilitado = useMemo(() => {
    return !rallyEmAndamento || aguardandoZonaPonto;
  }, [rallyEmAndamento, aguardandoZonaPonto]);

  const botaoVoltarPontoDesabilitado = useMemo(() => {
    return rallyEmAndamento || aguardandoZonaPonto || (score.a === 0 && score.b === 0);
  }, [rallyEmAndamento, aguardandoZonaPonto, score]);

  const botaoFinalizarPartidaDesabilitado = useMemo(() => {
    return rallyEmAndamento || aguardandoZonaPonto;
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

    atletaDesabilitado,
    saqueDesabilitado,
    tecnicaDesabilitada,
    botaoPontoDesabilitado,
    botaoVoltarPontoDesabilitado,
    botaoFinalizarPartidaDesabilitado,

    validacaoZona,

    isZonaDesabilitada,
  };
};
