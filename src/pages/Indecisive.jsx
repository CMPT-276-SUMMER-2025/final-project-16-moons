import { useState } from "react";
import meat from '../assets/icons/meat.png'
import apple from '../assets/icons/apple.png'
import carrot from '../assets/icons/carrot.png'
import lines from '../assets/images/linesHorizontal.png'
import RandomRecipe from '../components/Search/SearchResult'

export default function Scanner() {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [recipes, setRecipes] = useState([])
    const [count, setCount] = useState(0)

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

    // Format a recipe to have name, image, instructions, and ingredients
    const formatRecipe = (meal, mealType) => {
        return {
            name: meal.strMeal,
            image: meal.strMealThumb,
            category: meal.strCategory,
            area: meal.strArea,
            instructions: meal.strInstructions,
            ingredients: formatIngredients(meal),
            mealType: mealType
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
            const mealTypes = ['Breakfast', 'Lunch', 'Dinner']
            const recipes = []

            for (let i = 0; i < 3; i++) {
                recipes.push(fetchRecipe())
            }

            const meals = await Promise.all(recipes)

            const formattedRecipes = meals.map((meal, idx) =>
                formatRecipe(meal, mealTypes[idx])
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

    return (
        <div className="flex flex-row justify-center px-20 py-10 space-x-20 h-200">
            <div className="w-[35%] text-left text-2xl flex flex-col">
                <p className="py-3">Don't know what you want to eat today?</p>
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
                <div className="flex space-x-8 mt-auto pl-35">
                    <img src={meat} alt="meat" className="w-15 h-15 object-cover rounded"/>
                    <img src={carrot} alt="carrot" className="w-15 h-15 object-cover rounded"/>
                    <img src={apple} alt="apple" className="w-15 h-15 object-cover rounded"/>
                </div>
                <div className="flex justify-start mt-4">
                    <img src={lines} alt="lines" className="w-130"/>
                </div>
            </div>
            <div className="flex flex-col w-[40%] gap-6">
                <div className="bg-white p-6 rounded-xl shadow-2xl max-h-full flex-1 space-y-5 overflow-y-auto">
                    <div className="flex flex-row justify-between">
                        <div className="space-y-6 w-full">
                            {recipes.map((recipe, idx) => (
                                <div key={idx}>
                                    <h1 className="text-3xl mb-4">{recipe.mealType}</h1>
                                    <RandomRecipe key={`${recipe.mealType}-${idx}`} number={idx + 1} name={recipe.name} image={recipe.image} recipeData={recipe} area={recipe.area} category={recipe.category} />
                                </div>
                            ))}
                        </div>
                    </div>
                    {recipes.length === 0 && !error && count === 0 && (
                        <div className="bg-base-200 p-6 rounded-xl shadow-lg">
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
