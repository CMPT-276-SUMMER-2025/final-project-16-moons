import { createContext, useState } from "react";

//RecipeContext provides a way to share the selected recipe state across the component tree without prop drilling.

export const RecipeContext = createContext();

/*
 RecipeProvider wraps parts of the app that need access to recipe selection.
  Props: Components that will have access to the RecipeContext.
  Provides:
   selectedRecipe: Current selected recipe data.
   setSelectedRecipe: Function to update selected recipe.
 */

export const RecipeProvider = ({ children }) => {
  const [selectedRecipe, setSelectedRecipe] = useState(null);

  return (
    <RecipeContext.Provider value={{ selectedRecipe, setSelectedRecipe }}>
      {children}
    </RecipeContext.Provider>
  );
};
