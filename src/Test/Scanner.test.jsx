import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll } from "vitest";
import Scanner from "../pages/Scanner";

// Set a dummy API key so the component doesn't fail due to missing environment variables
beforeAll(() => {
  process.env.VITE_API_NINJAS_KEY = "test_key";
});

describe("Scanner component", () => {
  it("renders and has 'Get Nutrition!' button disabled initially", () => {
    render(<Scanner />);

    // Ensure heading and initial disabled button are present
    expect(screen.getByText(/Nutrition Analysis/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /get nutrition!/i })
    ).toBeDisabled();
  });

  it("shows error for too-large files", async () => {
    const { container } = render(<Scanner />);
    const input = container.querySelector('input[type="file"]');

    // File over 200 KB (200001 bytes) – triggers size validation error
    const bigFile = new File([new ArrayBuffer(200001)], "big.png", {
      type: "image/png",
    });

    // Trigger validation with fireEvent (bypasses native accept filter)
    fireEvent.change(input, { target: { files: [bigFile] } });

    // Expect specific error message for large file
    expect(
      await screen.findByText(
        /Error: File size is too large\. Please use a file smaller than 200 KB\./i
      )
    ).toBeInTheDocument();

    // Button should remain disabled
    expect(
      screen.getByRole("button", { name: /get nutrition!/i })
    ).toBeDisabled();
  });

  it("shows error for unsupported file types", async () => {
    const { container } = render(<Scanner />);
    const input = container.querySelector('input[type="file"]');

    // Invalid file type (.txt), triggers type validation
    const txtFile = new File(["hello"], "readme.txt", {
      type: "text/plain",
    });

    fireEvent.change(input, { target: { files: [txtFile] } });

    // Expect format error message
    expect(
      await screen.findByText(/Unsupported image format/i)
    ).toBeInTheDocument();

    // Button should remain disabled
    expect(
      screen.getByRole("button", { name: /get nutrition!/i })
    ).toBeDisabled();
  });

  it("enables button when a valid file is selected", async () => {
    const { container } = render(<Scanner />);
    const input = container.querySelector('input[type="file"]');

    // Valid PNG under 200KB
    const png = new File(["hi"], "small.png", { type: "image/png" });
    fireEvent.change(input, { target: { files: [png] } });

    // No errors should appear, button should be enabled
    expect(screen.queryByText(/^Error:/)).toBeNull();
    expect(
      screen.getByRole("button", { name: /get nutrition!/i })
    ).toBeEnabled();
  });

  it("fetches image-to-text and nutrition data and displays results", async () => {
    // Mock both /imagetotext and /nutrition API responses
    const fetchMock = vi
      .spyOn(global, "fetch")
      .mockImplementation((url) => {
        if (url.includes("/imagetotext")) {
          return Promise.resolve({
            ok: true,
            json: () => Promise.resolve([{ text: "apple 100g" }]),
          });
        }
        if (url.includes("/nutrition")) {
          return Promise.resolve({
            ok: true,
            json: () =>
              Promise.resolve([
                {
                  name: "apple",
                  fat_total_g: 0.2,
                  fat_saturated_g: 0.0,
                  sodium_mg: 1,
                  potassium_mg: 107,
                  cholesterol_mg: 0,
                  carbohydrates_total_g: 14,
                  fiber_g: 2.4,
                  sugar_g: 10,
                },
              ]),
          });
        }
        return Promise.reject(new Error("unexpected url: " + url));
      });

    const { container } = render(<Scanner />);
    const input = container.querySelector('input[type="file"]');
    const png = new File(["data"], "small.png", { type: "image/png" });

    // Simulate user selecting valid image
    fireEvent.change(input, { target: { files: [png] } });

    // Click to trigger image-to-text and nutrition fetch
    const btn = screen.getByRole("button", { name: /get nutrition!/i });
    fireEvent.click(btn);

    // Wait for final output — don't assert spinner here
    expect(await screen.findByText(/^apple$/i)).toBeInTheDocument();
    expect(screen.getByText(/Estimated Calories:/i)).toBeInTheDocument();

    // Restore fetch mock
    fetchMock.mockRestore();
  });
});
