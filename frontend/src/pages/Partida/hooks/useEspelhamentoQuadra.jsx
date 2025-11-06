import { useMemo } from 'react';

export const useEspelhamentoQuadra = (acoesRally, atletaSelecionado, getTimeAtleta, ladosInvertidos) => {
  return useMemo(() => {
    if (acoesRally.length === 0) {
      if (atletaSelecionado) {
        const timeAtleta = getTimeAtleta(atletaSelecionado.atleta_id);
        return ladosInvertidos 
          ? timeAtleta === 'A'
          : timeAtleta === 'B';
      }
      return false;
    }

    const timeReferenciaNormal = ladosInvertidos ? 'B' : 'A';

    if (atletaSelecionado) {
      const timeAtleta = getTimeAtleta(atletaSelecionado.atleta_id);
      return timeAtleta !== timeReferenciaNormal;
    }

    const ultimaAcao = acoesRally[acoesRally.length - 1];
    const timeUltimaAcao = getTimeAtleta(ultimaAcao.atleta_id);

    if (acoesRally.length === 1) {
      const timeAdversario = timeUltimaAcao === 'A' ? 'B' : 'A';
      return timeAdversario !== timeReferenciaNormal;
    }

    let toquesConsecutivos = 1;
    for (let i = acoesRally.length - 2; i >= 0; i--) {
      if (getTimeAtleta(acoesRally[i].atleta_id) === timeUltimaAcao) {
        toquesConsecutivos++;
      } else {
        break;
      }
    }

    if (toquesConsecutivos >= 3) {
      const timeAdversario = timeUltimaAcao === 'A' ? 'B' : 'A';
      return timeAdversario !== timeReferenciaNormal;
    }

    return timeUltimaAcao !== timeReferenciaNormal;

  }, [acoesRally, atletaSelecionado, getTimeAtleta, ladosInvertidos]);
};
