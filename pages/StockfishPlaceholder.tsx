import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { ArrowLeft, Cpu } from 'lucide-react';

const StockfishPlaceholder: React.FC = () => {
    const navigate = useNavigate();

    return (
        <Layout>
            <div className="w-full max-w-lg bg-white p-8 rounded-xl shadow-xl text-center flex flex-col items-center justify-center">
                <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                    <Cpu className="w-8 h-8 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Stockfish Integration</h1>
                <p className="text-gray-600 mb-6">Coming soon with WASM engine.</p>
                <button onClick={() => navigate('/')} className="px-6 py-2 bg-green-500 text-white rounded font-bold flex items-center gap-2">
                    <ArrowLeft className="w-4 h-4" /> Back
                </button>
            </div>
        </Layout>
    );
};

export default StockfishPlaceholder;