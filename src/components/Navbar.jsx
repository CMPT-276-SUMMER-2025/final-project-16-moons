import React from 'react';
import {Link} from 'react-router-dom';
import logo from '../assets/logo.png';

function Navbar(){
    return (
    <>
        <nav className="navbar shadow-md" 
        style={{ backgroundColor: '#DE6B48' }}>
           <div className="flex-1 flex items-center">
            <img src={logo} alt="logo" />
                <Link to="/" className="text-white">
                Recipedia
                </Link>
            </div>

            <div className="flex-none">
                <ul className="menu menu-horizontal text-white-300">
                <Link to="/" className="hover:underline">
                Home
                </Link>
                <Link to="/Search">
                Search
                </Link>
                <Link to="/Scanner" >
                Scanner
                </Link>
                <Link to="/Indecisive">
                Indecisive
                </Link>
                <Link to="/Contact">
                Contact
                </Link>
                </ul>
            </div>
        </nav>
        
    </>
        

    );
}

export default Navbar