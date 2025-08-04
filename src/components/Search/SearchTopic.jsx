import { useState, useEffect } from "react";

export default function SearchTopic({ onSearch, searchType, setSearchType, inputText, setInputText, setError, setRecipes }){
    const [isVisible, setIsVisible] = useState(false)

    const placeholderText = {
        ingredient: "Search for recipes by main ingredient...",
        name: "Search for recipes by name...",
        area: "Search for recipes by cuisine...",
        category: "Search for recipes by category...",
        initial: "Pick an option above to start searching for recipes!"
    }

    // handle search
    const handleSearch = () => {
        // if the input text isn't empty and the search type isn't initial, handle the recipe search
        if (inputText.trim() && searchType !== "initial") {
            onSearch(searchType, inputText.trim())
        }
    }

    // handle key press
    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch()
        }
    }

    useEffect(() => {
        // search type is set to inital at first, to display a message on page land
        setSearchType("initial")
        // starts a timer, then after 300 ms, the state of isVisible changes
        // this is used for the animation of components on page load
        const showTimeout = setTimeout(() => setIsVisible(true), 300)

        // if the component unmounts or re-renders before the timeout finishes,
        // the timer is cleared to prevent memory leaks and warnings
        return () => {
            clearTimeout(showTimeout);
        }
    }, [])

    return(
        <div className="flex flex-col items-start pt-1 space-y-6">
            <div className={`flex justify-start space-x-6 transition ${isVisible ? 'opacity-100 translate-y-0 delay-100' : 'opacity-0 translate-y-10'}`}>
                <button
                    onClick={() => {setSearchType("name"), setInputText(''), setError(''), setRecipes([])}}
                    className={`${searchType === "name" ? "bg-[#DE6B48]" : "bg-[#C0BABA]"}
                                hover:bg-[#DE6B48] text-white px-4 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer shadow-xl`}
                    >
                        Name
                </button>
                <button
                    onClick={() => {setSearchType("area"), setInputText(''), setError(''), setRecipes([])}}
                    className={`${searchType === "area" ? "bg-[#DE6B48]" : "bg-[#C0BABA]"}
                                hover:bg-[#DE6B48] text-white py-2 px-5 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer shadow-xl`}
                >
                        Cuisine
                </button>
                <button
                    onClick={() => {setSearchType("category"), setInputText(''), setError(''), setRecipes([])}}
                    className={`${searchType === "category" ? "bg-[#DE6B48]" : "bg-[#C0BABA]"}
                                hover:bg-[#DE6B48] text-white px-4 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer shadow-xl`}
                    >
                        Category
                </button>
                <button
                    onClick={() => {setSearchType("ingredient"), setInputText(''), setError(''), setRecipes([])}}
                    className={`${searchType === "ingredient" ? "bg-[#DE6B48]" : "bg-[#C0BABA]"}
                                hover:bg-[#DE6B48] text-white px-4 rounded-full transition-all duration-300 hover:scale-110 cursor-pointer shadow-xl`}
                    >
                        Main Ingredient
                </button>
            </div>
            <div className={`relative flex items-center gap-2 w-full transition ${isVisible ? 'opacity-100 translate-y-0 delay-300' : 'opacity-0 translate-y-10'}`}>
                <button
                onClick={() => handleSearch()}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#C0BABA] hover:text-[#C0BABA]">
                    <i className="fas fa-search text-[#C0BABA] hover:text-[#DE6B48] duration-300 hover:scale-120"></i>
                </button>
                <input
                type = "text"
                placeholder = {placeholderText[searchType]}
                value = {inputText}
                onChange = {((e) => setInputText(e.target.value))}
                onKeyDown={handleKeyPress}
                disabled={searchType === "initial"}
                className = "bg-white shadow-xl h-10 px-10 rounded-full text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#C0BABA]">
                </input>
            </div>
        </div>
    );
}