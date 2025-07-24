export default function SearchHint({ searchType }) {
    const hints = {
        ingredient: "E.g., 'Chicken' or 'Onion'",
        name: "E.g., 'Lamb Pilaf' or 'Chicken Curry'",
        area: "E.g., 'Canadian' or 'Mexican'",
        category: "E.g., 'Seafood' or 'Dessert'",
        initial: "Looks like you haven't chosen a search method yet. Pick one above!"
    }

    return (
        <div className="bg-base-200 p-6 rounded-xl hover:bg-primary hover:text-white transition duration-300 hover:scale-102">
            <h1>{hints[searchType]}</h1>
        </div>
    )
}