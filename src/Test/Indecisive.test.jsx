import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Indecisive from '../pages/Indecisive'

// Mock the recipe‐context hook so SearchResult won’t crash
vi.mock('../Hooks/UseRecipe', () => ({
  __esModule: true,
  default: () => ({
    setSelectedRecipe: vi.fn(),
    selectedRecipe: null,
  }),
}))

const fakeMeal = {
  strMeal: 'Test Meal',
  strMealThumb: 'https://example.com/thumb.jpg',
  strCategory: 'Test Category',
  strArea: 'Test Area',
  strInstructions: 'Do something.',
  strIngredient1: 'Ingredient A',
  strMeasure1: '1 cup',
}

describe('Scanner component', () => {
  beforeEach(() => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ meals: [fakeMeal] }),
      })
    )
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  test('fetches 3 recipes on click and displays them', async () => {
    render(<Indecisive />)

    // Verify initial prompt is on screen
    expect(
      screen.getByText(/don't know what you want to eat today\?/i)
    ).toBeInTheDocument()

    // Simulate click on "Surprise Me!" button
    await userEvent.click(
      screen.getByRole('button', { name: /surprise me/i })
    )

    // Wait for any heading with "Test Meal" to appear
    const headings = await screen.findAllByRole('heading', { name: /test meal/i })
    expect(headings).toHaveLength(3)

    // Confirm fetch was called 3 times
    expect(global.fetch).toHaveBeenCalledTimes(3)
  })

  test('displays error message on fetch failure', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({ ok: false, status: 500 })
    )

    render(<Indecisive />)

    await userEvent.click(
      screen.getByRole('button', { name: /surprise me/i })
    )

    const err = await screen.findByText(
      /error: failed to fetch recipes\. please try again\./i
    )
    expect(err).toBeInTheDocument()
  })
})
