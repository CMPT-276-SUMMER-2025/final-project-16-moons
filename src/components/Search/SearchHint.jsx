import { useEffect, useState } from 'react';

export default function SearchHint({ searchType }) {
    const [isVisible, setIsVisible] = useState(false)

    const hints = {
        ingredient: "E.g., 'Chicken' or 'Onion'",
        name: "E.g., 'Lamb Pilaf' or 'Chicken Curry'",
        area: "E.g., 'Canadian' or 'Mexican'",
        category: "E.g., 'Seafood' or 'Dessert'",
        initial: "Looks like you haven't chosen a search method yet. Pick one above!"
    }

    useEffect(() => {
        const showTimeout = setTimeout(() => setIsVisible(true), 300)

        return () => {
            clearTimeout(showTimeout);
        }
    })

    return (
        <div className={`bg-base-200 p-6 rounded-xl shadow-lg transition ${isVisible ? 'opacity-100 translate-y-0 delay-700' : 'opacity-0 translate-y-10'}`}>
            <h1>{hints[searchType]}</h1>
        </div>
    )
}