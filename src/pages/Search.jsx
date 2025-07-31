import { useState, useEffect } from "react";
import Horizontal from '../components/Designs/Horizontal'
import SearchResult from '../components/Search/SearchResult'
import SearchHint from '../components/Search/SearchHint'
import SearchTopic from '../components/Search/SearchTopic'

export default function Search() {
    const [searchType, setSearchType] = useState('')
    const [inputText, setInputText] = useState('')
    const [recipes, setRecipes] = useState([])
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    const [isVisible, setIsVisible] = useState(false)

    // Get the endpoint for the topic the user has chosen
    // i.e., area, name, category, or main ingredient
    const getEndpoint = (searchType, query) => {
        const baseUrl = 'https://www.themealdb.com/api/json/v1/1'
        const encodedQuery = encodeURIComponent(query)

        switch (searchType) {
            case 'name':
                return `${baseUrl}/search.php?s=${encodedQuery}`
            case 'ingredient':
                return `${baseUrl}/filter.php?i=${encodedQuery}`
            case 'area':
                return `${baseUrl}/filter.php?a=${encodedQuery}`
            case 'category':
                return `${baseUrl}/filter.php?c=${encodedQuery}`
            default:
                return null
        }
    }

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

    // Format the recipes to have name, image, instructions, and ingredients
    const formatRecipes = (data) => {
        if (!data || !data.meals) {
            return []
        }

        return data.meals.map(meal => ({
            name: meal.strMeal,
            image: meal.strMealThumb,
            category: meal.strCategory,
            area: meal.strArea,
            instructions: meal.strInstructions,
            ingredients: formatIngredients(meal)
        }))
    }

    // In the case where the user chooses area, category, or main ingredient, this function is ran
    // Calling the API for those topics only returns recipe names, not recipe information like ingredients or instructions
    // So this function is to get the missing data for the recipes when those certain topics are chosen
    const getRecipeData = async (recipeName) => {
        try {
            const endpoint = getEndpoint('name', recipeName)
            const response = await fetch(endpoint)

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`)
            }

            const data = await response.json()

            if (data && data.meals && data.meals.length > 0) {
                return data.meals[0]
            }

            return null
        } catch (error) {
            console.error('Error:', error.message)
            setError('Error: Failed to fetch recipes. Please try again.')
            setRecipes([])
        }
    }

    // Fill the recipes array with the missing recipe data if it's like the scenario described above
    const fillRecipeData = async (recipes) => {
        const updatedRecipes = []

        for (const recipe of recipes) {
            if (!recipe.ingredients || !recipe.instructions) {
                const data = await getRecipeData(recipe.name)

                if (data) {
                    const updatedRecipe = {
                        ...recipe,
                        instructions: data.strInstructions || recipe.instructions,
                        ingredients: formatIngredients(data),
                        category: data.strCategory,
                        area: data.strArea
                    }

                    updatedRecipes.push(updatedRecipe)
                }
            }
        }

        return updatedRecipes
    }

    // This function is ran when the user enters their search or clicks the search button
    const handleSearch = async (searchType, query) => {
        setRecipes([])
        setError('')
        setLoading(true)

        try {
            const endpoint = getEndpoint(searchType, query)
            const response = await fetch(endpoint)

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`)
            }

            const data = await response.json()
            let formattedRecipes = formatRecipes(data)

            if (formattedRecipes.length === 0) {
                setError('Error: No recipes found. Try a different search term.')
                setRecipes([])
                return
            }

            // Only fill recipe data for non-name searches
            // Name searches already return complete data
            if (searchType !== 'name') {
                formattedRecipes = await fillRecipeData(formattedRecipes)
            }

            setRecipes(formattedRecipes)
            console.log(formattedRecipes)
        } catch (error) {
            console.error('Error:', error.message)
            setError('Error: Failed to fetch recipes. Please try again.')
            setRecipes([])
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const showTimeout = setTimeout(() => setIsVisible(true), 300)

        return () => {
            clearTimeout(showTimeout);
        }
    })

    return(
        <div className="flex flex-row justify-center px-20 py-10 space-x-20 h-200">
            <div className={`w-[35%] text-left text-3xl flex flex-col transition ${isVisible ? 'opacity-100 translate-y-0 delay-100' : 'opacity-0 translate-y-10'}`}>
                <p className="pb-3">Only remember part of the name of a recipe?</p>
                <p className="py-3">Don't know what you can make with your ingredients?</p>
                <p className="py-3">Want to try something different?</p>
                <p className="py-3">Don't worry! Search for tons of amazing recipes by area, name, category, or main ingredient.  </p>
                <p className="py-3">You can get started by simply clicking on the search method you want to use, on the right.</p>
                <p className="py-3">Once you're done searching, click on a recipe to see its detailed information!</p>
                <Horizontal />
            </div>
            <div className="flex flex-col w-[40%] gap-6">
                <SearchTopic
                    onSearch={handleSearch}
                    searchType={searchType}
                    setSearchType={setSearchType}
                    inputText={inputText}
                    setInputText={setInputText}
                    setError={setError}
                    setRecipes={setRecipes}
                />

                <div className={`bg-white p-6 rounded-xl shadow-2xl max-h-full flex-1 space-y-5 overflow-y-auto transition ${isVisible ? 'opacity-100 translate-y-0 delay-500' : 'opacity-0 translate-y-10'}`}>
                    <SearchHint searchType={searchType} />

                    {error && (
                        <div className="bg-base-200 p-6 rounded-xl shadow-lg">
                            <h1 className="font-medium text-error">{error}</h1>
                        </div>
                    )}

                    {recipes.map((recipe, idx) => (
                        <SearchResult key={idx} number={idx + 1} name={recipe.name} image={recipe.image} recipeData={recipe} area={recipe.area} category={recipe.category} />
                    ))}

                    {loading && (
                        <div className="flex flex-row space-x-5">
                            <p className="text-2xl">Fetching recipes, hang tight!</p>
                            <span className="loading loading-spinner text-primary loading-xl"></span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}