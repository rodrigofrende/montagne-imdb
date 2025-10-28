import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import MovieCard from '../MovieCard';

describe('MovieCard Component', () => {
  const mockMovie = {
    Title: 'The Matrix',
    Year: '1999',
    imdbID: 'tt0133093',
    Type: 'movie',
    Poster: 'https://example.com/matrix.jpg',
  };

  const mockOnClick = jest.fn();

  beforeEach(() => {
    mockOnClick.mockClear();
  });

  test('renders movie information correctly', () => {
    render(<MovieCard movie={mockMovie} onClick={mockOnClick} />);
    
    expect(screen.getByText('The Matrix')).toBeInTheDocument();
    expect(screen.getByText('1999')).toBeInTheDocument();
    expect(screen.getByText('Movie')).toBeInTheDocument();
  });

  test('renders movie poster with correct alt text', () => {
    render(<MovieCard movie={mockMovie} onClick={mockOnClick} />);
    
    const poster = screen.getByAltText('The Matrix poster');
    expect(poster).toBeInTheDocument();
    expect(poster).toHaveAttribute('src', mockMovie.Poster);
  });

  test('displays placeholder image when poster is N/A', () => {
    const movieWithoutPoster = { ...mockMovie, Poster: 'N/A' };
    render(<MovieCard movie={movieWithoutPoster} onClick={mockOnClick} />);
    
    const poster = screen.getByAltText('The Matrix poster');
    expect(poster).toHaveAttribute('src', 'https://via.placeholder.com/300x450?text=No+Image');
  });

  test('calls onClick when card is clicked', async () => {
    const user = userEvent.setup();
    render(<MovieCard movie={mockMovie} onClick={mockOnClick} />);
    
    const card = screen.getByRole('button', { name: /view details for the matrix/i });
    await user.click(card);
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('calls onClick when Enter key is pressed', () => {
    render(<MovieCard movie={mockMovie} onClick={mockOnClick} />);
    
    const card = screen.getByRole('button', { name: /view details for the matrix/i });
    fireEvent.keyDown(card, { key: 'Enter', code: 'Enter' });
    
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  test('does not call onClick when other keys are pressed', () => {
    render(<MovieCard movie={mockMovie} onClick={mockOnClick} />);
    
    const card = screen.getByRole('button', { name: /view details for the matrix/i });
    fireEvent.keyDown(card, { key: 'Space', code: 'Space' });
    
    expect(mockOnClick).not.toHaveBeenCalled();
  });

  test('has correct accessibility attributes', () => {
    render(<MovieCard movie={mockMovie} onClick={mockOnClick} />);
    
    const card = screen.getByRole('button', { name: /view details for the matrix/i });
    expect(card).toHaveAttribute('tabIndex', '0');
  });

  test('displays correct type labels', () => {
    const types = [
      { type: 'movie', label: 'Movie' },
      { type: 'series', label: 'Series' },
      { type: 'episode', label: 'Episode' },
      { type: 'game', label: 'Game' },
    ];

    types.forEach(({ type, label }) => {
      const { unmount } = render(
        <MovieCard movie={{ ...mockMovie, Type: type }} onClick={mockOnClick} />
      );
      expect(screen.getByText(label)).toBeInTheDocument();
      unmount();
    });
  });

  test('handles unknown type gracefully', () => {
    const movieWithUnknownType = { ...mockMovie, Type: 'unknown' };
    render(<MovieCard movie={movieWithUnknownType} onClick={mockOnClick} />);
    
    expect(screen.getByText('unknown')).toBeInTheDocument();
  });

  test('image has lazy loading attribute', () => {
    render(<MovieCard movie={mockMovie} onClick={mockOnClick} />);
    
    const poster = screen.getByAltText('The Matrix poster');
    expect(poster).toHaveAttribute('loading', 'lazy');
  });

  test('card has article semantic tag', () => {
    const { container } = render(<MovieCard movie={mockMovie} onClick={mockOnClick} />);
    
    expect(container.querySelector('article')).toBeInTheDocument();
  });
});

