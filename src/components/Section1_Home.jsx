import VerticalDesign1 from './Designs/Vertical1'
import VerticalDesign2 from './Designs/Vertical2'
import arrow from '../assets/icons/down-arrow.png'

export default function Section1_Home() {
    return(
        <section id="section1" className="grid grid-cols-5 px-15 min-w-svh min-h-screen">
            <div className="flex mb-20">
                <VerticalDesign1 />
            </div>
            <div className="flex flex-col col-span-3 mt-50 text-center">
                <h1 className="text-7xl">Eat smarter, not harder.</h1>
                <p className="mt-10 text-3xl text-secondary-content text-balance">Welcome to Recipedia, the recipe and nutrition platform that makes healthy eating easy. Whether you're a busy professional, fitness coach, or just someone looking to make better nutrition choices, Recipedia makes it possible to create delicious, home cooked meals that fit your dietary preferences.</p>
                <p className="text-3xl text-secondary-content">Scroll down on this page to see what we have to offer!</p>
                <button
                    onClick={() => {
                        document.getElementById('section2')?.scrollIntoView({ behavior: 'smooth' });
                    }}
                    className="tooltip mt-20 w-fit self-center btn btn-primary rounded-full shadow-2xl transition duration-300 hover:scale-110"
                    data-tip="Scroll down the page!"
                    >
                    <img className="h-8 w-8" src={arrow} alt="Black icon of a downwards pointing greater than symbol." />
                </button>
            </div>
            <div className="flex justify-end mb-20">
                <VerticalDesign2 />
            </div>
        </section>
    );
}