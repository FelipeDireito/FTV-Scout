import { describe, it, expect } from 'vitest';
import { 
  TIPOS_ACOES, 
  TIPO_ACAO_ID, 
  TECNICAS, 
  TECNICAS_SIMPLIFICADAS,
  MOTIVOS_PONTO 
} from '../../constants/jogo';

describe('Constantes do Jogo', () => {
  describe('TIPOS_ACOES', () => {
    it('contém 7 tipos de ações', () => {
      expect(TIPOS_ACOES).toHaveLength(7);
    });

    it('cada ação tem id e nome', () => {
      TIPOS_ACOES.forEach(acao => {
        expect(acao).toHaveProperty('id');
        expect(acao).toHaveProperty('nome');
        expect(typeof acao.id).toBe('number');
        expect(typeof acao.nome).toBe('string');
      });
    });

    it('contém as ações esperadas', () => {
      const nomes = TIPOS_ACOES.map(a => a.nome);
      expect(nomes).toContain('Saque');
      expect(nomes).toContain('Defesa');
      expect(nomes).toContain('Ataque');
      expect(nomes).toContain('Recepção');
    });
  });

  describe('TIPO_ACAO_ID', () => {
    it('mapeia nomes para IDs corretamente', () => {
      expect(TIPO_ACAO_ID.SAQUE).toBe(1);
      expect(TIPO_ACAO_ID.DEFESA).toBe(2);
      expect(TIPO_ACAO_ID.ATAQUE).toBe(5);
      expect(TIPO_ACAO_ID.RECEPCAO).toBe(7);
    });

    it('possui todas as chaves em maiúsculas', () => {
      Object.keys(TIPO_ACAO_ID).forEach(key => {
        expect(key).toBe(key.toUpperCase());
      });
    });
  });

  describe('TECNICAS', () => {
    it('contém 12 técnicas', () => {
      expect(TECNICAS).toHaveLength(12);
    });

    it('cada técnica tem id e nome', () => {
      TECNICAS.forEach(tecnica => {
        expect(tecnica).toHaveProperty('id');
        expect(tecnica).toHaveProperty('nome');
        expect(typeof tecnica.id).toBe('number');
        expect(typeof tecnica.nome).toBe('string');
      });
    });

    it('IDs são únicos', () => {
      const ids = TECNICAS.map(t => t.id);
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe('TECNICAS_SIMPLIFICADAS', () => {
    it('contém 5 técnicas', () => {
      expect(TECNICAS_SIMPLIFICADAS).toHaveLength(5);
    });

    it('todas as técnicas simplificadas existem nas técnicas completas', () => {
      const idsCompletos = TECNICAS.map(t => t.id);
      TECNICAS_SIMPLIFICADAS.forEach(tecnica => {
        expect(idsCompletos).toContain(tecnica.id);
      });
    });

    it('contém as técnicas básicas esperadas', () => {
      const nomes = TECNICAS_SIMPLIFICADAS.map(t => t.nome);
      expect(nomes).toContain('Cabeça');
      expect(nomes).toContain('Peito');
      expect(nomes).toContain('Shark');
    });
  });

  describe('MOTIVOS_PONTO', () => {
    it('contém 5 motivos de ponto', () => {
      expect(MOTIVOS_PONTO).toHaveLength(5);
    });

    it('cada motivo tem id e descrição', () => {
      MOTIVOS_PONTO.forEach(motivo => {
        expect(motivo).toHaveProperty('id');
        expect(motivo).toHaveProperty('descricao');
        expect(typeof motivo.id).toBe('number');
        expect(typeof motivo.descricao).toBe('string');
      });
    });

    it('contém os motivos esperados', () => {
      const descricoes = MOTIVOS_PONTO.map(m => m.descricao);
      expect(descricoes).toContain('Erro não forçado');
      expect(descricoes).toContain('Ponto de ataque');
      expect(descricoes).toContain('Ponto de ace');
    });
  });
});
