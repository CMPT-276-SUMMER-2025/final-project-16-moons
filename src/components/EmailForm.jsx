import emailjs from 'emailjs-com';
import { useEffect, useState } from 'react';

export default function EmailForm() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [subject, setSubject] = useState('')
    const [message, setMessage] = useState('')

    const [showSuccessMessage, setShowSuccessMessage] = useState(false)
    const [showErrorMessage, setShowErrorMessage] = useState(false)
    const [isVisible, setIsVisible] = useState(false)

    const serviceID = import.meta.env.VITE_EMAILJS_SERVICE_ID
    const templateID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID
    const publicKey = import.meta.env.VITE_EMAILJS_PUBLIC_KEY

    // handle form submission
    const handleSubmit = (e) => {
        // prevents the page from refreshing/redirecting on form submission
        e.preventDefault()

        // send an email using EmailJS
        emailjs.sendForm(
            // the type of EmailJS service being used
            serviceID,
            // the specific email template being used
            templateID,
            // the form input data
            e.target,
            // EmailJS key for authentication
            publicKey
        ).then(
            // on success, show the success message
            () => setShowSuccessMessage(true),
            // on failure, show the error message
            () => setShowErrorMessage(true)
        )

        // reset the states after form submission
        setName('')
        setEmail('')
        setSubject('')
        setMessage('')
    }

    useEffect(() => {
        // starts a timer, then after a certain amount of ms, the states change
        // this is used for the animation of components on page load and for showing/hiding success/error messages
        const showTimeout = setTimeout(() => setIsVisible(true), 300)
        const showSuccess = setTimeout(() => setShowSuccessMessage(false), 10000)
        const showError = setTimeout(() => setShowErrorMessage(false), 10000)

        // if the component unmounts or re-renders before the timeouts finish,
        // the timers are cleared to prevent memory leaks and warnings
        return () => {
            clearTimeout(showTimeout);
            clearTimeout(showSuccess);
            clearTimeout(showError);
        }
    })

    return(
        <form onSubmit={handleSubmit} className="grid grid-rows-[auto_auto_auto_auto] gap-10">
            <div className="grid grid-cols-2 gap-5">
                <fieldset className={`fieldset w-full transition ${isVisible ? 'opacity-100 translate-y-0 delay-300' : 'opacity-0 translate-y-10'}`}>
                    <legend
                        className="fieldset-legend text-lg">
                        Name
                    </legend>
                    <input
                        type="text"
                        name="from_name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input w-full rounded-full bg-base-200 shadow-lg"
                        placeholder="Your Name"
                        required
                    />
                </fieldset>
                <fieldset className={`fieldset w-full transition ${isVisible ? 'opacity-100 translate-y-0 delay-500' : 'opacity-0 translate-y-10'}`}>
                    <legend
                        className="fieldset-legend text-lg">
                        Email
                    </legend>
                    <input
                        type="email"
                        name="from_email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        pattern="[A-Za-z0-9.]+@[A-Za-z0-9]+\.[A-Za-z]+"
                        className="input validator w-full rounded-full bg-base-200 shadow-lg"
                        placeholder="example@mail.com"
                        required
                    />
                </fieldset>
            </div>
            <fieldset className={`fieldset transition ${isVisible ? 'opacity-100 translate-y-0 delay-700' : 'opacity-0 translate-y-10'}`}>
                <legend
                    className="fieldset-legend text-lg">
                    Subject
                </legend>
                <input
                    type="text"
                    name="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="input w-full rounded-full bg-base-200 shadow-lg"
                    placeholder="Your Subject"
                    required
                />
            </fieldset>
            <fieldset className={`fieldset transition ${isVisible ? 'opacity-100 translate-y-0 delay-900' : 'opacity-0 translate-y-10'}`}>
                <legend
                    className="fieldset-legend text-lg">
                    Message
                </legend>
                <textarea
                    type="text"
                    name="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="textarea h-30 w-full overflow-y-auto rounded-2xl bg-base-200 shadow-lg"
                    placeholder="Your Message"
                    required>
                </textarea>
            </fieldset>
            <div className={`flex justify-center mb-15 transition ${isVisible ? 'opacity-100 translate-y-0 delay-1100' : 'opacity-0 translate-y-10'}`}>
                <button
                    type="submit"
                    disabled={!name || !email || !subject || !message}
                    className="btn btn-lg btn-primary w-[60%] text-xl rounded-full shadow-2xl text-white transition duration-300 hover:scale-105">
                    Send!
                </button>
            </div>
            {showSuccessMessage && (
                <div role="alert" className="alert bg-base-200 -mt-15 mb-15 text-black font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span>Alert: Your message was sent successfully!</span>
                </div>
            )}
            {showErrorMessage && (
                <div role="alert" class="alert bg-base-200 -mt-15 mb-15 text-error font-medium">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none" viewBox="0 0 24 24">
                        <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            stroke-width="2"
                            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                    </svg>
                    <span>Error: Message sent unsuccessfully. Try again.</span>
                </div>
            )}
        </form>
    );
}

