import { useState, useEffect, useRef } from 'react';
import useRecipe from '../../Hooks/UseRecipe.js';
import { FaFileDownload, FaTimes } from 'react-icons/fa';


// SearchResult component displays a summary of a recipe and shows a modal with full details
export default function SearchResult({ number, name, image, area, category, recipeData }) {

  const { setSelectedRecipe, selectedRecipe } = useRecipe();

  const [showModal, setShowModal] = useState(false);
  const [nutritionData, setNutritionData] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const modalRef = useRef(null); // Reference for modal DOM element

  const key = import.meta.env.VITE_API_NINJAS_KEY; // API key for Nutrition API

  // Order of nutrition keys to display
  const nutritionOrder = [
    "fat_total_g", "sodium_mg", "potassium_mg",
    "cholesterol_mg", "carbohydrates_total_g", "fiber_g", "sugar_g"
  ];

  //nutrition labels
  const displayLabel = {
    fat_total_g: "Fat",
    sodium_mg: "Sodium",
    potassium_mg: "Potassium",
    cholesterol_mg: "Cholesterol",
    carbohydrates_total_g: "Carbs",
    fiber_g: "Fiber",
    sugar_g: "Sugar",
  };

  // Units corresponding to each nutrition field
  const units = [ "g", "mg", "mg", "mg", "g", "g", "g" ];

  /**
   * useEffect hook to fetch nutrition data when modal opens and a recipe is selected.
   * Calls API-Ninjas' Nutrition endpoint for each ingredient.
   * Updates state with fetched nutrition data or error if any.
   */
  useEffect(() => {
    const fetchNutrition = async () => {
      setError(null);
      if (!selectedRecipe?.ingredients) return;
      setLoading(true);

      const results = await Promise.all(
        selectedRecipe.ingredients.map(async (ing) => {
          const query = `${ing.measure} ${ing.name}`;
          try {
            const response = await fetch(
              `https://api.api-ninjas.com/v1/nutrition?query=${encodeURIComponent(query)}`,
              {
                headers: {
                  "X-Api-Key": key,
                },
              }
            );

            if (!response.ok) {
              throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            return { ingredient: ing.name, data: data[0] };
          } catch (err) {
            console.error("Error: ", err.message);
            setError("Error: API Ninja's text to nutrition endpoint may be down. Try refreshing the page or check the status at https://api-ninjas.com/api/nutrition.");
            return { ingredient: ing.name, data: null };
          }
        })
      );

      setNutritionData(results);
      setLoading(false);
    };

    if (showModal && selectedRecipe) {
      fetchNutrition();
    }
  }, [showModal, selectedRecipe]);

  /*
    Calculates total nutrition values for each nutrient type across all ingredients.
    Output: Object with keys from `nutritionOrder` and numeric values.
   */
  const totals = nutritionOrder.reduce((acc, key) => {
    acc[key] = nutritionData.reduce((sum, item) => {
      return item.data && !isNaN(item.data[key]) ? sum + Number(item.data[key]) : sum;
    }, 0);
    return acc;
  }, {});

  /*
   Calculates estimated calories from totals:
   Fat: 9 kcal/g
   Net carbs (carbs - fiber): 4 kcal/g
   Fiber: 2 kcal/g
   Output: Number (estimated total calories)
   */
  const estimatedCalories =
    (totals.fat_total_g || 0) * 9 +
    (Math.max((totals.carbohydrates_total_g || 0) - (totals.fiber_g || 0), 0)) * 4 +
    (totals.fiber_g || 0) * 2;

  /*
    Handles user clicking the recipe card.
    Sets selected recipe and opens the modal.
   */
  const handleClick = () => {
    setSelectedRecipe(recipeData);
    setShowModal(true);
  };

  /*
    Opens a new window and generates a printable HTML version of the recipe.
    Includes recipe image, ingredients, instructions, and nutrition info.
    Automatically triggers the browser print dialog.
   */
  const generatePDF = () => {
    const printWindow = window.open('', '_blank');
    const htmlContent = `...`;
    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  // JSX rendering below
  return (
    <>
      {/* Recipe preview card */}
      <div
        onClick={handleClick}
        className="cursor-pointer bg-base-200 p-6 rounded-xl hover:bg-primary transition duration-300 hover:scale-102 group shadow-lg"
      >
        <div className="flex flex-row justify-between">
          <div className="flex flex-col space-y-5">
            <h1 className="text-xl font-semibold text-base-content group-hover:text-white transition duration-300">
              {number}. {name}
            </h1>
            <div className="flex space-x-1">
              <p className="text-md font-semibold group-hover:text-white transition duration-300">Area:</p>
              <p className="text-md text-secondary-content group-hover:text-white transition duration-300">{area}</p>
            </div>
            <div className="flex space-x-1">
              <p className="text-md font-semibold group-hover:text-white transition duration-300">Category:</p>
              <p className="text-md text-secondary-content group-hover:text-white transition duration-300">{category}</p>
            </div>
          </div>
          <img src={image} className="h-40 w-40 rounded-xl" alt={name + ' - Picture unavailable.'} />
        </div>
      </div>

      {/* Modal for detailed recipe view */}
      {showModal && selectedRecipe && (
        <div className="fixed inset-0 z-50">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xl transition-all duration-500"></div>

          <div ref={modalRef} className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto">
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-7xl p-10 max-h-[90vh] overflow-y-auto border border-gray-200">

              {/* Header section */}
              <div className="flex flex-col md:flex-row justify-between items-start mb-10">
                <div className="flex gap-6">
                  <img
                    src={selectedRecipe.image}
                    alt={selectedRecipe.name + ' - Picture unavailable.'}
                    className="w-52 h-52 rounded-xl shadow-xl"
                  />
                  <div>
                    <h1 className="text-3xl font-bold">{selectedRecipe.name}</h1>
                    <p className="mt-2 text-gray-500 text-sm italic">Powered by TheMealDB & API Ninjas</p>
                    <div className="flex space-x-1 mt-4">
                      <p className="text-md font-semibold group-hover:text-white transition duration-300">Area:</p>
                      <p className="text-md text-secondary-content group-hover:text-white transition duration-300">{selectedRecipe.area}</p>
                    </div>
                    <div className="flex space-x-1">
                      <p className="text-md group-hover:text-white font-semibold transition duration-300">Category:</p>
                      <p className="text-md text-secondary-content group-hover:text-white transition duration-300">{selectedRecipe.category}</p>
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex flex-row gap-5">
                  <button
                    onClick={generatePDF}
                    className="btn btn-primary text-white px-6 py-2.5 rounded-full flex items-center transition-all duration-300 hover:scale-110 shadow-lg"
                  >
                    <FaFileDownload /> Save as PDF
                  </button>
                  <button
                    onClick={() => setShowModal(false)}
                    className="btn btn-primary text-white rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110 shadow-lg"
                  >
                    <FaTimes />
                  </button>
                </div>
              </div>

              {/* Grid content */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Ingredients Section */}
                <div className="bg-base-200 rounded-xl p-5 shadow-xl h-[420px] overflow-y-auto">
                  <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
                  <ul className="list-disc ml-5 space-y-1 text-secondary-content">
                    {selectedRecipe.ingredients.map((ing, idx) => (
                      <li key={idx}>
                        <span className="font-semibold">{ing.name}</span> — {ing.measure}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Instructions Section */}
                <div className="bg-base-200 rounded-xl p-5 shadow-xl h-[420px] overflow-y-auto">
                  <h2 className="text-xl font-semibold mb-4">Instructions</h2>
                  <p className="text-secondary-content whitespace-pre-line leading-relaxed">
                    {selectedRecipe.instructions}
                  </p>
                </div>

                {/* Nutrition Section */}
                <div className="bg-base-200 rounded-xl p-5 shadow-xl h-[420px] overflow-y-auto">
                  <h2 className="text-xl font-semibold mb-4">Nutrition Analysis</h2>
                  {loading ? (
                    <div className="flex flex-row space-x-2">
                      <p className="text-gray-600">Analyzing nutritional data, hang tight!</p>
                      <span className="loading loading-spinner text-primary loading-"></span>
                    </div>
                  ) : error ? (
                    <p className="text-error">
                      Error: API Ninja's text to nutrition endpoint may be down. Check the status at{" "}
                      <a
                        href="https://api-ninjas.com/api/nutrition"
                        target="_blank"
                        className="text-error underline"
                      >
                        https://api-ninjas.com/api/nutrition.
                      </a>
                    </p>
                  ) : (
                    <>
                      <ul className="list-disc ml-5 space-y-1 text-secondary-content">
                        {nutritionOrder.map((key, idx) => (
                          <li key={key}>
                            <span className="font-medium">{displayLabel[key]}</span>: {totals[key]?.toFixed(1)} {units[idx]}
                          </li>
                        ))}
                      </ul>
                      <div className="flex space-x-1">
                        <p className="mt-4 font-semibold text-md text-secondary-content">
                          Estimated Calories:
                        </p>
                        <p className="mt-4 text-md text-secondary-content">
                          {estimatedCalories.toFixed(0)} kcal
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
}