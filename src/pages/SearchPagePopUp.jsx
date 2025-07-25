import useRecipe from "../Hooks/UseRecipe";

export default function RecipeDetail() {
    const { selectedRecipe } = useRecipe();
    if (!selectedRecipe) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-bold mb-4">No recipe selected</h1>
                <p>Please go back and select a recipe from the search page.</p>
            </div>
        );
    }

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">{selectedRecipe.name}</h1>
            <img src={selectedRecipe.image} alt={selectedRecipe.name} className="w-64 h-64 mb-4" />
            <p><strong>Ingredients:</strong></p>
            <ul className="mb-4 list-disc ml-6">
                {selectedRecipe.ingredients.map((ing, idx) => (
                    <li key={idx}>{ing.name} - {ing.measure}</li>
                ))}
            </ul>
            <p><strong>Instructions:</strong></p>
            <p>{selectedRecipe.instructions}</p>
        </div>
    );
}
