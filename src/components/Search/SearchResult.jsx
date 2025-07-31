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

  const nutritionOrder = [
    "fat_total_g", "sodium_mg", "potassium_mg",
    "cholesterol_mg", "carbohydrates_total_g", "fiber_g", "sugar_g"
  ];

  const displayLabel = {
    fat_total_g: "Fat",
    sodium_mg: "Sodium",
    potassium_mg: "Potassium",
    cholesterol_mg: "Cholesterol",
    carbohydrates_total_g: "Carbs",
    fiber_g: "Fiber",
    sugar_g: "Sugar",
  };

  const units = [
    "g", "mg", "mg", "mg", "g", "g", "g"
  ]

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

  const handleClick = () => {
    setSelectedRecipe(recipeData);
    setShowModal(true);
  };

  const generatePDF = () => {
    const printWindow = window.open('', '_blank');
    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${selectedRecipe.name} - Recipe</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 800px;
              margin: 0 auto;
              padding: 20px;
              line-height: 1.6;
              color: #333;
            }
            .header {
              text-align: center;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
              margin-bottom: 30px;
            }
            .recipe-image {
              width: 200px;
              height: 200px;
              object-fit: cover;
              border-radius: 10px;
              margin-bottom: 20px;
              box-shadow: 0 4px 8px rgba(0,0,0,0.1);
            }
            .recipe-title {
              font-size: 28px;
              font-weight: bold;
              margin-bottom: 10px;
            }
            .recipe-meta {
              font-size: 16px;
              color: #666;
              margin: 5px 0;
            }
            .section {
              margin-bottom: 30px;
              page-break-inside: avoid;
            }
            .section-title {
              font-size: 20px;
              font-weight: bold;
              margin-bottom: 15px;
              color: #2c3e50;
              border-bottom: 1px solid #eee;
              padding-bottom: 5px;
            }
            .ingredients-list {
              list-style-type: disc;
              padding-left: 20px;
            }
            .ingredients-list li {
              margin-bottom: 8px;
            }
            .instructions {
              white-space: pre-line;
              line-height: 1.8;
            }
            .nutrition-list {
              list-style-type: none;
              padding-left: 0;
            }
            .nutrition-list li {
              margin-bottom: 5px;
              padding: 5px;
              background-color: #f8f9fa;
              border-radius: 3px;
            }
            .calories {
              font-size: 18px;
              font-weight: bold;
              background-color: #e9a48dff;
              padding: 10px;
              border-radius: 5px;
              text-align: left;
              margin-top: 15px;
            }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <img src="${selectedRecipe.image}" alt="${selectedRecipe.name}" class="recipe-image" />
            <div class="recipe-title">${selectedRecipe.name}</div>
            <div class="recipe-meta">Area: ${selectedRecipe.area}</div>
            <div class="recipe-meta">Category: ${selectedRecipe.category}</div>
          </div>

          <div class="section">
            <div class="section-title">Ingredients</div>
            <ul class="ingredients-list">
              ${selectedRecipe.ingredients.map(ing =>
                `<li><strong>${ing.name}</strong> — ${ing.measure}</li>`
              ).join('')}
            </ul>
          </div>

          <div class="section">
            <div class="section-title">Instructions</div>
            <div class="instructions">${selectedRecipe.instructions}</div>
          </div>

          <div class="section">
            <div class="section-title">Nutrition Information</div>
            <ul class="nutrition-list">
              ${nutritionOrder.map((key, idx) =>
                `<li><strong>${displayLabel[key]}:</strong> ${totals[key]?.toFixed(1)} ${units[idx]}</li>`
              ).join('')}
            </ul>
            <div class="calories">Estimated Calories: ${estimatedCalories} kcal</div>
          </div>

          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
  };

  return (
    <>
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
              <p className="text-md text-secondary-content group-hover:text-white  transition duration-300">{area}</p>
            </div>
            <div className="flex space-x-1">
              <p className="text-md font-semibold group-hover:text-white transition duration-300">Category:</p>
              <p className="text-md text-secondary-content group-hover:text-white transition duration-300">{category}</p>
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
            <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-7xl p-10 max-h-[90vh] overflow-y-auto border border-gray-200">
              <div className="flex flex-col md:flex-row justify-between items-start mb-10">
                <div className="flex gap-6">
                  <img
                    src={selectedRecipe.image}
                    alt={selectedRecipe.name}
                    className="w-52 h-52 rounded-xl shadow-xl"
                  />
                  <div>
                    <h1 className="text-3xl font-bold">{selectedRecipe.name}</h1>
                    <p className="mt-2 text-gray-500 text-sm italic">Powered by TheMealDB & Nutrition API</p>
                    <div className="flex space-x-1 mt-4">
                      <p className="text-md font-semibold group-hover:text-white transition duration-300">Area:</p>
                      <p className="text-md text-secondary-content group-hover:text-white  transition duration-300">{selectedRecipe.area}</p>
                    </div>
                    <div className="flex space-x-1">
                      <p className="text-md group-hover:text-white font-semibold transition duration-300">Category:</p>
                      <p className="text-md text-secondary-content group-hover:text-white transition duration-300">{selectedRecipe.category}</p>
                    </div>
                  </div>
                </div>
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

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Ingredients */}
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

                {/* Instructions */}
                <div className="bg-base-200 rounded-xl p-5 shadow-xl h-[420px] overflow-y-auto">
                  <h2 className="text-xl font-semibold mb-4">Instructions</h2>
                  <p className="text-secondary-content whitespace-pre-line leading-relaxed">
                    {selectedRecipe.instructions}
                  </p>
                </div>

                {/* Nutrition */}
                <div className="bg-base-200 rounded-xl p-5 shadow-xl h-[420px] overflow-y-auto">
                  <h2 className="text-xl font-semibold mb-4">Nutrition Analysis</h2>
                  {loading ? (
                    <div className="flex flex-row space-x-2">
                      <p className="text-gray-600">Analyzing nutritional data, hang tight!</p>
                      <span className="loading loading-spinner text-primary loading-"></span>
                    </div>
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