import { useState, useEffect } from "react";
import Horizontal from '../components/Designs/Horizontal'
import RandomRecipe from '../components/Search/SearchResult'

export default function Indecisive() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [recipes, setRecipes] = useState([])
    const [count, setCount] = useState(0)
    const [isVisible, setIsVisible] = useState(false)

    // Format the ingredients from the JSON data of one recipe
    const formatIngredients = (meal) => {
        const ingredients = []

        for (let i = 1; i <= 20; i++) {
            const ingredient = meal[`strIngredient${i}`]
            const measure = meal[`strMeasure${i}`]

            if (ingredient && ingredient.trim()) {
                ingredients.push({
                    name: ingredient.trim(),
                    measure: measure ? measure.trim() : ''
                })
            }
        }

        return ingredients
    }

    // Check if a recipe has all the required data
    const isRecipeComplete = (meal) => {
        return (
            meal.strMeal && meal.strMeal.trim() &&
            meal.strMealThumb && meal.strMealThumb.trim() &&
            meal.strCategory && meal.strCategory.trim() &&
            meal.strArea && meal.strArea.trim()
        )
    }

    // Format a recipe to have name, image, instructions, and ingredients
    const formatRecipe = (meal) => {
        return {
            name: meal.strMeal,
            image: meal.strMealThumb,
            category: meal.strCategory,
            area: meal.strArea,
            instructions: meal.strInstructions,
            ingredients: formatIngredients(meal),
        }
    }

    // Fetch a random recipe
    const fetchRecipe = async () => {
        const response = await fetch("https://www.themealdb.com/api/json/v1/1/random.php")

        if (!response.ok) {
            throw new Error(`Error: ${response.status}`)
        }

        const data = await response.json()

        if (!data || !data.meals || data.meals.length === 0) {
            throw new Error('No recipe data received. Try again.')
        }

        return data.meals[0]
    }

    // This function is ran when the user clicks the button
    const handleGeneration = async () => {
        setRecipes([])
        setError('')
        setLoading(true)

        try {
            const recipes = []

            for (let i = 0; i < 3; i++) {
                recipes.push(fetchRecipe())
            }

            const meals = await Promise.all(recipes)

            const formattedRecipes = meals
                .filter(meal => isRecipeComplete(meal))
                .map((meal) =>
                    formatRecipe(meal)
            )

            setRecipes(formattedRecipes)
            console.log(formattedRecipes)
        } catch (err) {
            console.error('Error:', err.message)
            setError('Error: Failed to fetch recipes. Please try again.')
            setRecipes([])
        } finally {
            setLoading(false)
            setCount(1)
        }
    }

    useEffect(() => {
        const showTimeout = setTimeout(() => setIsVisible(true), 300)

        return () => {
            clearTimeout(showTimeout);
        }
    })

    return (
        <div className="flex flex-row justify-center px-20 py-10 space-x-20 h-200">
            <div className={`w-[35%] text-left text-3xl flex flex-col transition ${isVisible ? 'opacity-100 translate-y-0 delay-100' : 'opacity-0 translate-y-10'}`}>
                <p className="pb-3">Don't know what you want to eat today?</p>
                <p className="py-3">Can't settle on a recipe?</p>
                <p className="py-3">Let us do the work for you!</p>
                <div className="py-10">
                    <button
                        className="mt-2 btn btn-primary w-[80%] rounded-full shadow-xl text-lg transition-all duration-300 hover:scale-105"
                        onClick={handleGeneration}
                        disabled={loading}
                        >
                        Surprise Me!
                    </button>
                </div>
                <Horizontal />
            </div>
            <div className="flex flex-col w-[40%] gap-6">
                <div className="bg-white p-6 rounded-xl shadow-2xl max-h-full flex-1 space-y-5 overflow-y-auto">
                    <div className="flex flex-row justify-between">
                        <div className="space-y-6 w-full">
                            {recipes.map((recipe, idx) => (
                                <div key={idx}>
                                    <RandomRecipe key={idx} number={idx + 1} name={recipe.name} image={recipe.image} recipeData={recipe} area={recipe.area} category={recipe.category} />
                                </div>
                            ))}
                        </div>
                    </div>
                    {recipes.length === 0 && !error && count === 0 && (
                        <div className={`bg-base-200 p-6 rounded-xl shadow-lg transition ${isVisible ? 'opacity-100 translate-y-0 delay-100' : 'opacity-0 translate-y-10'}`}>
                            <h1>Looks like you haven't clicked the button yet. Click it on the left!</h1>
                        </div>
                    )}
                    {error && (
                        <div className="bg-base-200 p-6 rounded-xl shadow-lg">
                            <h1 className="font-medium text-error">{error}</h1>
                        </div>
                    )}
                    {loading && (
                        <div className="flex flex-row space-x-5">
                            <p className="text-2xl">Fetching recipes, hang tight!</p>
                            <span className="loading loading-spinner text-primary loading-xl"></span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
