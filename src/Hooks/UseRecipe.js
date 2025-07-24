import { useContext } from 'react';
import { RecipeContext } from '../Context/RecipeContext'; 


const useRecipe = () => useContext(RecipeContext);
export default useRecipe;