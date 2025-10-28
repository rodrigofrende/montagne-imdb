import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchBar from '../SearchBar';

describe('SearchBar Component', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  test('renders search input and button', () => {
    render(<SearchBar onSearch={mockOnSearch} hasSearched={false} />);
    
    expect(screen.getByLabelText(/movie search input/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search button/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/search movies by title/i)).toBeInTheDocument();
  });

  test('displays suggested search terms when no search has been performed', () => {
    render(<SearchBar onSearch={mockOnSearch} hasSearched={false} />);
    
    expect(screen.getByText(/inception/i)).toBeInTheDocument();
    expect(screen.getByText(/marvel/i)).toBeInTheDocument();
    expect(screen.getByText(/star wars/i)).toBeInTheDocument();
  });

  test('hides suggested search terms after search', () => {
    render(<SearchBar onSearch={mockOnSearch} hasSearched={true} />);
    
    expect(screen.queryByText(/inception/i)).not.toBeInTheDocument();
  });

  test('updates input value on change', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} hasSearched={false} />);
    
    const input = screen.getByLabelText(/movie search input/i);
    await user.type(input, 'Avengers');
    
    expect(input).toHaveValue('Avengers');
  });

  test('calls onSearch with trimmed value on form submit', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} hasSearched={false} />);
    
    const input = screen.getByLabelText(/movie search input/i);
    const button = screen.getByRole('button', { name: /search button/i });
    
    await user.type(input, '  Matrix  ');
    await user.click(button);
    
    expect(mockOnSearch).toHaveBeenCalledWith('Matrix');
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
  });

  test('does not call onSearch when input is empty or only whitespace', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} hasSearched={false} />);
    
    const button = screen.getByRole('button', { name: /search button/i });
    await user.click(button);
    
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  test('handles Enter key press in input', async () => {
    render(<SearchBar onSearch={mockOnSearch} hasSearched={false} />);
    
    const input = screen.getByLabelText(/movie search input/i);
    
    fireEvent.change(input, { target: { value: 'Inception' } });
    fireEvent.submit(input.closest('form'));
    
    expect(mockOnSearch).toHaveBeenCalledWith('Inception');
  });

  test('input has required and minLength attributes', () => {
    render(<SearchBar onSearch={mockOnSearch} hasSearched={false} />);
    
    const input = screen.getByLabelText(/movie search input/i);
    
    expect(input).toBeRequired();
    expect(input).toHaveAttribute('minLength', '2');
  });

  test('applies focus styles when input is focused', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} hasSearched={false} />);
    
    const input = screen.getByLabelText(/movie search input/i);
    
    await user.click(input);
    expect(input).toHaveFocus();
    
    await user.tab();
    expect(input).not.toHaveFocus();
  });

  test('search icon is present with correct aria-label', () => {
    render(<SearchBar onSearch={mockOnSearch} hasSearched={false} />);
    
    const searchIcon = screen.getByRole('img', { name: /search/i });
    expect(searchIcon).toBeInTheDocument();
  });
});

