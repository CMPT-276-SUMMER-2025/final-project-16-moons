import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import SearchResult from '../components/Search/SearchResult';

// Mock the useRecipe hook
const mockSetSelectedRecipe = vi.fn();
const sampleRecipe = {
  name: 'Mock Dish',
  area: 'Italian',
  category: 'Main Course',
  image: 'https://example.com/image.jpg',
  instructions: 'Cook everything together.',
  ingredients: [
    { name: 'Pasta', measure: '100g' },
    { name: 'Cheese', measure: '50g' },
  ],
};

vi.mock('../Hooks/UseRecipe.js', () => ({
  default: () => ({
    selectedRecipe: sampleRecipe,
    setSelectedRecipe: mockSetSelectedRecipe,
  }),
}));

describe('SearchResult API call test', () => {
  beforeEach(() => {
    // Mock the global fetch function
    global.fetch = vi.fn(() => {
      return Promise.resolve({
        ok: true, // Crucial: Indicate a successful response
        json: () =>
          Promise.resolve([
            {
              fat_total_g: 10,
              sodium_mg: 500,
              potassium_mg: 400,
              cholesterol_mg: 50,
              carbohydrates_total_g: 60,
              fiber_g: 5,
              sugar_g: 3,
            },
          ]),
      });
    });
  });

  afterEach(() => {
    // Clear all mocks after each test to ensure isolation
    vi.clearAllMocks();
  });

  it('fetches nutrition data when modal is opened and displays results', async () => {
    render(
      <SearchResult
        number={1}
        name="Mock Dish"
        image={sampleRecipe.image}
        area={sampleRecipe.area}
        category={sampleRecipe.category}
        recipeData={sampleRecipe}
      />
    );

    // Trigger modal open by clicking the search result item
    fireEvent.click(screen.getByText(/1\. Mock Dish/i));

    // Wait for the nutrition section to appear in the modal and assert its content
    await waitFor(() => {
      const nutritionBlock = screen
        .getByText('Nutrition Analysis')
        .closest('div');
      expect(nutritionBlock).toBeTruthy();
      expect(nutritionBlock.textContent).toContain('Fat:');
      expect(nutritionBlock.textContent).toContain('Sodium:');
      expect(nutritionBlock.textContent).toContain('Cholesterol:');
      expect(nutritionBlock.textContent).toContain('Estimated Calories:');

      expect(nutritionBlock.textContent).toContain('640');
    });

    // Assert that fetch was called for each ingredient
    expect(global.fetch).toHaveBeenCalledTimes(2);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('100g%20Pasta'),
      expect.any(Object)
    );
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('50g%20Cheese'),
      expect.any(Object)
    );
  });
});
