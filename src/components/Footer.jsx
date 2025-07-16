import { featuresLinks } from "../constants";
import { aboutUsLinks } from "../constants";

export default function Footer() {
    return(
        <footer className="mt-20 bg-base-100 text-secondary-content">
            <div className="px-80">
                <div className="row py-5">
                    <div className="grid lg:grid-cols-2">
                        {/* logo column */}
                        <div className="flex items-center space-x-2">
                            <img src="src/assets/recipedialogo.png" alt="Recipedia Logo" className="w-12 h-12"/>
                            <span className="text-3xl text-base-content">Recipedia</span>
                        </div>
                        
                        {/* Two footer links columns */}
                        <div className="grid lg:grid-cols-2">
                            <div>
                                <h2 className="text-xl text-base-content mb-2">Features</h2>
                                <ul className="space-y-1">
                                    {featuresLinks.map((link, index) => (
                                        <li key={index}>
                                            <a className="text-md text-secondary-content hover:text-base-content underline" href={link.href}>{link.text}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h2 className="text-xl text-base-content mb-2">About Us</h2>
                                <ul className="space-y-1">
                                    {aboutUsLinks.map((link, index) => (
                                        <li key={index}>
                                            <a className="text-md text-secondary-content hover:text-base-content underline" href={link.href}>{link.text}</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row py-5">
                    <p className="text-center text-secondary-content">
                        &copy; 2025 Recipedia. All rights reserved.
                    </p>
                </div>
            </div>
            
        </footer>
    );
}