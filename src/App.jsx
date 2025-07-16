import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import Scanner from './pages/Scanner';
import Indecisive from './pages/Indecisive';
import Contact from './pages/Contact';
import Footer from './components/Footer';
import Navbar from './components/Navbar';

import './App.css';

function App() {
  return (
    <HashRouter>
      <Navbar />
      <Routes>
        <Route exact path ="/" element={<Home />} />
        <Route path ="/search" element={<Search />} />
        <Route path ="/scanner" element={<Scanner />} />
        <Route path ="/indecisive" element={<Indecisive />} />
        <Route path ="/contact" element={<Contact />} />
      </Routes>
      <Footer />
    </HashRouter>
  );
}

export default App;
