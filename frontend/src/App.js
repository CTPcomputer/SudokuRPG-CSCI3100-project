import React from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import HomePage from './components/HomePage/HomePage';

import Instructions from './components/HomePage/Instructions';
import Settings from './components/HomePage/Settings';
import Game from './components/Game/Game';


function App() {
  return (
    <BrowserRouter>
            <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/game" element={<Game />} />
          <Route path="/instructions" element={<Instructions />} />
          <Route path="/settings" element={<Settings />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;

