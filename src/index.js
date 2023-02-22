import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Favorites from './components/favorites'
import Song from './components/song'
import Artist from './components/artist';

import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <Router>
    <Routes>
      <Route path='/' element={<App logout={false} />} />
      <Route path='/#' element={<App logout={false} />} />
      <Route path='/favorites' element={<Favorites />} />
      <Route path='/song' element={<Song />} />
      <Route path='/artist' element={<Artist />} />
      <Route path='/logout' element={<App logout={true} />}  />
    </Routes>
  </Router>
);
