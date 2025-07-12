import React from 'react';
import {Link} from 'react-router-dom';
import logo from '../assets/logo.png';

function Navbar(){
    return (
    <>
        <nav className="navbar shadow-md pr-4 pl-4 mb-4 mt-2 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6" 
        style={{ backgroundColor: '#DE6B48' }}>
           <div className="flex-1 flex items-center gap-2">
            <img src={logo} alt="logo" className="h-8 w-8" />
                <Link to="/" className="text-white text-lg">
                Recipedia
                </Link>
            </div>

            <div className="flex-none">
                <ul className="menu menu-horizontal gap-6 text-sm text-white-300">
                <Link to="/" className="hover:underline">
                Home
                </Link>
                <Link to="/Search" className="hover:underline">
                Search
                </Link>
                <Link to="/Scanner" className="hover:underline">
                Scanner
                </Link>
                <Link to="/Indecisive" className="hover:underline">
                Indecisive
                </Link>
                <Link to="/Contact" className="hover:underline">
                Contact
                </Link>
                </ul>
            </div>
        </nav>
        
    </>
        

    );
}

export default Navbar