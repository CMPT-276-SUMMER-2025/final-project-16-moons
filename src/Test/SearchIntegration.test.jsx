import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Search from '../pages/Search';


// Mocking static assets (images) to prevent test failures
vi.mock('../assets/icons/meat.png', () => ({ default: 'meat.png' }));
vi.mock('../assets/icons/apple.png', () => ({ default: 'apple.png' }));
vi.mock('../assets/icons/carrot.png', () => ({ default: 'carrot.png' }));
vi.mock('../assets/images/linesHorizontal.png', () => ({ default: 'lines.png' }));


// Mocking child components to simplify the test
vi.mock('../components/Search/SearchHint', () => ({
  default: () => <div data-testid="search-hint">SearchHint</div>,
}));

vi.mock('../components/Search/SearchResult', () => ({
  default: ({ name, area, category }) => (
    <div data-testid="search-result">
      <h2>{name}</h2>
      <div>Area: {area}</div>
      <div>Category: {category}</div>
    </div>
  ),
}));

// Mocking the SearchTopic component to control user input and actions
vi.mock('../components/Search/SearchTopic', () => {
  function MockSearchTopic({ onSearch, setInputText, setSearchType }) {
    const [localType, setLocalType] = React.useState('name');
    const [localQuery, setLocalQuery] = React.useState('');
    return (
      <div>
        <button onClick={() => { setLocalType('name'); setSearchType('name'); }}>Pick: Name</button>
        <button onClick={() => { setLocalType('ingredient'); setSearchType('ingredient'); }}>Pick: Ingredient</button>
        <button onClick={() => { setLocalType('area'); setSearchType('area'); }}>Pick: Area</button>
        <button onClick={() => { setLocalType('category'); setSearchType('category'); }}>Pick: Category</button>
        <input
          aria-label="query"
          placeholder="Search term"
          value={localQuery}
          onChange={(e) => { setLocalQuery(e.target.value); setInputText(e.target.value); }}
        />
        <button onClick={() => onSearch(localType, localQuery)}>Run Search</button>
        <div>Current type: {localType}</div>
      </div>
    );
  }

  return { default: MockSearchTopic };
});

const MEALDB_BASE = 'https://www.themealdb.com/api/json/v1/1';
const APININJAS_BASE = 'https://api.api-ninjas.com/v1/recipe?query=';

