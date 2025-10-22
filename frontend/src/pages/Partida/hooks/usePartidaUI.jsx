import { useState, useCallback, useMemo } from 'react';

export const usePartidaUI = (duplas, score) => {
  const [sidebarPosition, setSidebarPosition] = useState('right');
  const [ladosInvertidos, setLadosInvertidos] = useState(false);

  const toggleSidebarPosition = useCallback(() => {
    setSidebarPosition(prev => (prev === 'right' ? 'left' : 'right'));
  }, []);

  const toggleLadosQuadra = useCallback(() => {
    setLadosInvertidos(prev => !prev);
  }, []);

  const duplasVisuais = useMemo(() => {
    if (ladosInvertidos) {
      return {
        esquerda: { dupla: 'B', atletas: [duplas.b1, duplas.b2], cor: 'red' },
        direita: { dupla: 'A', atletas: [duplas.a1, duplas.a2], cor: 'blue' }
      };
    }
    return {
      esquerda: { dupla: 'A', atletas: [duplas.a1, duplas.a2], cor: 'blue' },
      direita: { dupla: 'B', atletas: [duplas.b1, duplas.b2], cor: 'red' }
    };
  }, [ladosInvertidos, duplas]);

  const placarVisual = useMemo(() => {
    if (ladosInvertidos) {
      return { esquerda: score.b, direita: score.a };
    }
    return { esquerda: score.a, direita: score.b };
  }, [ladosInvertidos, score]);

  return {
    sidebarPosition,
    ladosInvertidos,
    toggleSidebarPosition,
    toggleLadosQuadra,
    duplasVisuais,
    placarVisual
  };
};
