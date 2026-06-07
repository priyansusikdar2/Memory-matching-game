import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import App from '../App';

describe('Memory Matching Game', () => {
  beforeEach(() => {
    render(<App />);
  });

  describe('Game Initialization', () => {
    it('should render the name prompt initially', () => {
      expect(screen.getByText(/Enter your name to get started/i)).toBeInTheDocument();
    });

    it('should show start playing button', () => {
      expect(screen.getByText(/Start Playing/i)).toBeInTheDocument();
    });

    it('should accept player name input', () => {
      const input = screen.getByPlaceholderText(/Your name/i);
      expect(input).toBeInTheDocument();
    });
  });

  describe('Game Controls', () => {
    it('should start game after entering name', async () => {
      const input = screen.getByPlaceholderText(/Your name/i);
      const button = screen.getByText(/Start Playing/i);
      
      fireEvent.change(input, { target: { value: 'Test Player' } });
      fireEvent.click(button);
      
      await waitFor(() => {
        expect(screen.queryByText(/Enter your name to get started/i)).not.toBeInTheDocument();
      });
    });
  });
});