import { useState, useCallback, useMemo } from 'react';

export const useSaqueAlternado = (duplas) => {
  const [historicoSacadores, setHistoricoSacadores] = useState([]);

  const getSacadorAtual = () => historicoSacadores[historicoSacadores.length - 1] ?? null;

  const atletasMap = useMemo(() => ({
    [duplas.a1.atleta_id]: { atleta: duplas.a1, dupla: 'A', parceiro: duplas.a2 },
    [duplas.a2.atleta_id]: { atleta: duplas.a2, dupla: 'A', parceiro: duplas.a1 },
    [duplas.b1.atleta_id]: { atleta: duplas.b1, dupla: 'B', parceiro: duplas.b2 },
    [duplas.b2.atleta_id]: { atleta: duplas.b2, dupla: 'B', parceiro: duplas.b1 },
  }), [duplas]);

  const duplasQueJaSacaram = useMemo(() => {
    const duplas = new Set();
    historicoSacadores.forEach(sacadorId => {
      if (sacadorId !== null && atletasMap[sacadorId]) {
        duplas.add(atletasMap[sacadorId].dupla);
      }
    });
    return duplas;
  }, [historicoSacadores, atletasMap]);

  const getProximoSacadorDuplaAdversaria = useCallback((duplaAtual) => {
    for (let i = historicoSacadores.length - 1; i >= 0; i--) {
      const sacadorId = historicoSacadores[i];
      
      if (sacadorId === null) continue;
      
      const info = atletasMap[sacadorId];
      if (info && info.dupla !== duplaAtual) {
        return info.parceiro.atleta_id;
      }
    }
    
    return null;
  }, [historicoSacadores, atletasMap]);
  const definirSacadorInicial = useCallback((atletaId) => {
    setHistoricoSacadores(prev => [...prev, atletaId]);
  }, []);

  const atualizarSacadorAposPonto = useCallback((duplaVencedora) => {
    const sacadorAtualId = getSacadorAtual();
    if (sacadorAtualId === null) return;

    const duplaAtualSacador = atletasMap[sacadorAtualId]?.dupla;
    
    let novoSacadorId;

    if (duplaVencedora === duplaAtualSacador) {
      novoSacadorId = sacadorAtualId;
    } else {
      const proximoSacador = getProximoSacadorDuplaAdversaria(duplaAtualSacador);
      novoSacadorId = proximoSacador;
    }

    setHistoricoSacadores(prev => [...prev, novoSacadorId]);
  }, [atletasMap, getProximoSacadorDuplaAdversaria, historicoSacadores]);

  const voltarSacador = useCallback(() => {
    setHistoricoSacadores(prev => prev.length > 1 ? prev.slice(0, -1) : prev);
  }, []);

  const ehSacadorAtual = useCallback((atletaId) => {
    const sacadorAtualId = getSacadorAtual();
    if (sacadorAtualId === null) {
      const duplaAtleta = atletasMap[atletaId]?.dupla;
      return duplasQueJaSacaram.has(duplaAtleta) ? false : null;
    }
    return sacadorAtualId === atletaId;
  }, [atletasMap, duplasQueJaSacaram, historicoSacadores]);

  return {
    definirSacadorInicial,
    atualizarSacadorAposPonto,
    voltarSacador,
    ehSacadorAtual,
  };
};
