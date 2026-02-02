import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import About from './pages/About';
import Game from './pages/Game';
import StockfishPlaceholder from './pages/StockfishPlaceholder';

const AppContent: React.FC = () => {
    return (
        <div className="min-h-screen font-sans antialiased text-gray-900">
             <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/play/local" element={<Game mode="normal" />} />
                <Route path="/play/kindle" element={<Game mode="kindle" />} />
                <Route path="/play/stockfish" element={<StockfishPlaceholder />} />
            </Routes>
        </div>
    );
};

const App: React.FC = () => {
    return (
        <HashRouter>
            <AppContent />
        </HashRouter>
    );
};

export default App;