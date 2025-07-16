import React from 'react';

function WhatWeOfferCards(props) {
  return (
    <div className="bg-[#EDE9E9] p-6 rounded-xl border-gray-400 shadow-2xl text-center">

      <div className="flex justify-center mb-4">
        <img src={props.image} alt="icon" className="w-8 h-8" />
      </div>

      <h2 className="text-3xl mb-2">{props.title}</h2>


      <p className="text-[#535353] text-xl mb-4 border-blue-400 rounded p-2">
        {props.content}
      </p>

      <a
        href={props.link}
        className="bg-[#DE6B48] text-white text-xl py-2 px-8 rounded-full hover:bg-[#c75c3c] transition "
      >
        Check it out!
      </a>
    </div>
  );
}

export default WhatWeOfferCards;
