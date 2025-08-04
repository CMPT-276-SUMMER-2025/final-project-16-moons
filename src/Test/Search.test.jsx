// src/Test/Search.test.jsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import Search from '../pages/Search';
import { vi, describe, test, beforeEach, afterEach, expect } from 'vitest';

// --- MOCKING CHILD COMPONENTS ---
// These mocks remain the same as they correctly simulate user interaction.
vi.mock('../components/Search/SearchTopic', () => ({
  __esModule: true,
  default: ({ onSearch, setSearchType }) => (
    <button onClick={() => { onSearch('name', 'Test Meal'); setSearchType('name'); }}>
      Search
    </button>
  ),
}));
vi.mock('../components/Search/SearchHint', () => ({
  __esModule: true,
  default: () => <div>Hint</div>,
}));
vi.mock('../components/Search/SearchResult', () => ({
  __esModule: true,
  default: ({ number, name }) => (
    <div data-testid="result">{number}: {name}</div>
  ),
}));

// --- TEST SUITE ---
describe('Search component', () => {
  // This is the fake data that will be returned by our mocked API call.
  // It's structured to match the API Ninjas response format, which the component uses for 'name' searches.
  const fakeApiNinjasMeal = [
    {
      title: 'Test Meal',
      instructions: 'Do something.',
      ingredients: '1 cup Ingredient A',
    }
  ];

  // This runs before each test, clearing previous mocks.
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // --- TEST CASE 1: SUCCESSFUL SEARCH ---
  test('fetches and displays recipes on search', async () => {
    // We mock the global `fetch` function.
    // When the component calls fetch, this mock will intercept it.
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true, // Simulate a successful HTTP response
      json: async () => fakeApiNinjasMeal, // The response body will be our fake data
    });

    render(<Search />); // Render the component
    userEvent.click(screen.getByRole('button', { name: /search/i })); // Simulate a user clicking the search button

    // `waitFor` allows the component to finish its asynchronous fetch operation.
    await waitFor(() =>
      expect(screen.getByTestId('result')).toBeInTheDocument()
    );

    // Assert that the result is displayed correctly.
    expect(screen.getByTestId('result')).toHaveTextContent('1: Test Meal');

    // Assert that fetch was called with the correct API Ninjas URL for a 'name' search.
    expect(global.fetch).toHaveBeenCalledWith(
      'https://api.api-ninjas.com/v1/recipe?query=Test%20Meal',
      { headers: { 'X-Api-Key': undefined } } // The API key is undefined in test environment, which is expected.
    );
  });

  // --- TEST CASE 2: NO RECIPES FOUND ---
  test('shows a "no recipes found" error when the API returns an empty array', async () => {
    // For this test, we mock a successful response, but with an empty array for the data.
    vi.spyOn(global, 'fetch').mockResolvedValue({
      ok: true,
      json: async () => [], // Empty array simulates no results found
    });

    render(<Search />);
    userEvent.click(screen.getByRole('button', { name: /search/i }));

    // The test should now look for the exact error message the component renders in this scenario.
    await waitFor(() =>
      expect(
        screen.getByText('Error: No recipes found. Try a different search term.')
      ).toBeInTheDocument()
    );
  });

  // --- TEST CASE 3: FETCH FAILURE (NETWORK ERROR) ---
  test('shows an error message when the fetch call fails', async () => {
    // Here, we simulate a network error by having the fetch promise reject.
    vi.spyOn(global, 'fetch').mockRejectedValue(new Error('Network failure'));

    render(<Search />);
    userEvent.click(screen.getByRole('button', { name: /search/i }));

    // When a fetch promise rejects, the component's `catch` block is executed.
    // We assert that the corresponding error message is displayed.
    await waitFor(() =>
      expect(
        screen.getByText('Error: No recipes found. Try a different search term.')
      ).toBeInTheDocument()
    );
  });
});