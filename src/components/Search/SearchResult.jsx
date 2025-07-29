import { useState, useEffect, useRef } from 'react';
import useRecipe from '../../Hooks/UseRecipe.js';
import { FaFileDownload, FaTimes } from 'react-icons/fa';

export default function SearchResult({ number, name, image, area, category, recipeData }) {
  const { setSelectedRecipe, selectedRecipe } = useRecipe();
  const [showModal, setShowModal] = useState(false);
  const [nutritionData, setNutritionData] = useState([]);
  const [loading, setLoading] = useState(false);
  const modalRef = useRef(null);

  const key = import.meta.env.VITE_API_NINJAS_KEY


  // Disable scroll on body when modal is open
  useEffect(() => {
    if (showModal) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [showModal]);

  const nutritionOrder = [
    "fat_total_g", "sodium_mg", "potassium_mg",
    "cholesterol_mg", "carbohydrates_total_g", "fiber_g", "sugar_g"
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

  const handleClick = () => {
    setSelectedRecipe(recipeData);
    setShowModal(true);
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
                  "X-Api-Key": key,
                },
              }
            );
            const data = await response.json();
            return { ingredient: ing.name, data: data[0] };
          } catch {
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

  const totals = nutritionOrder.reduce((acc, key) => {
    acc[key] = nutritionData.reduce((sum, item) => {
      return item.data && !isNaN(item.data[key]) ? sum + Number(item.data[key]) : sum;
    }, 0);
    return acc;
  }, {});

  const estimatedCalories =
    (totals.fat_total_g || 0) * 9 +
    (Math.max((totals.carbohydrates_total_g || 0) - (totals.fiber_g || 0), 0)) * 4 +
    (totals.fiber_g || 0) * 2;

  return (
    <>
      <div
        onClick={handleClick}
        className="cursor-pointer bg-base-200 p-6 rounded-xl hover:bg-primary transition duration-300 hover:scale-102 group"
      >
        <div className="flex flex-row justify-between">
          <div className="flex flex-col space-y-5">
            <h1 className="text-xl text-base-content group-hover:text-white transition duration-300">
              {number}. {name}
            </h1>
            <div className="flex space-x-1">
              <p className="text-md text-secondary-content group-hover:text-white transition duration-300">Area:</p>
              <p className="text-md group-hover:text-white transition duration-300">{area}</p>
            </div>
            <div className="flex space-x-1">
              <p className="text-md text-secondary-content group-hover:text-white transition duration-300">Category:</p>
              <p className="text-md group-hover:text-white transition duration-300">{category}</p>
            </div>
          </div>
          <img src={image} className="h-40 w-40 rounded-xl" alt={name} />
        </div>
      </div>

      {showModal && selectedRecipe && (
        <div className="fixed inset-0 z-50">
          {/* Enhanced backdrop with consistent blur */}
          <div className="fixed inset-0 bg-black/50 backdrop-blur-xl transition-all duration-500"></div>

          {/* Modal container */}
          <div
            ref={modalRef}
            className="fixed inset-0 flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-6xl p-10 max-h-[90vh] overflow-y-auto border border-gray-200">
              <button
                onClick={() => setShowModal(false)}
                className="absolute top-4 right-4 text-2xl text-gray-500 hover:text-gray-800 transition"
              >
                <FaTimes />
              </button>

              <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-6">
                <div className="flex gap-6">
                  <img
                    src={selectedRecipe.image}
                    alt={selectedRecipe.name}
                    className="w-52 h-52 object-cover rounded-xl border-2 border-gray-300 shadow-lg"
                  />
                  <div>
                    <h1 className="text-4xl font-extrabold text-gray-900">{selectedRecipe.name}</h1>
                    <p className="mt-2 text-gray-500 text-sm italic">Powered by TheMealDB & Nutrition API</p>
                    <div className="mt-4 space-y-1">
                      <p className="text-sm text-gray-600"><strong>Area:</strong> {selectedRecipe.area}</p>
                      <p className="text-sm text-gray-600"><strong>Category:</strong> {selectedRecipe.category}</p>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => window.print()}
                  className="btn btn-primary text-white px-6 py-2.5 rounded-full shadow hover:brightness-110 transition-all duration-200 flex items-center gap-2"
                >
                  <FaFileDownload /> Save as PDF
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Ingredients */}
                <div className="bg-orange-50 border border-orange-200 rounded-xl p-5 shadow-inner h-[420px] overflow-y-auto">
                  <h2 className="text-xl font-semibold text-orange-700 mb-4">🧂 Ingredients</h2>
                  <ul className="list-disc ml-5 space-y-1 text-gray-800">
                    {selectedRecipe.ingredients.map((ing, idx) => (
                      <li key={idx}>
                        <span className="font-semibold">{ing.name}</span> — {ing.measure}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Instructions */}
                <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 shadow-inner h-[420px] overflow-y-auto">
                  <h2 className="text-xl font-semibold text-blue-700 mb-4">📋 Instructions</h2>
                  <p className="text-gray-700 text-sm whitespace-pre-line leading-relaxed">
                    {selectedRecipe.instructions}
                  </p>
                </div>

                {/* Nutrition */}
                <div className="bg-green-50 border border-green-200 rounded-xl p-5 shadow-inner h-[420px] overflow-y-auto">
                  <h2 className="text-xl font-semibold text-green-700 mb-4">🥗 Nutrition Analysis</h2>
                  {loading ? (
                    <p className="text-gray-600">Loading nutrition data...</p>
                  ) : (
                    <>
                      <ul className="list-disc ml-5 space-y-1 text-gray-800">
                        {nutritionOrder.map((key) => (
                          <li key={key}>
                            <span className="font-medium">{displayLabel[key]}</span>: {totals[key]?.toFixed(1)}
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
          </div>
        </div>
      )}
    </>
  );
}