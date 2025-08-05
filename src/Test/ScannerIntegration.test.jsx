import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import Scanner from '../pages/Scanner'

// Mock the global fetch function before each test
beforeEach(() => {
  vi.spyOn(global, 'fetch')
})

// Restore the original fetch function after each test
afterEach(() => {
  vi.restoreAllMocks()
})

// Describe a test suite for the Scanner component's integration
describe('Scanner Component (integration)', () => {
  // Test case: successful image upload, API calls, and nutrition data rendering
  it('uploads an image, calls both endpoints, and renders nutrition data', async () => {
    // 1) Mock the response from the image-to-text API call
    const textData = [{ text: 'Test Food' }]
    // 2) Mock the response from the nutrition API call
    const nutritionData = [
      {
        name: 'Test Food',
        fat_total_g: 1,
        fat_saturated_g: 2,
        sodium_mg: 3,
        potassium_mg: 4,
        cholesterol_mg: 5,
        carbohydrates_total_g: 6,
        fiber_g: 7,
        sugar_g: 8,
      },
    ]

    // Chain two mock resolved values for the two separate fetch calls
    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => textData })
      .mockResolvedValueOnce({ ok: true, json: async () => nutritionData })

    // Render the Scanner component
    const { container } = render(<Scanner />)

    // Simulate uploading a dummy PNG file
    const fileInput = container.querySelector('input[type="file"]')
    const file = new File(['dummy'], 'test.png', { type: 'image/png' })
    fireEvent.change(fileInput, { target: { files: [file] } })

    // Find and click the "Get Nutrition!" button
    const analyseBtn = screen.getByRole('button', { name: /get nutrition!/i })
    fireEvent.click(analyseBtn)

    // Expect the loading indicator to be present
    expect(
      screen.getByText(/Analyzing nutritional info, hang tight!/i)
    ).toBeInTheDocument()

    // Wait for the loading indicator to disappear, signifying the end of the API calls
    await waitFor(() => {
      expect(
        screen.queryByText(/Analyzing nutritional info, hang tight!/i)
      ).not.toBeInTheDocument()
    })

    // Assert that the food item name from the mock data is rendered
    expect(screen.getByText('Test Food')).toBeInTheDocument()

    // Assert that the fat content is displayed correctly
    const fatLabel = screen.getByText('Fat:')
    const fatLi = fatLabel.parentElement
    expect(fatLi).toHaveTextContent(/Fat:\s*1\s*g/)

    // Assert that the carb content is displayed correctly
    const carbsLabel = screen.getByText('Carbs:')
    const carbsLi = carbsLabel.parentElement
    expect(carbsLi).toHaveTextContent(/Carbs:\s*6\s*g/)

    // Assert that the estimated calories are also displayed
    expect(screen.getByText(/Estimated Calories:/)).toBeInTheDocument()
  })

  // Test case: handling a failed image-to-text API call
  it('shows an error when the image-to-text call fails', async () => {
    // Mock a failed fetch response
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => 'Server error',
    })

    // Render the component
    const { container } = render(<Scanner />)
    const fileInput = container.querySelector('input[type="file"]')
    const file = new File(['dummy'], 'test.png', { type: 'image/png' })
    fireEvent.change(fileInput, { target: { files: [file] } })

    // Click the analysis button
    fireEvent.click(screen.getByRole('button', { name: /get nutrition!/i }))

    // Wait for the error message to appear
    await waitFor(() => {
      expect(
        screen.getByText(
          /Error: Couldn't analyze text\. Try an image with clearer text\./i
        )
      ).toBeInTheDocument()
    })
  })

  // Test case: validating the file size before uploading
  it('validates file size and prevents upload of too-large images', () => {
    // Render the component
    const { container } = render(<Scanner />)
    const fileInput = container.querySelector('input[type="file"]')

    // Create a mock file that is larger than the allowed size (200 KB)
    const tooBig = new File([new Uint8Array(200_001)], 'big.png', {
      type: 'image/png',
    })
    fireEvent.change(fileInput, { target: { files: [tooBig] } })

    // Expect the file size error message to be displayed
    expect(
      screen.getByText(
        /Error: File size is too large\. Please use a file smaller than 200 KB\./i
      )
    ).toBeInTheDocument()

    // Assert that the analysis button is disabled
    expect(
      screen.getByRole('button', { name: /get nutrition!/i })
    ).toBeDisabled()
  })
})