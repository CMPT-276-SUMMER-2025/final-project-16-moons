import { useState } from "react";

function SearchCategory(){
    const [searchType, setSearchType] = useState("");
    const [inputText, setInput] = useState("");

    const placeholderText = {
        ingredient: "Search by main ingredient...",
        name: "Search by main name...",
        area: "Search by main area...",    
        category: "Search by main category..."
    };

    return(
        <div className="flex justify-center p-4">
            <div className = "flex flex-col items-start p-10 space-y-6 min-w-max">
                <div className="flex flex-wrap gap-4">
                    <button 
                        onClick={() => setSearchType("name")}
                        className="bg-[#C0BABA] hover:bg-[#DE6B48] text-white py-3 px-4 rounded-full shadow-md hover:shadow-lg transition-all">
                            Name
                    </button>
                    <button 
                        onClick={() => setSearchType("ingredient")}
                        className="bg-[#C0BABA] hover:bg-[#DE6B48] text-white py-3 px-4 rounded-full shadow-md hover:shadow-lg transition-all">
                            Main Ingredient
                    </button>
                    <button 
                        onClick={() => setSearchType("area")}
                        className="bg-[#C0BABA] hover:bg-[#DE6B48] text-white py-3 px-4 rounded-full shadow-md hover:shadow-lg transition-all">
                            Area
                    </button>
                    <button 
                        onClick={() => setSearchType("category")}
                        className="bg-[#C0BABA] hover:bg-[#DE6B48] text-white py-3 px-4 rounded-full transition-all">
                            Category
                    </button>
                </div>
        
                {searchType && (
                    <div className = "relative flex items-center gap-2 mt-4 w-full">
                        <input
                        type = "text"
                        placeholder = {placeholderText[searchType]}
                        value = {inputText}
                        onChange = {(e) => setInput(e.target.value)}
                        className = "bg-white h-10 px-5 rounded-full text-sm w-full focus:outline-none focus:ring-2 focus:ring-[#C0BABA]">
                        </input>
                        <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#C0BABA] hover:text-[#C0BABA]">
                            <i className="fas fa-search text-[#C0BABA]"></i>
                        </button>
                        </div>
                    )}            
                </div>
        </div>

    );

}
export default function Search() {
    return(
        <div className="flex flex-col md:flex-row min-h-screen">
            <div className="w-1/2 p-10 text-left text-xl leading-relaxed">
            <p className="py-5">Only remember part of the name of a recipe?</p>
            <p className="py-5">Don’t know what you can make with your ingredients?</p>
            <p className="py-5">Want to try something different?</p>
            <p className="py-5">Don’t worry! Search for tons of amazing recipes by name, main ingredient, area, or category!  </p>
            </div>
        <SearchCategory/>
        </div>
        
    );
}