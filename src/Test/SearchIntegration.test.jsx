// SearchIntegration.test.jsx
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import Search from '../pages/Search';

// ---- Mock static assets
vi.mock('../assets/icons/meat.png', () => ({ default: 'meat.png' }));
vi.mock('../assets/icons/apple.png', () => ({ default: 'apple.png' }));
vi.mock('../assets/icons/carrot.png', () => ({ default: 'carrot.png' }));
vi.mock('../assets/images/linesHorizontal.png', () => ({ default: 'lines.png' }));

// ---- Mock child components
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

describe('Search Component (integration)', () => {
  beforeEach(() => {
    vi.spyOn(global, 'fetch');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('performs a "name" search, renders a full recipe, and hides the loader', async () => {
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

    render(<Search />);

    fireEvent.click(screen.getByText(/Pick: Name/i));
    fireEvent.change(screen.getByLabelText(/query/i), { target: { value: 'pasta' } });
    fireEvent.click(screen.getByText(/Run Search/i));

    expect(screen.getByText(/Fetching recipes, hang tight!/i)).toBeInTheDocument();

    await waitFor(() =>
      expect(screen.queryByText(/Fetching recipes, hang tight!/i)).not.toBeInTheDocument()
    );

    expect(screen.getByText('Test Pasta')).toBeInTheDocument();
    expect(screen.getByText('Area: Unavailable')).toBeInTheDocument();
    expect(screen.getByText('Category: Unavailable')).toBeInTheDocument();

    expect(global.fetch).toHaveBeenCalledWith(
      `${APININJAS_BASE}pasta`,
      { headers: { 'X-Api-Key': undefined } }
    );
  });

  it('performs an "ingredient" search, then fetches full details per recipe', async () => {
    const filterResponse = { meals: [{ strMeal: 'Test Curry', strMealThumb: 'http://img/curry.jpg' }] };
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

    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => filterResponse })
      .mockResolvedValueOnce({ ok: true, json: async () => detailResponse });

    render(<Search />);

    fireEvent.click(screen.getByText(/Pick: Ingredient/i));
    fireEvent.change(screen.getByLabelText(/query/i), { target: { value: 'chicken' } });
    fireEvent.click(screen.getByText(/Run Search/i));

    await waitFor(() => expect(screen.queryByText(/Fetching recipes, hang tight!/i)).not.toBeInTheDocument());

    expect(screen.getByText('Test Curry')).toBeInTheDocument();
    expect(screen.getByText('Area: Indian')).toBeInTheDocument();
    expect(screen.getByText('Category: Curry')).toBeInTheDocument();

    expect(global.fetch).toHaveBeenNthCalledWith(1, `${MEALDB_BASE}/filter.php?i=chicken`, {});
    // *** THIS IS THE CORRECTED LINE ***
    expect(global.fetch).toHaveBeenNthCalledWith(2, `${MEALDB_BASE}/search.php?s=Test%20Curry`);
  });

  it('shows a friendly message when no recipes are found', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    render(<Search />);

    fireEvent.click(screen.getByText(/Pick: Name/i));
    fireEvent.change(screen.getByLabelText(/query/i), { target: { value: 'zzz' } });
    fireEvent.click(screen.getByText(/Run Search/i));

    await waitFor(() =>
      expect(
        screen.getByText('Error: No recipes found. Try a different search term.')
      ).toBeInTheDocument()
    );

    expect(screen.queryByTestId('search-result')).not.toBeInTheDocument();
  });

  it('shows a generic fetch error when the API returns !ok', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
    });

    render(<Search />);

    fireEvent.click(screen.getByText(/Pick: Area/i));
    fireEvent.change(screen.getByLabelText(/query/i), { target: { value: 'NonExistentArea' } });
    fireEvent.click(screen.getByText(/Run Search/i));

    await waitFor(() =>
      expect(
        screen.getByText('Error: No recipes found. Try a different search term.')
      ).toBeInTheDocument()
    );
  });
});