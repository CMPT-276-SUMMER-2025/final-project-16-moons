import { useState } from "react";
import meat from '../assets/icons/meat.png'
import apple from '../assets/icons/apple.png'
import carrot from '../assets/icons/carrot.png'
import lines from '../assets/images/linesHorizontal.png'


function SearchCategory(){
    const [searchType, setSearchType] = useState("");
    const [inputText, setInput] = useState("");

    const placeholderText = {
        ingredient: "Search by main ingredient...",
        name: "Search by name...",
        area: "Search by area...",    
        category: "Search by category..."
    };

    return(
        <div className="w-1/2 p-10 flex flex-col">
            <div className = "flex flex-col items-start p-10 space-y-6 min-w-max">
                <div className="flex justify-start space-x-8 p-10 min-w-max">
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
                        className="bg-[#C0BABA] hover:bg-[#DE6B48] text-white py-3 px-4 rounded-full transition-all hover:shadow-lg transition-all">
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
                        <button 
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-[#C0BABA] hover:text-[#C0BABA]">
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
        <div className="flex min-h-screen">
            <div className="w-1/2 p-10 text-left text-xl leading-relaxed flex flex-col min-h-screen justify-between">
                <div className="flex-grow flex flex-col justify-start pt-20 pl-10">
                    <p className="py-5">Only remember part of the name of a recipe?</p>
                    <p className="py-5">Don’t know what you can make with your ingredients?</p>
                    <p className="py-5">Want to try something different?</p>
                    <p className="py-5">Don’t worry! Search for tons of amazing recipes by name, main ingredient, area, or category!  </p>
            
                </div>
            <div className="flex justify-center space-x-6 mt-auto ">
                <img src={meat} alt="meat" className="w-16 h-16 object-cover rounded"/>
                <img src={carrot} alt="carrot" className="w-16 h-16 object-cover rounded"/>
                <img src={apple} alt="apple" className="w-16 h-16 object-cover rounded"/>
            </div>
            <div className="flex justify-center mt-4">
                <img src={lines} alt="lines" className="w-150 h-auto"/>
            </div>

            </div>

        <SearchCategory/>
        
        </div>
        
    );
}