// Test suite for the Search component's integration
describe('Search Component (integration)', () => {
  // Set up a spy on the global fetch function before each test
  beforeEach(() => {
    vi.spyOn(global, 'fetch');
  });

  // Restore the original fetch function after each test
  afterEach(() => {
    vi.restoreAllMocks();
  });

  // Test case: successful "name" search using the API-Ninjas endpoint
  it('performs a "name" search, renders a full recipe, and hides the loader', async () => {
    // Mock a successful API-Ninjas response for a recipe search
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [
        {
          title: 'Test Pasta',
          instructions: 'Boil water. Cook pasta.',
          ingredients: '200g Pasta | 1 tsp Salt',
        },
      ],
    });

    // Render the Search component
    render(<Search />);

    // Simulate user interaction to perform a "name" search
    fireEvent.click(screen.getByText(/Pick: Name/i));
    fireEvent.change(screen.getByLabelText(/query/i), { target: { value: 'pasta' } });
    fireEvent.click(screen.getByText(/Run Search/i));

    // Assert that the loading message is displayed
    expect(screen.getByText(/Fetching recipes, hang tight!/i)).toBeInTheDocument();

    // Wait for the loading message to disappear after the fetch call
    await waitFor(() =>
      expect(screen.queryByText(/Fetching recipes, hang tight!/i)).not.toBeInTheDocument()
    );

    // Assert that the recipe details from the mock data are rendered
    expect(screen.getByText('Test Pasta')).toBeInTheDocument();
    expect(screen.getByText('Area: Unavailable')).toBeInTheDocument();
    expect(screen.getByText('Category: Unavailable')).toBeInTheDocument();

    // Verify that the fetch function was called with the correct API-Ninjas URL
    expect(global.fetch).toHaveBeenCalledWith(
      `${APININJAS_BASE}pasta`,
      { headers: { 'X-Api-Key': undefined } }
    );
  });

  // Test case: successful "ingredient" search using two separate MealDB API calls
  it('performs an "ingredient" search, then fetches full details per recipe', async () => {
    // Mock the first response (filter by ingredient) from TheMealDB
    const filterResponse = { meals: [{ strMeal: 'Test Curry', strMealThumb: 'http://img/curry.jpg' }] };
    // Mock the second response (full details for the recipe) from TheMealDB
    const detailResponse = {
      meals: [{
        strMeal: 'Test Curry',
        strMealThumb: 'http://img/curry.jpg',
        strCategory: 'Curry',
        strArea: 'Indian',
        strInstructions: 'Cook gently.',
        strIngredient1: 'Chicken', strMeasure1: '300g',
      }],
    };

    // Chain the two mock responses for the two fetch calls
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => filterResponse })
      .mockResolvedValueOnce({ ok: true, json: async () => detailResponse });

    // Render the component
    render(<Search />);

    // Simulate user selecting "ingredient" and searching for "chicken"
    fireEvent.click(screen.getByText(/Pick: Ingredient/i));
    fireEvent.change(screen.getByLabelText(/query/i), { target: { value: 'chicken' } });
    fireEvent.click(screen.getByText(/Run Search/i));

    // Wait for the loading indicator to disappear, confirming both API calls have completed
    await waitFor(() => expect(screen.queryByText(/Fetching recipes, hang tight!/i)).not.toBeInTheDocument());

    // Assert that the recipe details from the second mock response are rendered
    expect(screen.getByText('Test Curry')).toBeInTheDocument();
    expect(screen.getByText('Area: Indian')).toBeInTheDocument();
    expect(screen.getByText('Category: Curry')).toBeInTheDocument();

    // Verify the first fetch call was made correctly for filtering
    expect(global.fetch).toHaveBeenNthCalledWith(1, `${MEALDB_BASE}/filter.php?i=chicken`, {});
    // Verify the second fetch call was made correctly for getting recipe details
    expect(global.fetch).toHaveBeenNthCalledWith(2, `${MEALDB_BASE}/search.php?s=Test%20Curry`);
  });

  // Test case: handling a search with no results
  it('shows a friendly message when no recipes are found', async () => {
    // Mock an API response with an empty array
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    // Render the component
    render(<Search />);

    // Simulate a search for a non-existent recipe name
    fireEvent.click(screen.getByText(/Pick: Name/i));
    fireEvent.change(screen.getByLabelText(/query/i), { target: { value: 'zzz' } });
    fireEvent.click(screen.getByText(/Run Search/i));

    // Wait for the "no recipes found" error message to appear
    await waitFor(() =>
      expect(
        screen.getByText('Error: No recipes found. Try a different search term.')
      ).toBeInTheDocument()
    );

    // Ensure no search results are rendered
    expect(screen.queryByTestId('search-result')).not.toBeInTheDocument();
  });

  // Test case: handling an API error (e.g., status 500)
  it('shows a generic fetch error when the API returns !ok', async () => {
    // Mock a failed fetch response
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    // Render the component
    render(<Search />);

    // Simulate a search that will trigger the failed fetch
    fireEvent.click(screen.getByText(/Pick: Area/i));
    fireEvent.change(screen.getByLabelText(/query/i), { target: { value: 'NonExistentArea' } });
    fireEvent.click(screen.getByText(/Run Search/i));

    // Wait for the generic error message to be displayed
    await waitFor(() =>
      expect(
        screen.getByText('Error: No recipes found. Try a different search term.')
      ).toBeInTheDocument()
    );
  });
});