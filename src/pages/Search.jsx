export default function Search() {
    return(
        <div className="flex flex-col md:flex-row min-h-screen">
            <div className="w-1/2 p-10 text-left text-xl leading-relaxed">
            <p className="py-5">Only remember part of the name of a recipe?</p>
            <p className="py-5">Don’t know what you can make with your ingredients?</p>
            <p className="py-5">Want to try something different?</p>
            <p className="py-5">Don’t worry! Search for tons of amazing recipes by name, main ingredient, area, or category!  </p>
            </div>
       
        <div className="flex justify-center p-4">
            <div className="p-10 space-x-4 min-w-max">
            
            <button className="bg-[#C0BABA] hover:bg-[#DE6B48] text-white py-3 px-4 rounded-full shadow-md hover:shadow-lg transition-all">
               Name
            </button>
            <button className="bg-[#C0BABA] hover:bg-[#DE6B48] text-white py-3 px-4 rounded-full shadow-md hover:shadow-lg transition-all">
                Main Ingredient
            </button>
            <button className="bg-[#C0BABA] hover:bg-[#DE6B48] text-white py-3 px-4 rounded-full shadow-md hover:shadow-lg transition-all">
                Area
            </button>
            <button className="bg-[#C0BABA] hover:bg-[#DE6B48] text-white py-3 px-4 rounded-full transition-all">
                Category
            </button>
            </div>

        </div>

        </div>
    );
}