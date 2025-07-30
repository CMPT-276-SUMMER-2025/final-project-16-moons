import { useState } from "react";
import meat from '../assets/icons/meat.png'
import apple from '../assets/icons/apple.png'
import carrot from '../assets/icons/carrot.png'
import lines from '../assets/images/linesHorizontal.png'
import { FaFileDownload } from 'react-icons/fa';

export default function Scanner() {
    const [image, setImage] = useState(null);
    const [nutritionData, setNutritionData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const key = import.meta.env.VITE_API_NINJAS_KEY

    const imageChange = (e) => {
        setImage(e.target.files[0]);
        setNutritionData([]);
        setError("");
    };

    const handleAnalyse = async () => {
        setLoading(true);
        setError("");
        setNutritionData([]);

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

            const data = await nutrition.json();
            setNutritionData(data);
        }   catch (err) {
            setError("Couldn't analyze nutritional info. Try another image with cleaner text font.");
        }   finally {
            setLoading(false);
        }
    };

    const generatePDF = () => {
        const printWindow = window.open('', '_blank');
        const htmlContent = `
            <!DOCTYPE html>
            <html>
                <head>
                <title>Nutrition Analysis</title>
                <style>
                    body {
                        font-family: Arial, sans-serif;
                        max-width: 800px;
                        margin: 0 auto;
                        padding: 20px;
                        line-height: 1.6;
                        color: #333;
                    }
                    .header {
                        text-align: center;
                        border-bottom: 2px solid #333;
                        padding-bottom: 10px;
                        margin-bottom: 15px;
                        page-break-after: avoid;
                    }
                    .item-title {
                        font-size: 28px;
                        font-weight: bold;
                        margin-bottom: 10px;
                    }
                    .section {
                        margin-bottom: 30px;
                        page-break-inside: avoid;
                    }
                    .section-title {
                        font-size: 20px;
                        font-weight: bold;
                        margin-bottom: 15px;
                        color: #2c3e50;
                        border-bottom: 1px solid #eee;
                        padding-bottom: 5px;
                    }
                    .section-divider {
                        border: none;
                        height: 2px;
                        margin: 20px 0;
                        background-color: black;
                    }
                    .nutrition-list {
                        list-style-type: none;
                        padding-left: 0;
                    }
                    .nutrition-list li {
                        margin-bottom: 5px;
                        padding: 5px;
                        background-color: #f8f9fa;
                        border-radius: 3px;
                    }
                    .calories {
                        font-size: 18px;
                        font-weight: bold;
                        background-color: #e3f2fd;
                        padding: 10px;
                        border-radius: 5px;
                        text-align: center;
                        margin-top: 15px;
                    }
                    @media print {
                        body { margin: 0; }
                        .no-print { display: none; }
                    }
                </style>
                </head>
                <body>
                <div class="header">
                    <div class="item-title">Nutrition Analysis</div>
                </div>
                <div class="section">
                    <ul class="nutrition-list">
                        ${nutritionData.map((item) => `
                            <h2>${item.name}</h2>
                            <ul class="nutrition-list">
                                <li><strong>Fat:</strong> ${item.fat_total_g} g</li>
                                <li><strong>Saturated Fat:</strong> ${item.fat_saturated_g} g</li>
                                <li><strong>Sodium:</strong> ${item.sodium_mg} mg</li>
                                <li><strong>Potassium:</strong> ${item.potassium_mg} mg</li>
                                <li><strong>Cholesterol:</strong> ${item.cholesterol_mg} mg</li>
                                <li><strong>Carbs:</strong> ${item.carbohydrates_total_g} g</li>
                                <li><strong>Fibre:</strong> ${item.fiber_g} g</li>
                                <li><strong>Sugar:</strong> ${item.sugar_g} g</li>
                            </ul>
                            <div class="calories">
                                Estimated Calories: ${
                                    (
                                        (item.fat_total_g || 0) * 9 +
                                        (Math.max((item.carbohydrates_total_g || 0) - (item.fiber_g || 0), 0)) * 4 +
                                        (item.fiber_g || 0) * 2
                                    ).toFixed(0)
                                } kcal
                            </div>
                            <hr class="section-divider">
                        `).join('')}

                    </ul>
                </div>

                <script>
                    window.onload = function() {
                    window.print();
                    window.onafterprint = function() {
                        window.close();
                    };
                    };
                </script>
                </body>
            </html>
        `;

        printWindow.document.write(htmlContent);
        printWindow.document.close();
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
                        className="file-input file-input-primary w-full rounded-full shadow-xl flex justify-center items-center"
                        />
                    <button
                        className="btn btn-primary mt-4 w-full rounded-full shadow-xl text-lg transition-all duration-300 hover:scale-105"
                        onClick={handleAnalyse}
                        disabled={!image}
                        >
                        Get Nutrition!
                        </button>
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
                        <h1 className="text-3xl mb-2">Nutrition Analysis</h1>
                        <button
                            onClick={generatePDF}
                            className="btn btn-primary text-white px-6 py-2.5 rounded-full flex items-center transition-all duration-300 hover:scale-110 shadow-lg"
                            disabled={nutritionData.length === 0}
                        >
                            <FaFileDownload /> Save as PDF
                        </button>
                    </div>
                    {(nutritionData.length === 0) && !error && (
                        <div className="bg-base-200 p-6 rounded-xl shadow-lg">
                            <h1>Looks like you haven't uploaded an image yet. Upload one on the left!</h1>
                        </div>
                    )}
                    {error && (
                        <div className="bg-base-200 p-6 rounded-xl shadow-lg">
                            <h1>{error}</h1>
                        </div>
                    )}
                    {loading && (
                        <div className="flex flex-row space-x-5">
                            <p className="text-2xl">Analyzing nutritional info, hang tight!</p>
                            <span className="loading loading-spinner text-primary loading-xl"></span>
                        </div>
                    )}
                    {nutritionData && nutritionData.length > 0 && (
                        <div className="mt-6">
                        <ul className="space-y-2">
                            {nutritionData.map((item, idx) => (
                            <li key={idx} className="p-4 bg-base-200 rounded-xl text-secondary-content">
                                <p className="font-medium text-black text-lg">{item.name}</p>
                                <ul className="list-disc pl-6 mt-2 space-y-1">
                                    <li><span className="font-medium">Fat:</span> {item.fat_total_g} g</li>
                                    <li><span className="font-medium">Saturated Fat:</span> {item.fat_saturated_g} g</li>
                                    <li><span className="font-medium">Sodium:</span> {item.sodium_mg} mg</li>
                                    <li><span className="font-medium">Potassium:</span> {item.potassium_mg} mg</li>
                                    <li><span className="font-medium">Cholesterol:</span> {item.cholesterol_mg} mg</li>
                                    <li><span className="font-medium">Carbs:</span> {item.carbohydrates_total_g} g</li>
                                    <li><span className="font-medium">Fibre:</span> {item.fiber_g} g</li>
                                    <li><span className="font-medium">Sugar:</span> {item.sugar_g} g</li>
                                </ul>
                                <div className="mt-2">
                                    <span className="font-medium">Estimated Calories: </span> {
                                        (
                                            (item.fat_total_g || 0) * 9 +
                                            (Math.max((item.carbohydrates_total_g || 0) - (item.fiber_g || 0), 0)) * 4 +
                                            (item.fiber_g || 0) * 2
                                            ).toFixed(0)
                                        } kcal
                                </div>
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
