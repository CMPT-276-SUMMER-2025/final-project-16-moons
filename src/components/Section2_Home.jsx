import React from 'react'
import WhatWeOfferCards from './DesignCompenets/WhatWeOfferCards'

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
        image='src\assets\search-interface-symbol.png'
        title='Recipe Search'
        content= 'Search for recipes by name, main ingredient, or cuisine!'
        />
        <WhatWeOfferCards 
        image='src\assets\Scanner.png'
        title='Nutrition Scanner'
        content= 'Get the nutrition facts of menus, recipes, or food journals by uploading an image!'
        />
        <WhatWeOfferCards 
        image='src\assets\indecisive.png'
        title='Feeling Indecisive?'
        content= 'Generate recipes for breakfast, lunch, and dinner!'
        />
        </div>

        <div>
          <div className='flex justify-center mt-20 gap-8'>
            <img src="src\assets\apple.png" alt="apple" />
            <img src="src\assets\carrot.png" alt="apple" />
            <img src="src\assets\meat.png" alt="apple" />
          </div>
          <div className='flex justify-center mt-5'>
            <img src="src\assets\linesHorizontal.png" alt="lines" className='w-175' />
          </div>
        </div>

    </section>
    </>
  )
}

export default Section2_Home