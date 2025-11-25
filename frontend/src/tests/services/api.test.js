import { describe, it, expect } from 'vitest';
import api from '../../services/api';

describe('API Service', () => {
  it('cria uma instância do axios', () => {
    expect(api).toBeDefined();
    expect(api.defaults).toBeDefined();
  });

  it('configura a baseURL corretamente', () => {
    expect(api.defaults.baseURL).toBe('/api/v1');
  });

  it('possui métodos HTTP básicos', () => {
    expect(typeof api.get).toBe('function');
    expect(typeof api.post).toBe('function');
    expect(typeof api.put).toBe('function');
    expect(typeof api.delete).toBe('function');
    expect(typeof api.patch).toBe('function');
  });
});
