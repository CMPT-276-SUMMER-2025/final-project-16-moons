import { useEffect, useState } from 'react';
import Horizontal from '../components/Designs/Horizontal'
import EmailForm from '../components/EmailForm'

export default function Contact() {
    const [isVisible, setIsVisible] = useState(false)

    useEffect(() => {
        const showTimeout = setTimeout(() => setIsVisible(true), 300)

        return () => {
            clearTimeout(showTimeout);
        }
    })

    return (
        <div className="h-screen">
            <div className="flex flex-row justify-center px-20 py-10 space-x-20 h-200 flex-1">
                <div className={`w-[35%] text-left text-3xl flex flex-col transition ${isVisible ? 'opacity-100 translate-y-0 delay-100' : 'opacity-0 translate-y-10'}`}>
                    <p className="pb-3">Want to get in touch with us?</p>
                    <p className="py-3">Send a message using the form on the right!</p>
                    <Horizontal />
                </div>
                <div className="flex flex-col w-[40%] gap-6">
                    <div className={`bg-white p-6 rounded-xl shadow-2xl max-h-full flex-1 space-y-5 overflow-y-auto transition ${isVisible ? 'opacity-100 translate-y-0 delay-100' : 'opacity-0 translate-y-10'}`}>
                        <EmailForm />
                    </div>
                </div>
            </div>
        </div>
    )
}
