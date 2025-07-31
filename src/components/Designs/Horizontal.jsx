import { useEffect, useState } from 'react';
import meat from '../../assets/icons/meat.png'
import carrot from '../../assets/icons/carrot.png'
import apple from '../../assets/icons/apple.png'
import lines from '../../assets/images/linesHorizontal.png'

export default function Horizontal() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const showTimeout = setTimeout(() => setIsVisible(true), 300)

        return () => {
            clearTimeout(showTimeout);
        }
    })

    return(
        <div className={`flex flex-col mt-auto transition ${isVisible ? 'opacity-100 translate-y-0 delay-300' : 'opacity-0 translate-y-10'}`}>
            <div className="flex flex-row gap-8 pl-35">
                <img src={meat} alt="meat" className="w-15 h-15 object-cover rounded"/>
                <img src={carrot} alt="carrot" className="w-15 h-15 object-cover rounded"/>
                <img src={apple} alt="apple" className="w-15 h-15 object-cover rounded"/>
            </div>
            <img src={lines} alt="lines" className="w-130 mt-5"/>
        </div>
    );
}