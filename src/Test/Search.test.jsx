import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Search from '../pages/Search'

// Mock child components to simplify testing
vi.mock('../components/Search/SearchTopic', () => ({
  __esModule: true,
  default: ({ onSearch, setSearchType }) => (
    // Simulate a button that triggers a name search for "Test Meal"
    <button onClick={() => { setSearchType('name'); onSearch('name', 'Test Meal') }}>
      Search
    </button>
  ),
}))
vi.mock('../components/Search/SearchHint', () => ({ __esModule: true, default: () => <div>Hint</div> }))
vi.mock('../components/Search/SearchResult', () => ({
  __esModule: true,
  default: ({ number, name }) => (
    <div data-testid="result">{number}: {name}</div>
  ),
}))

describe('Search component', () => {
  const fakeMeal = {
    strMeal: 'Test Meal',
    strMealThumb: 'https://example.com/thumb.jpg',
    strCategory: 'Category',
    strArea: 'Area',
    strInstructions: 'Do something.',
    strIngredient1: 'Ingredient A',
    strMeasure1: '1 cup',
  }

  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ meals: [fakeMeal] }),
      })
    )
  })

  afterEach(() => {
    vi.resetAllMocks()
  })

  test('fetches and displays recipes on search', async () => {
    render(<Search />)

    userEvent.click(screen.getByRole('button', { name: /search/i }))

    // Wait for the SearchResult mock to appear
    await waitFor(() => expect(screen.getByTestId('result')).toBeInTheDocument())
    expect(screen.getByTestId('result')).toHaveTextContent('1: Test Meal')
    expect(global.fetch).toHaveBeenCalledWith(
      'https://www.themealdb.com/api/json/v1/1/search.php?s=Test%20Meal'
    )
  })

  test('shows error when no recipes found', async () => {
    // Override fetch to return empty meals
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: true, json: () => Promise.resolve({ meals: null }) })
    )

    render(<Search />)
    userEvent.click(screen.getByRole('button', { name: /search/i }))

    await waitFor(() => expect(screen.getByText(/no recipes found/i)).toBeInTheDocument())
  })
})
