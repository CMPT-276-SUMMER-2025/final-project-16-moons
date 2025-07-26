import { useEffect, useState } from "react";
import useRecipe from "../Hooks/UseRecipe";
import { useNavigate } from "react-router-dom";
import { FaFileDownload, FaTimes } from "react-icons/fa";

export default function RecipeDetail() {
  const { selectedRecipe } = useRecipe();
  const [nutritionData, setNutritionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleDownloadPDF = () => {
    window.print();
  };

  const handleClick = () => {
    navigate("/search");
  };

  const nutritionOrder = [
    "fat_total_g",
    "sodium_mg",
    "potassium_mg",
    "cholesterol_mg",
    "carbohydrates_total_g",
    "fiber_g",
    "sugar_g",
  ];

  const displayLabel = {
    fat_total_g: "Total Fat (g)",
    sodium_mg: "Sodium (mg)",
    potassium_mg: "Potassium (mg)",
    cholesterol_mg: "Cholesterol (mg)",
    carbohydrates_total_g: "Carbs (g)",
    fiber_g: "Fiber (g)",
    sugar_g: "Sugar (g)",
  };

  useEffect(() => {
    const fetchNutrition = async () => {
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
                  "X-Api-Key": import.meta.env.VITE_API_NINJA_KEY,
                },
              }
            );
            if (!response.ok) throw new Error("Nutrition fetch failed");

            const data = await response.json();
            return { ingredient: ing.name, data: data[0] };
          } catch (error) {
            console.error("Error fetching nutrition for", ing.name, error);
            return { ingredient: ing.name, data: null };
          }
        })
      );

      setNutritionData(results);
      setLoading(false);
    };

    fetchNutrition();
  }, [selectedRecipe]);

  const calculateTotals = () => {
    const totals = {};
    nutritionOrder.forEach((key) => (totals[key] = 0));
    nutritionData.forEach((item) => {
      if (item.data) {
        nutritionOrder.forEach((key) => {
          if (!isNaN(item.data[key])) {
            totals[key] += Number(item.data[key]);
          }
        });
      }
    });
    return totals;
  };

  const calculateCaloriesFromMacros = (totals) => {
    const fat = totals.fat_total_g || 0;
    const carbs = totals.carbohydrates_total_g || 0;
    const fiber = totals.fiber_g || 0;
    const netCarbs = Math.max(carbs - fiber, 0);

    return fat * 9 + netCarbs * 4 + fiber * 2;
  };

  const totals = calculateTotals();
  const estimatedCalories = calculateCaloriesFromMacros(totals);

  if (!selectedRecipe) {
    return (
      <div className="p-6 text-center">
        <h1 className="text-3xl font-bold mb-4 text-gray-800">No recipe selected</h1>
        <p className="text-gray-600">Please go back and select a recipe from the search page.</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white rounded-xl shadow-lg max-w-screen-xl mx-auto relative">
      {/* Close Button */}
      <button
        onClick={handleClick}
        className="absolute top-4 right-4 bg-red-600 hover:bg-red-700 text-white rounded-full w-9 h-9 flex items-center justify-center shadow-md"
        title="Back to Search"
      >
        <FaTimes />
      </button>

      {/* Header */}
      <div className="flex items-center justify-between mb-10">
        <div className="flex gap-6 items-center">
          <img
            src={selectedRecipe.image}
            alt={selectedRecipe.name}
            className="w-52 h-52 object-cover rounded-xl border shadow"
          />
          <div>
            <h1 className="text-4xl font-bold text-gray-800">{selectedRecipe.name}</h1>
            <p className="mt-2 text-gray-600 italic">Powered by TheMealDB & Nutrition API</p>
          </div>
        </div>

        <button
          onClick={handleDownloadPDF}
          className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-2.5 rounded-lg shadow flex items-center gap-2 transition"
        >
          <FaFileDownload /> Save as PDF
        </button>
      </div>

      {/* Section Panels */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Ingredients */}
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-5 shadow-inner overflow-y-auto h-[420px]">
          <h2 className="text-xl font-semibold text-orange-700 mb-3">🧂 Ingredients</h2>
          <ul className="list-disc ml-5 space-y-1 text-gray-700">
            {selectedRecipe.ingredients.map((ing, idx) => (
              <li key={idx}>
                <span className="font-medium">{ing.name}</span> - {ing.measure}
              </li>
            ))}
          </ul>
        </div>

        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-5 shadow-inner overflow-y-auto h-[420px]">
          <h2 className="text-xl font-semibold text-blue-700 mb-3">📋 Instructions</h2>
          <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">
            {selectedRecipe.instructions}
          </p>
        </div>

        {/* Nutrition */}
        <div className="bg-green-50 border border-green-200 rounded-lg p-5 shadow-inner overflow-y-auto h-[420px]">
          <h2 className="text-xl font-semibold text-green-700 mb-3">🥗 Nutrition Analysis</h2>
          {loading ? (
            <p className="text-gray-600">Loading nutrition data...</p>
          ) : (
            <>
              <ul className="list-disc ml-5 space-y-1 text-gray-700">
                {nutritionOrder.map((key) => (
                  <li key={key}>
                    <span className="font-medium">{displayLabel[key]}</span>:{" "}
                    {totals[key].toFixed(1)}
                  </li>
                ))}
              </ul>
              <p className="mt-4 font-semibold text-lg text-green-800">
                🔥 Estimated Calories: {estimatedCalories.toFixed(0)} kcal
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
