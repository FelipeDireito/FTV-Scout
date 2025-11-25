import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import MicIcon from '../../components/MicIcon';

describe('MicIcon Component', () => {
  it('renderiza o ícone SVG', () => {
    const { container } = render(<MicIcon />);
    const svg = container.querySelector('svg');
    
    expect(svg).toBeTruthy();
    expect(svg.tagName).toBe('svg');
  });

  it('aplica className personalizada', () => {
    const customClass = 'custom-icon-class';
    const { container } = render(<MicIcon className={customClass} />);
    const svg = container.querySelector('svg');
    
    expect(svg.classList.contains(customClass)).toBe(true);
  });

  it('contém os elementos path e line corretos', () => {
    const { container } = render(<MicIcon />);
    const paths = container.querySelectorAll('path');
    const lines = container.querySelectorAll('line');
    
    expect(paths.length).toBe(2);
    expect(lines.length).toBe(2);
  });
});
