import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Chess, Move } from 'chess.js';
import { ArrowLeft, RefreshCw, Undo, Smartphone, ZoomIn, ZoomOut } from 'lucide-react';
import Layout from '../components/Layout';
import { GameModeProps } from '../types';

// Standard Chess Piece SVGs (Wikimedia Commons / Cburnett style)
const PIECE_IMAGES: Record<string, string> = {
    'wp': 'https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg',
    'wn': 'https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg',
    'wb': 'https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg',
    'wr': 'https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg',
    'wq': 'https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg',
    'wk': 'https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg',
    'bp': 'https://upload.wikimedia.org/wikipedia/commons/c/c7/Chess_pdt45.svg',
    'bn': 'https://upload.wikimedia.org/wikipedia/commons/e/ef/Chess_ndt45.svg',
    'bb': 'https://upload.wikimedia.org/wikipedia/commons/9/98/Chess_bdt45.svg',
    'br': 'https://upload.wikimedia.org/wikipedia/commons/f/ff/Chess_rdt45.svg',
    'bq': 'https://upload.wikimedia.org/wikipedia/commons/4/47/Chess_qdt45.svg',
    'bk': 'https://upload.wikimedia.org/wikipedia/commons/f/f0/Chess_kdt45.svg',
};

const Game: React.FC<GameModeProps> = ({ mode }) => {
    const navigate = useNavigate();
    const [game, setGame] = useState(new Chess());
    const [board, setBoard] = useState(game.board());
    const [selectedSquare, setSelectedSquare] = useState<string | null>(null);
    const [validMoves, setValidMoves] = useState<Move[]>([]);
    const [pendingPromotion, setPendingPromotion] = useState<{ from: string; to: string } | null>(null);
    const [status, setStatus] = useState("White's turn");
    const [gameOverState, setGameOverState] = useState<{ title: string; msg: string; icon: string } | null>(null);
    const [isZoomed, setIsZoomed] = useState(false);

    const isKindle = mode === 'kindle';

    // Styling Constants
    const theme = {
        // Modern Green/Cream theme vs Kindle High Contrast (Grayscale)
        light: isKindle ? 'bg-white border-[0.5px] border-gray-400' : 'bg-[#ebecd0]',
        dark: isKindle ? 'bg-[#b0b0b0] border-[0.5px] border-gray-400' : 'bg-[#739552]',
        
        // Coordinates colors (contrast with square)
        textLight: isKindle ? 'text-black' : 'text-[#739552]',
        textDark: isKindle ? 'text-white' : 'text-[#ebecd0]',

        // Highlights
        selected: isKindle ? 'ring-inset ring-4 ring-black' : 'bg-yellow-200/60',
        
        // Move Indicators
        validDot: isKindle 
            ? 'after:content-[""] after:absolute after:w-3 after:h-3 after:bg-black after:rounded-full' 
            : 'after:content-[""] after:absolute after:w-[15%] after:h-[15%] after:bg-black/15 after:rounded-full',
        
        // Capture Indicators
        validCapture: isKindle
             ? 'ring-inset ring-4 ring-black'
             : 'after:content-[""] after:absolute after:inset-0 after:border-[6px] after:border-black/10 after:rounded-full',

        // Container
        container: isKindle ? 'border-4 border-black' : 'rounded shadow-xl overflow-hidden',
        
        // Buttons
        btnPrimary: isKindle 
            ? 'bg-black text-white border-2 border-black active:invert' 
            : 'bg-[#739552] text-white shadow-md hover:bg-[#5d7a42] active:translate-y-0.5 transition-all',
        btnSecondary: isKindle 
            ? 'bg-white text-black border-2 border-black active:bg-gray-200' 
            : 'bg-white text-gray-700 shadow-md hover:bg-gray-50 active:translate-y-0.5 transition-all',
    };

    const updateStatus = useCallback(() => {
        const turn = game.turn() === 'w' ? 'White' : 'Black';
        if (game.isCheckmate()) {
            const winner = game.turn() === 'w' ? 'Black' : 'White';
            setStatus(`Mate! ${winner} wins!`);
            setGameOverState({ title: 'Checkmate!', msg: `${winner} wins!`, icon: '👑' });
        } else if (game.isStalemate()) {
            setStatus('Stalemate!');
            setGameOverState({ title: 'Stalemate', msg: 'Draw', icon: '🤝' });
        } else if (game.isDraw()) {
            setStatus('Draw');
            setGameOverState({ title: 'Draw', msg: 'Draw', icon: '🤝' });
        } else if (game.isCheck()) {
            setStatus(`${turn} in check!`);
        } else {
            setStatus(`${turn}'s turn`);
        }
        setBoard(game.board());
    }, [game]);

    const handleSquareClick = (squareKey: string) => {
        if (game.isGameOver()) return;
        const piece = game.get(squareKey as any);

        if (!selectedSquare) {
            if (piece && piece.color === game.turn()) {
                setSelectedSquare(squareKey);
                setValidMoves(game.moves({ square: squareKey as any, verbose: true }) as Move[]);
            }
            return;
        }

        if (squareKey === selectedSquare) {
            setSelectedSquare(null);
            setValidMoves([]);
            return;
        }

        if (piece && piece.color === game.turn()) {
            setSelectedSquare(squareKey);
            setValidMoves(game.moves({ square: squareKey as any, verbose: true }) as Move[]);
            return;
        }

        try {
            const move = validMoves.find(m => m.to === squareKey);
            if (move && move.flags.includes('p')) {
                setPendingPromotion({ from: selectedSquare, to: squareKey });
                return;
            }
            if (game.move({ from: selectedSquare, to: squareKey })) {
                setSelectedSquare(null);
                setValidMoves([]);
                updateStatus();
            }
        } catch (e) {
            setSelectedSquare(null);
            setValidMoves([]);
        }
    };

    const handlePromotion = (promotionPiece: 'q' | 'r' | 'b' | 'n') => {
        if (!pendingPromotion) return;
        try {
            game.move({ from: pendingPromotion.from, to: pendingPromotion.to, promotion: promotionPiece });
            setPendingPromotion(null);
            setSelectedSquare(null);
            setValidMoves([]);
            updateStatus();
        } catch (e) {}
    };

    const resetGame = () => {
        const newGame = new Chess();
        setGame(newGame);
        setBoard(newGame.board());
        setSelectedSquare(null);
        setValidMoves([]);
        setPendingPromotion(null);
        setGameOverState(null);
        setStatus("White's turn");
    };

    const undoMove = () => {
        game.undo();
        updateStatus();
        setSelectedSquare(null);
        setValidMoves([]);
        setPendingPromotion(null);
        setGameOverState(null);
    };

    return (
        <Layout mode={mode}>
            <div className={`w-full h-full flex flex-col ${isKindle ? 'bg-white' : 'bg-white/95 sm:bg-white'} rounded-none sm:rounded-xl shadow-none sm:shadow-2xl overflow-hidden`}>
                
                {/* Header */}
                <div className="flex-shrink-0 flex justify-between items-center p-2 sm:p-3 border-b border-gray-200/80">
                    <button onClick={() => navigate('/')} className={`px-2 py-1.5 rounded-lg font-bold text-sm flex items-center gap-1 ${theme.btnSecondary}`}>
                        <ArrowLeft className="w-4 h-4" /> <span className="hidden sm:inline">Back</span>
                    </button>
                    
                    <h1 className="font-bold text-lg text-gray-800 hidden xs:block">{isKindle ? 'Micro Chess' : 'Micro Chess'}</h1>
                    
                    <div className="flex gap-2">
                        {/* Zoom Toggle */}
                        <button 
                            onClick={() => setIsZoomed(!isZoomed)} 
                            className={`px-3 py-1.5 rounded-lg font-bold text-sm flex items-center gap-1 ${theme.btnSecondary}`}
                            title={isZoomed ? "Fit to Screen" : "Zoom In"}
                        >
                            {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
                        </button>

                        <button onClick={() => navigate(isKindle ? '/play/local' : '/play/kindle')} className={`px-3 py-1.5 rounded-lg font-bold text-sm flex items-center gap-1 ${theme.btnPrimary}`}>
                            <Smartphone className="w-4 h-4" /> <span className="hidden sm:inline">{isKindle ? 'Color' : 'Kindle'}</span>
                        </button>
                    </div>
                </div>

                {/* Status Bar */}
                <div className={`flex-shrink-0 text-center py-1.5 font-bold text-sm sm:text-base border-b border-gray-200/80 ${isKindle ? 'bg-white text-black' : 'bg-gray-50 text-gray-700'}`}>
                    {status}
                </div>

                {/* Board Container */}
                <div className={`
                    flex-1 min-h-0 bg-gray-100/50 w-full relative
                    ${isZoomed ? 'overflow-auto block p-4' : 'flex items-center justify-center p-1 sm:p-4 overflow-hidden'}
                `}>
                    {/* The Board Wrapper 
                        If Zoomed: We force a larger minimum dimension to ensure scrolling is triggered.
                        If Not Zoomed: We use standard fit-contain logic.
                    */}
                    <div 
                        className={`
                            ${theme.container} relative select-none bg-gray-300 shadow-xl mx-auto
                            ${isZoomed ? '' : 'aspect-square max-h-full max-w-full'}
                        `}
                        style={isZoomed ? { width: '130vmin', height: '130vmin' } : {}}
                    >
                        <div className="grid grid-cols-8 grid-rows-8 w-full h-full">
                            {[8, 7, 6, 5, 4, 3, 2, 1].map((rank, rIdx) => (
                                ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'].map((file, fIdx) => {
                                    const squareKey = `${file}${rank}`;
                                    const piece = board[rIdx][fIdx];
                                    const isLight = (rIdx + fIdx) % 2 === 0;
                                    const isSelected = selectedSquare === squareKey;
                                    const move = validMoves.find(m => m.to === squareKey);
                                    const isValid = !!move;
                                    const isCapture = move && (move.flags.includes('c') || move.flags.includes('e')); // capture or en passant

                                    return (
                                        <div
                                            key={squareKey}
                                            onClick={() => handleSquareClick(squareKey)}
                                            className={`
                                                relative flex items-center justify-center cursor-pointer
                                                ${isLight ? theme.light : theme.dark}
                                                ${isSelected ? theme.selected : ''}
                                                ${isValid ? (isCapture ? theme.validCapture : theme.validDot) : ''}
                                            `}
                                        >
                                            {/* Rank Number (Left side) */}
                                            {fIdx === 0 && (
                                                <span className={`absolute left-0.5 top-0 text-[2.5vmin] sm:text-[10px] font-bold leading-none pointer-events-none opacity-80 ${isLight ? theme.textLight : theme.textDark}`}>
                                                    {rank}
                                                </span>
                                            )}

                                            {/* File Letter (Bottom side) */}
                                            {rIdx === 7 && (
                                                <span className={`absolute right-0.5 bottom-0 text-[2.5vmin] sm:text-[10px] font-bold leading-none pointer-events-none opacity-80 ${isLight ? theme.textLight : theme.textDark}`}>
                                                    {file}
                                                </span>
                                            )}

                                            {/* Piece Image */}
                                            {piece && PIECE_IMAGES[`${piece.color}${piece.type}`] && (
                                                <img 
                                                    src={PIECE_IMAGES[`${piece.color}${piece.type}`]} 
                                                    alt={`${piece.color} ${piece.type}`}
                                                    className="w-[85%] h-[85%] object-contain select-none pointer-events-none"
                                                    loading="eager"
                                                />
                                            )}
                                        </div>
                                    );
                                })
                            ))}
                        </div>

                         {/* Promotion Modal */}
                        {pendingPromotion && (
                            <div className="absolute inset-0 bg-black/20 backdrop-blur-sm z-20 flex items-center justify-center p-4">
                                <div className={`p-4 bg-white rounded-xl shadow-2xl ${isKindle ? 'border-4 border-black' : ''}`}>
                                    <h3 className="text-center font-bold mb-3">Promote Pawn</h3>
                                    <div className="flex gap-2">
                                        {['q', 'r', 'b', 'n'].map((p) => (
                                            <button 
                                                key={p} 
                                                onClick={() => handlePromotion(p as any)} 
                                                className={`w-14 h-14 flex items-center justify-center rounded-lg hover:bg-gray-100 ${isKindle ? 'border border-black' : 'shadow-sm border border-gray-200'}`}
                                            >
                                                <img 
                                                    src={PIECE_IMAGES[`${game.turn()}${p}`]} 
                                                    alt={p} 
                                                    className="w-10 h-10" 
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Footer Controls */}
                <div className="flex-shrink-0 p-3 border-t border-gray-200/80 flex gap-3 bg-white">
                    <button onClick={resetGame} className={`flex-1 py-3 rounded-lg font-bold flex justify-center items-center gap-2 ${theme.btnPrimary}`}>
                        <RefreshCw className="w-4 h-4" /> New Game
                    </button>
                    <button onClick={undoMove} disabled={game.history().length === 0} className={`flex-1 py-3 rounded-lg font-bold flex justify-center items-center gap-2 ${theme.btnSecondary} disabled:opacity-50 disabled:cursor-not-allowed`}>
                        <Undo className="w-4 h-4" /> Undo
                    </button>
                </div>

                 {/* Game Over Modal */}
                 {gameOverState && (
                    <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
                        <div className={`p-8 bg-white text-center w-full max-w-sm ${isKindle ? 'border-4 border-black' : 'rounded-2xl shadow-2xl'}`}>
                            <div className="text-5xl mb-4">{gameOverState.icon}</div>
                            <h2 className="text-2xl font-bold mb-2 text-gray-900">{gameOverState.title}</h2>
                            <p className="text-lg text-gray-600 mb-6">{gameOverState.msg}</p>
                            <button onClick={resetGame} className={`w-full py-3 rounded-lg font-bold text-lg ${theme.btnPrimary}`}>
                                Play Again
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Game;