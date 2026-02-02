import React from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { ArrowLeft, ExternalLink, Mail, Code, Smartphone, Zap } from 'lucide-react';

const About: React.FC = () => {
    const navigate = useNavigate();

    const Section: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
        <div className="bg-gray-50 rounded-lg p-5 border border-gray-100">
            <h2 className="text-lg font-bold text-green-700 flex items-center gap-2 mb-3">
                {icon} {title}
            </h2>
            <div className="text-gray-700 leading-relaxed text-sm sm:text-base">
                {children}
            </div>
        </div>
    );

    return (
        <Layout>
            <div className="w-full h-full max-w-3xl bg-white rounded-xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
                {/* Header */}
                <div className="bg-gradient-to-r from-green-500 to-green-600 p-5 text-white flex items-center gap-4 flex-shrink-0 shadow-md">
                    <button 
                        onClick={() => navigate('/')} 
                        className="p-2 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6" />
                    </button>
                    <h1 className="text-2xl font-bold tracking-tight">About Micro Chess</h1>
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                    
                    <div className="prose prose-green max-w-none">
                        <p className="text-lg text-gray-600 italic border-l-4 border-green-500 pl-4 bg-green-50 p-3 rounded-r-lg">
                            "Bridging the gap between modern web technology and classic strategy gaming."
                        </p>
                    </div>

                    <Section title="The Mission" icon={<Smartphone className="w-5 h-5"/>}>
                        <p className="mb-2">
                            Micro Chess is designed to be a lightweight, ultra-responsive chess platform. 
                            It prioritizes accessibility and performance, featuring a dedicated <strong>Kindle Mode</strong> optimized for E-ink displays 
                            (high contrast, no animations) and a responsive design that adapts to any screen size.
                        </p>
                    </Section>

                    <Section title="Under the Hood" icon={<Code className="w-5 h-5"/>}>
                        <p className="mb-2">
                            This project explores the intersection of AI and Software Engineering. 
                            The entire application logic, from the chess rules (via chess.js) to the UI components (React + Tailwind), 
                            was architected and refined through AI-assisted development.
                        </p>
                        <ul className="list-disc list-inside mt-2 space-y-1 text-gray-600">
                            <li><strong>Tech Stack:</strong> React 19, Tailwind CSS, Lucide Icons</li>
                            <li><strong>Engine:</strong> Chess.js for move validation</li>
                            <li><strong>Design:</strong> Mobile-first, Adaptive Layouts</li>
                        </ul>
                    </Section>

                    <Section title="The Creator" icon={<Zap className="w-5 h-5"/>}>
                        <p className="mb-4">
                            Created by <strong>Aniket Shenoy</strong>, a developer passionate about building intuitive and fun digital experiences.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3">
                            <a 
                                href="mailto:aniketshenoy2012@gmail.com" 
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-white border-2 border-green-500 text-green-700 font-bold rounded-lg hover:bg-green-50 transition-colors"
                            >
                                <Mail className="w-4 h-4"/> aniketshenoy2012@gmail.com
                            </a>
                            <a 
                                href="https://aniket-shenoy-portfolio.lovable.app" 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white font-bold rounded-lg hover:bg-green-700 transition-colors shadow-sm"
                            >
                                <ExternalLink className="w-4 h-4"/> Visit Portfolio
                            </a>
                        </div>
                    </Section>

                </div>
                
                {/* Footer Version */}
                <div className="p-3 bg-gray-50 border-t border-gray-200 text-center text-xs text-gray-400">
                    Micro Chess v1.2.0 • AI-Assisted Build
                </div>
            </div>
        </Layout>
    );
};

export default About;