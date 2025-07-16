import React from 'react'
import WhatWeOfferCards from './DesignCompenets/WhatWeOfferCards'
import search from '../assets/icons/search-interface-symbol.png'
import scanner from '../assets/icons/Scanner.png'
import indecisive from '../assets/icons/indecisive.png'
import apple from '../assets/icons/apple.png'
import carrot from '../assets/icons/carrot.png'
import meat from '../assets/icons/meat.png'
import lines from '../assets/images/linesHorizontal.png'

function Section2_Home() {
  return (
    <>
    <section id="section2" className="grid p-15 min-w-svh min-h-screen bg-[#EDE9E9]">
        <div>
          <div className="flex flex-col mt-20 text-center mb-10">
              <h1 className="text-7xl">What We Offer</h1>
          </div>
        </div>
        <div className='grid sm:grid-cols-3 grid-col-1 gap-10 sm:ml-5 sm:mr-5 h-[300px]'>
        <WhatWeOfferCards
        image={search}
        title='Recipe Search'
        content= 'Search for recipes by name, main ingredient, area, or category!'
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
            <img src={apple} alt="apple" />
            <img src={carrot} alt="apple" />
            <img src={meat} alt="apple" />
          </div>
          <div className='flex justify-center mt-5'>
            <img src={lines} alt="lines" className='w-175' />
          </div>
        </div>

    </section>
    </>
  )
}

export default Section2_Home