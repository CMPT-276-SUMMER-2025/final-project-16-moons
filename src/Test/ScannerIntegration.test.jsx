// src/Test/ScannerIntegration.test.jsx
import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import Scanner from '../pages/Scanner'

beforeEach(() => {
  vi.spyOn(global, 'fetch')
})

afterEach(() => {
  vi.restoreAllMocks()
})

describe('Scanner Component (integration)', () => {
  it('uploads an image, calls both endpoints, and renders nutrition data', async () => {
    // 1) Mock image→text response
    const textData = [{ text: 'Test Food' }]
    // 2) Mock nutrition response
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

    global.fetch
      .mockResolvedValueOnce({ ok: true, json: async () => textData })
      .mockResolvedValueOnce({ ok: true, json: async () => nutritionData })

    const { container } = render(<Scanner />)

    // Upload a dummy PNG
    const fileInput = container.querySelector('input[type="file"]')
    const file = new File(['dummy'], 'test.png', { type: 'image/png' })
    fireEvent.change(fileInput, { target: { files: [file] } })

    // Click "Get Nutrition!"
    const analyseBtn = screen.getByRole('button', { name: /get nutrition!/i })
    fireEvent.click(analyseBtn)

    // Loading indicator
    expect(
      screen.getByText(/Analyzing nutritional info, hang tight!/i)
    ).toBeInTheDocument()

    // Wait for loading to finish
    await waitFor(() => {
      expect(
        screen.queryByText(/Analyzing nutritional info, hang tight!/i)
      ).not.toBeInTheDocument()
    })

    // The “Test Food” item should appear
    expect(screen.getByText('Test Food')).toBeInTheDocument()

    // — Fat —
    const fatLabel = screen.getByText('Fat:')
    const fatLi = fatLabel.parentElement
    expect(fatLi).toHaveTextContent(/Fat:\s*1\s*g/)

    // — Carbs —
    const carbsLabel = screen.getByText('Carbs:')
    const carbsLi = carbsLabel.parentElement
    expect(carbsLi).toHaveTextContent(/Carbs:\s*6\s*g/)

    // Estimated Calories
    expect(screen.getByText(/Estimated Calories:/)).toBeInTheDocument()
  })

  it('shows an error when the image-to-text call fails', async () => {
    global.fetch.mockResolvedValueOnce({
      ok: false,
      status: 500,
      text: async () => 'Server error',
    })

    const { container } = render(<Scanner />)
    const fileInput = container.querySelector('input[type="file"]')
    const file = new File(['dummy'], 'test.png', { type: 'image/png' })
    fireEvent.change(fileInput, { target: { files: [file] } })

    fireEvent.click(screen.getByRole('button', { name: /get nutrition!/i }))

    await waitFor(() => {
      expect(
        screen.getByText(
          /Error: Couldn't analyze text\. Try an image with clearer text\./i
        )
      ).toBeInTheDocument()
    })
  })

  it('validates file size and prevents upload of too-large images', () => {
    const { container } = render(<Scanner />)
    const fileInput = container.querySelector('input[type="file"]')

    // create a blob >200 KB
    const tooBig = new File([new Uint8Array(200_001)], 'big.png', {
      type: 'image/png',
    })
    fireEvent.change(fileInput, { target: { files: [tooBig] } })

    expect(
      screen.getByText(
        /Error: File size is too large\. Please use a file smaller than 200 KB\./i
      )
    ).toBeInTheDocument()

    // button should remain disabled
    expect(
      screen.getByRole('button', { name: /get nutrition!/i })
    ).toBeDisabled()
  })
})
