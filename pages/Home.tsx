import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { ChevronRight, Smartphone, Cpu, Users } from 'lucide-react';

const Home: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Layout>
            <div className="w-full h-full flex flex-col bg-white shadow-2xl rounded-none sm:rounded-xl overflow-hidden border border-gray-200 max-w-lg max-h-[800px]">
                {/* Header */}
                <div className="bg-white p-4 text-center border-b border-gray-100 flex-shrink-0">
                    <h1 className="text-3xl font-bold text-green-500">Micro Chess</h1>
                </div>

                {/* Cards - Flex 1 to fill space evenly */}
                <div className="flex-1 flex flex-col overflow-y-auto min-h-0">
                    {/* Local Play */}
                    <div 
                        onClick={() => navigate('/play/local')}
                        className="flex-1 p-4 bg-green-500 hover:bg-green-600 text-white flex flex-col justify-center cursor-pointer border-b border-green-600/20 transition-colors"
                    >
                        <h2 className="text-2xl font-bold flex items-center gap-3 mb-1">
                            <Smartphone className="w-6 h-6 opacity-90" /> Over The Board
                        </h2>
                        <p className="opacity-90 pl-9">Play locally with a friend</p>
                    </div>

                    {/* Stockfish */}
                    <div 
                        onClick={() => navigate('/play/stockfish')}
                        className="flex-1 p-4 bg-green-500 hover:bg-green-600 text-white flex flex-col justify-center cursor-pointer border-b border-green-600/20 transition-colors"
                    >
                        <h2 className="text-2xl font-bold flex items-center gap-3 mb-1">
                            <Cpu className="w-6 h-6 opacity-90" /> Play Stockfish
                        </h2>
                        <p className="opacity-90 pl-9">Challenge the AI</p>
                    </div>

                    {/* Multiplayer (Replaces ChatGPT) */}
                    <div className="flex-1 p-4 bg-blue-500 hover:bg-blue-600 text-white flex flex-col justify-center cursor-not-allowed transition-colors opacity-90">
                        <div className="flex justify-between items-start">
                            <div>
                                <h2 className="text-2xl font-bold flex items-center gap-3 mb-1">
                                    <Users className="w-6 h-6 opacity-90" /> Multiplayer
                                </h2>
                                <p className="opacity-90 pl-9">Play with real people, not bots</p>
                            </div>
                            <span className="text-xs font-bold bg-white/20 px-2 py-1 rounded uppercase tracking-wider">
                                Coming Soon
                            </span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="bg-white p-3 text-center flex-shrink-0">
                    <button 
                        onClick={() => navigate('/about')}
                        className="text-gray-800 text-sm font-semibold flex items-center justify-center gap-1 mx-auto hover:text-green-600 transition-colors"
                    >
                        About <ChevronRight className="w-4 h-4" />
                    </button>
                </div>
            </div>
        </Layout>
    );
};

export default Home;