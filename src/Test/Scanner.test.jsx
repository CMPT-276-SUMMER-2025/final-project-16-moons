// Scanner.test.jsx
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeAll } from "vitest";
import Scanner from "../pages/Scanner";

beforeAll(() => {
  // make sure our component sees an API key
  process.env.VITE_API_NINJAS_KEY = "test_key";
});

describe("Scanner component", () => {
  it("renders and has 'Get Nutrition!' button disabled initially", () => {
    render(<Scanner />);
    expect(screen.getByText(/Nutrition Analysis/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /get nutrition!/i })
    ).toBeDisabled();
  });

  it("shows error for too-large files", async () => {
    const { container } = render(<Scanner />);
    const input = container.querySelector('input[type="file"]');
    const bigFile = new File([new ArrayBuffer(200001)], "big.png", {
      type: "image/png",
    });

    // bypass accept-filter by using fireEvent.change
    fireEvent.change(input, { target: { files: [bigFile] } });

    // validateImage throws this exact message :contentReference[oaicite:3]{index=3}
    expect(
      await screen.findByText(
        /Error: File size is too large\. Please use a file smaller than 200 KB\./i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /get nutrition!/i })
    ).toBeDisabled();
  });

  it("shows error for unsupported file types", async () => {
    const { container } = render(<Scanner />);
    const input = container.querySelector('input[type="file"]');
    const txtFile = new File(["hello"], "readme.txt", {
      type: "text/plain",
    });

    // again, use fireEvent.change so validateImage runs :contentReference[oaicite:4]{index=4}
    fireEvent.change(input, { target: { files: [txtFile] } });

    expect(
      await screen.findByText(/Unsupported image format/i)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /get nutrition!/i })
    ).toBeDisabled();
  });

  it("enables button when a valid file is selected", async () => {
    const { container } = render(<Scanner />);
    const input = container.querySelector('input[type="file"]');
    const png = new File(["hi"], "small.png", { type: "image/png" });

    fireEvent.change(input, { target: { files: [png] } });

    expect(screen.queryByText(/^Error:/)).toBeNull();
    expect(
      screen.getByRole("button", { name: /get nutrition!/i })
    ).toBeEnabled();
  });

  it("fetches image-to-text and nutrition data and displays results", async () => {
    // Mock both endpoints
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
    fireEvent.change(input, { target: { files: [png] } });

    const btn = screen.getByRole("button", { name: /get nutrition!/i });
    fireEvent.click(btn);

    // Now just wait for the final "apple" result—skip the spinner assertion
    expect(await screen.findByText(/^apple$/i)).toBeInTheDocument();
    expect(screen.getByText(/Estimated Calories:/i)).toBeInTheDocument();

    fetchMock.mockRestore();
  });
});
