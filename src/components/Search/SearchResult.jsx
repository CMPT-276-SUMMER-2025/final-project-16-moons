import { useState, useEffect } from 'react';
import useRecipe from '../../Hooks/UseRecipe.js';
import { FaFileDownload, FaTimes } from 'react-icons/fa';

export default function SearchResult({ number, name, image, area, category, recipeData }) {
  const { setSelectedRecipe, selectedRecipe } = useRecipe();
  const [showModal, setShowModal] = useState(false);
  const [nutritionData, setNutritionData] = useState([]);
  const [loading, setLoading] = useState(false);

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

  // --- DISABLE PAGE SCROLL WHEN MODAL IS OPEN ---
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
  // ------------------------------------------------

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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md animate-fadeIn">
          {/* Glassmorphic modal */}
          <div className="relative w-[95%] max-w-5xl p-0 overflow-visible rounded-3xl shadow-2xl border border-white/30 bg-white/80 backdrop-blur-lg animate-popUp">
            {/* Close button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-5 right-6 text-3xl text-gray-500 hover:text-primary hover:scale-125 transition-all z-10 bg-white/70 rounded-full p-2 shadow"
              aria-label="Close"
            >
              <FaTimes />
            </button>

            <div className="flex flex-col gap-8 p-8 pb-6">
              {/* Header */}
              <div className="flex flex-col md:flex-row justify-between gap-8 items-center mb-4">
                <div className="flex gap-6 items-center">
                  <img
                    src={selectedRecipe.image}
                    alt={selectedRecipe.name}
                    className="w-48 h-48 object-cover rounded-2xl border-2 border-primary/30 shadow-lg"
                  />
                  <div>
                    <h1 className="text-4xl font-black tracking-tight text-gray-900 drop-shadow-sm">{selectedRecipe.name}</h1>
                    <div className="flex gap-4 mt-2 text-sm font-medium text-gray-500">
                      <span>🌍 {area}</span>
                      <span>🍴 {category}</span>
                    </div>
                    <p className="mt-2 text-gray-500 italic text-xs">Powered by TheMealDB &amp; Nutrition API</p>
                  </div>
                </div>
                <button
                  onClick={() => window.print()}
                  className="btn btn-primary text-white px-6 py-2.5 rounded-full flex items-center gap-2 shadow-md hover:scale-105 transition"
                >
                  <FaFileDownload /> Save as PDF
                </button>
              </div>

              {/* Modal content grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Ingredients */}
                <div className="bg-gradient-to-tr from-orange-100 via-orange-50 to-white/60 border border-orange-200 rounded-2xl p-6 shadow-inner h-[420px] overflow-y-auto">
                  <h2 className="text-xl font-bold text-orange-700 mb-3 flex items-center gap-1">🧂 Ingredients</h2>
                  <ul className="list-disc ml-5 space-y-1 text-gray-700 font-medium">
                    {selectedRecipe.ingredients.map((ing, idx) => (
                      <li key={idx}>
                        <span className="font-semibold">{ing.name}</span> – {ing.measure}
                      </li>
                    ))}
                  </ul>
                </div>
                {/* Instructions */}
                <div className="bg-gradient-to-tr from-blue-100 via-blue-50 to-white/60 border border-blue-200 rounded-2xl p-6 shadow-inner h-[420px] overflow-y-auto">
                  <h2 className="text-xl font-bold text-blue-700 mb-3 flex items-center gap-1">📋 Instructions</h2>
                  <p className="text-gray-700 text-base whitespace-pre-line leading-relaxed font-medium">
                    {selectedRecipe.instructions}
                  </p>
                </div>
                {/* Nutrition */}
                <div className="bg-gradient-to-tr from-green-100 via-green-50 to-white/60 border border-green-200 rounded-2xl p-6 shadow-inner h-[420px] overflow-y-auto">
                  <h2 className="text-xl font-bold text-green-700 mb-3 flex items-center gap-1">🥗 Nutrition Analysis</h2>
                  {loading ? (
                    <p className="text-gray-600">Loading nutrition data...</p>
                  ) : (
                    <>
                      <ul className="list-disc ml-5 space-y-1 text-gray-700 font-medium">
                        {nutritionOrder.map((key) => (
                          <li key={key}>
                            <span className="font-semibold">{displayLabel[key]}</span>: {totals[key]?.toFixed(1)}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-4 font-bold text-xl text-green-900 drop-shadow">
                        🔥 Estimated Calories: {estimatedCalories.toFixed(0)} kcal
                      </p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          {/* Animation for modal fade-in */}
          <style>{`
            @keyframes fadeIn {
              0% { opacity: 0 }
              100% { opacity: 1 }
            }
            .animate-fadeIn {
              animation: fadeIn 0.22s cubic-bezier(0.16,1,0.3,1);
            }
            @keyframes popUp {
              0% { transform: scale(0.96) translateY(30px); opacity: 0; }
              100% { transform: scale(1) translateY(0); opacity: 1; }
            }
            .animate-popUp {
              animation: popUp 0.33s cubic-bezier(0.18,0.89,0.32,1.28);
            }
          `}</style>
        </div>
      )}
    </>
  );
}