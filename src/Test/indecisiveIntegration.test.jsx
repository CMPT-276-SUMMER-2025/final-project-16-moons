// src/Test/indecisiveIntegration.test.jsx
import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Indecisive from '../pages/Indecisive';

// Stub out the RandomRecipe (SearchResult) component
vi.mock('../components/Search/SearchResult', () => ({
  __esModule: true,
  default: ({ number, name }) => (
    <div data-testid="random-recipe">
      <h2>{name}</h2>
    </div>
  )
}));

beforeEach(() => {
  // spy on global.fetch so we can mock its implementations
  vi.spyOn(global, 'fetch');
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Indecisive integration', () => {
  it('fetches and displays three recipes on button click', async () => {
    const mockMeals = [
      { strMeal: 'Meal1', strMealThumb: 'img1', strCategory: 'Cat1', strArea: 'Area1', strInstructions: 'Inst1', strIngredient1: 'Ing1', strMeasure1: '1 unit' },
      { strMeal: 'Meal2', strMealThumb: 'img2', strCategory: 'Cat2', strArea: 'Area2', strInstructions: 'Inst2', strIngredient1: 'Ing2', strMeasure1: '2 units' },
      { strMeal: 'Meal3', strMealThumb: 'img3', strCategory: 'Cat3', strArea: 'Area3', strInstructions: 'Inst3', strIngredient1: 'Ing3', strMeasure1: '3 units' },
    ];

    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => ({ meals: [mockMeals[0]] }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ meals: [mockMeals[1]] }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ meals: [mockMeals[2]] }) });

    render(<Indecisive />);

    fireEvent.click(screen.getByRole('button', { name: /surprise me/i }));

    // Loading state
    expect(screen.getByText(/fetching recipes/i)).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.queryByText(/fetching recipes/i)).not.toBeInTheDocument();
    });

    // Three headings and recipe cards
    ['Breakfast', 'Lunch', 'Dinner'].forEach((heading) => {
      expect(screen.getByText(heading)).toBeInTheDocument();
    });
    const cards = screen.getAllByTestId('random-recipe');
    expect(cards).toHaveLength(3);

    mockMeals.forEach((m) => {
      expect(screen.getByText(m.strMeal)).toBeInTheDocument();
    });
  });

  it('displays error message when fetch fails', async () => {
    global.fetch.mockResolvedValueOnce({ ok: false, status: 500 });

    render(<Indecisive />);
    fireEvent.click(screen.getByRole('button', { name: /surprise me/i }));

    await waitFor(() => {
      expect(screen.getByText(/error: failed to fetch recipes/i)).toBeInTheDocument();
    });
  });
});
