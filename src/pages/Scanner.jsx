import { useState } from "react";
import meat from '../assets/icons/meat.png'
import apple from '../assets/icons/apple.png'
import carrot from '../assets/icons/carrot.png'
import lines from '../assets/images/linesHorizontal.png'
import { FaFileDownload } from 'react-icons/fa';

export default function Scanner() {
    const [image, setImage] = useState(null);
    const [nutritionInfo, setNutritionInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const key = import.meta.env.VITE_API_NINJAS_KEY

    const imageChange = (e) => {
        setImage(e.target.files[0]);
        setNutritionInfo(null);
        setError("");
    };

    const handleAnalyse = async () => {
        if (!image) {
            setError("Error: Please upload image.");
            return;
        }

        setLoading(true);
        setError("");
        setNutritionInfo(null);

        try {
            const formData = new FormData();
            formData.append("image", image);

            // image to text
            const imageToText = await fetch("https://api.api-ninjas.com/v1/imagetotext", {
                method: "POST",
                headers: {
                    "X-Api-Key": key,
                },
                body: formData,
            });

            if (!imageToText.ok) throw new Error("Error: Couldn't extract text.");

            const textData = await imageToText.json();
            const fullText = textData.map((obj) => obj.text).join(" ").trim();

            if (!fullText) throw new Error("Error: No text detected.");

            //text to nutrition
            const nutrition = await fetch(
                "https://api.api-ninjas.com/v1/nutrition?query=" + encodeURIComponent(fullText),
                {
                    method: "GET",
                    headers: {
                        "X-Api-Key": key,
                    },
                }

            );

            if (!nutrition.ok) throw new Error("Error: Couldn't fetch nutritional info.");

            const nutritionData = await nutrition.json();
            setNutritionInfo(nutritionData);
        }   catch (err) {
            setError(err.message || "Error!");
        }   finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-row justify-center px-20 py-10 space-x-20 h-200">
            <div className="w-[35%] text-left text-2xl flex flex-col">
                <p className="py-3">Want to find out the nutrition facts of a menu, recipe, or food journal?</p>
                <p className="py-3">Just upload a picture of it and watch the magic happen!</p>
                <div className="py-15">
                    <input
                        type="file"
                        accept="image/*"
                        onChange={imageChange}
                        className="file-input file-input-primary w-full rounded-full shadow flex justify-center items-center"
                        />
                    <button
                        className="btn btn-primary mt-4 w-full rounded-full shadow text-xl"
                        onClick={handleAnalyse}
                        disabled={loading}
                        >
                        {loading ? "Analyzing..." : "Get Nutrition!"}
                        </button>

                    {error && <p className="text-error text-lg mt-4">{error}</p>}
                </div>
                <div className="flex justify-center space-x-8 mt-auto">
                    <img src={meat} alt="meat" className="w-15 h-15 object-cover rounded"/>
                    <img src={carrot} alt="carrot" className="w-15 h-15 object-cover rounded"/>
                    <img src={apple} alt="apple" className="w-15 h-15 object-cover rounded"/>
                </div>
                <div className="flex justify-center mt-4">
                    <img src={lines} alt="lines" className="w-130"/>
                </div>
            </div>
            <div className="flex flex-col w-[40%] gap-6">
                <div className="bg-white p-6 rounded-xl shadow-2xl max-h-full flex-1 space-y-5 overflow-y-auto">
                    <div className="flex flex-row justify-between">
                        <h1 className="text-3xl font-medium mb-2">Nutrition Analysis</h1>
                        <button
                            onClick={() => window.print()}
                            className="btn btn-primary text-white rounded-full shadow transition-all duration-200 flex items-center gap-2"
                        >
                            <FaFileDownload /> Save as PDF
                        </button>
                    </div>
                    {nutritionInfo && nutritionInfo.length > 0 && (
                        <div className="mt-6">
                        <ul className="space-y-2">
                            {nutritionInfo.map((item, idx) => (
                            <li key={idx} className="p-4 bg-base-200 rounded-xl">
                                <p className="font-bold">{item.name}</p>
                                <p>Total Fat: {item.fat_total_g} g</p>
                                <p>Saturated Fat: {item.fat_saturated_g} g</p>
                                <p>Sodium: {item.sodium_mg} mg</p>
                                <p>Potassium: {item.potassium_mg} mg</p>
                                <p>Cholesterol: {item.cholesterol_mg} mg</p>
                                <p>Total Carbs: {item.carbohydrates_total_g} g</p>
                                <p>Fibre: {item.fiber_g} g</p>
                                <p>Sugar: {item.sugar_g} g</p>

                            </li>
                            ))}
                        </ul>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}
