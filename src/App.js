import './App.css'
import { Routes, Route } from 'react-router-dom';

import Navbar from './components/navbar';
import Login from './pages/login';
import Song from './pages/song';
import Favorites from './pages/favorites';
import Artist from './pages/artist';
import NotFound from './pages/notfound';

function App() {
    return (
        <>
            <Routes>
                <Route path='/' element={<Navbar />}>
                    <Route path='/' element={<Login />} />
                    <Route path='/favorites' element={<Favorites />} />
                    <Route path='/song/:songID' element={<Song />} />
                    <Route path='/artist/:artistID' element={<Artist />} />
                </Route>
                <Route path='*' element={<NotFound />} />
            </Routes>
        </>
    )
}

export default App;