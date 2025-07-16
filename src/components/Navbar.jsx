import React from 'react';
import {Link} from 'react-router-dom';
import logo from '../assets/icons/recipe-book.png';

function Navbar(){
    return (
    <>
        <nav className="navbar shadow-md px-19 mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6"
        style={{ backgroundColor: '#DE6B48' }}>
            <div className="flex-1 flex items-center gap-2">
                <Link to="/">
                    <img src={logo} alt="logo" className="h-8 w-8" />
                </Link>
                <Link to="/" className="text-white text-lg">
                    Recipedia
                </Link>
            </div>

            <div className="flex-none">
                <div className="menu menu-horizontal gap-6 text-lg text-primary-content">
                    <Link to="/" className="hover:underline">
                    Home
                    </Link>
                    <Link to="/search" className="hover:underline">
                    Search
                    </Link>
                    <Link to="/scanner" className="hover:underline">
                    Scanner
                    </Link>
                    <Link to="/indecisive" className="hover:underline">
                    Indecisive
                    </Link>
                    <Link to="/contact" className="hover:underline">
                    Contact
                    </Link>
                </div>
            </div>
        </nav>

    </>


    );
}

export default Navbar