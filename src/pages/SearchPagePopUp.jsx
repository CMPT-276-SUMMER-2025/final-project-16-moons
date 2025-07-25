import { useEffect, useState } from "react";
import useRecipe from "../Hooks/UseRecipe";

export default function RecipeDetail() {
    const { selectedRecipe } = useRecipe();
    const [nutritionData, setNutritionData] = useState([]);
    const [loading, setLoading] = useState(false);

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
            if (!selectedRecipe || !selectedRecipe.ingredients) return;

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
                        return { ingredient: ing.name, data: data[0] }; // one result per query
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
                    if (item.data[key] !== undefined && !isNaN(item.data[key])) {
                        totals[key] += Number(item.data[key]);
                    }
                });
            }
        });

        return totals;
    };

    const calculateCaloriesFromMacros = (totals) => {
        // Basic estimate using fat, carbs, sugar, fiber
        const fat = totals.fat_total_g || 0;
        const carbs = totals.carbohydrates_total_g || 0;
        const sugar = totals.sugar_g || 0;
        const fiber = totals.fiber_g || 0;

        const netCarbs = Math.max(carbs - fiber, 0); // avoid negative
        const calories =
            fat * 9 +
            netCarbs * 4 +
            fiber * 2 +
            sugar * 4;

        return calories;
    };

    const totals = calculateTotals();
    const estimatedCalories = calculateCaloriesFromMacros(totals);

    if (!selectedRecipe) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">No recipe selected</h1>
                <p>Please go back and select a recipe from the search page.</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">{selectedRecipe.name}</h1>
            <img src={selectedRecipe.image} alt={selectedRecipe.name} className="w-64 h-64 mb-4" />

            <p className="font-semibold">Ingredients:</p>
            <ul className="mb-4 list-disc ml-6">
                {selectedRecipe.ingredients.map((ing, idx) => (
                    <li key={idx}>{ing.name} - {ing.measure}</li>
                ))}
            </ul>

            <p className="font-semibold">Instructions:</p>
            <p>{selectedRecipe.instructions}</p>

            <div className="mt-6">
                <h2 className="text-xl font-bold mb-2">Total Nutrition (for full recipe)</h2>
                {loading ? (
                    <p>Loading nutrition data...</p>
                ) : (
                    <>
                        <ul className="list-disc ml-6 space-y-1">
                            {nutritionOrder.map((key) => (
                                <li key={key}>
                                    {displayLabel[key]}: {totals[key].toFixed(1)}
                                </li>
                            ))}
                        </ul>
                        <p className="mt-2 font-semibold text-red-600">
                            Estimated Calories: {estimatedCalories.toFixed(0)} kcal
                        </p>
                    </>
                )}
            </div>

            <div className="mt-8">
                <h2 className="text-xl font-bold mb-2">Nutrition Info (per ingredient)</h2>
                {loading ? (
                    <p>Loading nutrition data...</p>
                ) : (
                    <ul className="list-disc ml-6 space-y-4">
                        {nutritionData.map((item, idx) => (
                            <li key={idx}>
                                <p className="font-semibold">{item.ingredient}</p>
                                {item.data ? (
                                    <ul className="ml-4 list-disc">
                                        {nutritionOrder.map((key) =>
                                            item.data[key] !== undefined ? (
                                                <li key={key}>
                                                    {displayLabel[key]}: {item.data[key].toFixed(1)}
                                                </li>
                                            ) : null
                                        )}
                                    </ul>
                                ) : (
                                    <p className="ml-4 text-sm text-gray-500">Nutrition data not available</p>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
}
