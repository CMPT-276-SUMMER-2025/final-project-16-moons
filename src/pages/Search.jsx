import { useState, useEffect } from "react";
import meat from '../assets/icons/meat.png'
import apple from '../assets/icons/apple.png'
import carrot from '../assets/icons/carrot.png'
import lines from '../assets/images/linesHorizontal.png'
import SearchResult from '../components/SearchResult'


function SearchCategory(){
    const [searchType, setSearchType] = useState("");
    const [inputText, setInputText] = useState("");

    const placeholderText = {
        ingredient: "Search by main ingredient...",
        name: "Search by name...",
        area: "Search by area...",
        category: "Search by category...",
        initial: "Pick an option above to start searching!"
    };

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
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#C0BABA] hover:text-[#C0BABA]">
                    <i className="fas fa-search text-[#C0BABA] hover:text-[#DE6B48] duration-300 hover:scale-120"></i>
                </button>
                <input
                type = "text"
                placeholder = {placeholderText[searchType]}
                value = {inputText}
                onChange = {(e) => setInputText(e.target.value)}
                className = "bg-white shadow-xl h-10 px-10 rounded-full text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#C0BABA]">
                </input>
            </div>
        </div>
    );

}

export default function Search() {
    const recipes = [
        'Spaghetti & Meatballs',
        'Lemon Shrimp Risotto',
        'American Style Burger & Fries',
        'Spaghetti & Meatballs',
        'Lemon Shrimp Risotto',
        'American Style Burger & Fries',
        'Spaghetti & Meatballs',
        'Lemon Shrimp Risotto',
        'American Style Burger & Fries',
        'Hello World'
    ]

    useEffect(() => {
        const query = 'pie'

        /* fetch(`https://api.api-ninjas.com/v1/recipe?query=${encodeURIComponent(query)}`, {
            method: 'GET',
            headers: {
                'X-Api-Key': 'etG02WI3p6sIOjDznbMQ0w==8x3EZ5mV0FRbhlj6',
                'Content-Type': 'application/json'
            }
        }) */

        fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Error: ${response.status}`)
                }

                return response.json()
            })

            .then(data => {
                console.log(data)
            })

            .catch(error => {
                console.error('Error: ', error.message)
            })
    }, [])

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
                <SearchCategory/>
                <div className="bg-white p-6 rounded-xl shadow-2xl max-h-full space-y-5 overflow-y-auto">
                    {recipes.map((recipe, idx) => (
                        <SearchResult key={idx} number={idx+1} name={recipe} />
                    ))}
                </div>
            </div>
        </div>

    );
}