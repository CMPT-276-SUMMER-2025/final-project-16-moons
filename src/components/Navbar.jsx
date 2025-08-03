import {Link, useLocation} from 'react-router-dom';
import logo from '../assets/icons/recipe-book.png';

function Navbar(){
    const location = useLocation();

    return (
        <nav className="navbar shadow-md px-19 mb-4 flex flex-col gap-2 lg:mb-0 lg:mt-0 lg:flex-row lg:items-center lg:gap-6"
            style={{ backgroundColor: '#DE6B48' }}>
            <div className="flex-1 flex items-center gap-2">
                <Link to="/">
                    <img src={logo} alt="logo" className="h-8 w-8 transition duration-300 hover:scale-115" />
                </Link>
                <Link to="/" className="text-white text-xl transition duration-300 hover:scale-115">
                    Recipedia
                </Link>
            </div>

            <div className="flex-none">
                <div className="menu menu-horizontal gap-6 text-xl text-primary-content">
                    <Link to="/" className={location.pathname === '/' ? 'transition duration-300 hover:scale-115 underline' : 'transition duration-300 hover:scale-120'}>
                    Home
                    </Link>
                    <Link to="/search" className={location.pathname === '/search' ? 'transition duration-300 hover:scale-115 underline' : 'transition duration-300 hover:scale-120'}>
                    Search
                    </Link>
                    <Link to="/scanner" className={location.pathname === '/scanner' ? 'transition duration-300 hover:scale-115 underline' : 'transition duration-300 hover:scale-120'}>
                    Scanner
                    </Link>
                    <Link to="/indecisive" className={location.pathname === '/indecisive' ? 'transition duration-300 hover:scale-115 underline' : 'transition duration-300 hover:scale-120'}>
                    Indecisive
                    </Link>
                    <Link to="/contact" className={location.pathname === '/contact' ? 'transition duration-300 hover:scale-115 underline' : 'transition duration-300 hover:scale-120'}>
                    Contact
                    </Link>
                </div>
            </div>
        </nav>
    );
}

export default Navbar