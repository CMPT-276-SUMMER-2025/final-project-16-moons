import { useRecipe } from "../../Context/RecipeContext"; 
import { useNavigate } from 'react-router-dom';

export default function SearchResult({ number, name, image, recipeData }) {
    const { setSelectedRecipe } = useRecipe();
    const navigate = useNavigate();

    const handleClick = () => {
        setSelectedRecipe(recipeData);
        navigate(`recipe`); 
    };

    return (
        <div
            onClick={handleClick}
            className="cursor-pointer bg-base-200 p-6 rounded-xl hover:bg-primary hover:text-white transition duration-300 hover:scale-102"
        >
            <div className="flex flex-row justify-between">
                <h1 className="text-xl">{number}. {name}</h1>
                <img src={image} className="h-30 w-30" alt={name} />
            </div>
        </div>
    );
}
