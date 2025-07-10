import { HashRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Search from './pages/Search';
import Scanner from './pages/Scanner';
import Indecisive from './pages/Indecisive';
import Contact from './pages/Contact';
import './App.css';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route exact path ="/" element={<Home />} />
        <Route path ="/search" element={<Search />} />
        <Route path ="/scanner" element={<Scanner />} />
        <Route path ="/indecisive" element={<Indecisive />} />
        <Route path ="/contact" element={<Contact />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
