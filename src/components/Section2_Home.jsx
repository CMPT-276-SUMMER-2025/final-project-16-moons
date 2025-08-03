import WhatWeOfferCards from './WhatWeOfferCards'
import search from '../assets/icons/search-interface-symbol.png'
import scanner from '../assets/icons/Scanner.png'
import indecisive from '../assets/icons/indecisive.png'
import apple from '../assets/icons/apple.png'
import carrot from '../assets/icons/carrot.png'
import meat from '../assets/icons/meat.png'
import lines from '../assets/images/linesHorizontal.png'
import arrow from '../assets/icons/down-arrow.png'

function Section2_Home() {
  return (
    <section id="section2" className="grid p-15 min-w-svh">
        <div className="flex flex-col text-center mb-10">
            <h1 className="text-7xl">What We Offer</h1>
        </div>
        <div className='mt-10 grid sm:grid-cols-3 grid-col-1 gap-10 sm:ml-5 sm:mr-5 h-[280px]'>
          <WhatWeOfferCards
            image={search}
            title='Recipe Search'
            content= 'Search for recipes by area, name, category, or main ingredient!'
            link="#/search"
          />
          <WhatWeOfferCards
            image={scanner}
            title='Nutrition Scanner'
            content= 'Get the nutrition facts of menus, recipes, or food journals by uploading an image!'
            link="#/scanner"
          />
          <WhatWeOfferCards
            image={indecisive}
            title='Feeling Indecisive?'
            content= 'Randomly generate amazing recipes for breakfast, lunch, and dinner!'
            link="#/indecisive"
          />
        </div>

        <div>
          <div className='flex justify-center mt-20 gap-8'>
            <img className="h-15 w-15" src={meat} alt="apple" />
            <img className="h-15 w-15" src={carrot} alt="apple" />
            <img className="h-15 w-15" src={apple} alt="apple" />
          </div>
          <div className='flex justify-center mt-5'>
            <img src={lines} alt="lines" className='w-130' />
          </div>
        </div>

      <div className="flex justify-center mt-20 gap-5">
        <button
          onClick={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
          }}
          className="tooltip w-fit btn btn-primary rounded-full shadow-xl transition duration-300 hover:scale-110"
          data-tip="Scroll up the page!"
          >
          <img className="h-8 w-8 rotate-180" src={arrow} alt="Black icon of an upwards pointing greater than symbol." />
        </button>
      </div>
    </section>
  )
}

export default Section2_Home