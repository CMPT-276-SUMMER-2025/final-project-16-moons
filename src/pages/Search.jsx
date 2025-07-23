import { useState, useEffect } from "react";
import meat from '../assets/icons/meat.png'
import apple from '../assets/icons/apple.png'
import carrot from '../assets/icons/carrot.png'
import lines from '../assets/images/linesHorizontal.png'
import SearchResult from '../components/SearchResult'


function SearchCategory({ onSearch }){
    const [searchType, setSearchType] = useState("");
    const [inputText, setInputText] = useState("");

    const placeholderText = {
        ingredient: "Search by main ingredient...",
        name: "Search by name...",
        area: "Search by area...",
        category: "Search by category...",
        initial: "Pick an option above to start searching!"
    };

    const handleSearch = () => {
        if (inputText.trim() && searchType !== "initial") {
            onSearch(searchType, inputText.trim())
        }
    }

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch()
        }
    }

    useEffect(() => {
        setSearchType("initial");
    }, [])

    return(
        <div className="flex flex-col items-start pt-5 space-y-6">
            <div className="flex justify-start space-x-6">
                <button
                    onClick={() => setSearchType("area")}
                    className={`${searchType === "area" ? "bg-[#DE6B48]" : "bg-[#C0BABA]"}
                                hover:bg-[#DE6B48] text-white py-2 px-5 rounded-full transition-all tooltip duration-300 hover:scale-110`}
                    data-tip="E.g.: 'Canada' or 'Mexico'"
                >
                        Area
                </button>
                <button
                    onClick={() => setSearchType("name")}
                    className={`${searchType === "name" ? "bg-[#DE6B48]" : "bg-[#C0BABA]"}
                                hover:bg-[#DE6B48] text-white px-4 rounded-full transition-all tooltip duration-300 hover:scale-110`}
                    data-tip="E.g.: 'Spaghetti' or 'Pizza'"
                    >
                        Name
                </button>
                <button
                    onClick={() => setSearchType("category")}
                    className={`${searchType === "category" ? "bg-[#DE6B48]" : "bg-[#C0BABA]"}
                                hover:bg-[#DE6B48] text-white px-4 rounded-full transition-all tooltip duration-300 hover:scale-110`}
                    data-tip="E.g.: 'Seafood' or 'Spicy'"

                    >
                        Category
                </button>
                <button
                    onClick={() => setSearchType("ingredient")}
                    className={`${searchType === "ingredient" ? "bg-[#DE6B48]" : "bg-[#C0BABA]"}
                                hover:bg-[#DE6B48] text-white px-4 rounded-full transition-all tooltip duration-300 hover:scale-110`}
                    data-tip="E.g.: 'Chicken' or 'Onion'"
                    >
                        Main Ingredient
                </button>
            </div>
            <div className="relative flex items-center gap-2 w-full">
                <button
                onClick={() => handleSearch()}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#C0BABA] hover:text-[#C0BABA]">
                    <i className="fas fa-search text-[#C0BABA] hover:text-[#DE6B48] duration-300 hover:scale-120"></i>
                </button>
                <input
                type = "text"
                placeholder = {placeholderText[searchType]}
                value = {inputText}
                onChange = {(e) => setInputText(e.target.value)}
                onKeyDown={handleKeyPress}
                disabled={searchType === "initial"}
                className = "bg-white shadow-xl h-10 px-10 rounded-full text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#C0BABA]">
                </input>
            </div>
        </div>
    );

}

export default function Search() {
    const [recipes, setRecipes] = useState([])
    const [error, setError] = useState(null)

    const getApiUrl = (searchType, query) => {
        const baseURL = 'https://www.themealdb.com/api/json/v1/1'
        const encodedQuery = encodeURIComponent(query)

        switch (searchType) {
            case 'name':
                return `${baseURL}/search.php?s=${encodedQuery}`
            case 'ingredient':
                return `${baseURL}/search.php?i=${encodedQuery}`
            case 'area':
                return `${baseURL}/search.php?a=${encodedQuery}`
            case 'category':
                return `${baseURL}/search.php?c=${encodedQuery}`
            default:
                return null
        }
    }

    const formatRecipes = (data) => {
        if (!data || !data.meals) {
            return []
        }

        return data.meals.map(meal => ({
            id: meal.idMeal,
            name: meal.strMeal,
            category: meal.strCategory,
            area: meal.strArea,
            image: meal.strMealThumb,
            instructions: meal.strInstructions,
            ingredients: meal.strIngredient1 ? extractIngredients(meal) : null
        }))
    }

    const extractIngredients = (meal) => {
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

    const handleSearch = async (searchType, query) => {
        setError(null);

        try {
            const apiUrl = getApiUrl(searchType, query);

            if (!apiUrl) {
                throw new Error('Invalid search type');
            }

            const response = await fetch(apiUrl);

            if (!response.ok) {
                throw new Error(`Error: ${response.status}`);
            }

            const data = await response.json();
            const formattedRecipes = formatRecipes(data);

            setRecipes(formattedRecipes);

            if (formattedRecipes.length === 0) {
                setError('No recipes found. Try a different search term.');
            }

        } catch (error) {
            console.error('Search error:', error.message);
            setError('Failed to fetch recipes. Please try again.');
            setRecipes([]);
        }
    }

    return(
        <div className="flex flex-row justify-between px-19 py-10 h-200">
            <div className="w-[40%] text-left text-2xl flex flex-col">
                <p className="py-3">Only remember part of the name of a recipe?</p>
                <p className="py-3">Don’t know what you can make with your ingredients?</p>
                <p className="py-3">Want to try something different?</p>
                <p className="py-3">Don’t worry! Search for tons of amazing recipes by area, name, category, or main ingredient.  </p>
                <p className="py-3">You can get started by just clicking on the search method you want to use, on the right!</p>
                <div className="flex justify-center space-x-8 mt-auto pr-50">
                    <img src={meat} alt="meat" className="w-15 h-15 object-cover rounded"/>
                    <img src={carrot} alt="carrot" className="w-15 h-15 object-cover rounded"/>
                    <img src={apple} alt="apple" className="w-15 h-15 object-cover rounded"/>
                </div>
                <div className="flex justify-center mt-4 pr-50">
                    <img src={lines} alt="lines" className="w-130 h-auto"/>
                </div>
            </div>
            <div className="flex flex-col w-[45%] gap-6">
                <SearchCategory onSearch={handleSearch}/>
                <div className="bg-white p-6 rounded-xl shadow-2xl max-h-full space-y-5 overflow-y-auto">
                    {error && (
                        <div className="text-center text-red-500 py-4">
                            {error}
                        </div>
                    )}

                    {recipes.map((recipe, idx) => (
                        <SearchResult key={recipe.id || idx} number={idx + 1} name={recipe.name} recipe={recipe} />
                    ))}
                </div>
            </div>
        </div>

    );
}