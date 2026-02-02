import React from 'react';

interface LayoutProps {
    children: React.ReactNode;
    className?: string;
    mode?: 'normal' | 'kindle';
}

const Layout: React.FC<LayoutProps> = ({ children, className = '', mode = 'normal' }) => {
    // Normal mode uses the lush green gradient
    // Kindle mode uses pure white for e-ink displays to prevent ghosting
    const bgClass = mode === 'normal' 
        ? 'bg-gradient-to-br from-green-500 to-green-700' 
        : 'bg-white text-black';

    return (
        <div className={`fixed inset-0 flex flex-col items-center justify-center p-2 sm:p-4 overflow-hidden ${bgClass} ${className}`}>
            <div className="w-full h-full max-w-4xl flex flex-col items-center justify-center relative">
                {children}
            </div>
        </div>
    );
};

export default Layout;