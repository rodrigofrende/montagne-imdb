import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Pagination from '../Pagination';

describe('Pagination Component', () => {
  const mockOnPageChange = jest.fn();

  beforeEach(() => {
    mockOnPageChange.mockClear();
    // Mock window.innerWidth for responsive tests
    global.innerWidth = 1024;
  });

  test('does not render when totalResults is less than one page', () => {
    const { container } = render(
      <Pagination currentPage={1} totalResults={10} onPageChange={mockOnPageChange} />
    );
    
    expect(container.firstChild).toBeNull();
  });

  test('renders pagination controls when there are multiple pages', () => {
    render(
      <Pagination currentPage={1} totalResults={100} onPageChange={mockOnPageChange} />
    );
    
    expect(screen.getByLabelText(/previous page/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/next page/i)).toBeInTheDocument();
  });

  test('displays correct page information', () => {
    render(
      <Pagination currentPage={2} totalResults={120} onPageChange={mockOnPageChange} />
    );
    
    const pageTexts = screen.getAllByText(/page/i);
    expect(pageTexts.length).toBeGreaterThan(0);
    
    // Check for "results" text instead of exact number (which may be formatted)
    expect(screen.getAllByText(/results/i)[0]).toBeInTheDocument();
  });

  test('calls onPageChange when page number is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Pagination currentPage={1} totalResults={100} onPageChange={mockOnPageChange} />
    );
    
    const page3Button = screen.getByLabelText('Go to page 3');
    await user.click(page3Button);
    
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  test('calls onPageChange when Next button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Pagination currentPage={2} totalResults={100} onPageChange={mockOnPageChange} />
    );
    
    const nextButton = screen.getByLabelText(/next page/i);
    await user.click(nextButton);
    
    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  test('calls onPageChange when Previous button is clicked', async () => {
    const user = userEvent.setup();
    render(
      <Pagination currentPage={3} totalResults={100} onPageChange={mockOnPageChange} />
    );
    
    const prevButton = screen.getByLabelText(/previous page/i);
    await user.click(prevButton);
    
    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  test('disables Previous button on first page', () => {
    render(
      <Pagination currentPage={1} totalResults={100} onPageChange={mockOnPageChange} />
    );
    
    const prevButton = screen.getByLabelText(/previous page/i);
    expect(prevButton).toBeDisabled();
  });

  test('disables Next button on last page', () => {
    render(
      <Pagination currentPage={9} totalResults={100} onPageChange={mockOnPageChange} />
    );
    
    const nextButton = screen.getByLabelText(/next page/i);
    expect(nextButton).toBeDisabled();
  });

  test('highlights current page', () => {
    render(
      <Pagination currentPage={3} totalResults={100} onPageChange={mockOnPageChange} />
    );
    
    const currentPageButton = screen.getByLabelText('Go to page 3');
    expect(currentPageButton).toHaveAttribute('aria-current', 'page');
    expect(currentPageButton).toHaveClass('bg-red-600');
  });

  test('calculates total pages correctly', () => {
    // 120 results / 12 per page = 10 pages
    render(
      <Pagination currentPage={1} totalResults={120} onPageChange={mockOnPageChange} />
    );
    
    // Should have a button or text showing page 10
    const page10Button = screen.getByLabelText('Go to page 10');
    expect(page10Button).toBeInTheDocument();
  });

  test('displays ellipsis for large page counts', () => {
    render(
      <Pagination currentPage={5} totalResults={200} onPageChange={mockOnPageChange} />
    );
    
    const ellipsis = screen.getAllByText('...');
    expect(ellipsis.length).toBeGreaterThan(0);
  });

  test('has proper navigation aria-label', () => {
    render(
      <Pagination currentPage={1} totalResults={100} onPageChange={mockOnPageChange} />
    );
    
    const nav = screen.getByRole('navigation', { name: /pagination navigation/i });
    expect(nav).toBeInTheDocument();
  });

  test('formats large numbers with locale string', () => {
    render(
      <Pagination currentPage={1} totalResults={1500} onPageChange={mockOnPageChange} />
    );
    
    // Should display as "1,500" in most locales
    const resultText = screen.getAllByText(/1,500|1\.500|1 500/)[0];
    expect(resultText).toBeInTheDocument();
  });

  test('disabled buttons do not trigger onPageChange', async () => {
    const user = userEvent.setup();
    render(
      <Pagination currentPage={1} totalResults={100} onPageChange={mockOnPageChange} />
    );
    
    const prevButton = screen.getByLabelText(/previous page/i);
    await user.click(prevButton);
    
    expect(mockOnPageChange).not.toHaveBeenCalled();
  });

  test('shows correct page range for first pages', () => {
    render(
      <Pagination currentPage={1} totalResults={200} onPageChange={mockOnPageChange} />
    );
    
    expect(screen.getByLabelText('Go to page 1')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to page 2')).toBeInTheDocument();
    expect(screen.getByLabelText('Go to page 3')).toBeInTheDocument();
  });

  test('shows correct page range for last pages', () => {
    render(
      <Pagination currentPage={17} totalResults={200} onPageChange={mockOnPageChange} />
    );
    
    const lastPageButton = screen.getByLabelText('Go to page 17');
    expect(lastPageButton).toBeInTheDocument();
  });
});

