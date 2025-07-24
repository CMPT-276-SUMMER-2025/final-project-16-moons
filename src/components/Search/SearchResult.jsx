import { useRecipe } from "../../Context/RecipeContext";
import { useNavigate } from 'react-router-dom';

export default function SearchResult({ number, name, image, area, category, recipeData }) {
    const { setSelectedRecipe } = useRecipe();
    const navigate = useNavigate();

    const handleClick = () => {
        setSelectedRecipe(recipeData);
        navigate('/recipe');
    };

    return (
        <div
            onClick={handleClick}
            className="cursor-pointer bg-base-200 p-6 rounded-xl hover:bg-primary transition duration-300 hover:scale-102 group"
        >
            <div className="flex flex-row justify-between">
                <div className="flex flex-col space-y-5">
                    <h1 className="text-xl text-base-content group-hover:text-white transition duration-300">
                        {number}. {name}
                    </h1>
                    <div className="flex space-x-1">
                        <p className="text-md text-secondary-content group-hover:text-white transition duration-300">Area:</p>
                        <p className="text-md group-hover:text-white transition duration-300">{area}</p>
                    </div>
                    <div className="flex space-x-1">
                        <p className="text-md text-secondary-content group-hover:text-white transition duration-300">Category:</p>
                        <p className="text-md group-hover:text-white transition duration-300">{category}</p>
                    </div>
                </div>
                <img src={image} className="h-40 w-40 rounded-xl" alt={name} />
            </div>
        </div>
    );
}
