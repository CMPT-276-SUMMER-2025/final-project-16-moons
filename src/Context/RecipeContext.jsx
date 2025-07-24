import { createContext, useState } from 'react';

export const RecipeContext = createContext();

export const RecipeProvider = ({ children }) => {
    const [selectedRecipe, setSelectedRecipe] = useState(null);

    return (
        <RecipeContext.Provider value={{ selectedRecipe, setSelectedRecipe }}>
            {children}
        </RecipeContext.Provider>
    );
};