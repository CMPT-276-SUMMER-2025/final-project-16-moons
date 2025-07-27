/*export default function Scanner() {
    return(
        <div className="flex items-center justify-center h-200">
            <h1 className="text-7xl">Scanner Page</h1>
        </div>
    );
}*/

import { useState } from "react";
import meat from '../assets/icons/meat.png'
import apple from '../assets/icons/apple.png'
import carrot from '../assets/icons/carrot.png'
import lines from '../assets/images/linesHorizontal.png'
import { FaFileDownload, FaTimes } from 'react-icons/fa';

export default function Scanner() {
    const [image, setImage] = useState(null);
    const [nutritionInfo, setNutritionInfo] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const imageChange = (e) => {
        setImage(e.target.files[0]);
        setNutritionInfo(null);
        setError("");
    };

    const handleAnalyse = async () => {
        if (!image) { 
            setError("Upload image!!");
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
                    "X-Api-Key": "qyFoT5C9lkOgKG1EcxLVvQ==we8cqSXl92HpZ3Xj", //alans api key, feel free to replce if it stops working in the future
                    //"X-Api-Key": import.meta.env.VITE_API_NINJAS_KEY,
                },
                body: formData,
            });

            if (!imageToText.ok) throw new Error("Couldn't extract text");

            const textData = await imageToText.json();
            const fullText = textData.map((obj) => obj.text).join(" ").trim();

            if (!fullText) throw new Error("No text detected");

            //text to nutrition
            const nutrition = await fetch(
                "https://api.api-ninjas.com/v1/nutrition?query=" + encodeURIComponent(fullText),
                {
                    method: "GET",
                    headers: {
                        "X-Api-Key": "qyFoT5C9lkOgKG1EcxLVvQ==we8cqSXl92HpZ3Xj", //alans api key, feel free to replace if it stops working in the future
                    },
                }

            );

            if (!nutrition.ok) throw new Error("couldnt fetch nutrition info");

            const nutritionData = await nutrition.json();
            setNutritionInfo(nutritionData);
        }   catch (err) {
            setError(err.message || "ERRROR!!!!!!!!!");
        }   finally {
            setLoading(false);
        }
    };

    const toBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result.split(",")[1]);
            reader.onerror = reject;
        });

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
                        className="file-input file-input-bordered w-full"
                    />
                <button
                        className="btn btn-primary mt-4 w-full rounded-full"
                        onClick={handleAnalyse}
                        disabled={loading}
                    >
                        {loading ? "Analyzing..." : "Get Nutrition!"}
                    </button>

                {error && <p className="text-error mt-4">{error}</p>}
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
                    <div className="flex flex-row">
                        <h1 className="text-3xl font-medium mb-2">Nutrition Analysis</h1>
                        <button
                            onClick={() => window.print()}
                            className="btn btn-primary justify-end text-white px-6 py-2.5 rounded-full shadow hover:brightness-110 transition-all duration-200 flex items-center gap-2"
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
                                <p>&emsp; -Saturated Fat: {item.fat_saturated_g} g</p>
                                <p>&emsp; -Sodium: {item.sodium_mg} mg</p>
                                <p>Potassium: {item.potassium_mg} mg</p>
                                <p>Cholesterol: {item.cholesterol_mg} mg</p>
                                <p>Total Carbs: {item.carbohydrates_total_g} g</p>
                                <p>&emsp; -Fibre: {item.fiber_g} g</p>
                                <p>&emsp; -Sugar: {item.sugar_g} g</p>
                                
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
