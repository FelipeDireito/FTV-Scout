import { useCallback } from 'react';

export const usePartidaHelpers = (duplas) => {
  const getTimeAtleta = useCallback((atletaId) => {
    if (duplas.a1.atleta_id === atletaId || duplas.a2.atleta_id === atletaId) return 'A';
    if (duplas.b1.atleta_id === atletaId || duplas.b2.atleta_id === atletaId) return 'B';
    return null;
  }, [duplas]);

  const getAtletaById = useCallback((atletaId) => {
    for (const key in duplas) {
      if (duplas[key].atleta_id === atletaId) return duplas[key];
    }
    return null;
  }, [duplas]);

  return {
    getTimeAtleta,
    getAtletaById
  };
};
